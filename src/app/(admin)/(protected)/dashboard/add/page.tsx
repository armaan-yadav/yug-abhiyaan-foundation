"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import makeSlug from "@/lib/utils";
import { MediaFile } from "@/types";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  CheckCircle,
  FileImage,
  Image,
  MoveLeft,
  Play,
  Plus,
  Save,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const AddContentPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailIsObjectUrl, setThumbnailIsObjectUrl] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [, setThumbnailUploadProgress] = useState<number | null>(null);
  type CloudinaryUploadResult = {
    secure_url?: string;
    url?: string;
    public_id?: string;
    resource_type?: string;
    format?: string;
    [key: string]: unknown;
  };
  const [galleryFiles, setGalleryFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // computed flags to ensure publish is only enabled when all uploads are done
  const allGalleryUploaded = galleryFiles.every(
    (f) => f.uploadStatus === "completed"
  );
  const thumbnailReady = !thumbnail || (thumbnail && !!thumbnailUrl);
  const canPublish =
    !isLoading &&
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    allGalleryUploaded &&
    thumbnailReady;

  // Upload file directly to Cloudinary (unsigned preset).
  const uploadToCloudinary = (
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<CloudinaryUploadResult> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      return Promise.reject(
        new Error(
          "Cloudinary configuration missing. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your env."
        )
      );
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    // Use fetch with a streaming multipart body so we can report upload progress
    return new Promise(async (resolve, reject) => {
      try {
        const boundary = "----WebKitFormBoundary" + Math.random().toString(36).slice(2);
        const encoder = new TextEncoder();

        const preamble = `--${boundary}\r\nContent-Disposition: form-data; name="upload_preset"\r\n\r\n${uploadPreset}\r\n--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${file.name}"\r\nContent-Type: ${file.type || "application/octet-stream"}\r\n\r\n`;
        const epilogue = `\r\n--${boundary}--\r\n`;

  type FileWithStream = File & { stream?: () => ReadableStream<Uint8Array> };
  const fileStream = (file as unknown as FileWithStream).stream ? (file as unknown as FileWithStream).stream() : new Response(file).body;
        if (!fileStream) {
          // Fallback: read whole file (less ideal)
          const fd = new FormData();
          fd.append("file", file);
          fd.append("upload_preset", uploadPreset);
          const r = await fetch(url, { method: "POST", body: fd });
          const body = await r.json().catch(() => null);
          if (!r.ok) throw new Error(body?.error?.message || body?.message || r.statusText);
          return resolve(body);
        }

  let bytesSent = 0;
  const total = file.size;
  // Abort controller used to cancel fetch if the server never responds
  const ac = new AbortController();
  const { signal } = ac;
  let finishTimer: ReturnType<typeof setTimeout> | null = null;

        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(preamble));
            const reader = fileStream.getReader();

            function read() {
              reader.read().then((r) => {
                const done = r.done;
                const value = r.value as Uint8Array | undefined;
                if (done) {
                  controller.enqueue(encoder.encode(epilogue));
                  controller.close();
                  return;
                }
                if (value) {
                  bytesSent += value.byteLength;
                  controller.enqueue(value);
                }
                if (onProgress && total > 0) {
                  const percent = Math.round((bytesSent / total) * 100);
                  const capped = percent > 100 ? 100 : percent;
                  onProgress(capped);
                  // If we've reached the file byte count, start a short watchdog
                  // waiting for the server response. If the server doesn't reply
                  // within 15s, abort the request to avoid hanging at 100%.
                  if (capped >= 100) {
                    if (finishTimer) clearTimeout(finishTimer);
                    finishTimer = setTimeout(() => {
                      try {
                        ac.abort();
                      } catch (e) {}
                    }, 15000);
                  } else {
                    if (finishTimer) {
                      clearTimeout(finishTimer);
                      finishTimer = null;
                    }
                  }
                }
                read();
              }).catch((err: unknown) => controller.error(err));
            }

            read();
          },
        });

        // Some browser runtimes (Chromium) require the non-standard `duplex` flag
        // when sending a streaming request body. TypeScript's RequestInit doesn't
        // include it, so cast to any to avoid type errors.
        // Try streaming upload first. Some networks/browsers may fail (ALPN,
        // proxies, or unsupported duplex). If streaming fails, fall back to
        // a standard FormData POST (no streaming, no per-byte progress).
        try {
          type FetchWithDuplex = (input: RequestInfo, init?: RequestInit & { duplex?: "half" }) => Promise<Response>;
          const fetchWithDuplex = fetch as unknown as FetchWithDuplex;
          const res = await fetchWithDuplex(url, {
            method: "POST",
            headers: {
              "Content-Type": `multipart/form-data; boundary=${boundary}`,
            },
            body: stream as unknown as BodyInit,
            duplex: "half",
            signal,
          });

          if (finishTimer) {
            clearTimeout(finishTimer);
            finishTimer = null;
          }

          const parsed = await res.json().catch(() => null);
          if (!res.ok) {
            const cloudinaryMsg = parsed?.error?.message || parsed?.error || parsed?.message;
            const errMsg = cloudinaryMsg || res.statusText || `Upload failed with status ${res.status}`;
            console.error("Cloudinary response (error):", { status: res.status, body: parsed });
            return reject(new Error(errMsg));
          }

          if (onProgress) onProgress(100);
          return resolve(parsed);
        } catch (err) {
          const maybeErr = err as unknown as { name?: string };
          if (maybeErr?.name === 'AbortError') {
            console.warn('Upload aborted due to timeout waiting for server response');
          } else {
            console.warn("Streaming fetch failed, falling back to FormData POST:", err);
          }
          try {
            // Fallback: send via FormData (no per-byte progress available)
            const fd = new FormData();
            fd.append("file", file);
            fd.append("upload_preset", uploadPreset);

            const r = await fetch(url, { method: "POST", body: fd, signal });
            const body = await r.json().catch(() => null);
            if (!r.ok) throw new Error(body?.error?.message || body?.message || r.statusText);
            if (onProgress) {
              // best-effort: indicate start/end since we don't have granular progress
              onProgress(0);
              onProgress(100);
            }
            return resolve(body);
          } catch (err2) {
            const maybeErr2 = err2 as unknown as { name?: string };
            if (maybeErr2?.name === 'AbortError') {
              console.error('Fallback upload aborted due to timeout');
            } else {
              console.error("Fallback FormData upload also failed:", err2);
            }
            return reject(new Error("Network error during upload"));
          }
        }
      } catch (err) {
        console.error("Fetch upload error:", err);
        reject(new Error("Network error during upload"));
      }
    });
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      // Use an object URL for preview to avoid loading a base64 data URL into memory
      if (thumbnailPreview && thumbnailIsObjectUrl) {
        try {
          URL.revokeObjectURL(thumbnailPreview);
        } catch (e) {}
      }
      const objectUrl = URL.createObjectURL(file);
      setThumbnail(file);
      setThumbnailPreview(objectUrl);
      setThumbnailIsObjectUrl(true);

      try {
        setThumbnailUploadProgress(0);
        const res = await uploadToCloudinary(file, (p) => setThumbnailUploadProgress(p));
  setThumbnailUrl((res.secure_url ?? res.url) ?? null);
        setThumbnailUploadProgress(null);
        toast.success("Thumbnail uploaded successfully!");
      } catch (error) {
        console.error("Thumbnail upload error:", error);
        toast.error("Failed to upload thumbnail");
        setThumbnailUploadProgress(null);
      }
    }
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    const newMediaFiles: MediaFile[] = validFiles.map((file) => ({
      id: Date.now().toString() + Math.random(),
      file,
      type: file.type.startsWith("image/") ? "image" : "video",
      preview: URL.createObjectURL(file),
      name: file.name,
      uploadStatus: "pending",
      isObjectUrl: true,
    }));

    setGalleryFiles((prev) => [...prev, ...newMediaFiles]);

  // Upload in small concurrent batches to avoid memory/network spikes
  // Use 1 concurrent upload to reduce chances of connection aborts / OOM for very large files
  const concurrency = 1;
    for (let i = 0; i < newMediaFiles.length; i += concurrency) {
      const batch = newMediaFiles.slice(i, i + concurrency);
      await Promise.all(
        batch.map(async (mediaFile) => {
          // mark uploading
          setGalleryFiles((prev) =>
            prev.map((f) => (f.id === mediaFile.id ? { ...f, uploadStatus: "uploading" } : f))
          );

          try {
            const res = await uploadToCloudinary(mediaFile.file!, (p) => {
              setGalleryFiles((prev) => prev.map((f) => (f.id === mediaFile.id ? { ...f, uploadProgress: p } : f)));
            });

            setGalleryFiles((prev) =>
              prev.map((f) =>
                f.id === mediaFile.id
                  ? {
                      ...f,
                      uploadedUrl: (res.secure_url ?? res.url) as string | undefined,
                      uploadStatus: "completed",
                      uploadProgress: 100,
                    }
                  : f
              )
            );
            toast.success(`${mediaFile.name} uploaded successfully!`);
          } catch (error) {
            console.error(`Upload error for ${mediaFile.name}:`, error);
            setGalleryFiles((prev) => prev.map((f) => (f.id === mediaFile.id ? { ...f, uploadStatus: "error" } : f)));
            toast.error(`Failed to upload ${mediaFile.name}`);
          }
        })
      );
    }
  };

  const removeGalleryFile = async (id: string) => {
    // Remove from local state and revoke object URL if necessary to free memory
    setGalleryFiles((prev) => {
      const toRemove = prev.find((f) => f.id === id);
      if (toRemove?.isObjectUrl && toRemove.preview) {
        try {
          URL.revokeObjectURL(toRemove.preview);
        } catch (e) {}
      }
      return prev.filter((file) => file.id !== id);
    });
  };

  const removeThumbnail = async () => {
    // We do not delete thumbnail from Cloudinary here. Just clear local state.
    if (thumbnailPreview) {
      try {
        URL.revokeObjectURL(thumbnailPreview);
      } catch (e) {}
    }
    setThumbnail(null);
    setThumbnailPreview(null);
    setThumbnailUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const contentData = {
        title: title.trim(),
        slug: makeSlug(title.trim()),
        description: description.trim(),
        thumbnailUrl: thumbnailUrl || null,
        mediaUrls: galleryFiles
          .filter((f) => f.uploadStatus === "completed")
          .map((f) => ({
            url: f.uploadedUrl,
            type: f.type,
            name: f.name,
          })),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        active: true,
      };

      const docRef = await addDoc(collection(db, "content"), contentData);

      toast.success("Content published successfully!");
      console.log("Content saved to Firebase with ID:", docRef.id);

      setTitle("");
      setDescription("");
      setThumbnail(null);
      setThumbnailPreview(null);
      setThumbnailUrl(null);
      setGalleryFiles([]);
      router.push("/dashboard");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to publish content");
    } finally {
      setIsLoading(false);
    }
  };

  const getUploadStatusIcon = (status: MediaFile["uploadStatus"]) => {
    switch (status) {
      case "uploading":
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
        );
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="w-full mt-7">
        <MoveLeft
          className="h-10 w-20 text-gray-500 cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
      </div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Content
          </h1>
          <p className="text-gray-600">
            Create engaging content with thumbnails, descriptions, and media
            galleries
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileImage className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Enter the main details for your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a compelling title..."
                  className="text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a detailed description of your content..."
                  className="min-h-[120px] resize-none"
                  required
                />
                <p className="text-xs text-gray-500">
                  {description.length}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Thumbnail Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>Thumbnail Image</span>
                {thumbnailUrl && (
                  <Badge variant="secondary" className="text-xs">
                    Uploaded
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Upload a thumbnail image that represents your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!thumbnailPreview ? (
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900">
                      Upload thumbnail
                    </p>
                    <p className="text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() =>
                        document.getElementById("thumbnail-upload")?.click()
                      }
                    >
                      Choose File
                    </Button>
                  </div>
                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border max-w-md mx-auto">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeThumbnail}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {thumbnailUrl && (
                      <Badge
                        className="absolute bottom-2 left-2"
                        variant="secondary"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Uploaded
                      </Badge>
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">{thumbnail?.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("thumbnail-upload")?.click()
                      }
                    >
                      Change Image
                    </Button>
                    <input
                      id="thumbnail-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gallery Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>Media Gallery</span>
              </CardTitle>
              <CardDescription>
                Upload multiple images and videos for your content gallery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Plus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900">
                    Add media files
                  </p>
                  <p className="text-xs text-gray-500">
                    Images and videos up to 50MB each
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleGalleryUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {galleryFiles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      Uploaded Media ({galleryFiles.length})
                    </h4>
                    <Badge variant="secondary">
                      {galleryFiles.length} files
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryFiles.map((mediaFile) => (
                      <div
                        key={mediaFile.id}
                        className="relative group rounded-lg overflow-hidden border bg-gray-50"
                      >
                        <div className="aspect-square relative">
                          {mediaFile.type === "image" && mediaFile.preview ? (
                            <img
                              src={mediaFile.preview}
                              alt={mediaFile.name}
                              className="w-full h-full object-cover"
                            />
                          ) : mediaFile.type === "video" &&
                            mediaFile.preview ? (
                            <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                              <video
                                src={mediaFile.preview}
                                className="w-full h-full object-cover"
                                muted
                              />
                              <Play className="absolute inset-0 m-auto h-8 w-8 text-white opacity-80" />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600" />
                            </div>
                          )}

                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeGalleryFile(mediaFile.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>

                          <div className="absolute bottom-1 right-1">
                            {getUploadStatusIcon(mediaFile.uploadStatus)}
                          </div>
                        </div>

                        <div className="p-2">
                          <p className="text-xs text-gray-600 truncate">
                            {mediaFile.name}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <Badge
                              variant={
                                mediaFile.type === "image"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {mediaFile.type}
                            </Badge>
                            {mediaFile.uploadStatus && (
                              <Badge
                                variant={
                                  mediaFile.uploadStatus === "completed"
                                    ? "default"
                                    : mediaFile.uploadStatus === "error"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {mediaFile.uploadStatus === "uploading" && typeof mediaFile.uploadProgress === "number"
                                  ? `uploading (${mediaFile.uploadProgress}%)`
                                  : mediaFile.uploadStatus}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="submit"
              className="flex-1 sm:flex-none"
              disabled={!canPublish}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Publish Content
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContentPage;
