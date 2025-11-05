// no local filesystem usage anymore; uploads are stored in Cloudinary
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function validateFile(file: File, type: string) {
  const allowedTypes = {
    thumbnail: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    gallery: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mov",
    ],
  };

  const allowed =
    type === "thumbnail" ? allowedTypes.thumbnail : allowedTypes.gallery;
  if (!allowed.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${allowed.join(", ")}`);
  }
}

function generateFileName(originalName: string): string {
  // create a short, safe filename-like identifier (no path or extension)
  const idx = originalName.lastIndexOf(".");
  const base = idx > 0 ? originalName.substring(0, idx) : originalName;
  const clean = base.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase().substring(0, 30);
  const timestamp = Date.now();
  return `${timestamp}_${clean}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "gallery";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!["thumbnail", "gallery"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    validateFile(file, type);

    // Prepare upload: build a public_id without extension
    const ext = file.name.split('.').pop() || '';
    const nameOnly = generateFileName(file.name).replace(/\.[^/.]+$/, "");
    const publicId = nameOnly; // cloudinary will append proper extension/version

    const buffer = Buffer.from(await file.arrayBuffer());

    type UploadResult = {
      secure_url?: string;
      public_id?: string;
      resource_type?: string;
      format?: string;
      bytes?: number;
      created_at?: string;
      [key: string]: unknown;
    };

    const uploadOptions: Record<string, unknown> = {
      resource_type: "auto",
      public_id: publicId,
      folder: "uploads",
      overwrite: false,
    };

    // Prefer streaming for large files (videos) to avoid request timeouts.
    const STREAM_THRESHOLD = 15 * 1024 * 1024; // 15MB
    const shouldStream = file.size > STREAM_THRESHOLD || file.type.startsWith("video/");

  let result: UploadResult | null = null;

    // Helper: stream upload from buffer
    const streamUpload = async (): Promise<UploadResult> => {
      return await new Promise<UploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error: Error | undefined | null, res: unknown) => {
            if (error) return reject(error);
            resolve(res as UploadResult);
          }
        );

        const readable = new Readable();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        readable._read = () => {};
        readable.push(buffer);
        readable.push(null);
        readable.pipe(uploadStream);
      });
    };

    if (shouldStream) {
      // stream large/video files
      result = await streamUpload();
    } else {
      // small files: upload via data URI (faster for small images)
      const base64 = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;
      try {
        result = (await cloudinary.uploader.upload(
          dataUri,
          uploadOptions
        )) as UploadResult;
      } catch (err: unknown) {
        const maybe = err as { message?: string } | undefined;
        console.warn(
          "Upload via data URI failed, falling back to stream upload:",
          maybe?.message ?? err
        );
        result = await streamUpload();
      }
    }

    if (!result) {
      console.error("Upload resulted in empty response");
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    console.log(`Cloudinary upload result: ${result.secure_url}`);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      originalName: file.name,
      size: file.size,
      format: result.format,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const max_results = parseInt(searchParams.get("limit") || "20", 10);
    const next_cursor = searchParams.get("next_cursor") || undefined;

    // Fetch resources from Cloudinary (images and videos)
    const res = await cloudinary.api.resources({
      resource_type: "auto",
      max_results,
      next_cursor,
      direction: "desc",
      type: "upload",
      prefix: "uploads/",
    });

    const files = (res.resources || []).map((r: Record<string, unknown>) => ({
      name: (r.public_id as string) || undefined,
      url: (r.secure_url as string) || undefined,
      size: (r.bytes as number) || undefined,
      format: (r.format as string) || undefined,
      resource_type: (r.resource_type as string) || undefined,
      createdAt: (r.created_at as string) || undefined,
      public_id: (r.public_id as string) || undefined,
    }));

    return NextResponse.json({
      files,
      pagination: {
        next_cursor: res.next_cursor || null,
        total_count: res.total_count || files.length,
      },
    });
  } catch (error) {
    console.error("List files error:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Expect JSON body with { url }
    const body = await req.json().catch(() => null);
    const url = body?.url || null;

    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    // Extract public_id from Cloudinary URL
    // Example: https://res.cloudinary.com/<cloud>/image/upload/v12345678/uploads/public_id.jpg
    const parsed = new URL(url);
    const pathname = parsed.pathname; // /<...>/upload/v12345/uploads/public_id.jpg
    const uploadIndex = pathname.indexOf("/upload/");
    if (uploadIndex === -1) {
      return NextResponse.json({ error: "Invalid Cloudinary URL" }, { status: 400 });
    }
    let afterUpload = pathname.substring(uploadIndex + "/upload/".length); // v123/.../uploads/public_id.jpg
    // remove version prefix if present
    afterUpload = afterUpload.replace(/^v[0-9]+\//, "");
    // remove extension
    const publicIdWithPath = afterUpload.replace(/\.[^/.]+$/, "");

    // Use the public id to destroy resource
    const destroyResult = await cloudinary.uploader.destroy(publicIdWithPath, { resource_type: "auto" });

    console.log("Cloudinary destroy result:", destroyResult);

    return NextResponse.json({ success: true, result: destroyResult });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
