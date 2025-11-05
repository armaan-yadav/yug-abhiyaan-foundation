import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  Clock,
  Eye,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { getDocBySlug } from "@/services/firebaseServices";
import { Timestamp } from "firebase/firestore";
import { notFound } from "next/navigation";
import Image from "next/image";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  mediaUrls: Array<{
    url: string;
    type: "image" | "video";
    name: string;
  }>;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  slug: string;
}

const formatDate = (timestamp: Timestamp) => {
  if (!timestamp?.toDate) return "N/A";
  return timestamp.toDate().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const contentData = await getDocBySlug("content", slug);

  if (!contentData) {
    notFound();
  }

  const content: ContentItem = contentData as ContentItem;

  const mediaCount = content.mediaUrls?.reduce(
    (acc, media) => {
      if (media.type === "image") acc.images++;
      else if (media.type === "video") acc.videos++;
      return acc;
    },
    { images: 0, videos: 0 }
  ) || { images: 0, videos: 0 };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          {content.thumbnailUrl && (
            <div className="relative w-full h-64 md:h-80 lg:h-96 mb-6 rounded-xl overflow-hidden shadow-lg">
              <img
                src={content.thumbnailUrl}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <Badge
              variant="default"
              className="bg-green-100 text-green-800 border-green-200"
            >
              <Eye className="w-3 h-3 mr-1" />
              Published
            </Badge>
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <span className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                {formatDate(content.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Updated {formatDate(content.updatedAt)}
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {content.title}
          </h1>
        </div>

        {/* Content Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {content.description}
            </p>
          </CardContent>
        </Card>

        {/* Media Section */}
        {content.mediaUrls && content.mediaUrls.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                Media Gallery
                <div className="flex items-center gap-4 text-sm text-gray-500 ml-auto">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-4 h-4" />
                    {mediaCount.images} Images
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    {mediaCount.videos} Videos
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.mediaUrls.map((media, index) => (
                  <div
                    key={index}
                    className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    {media.type === "image" ? (
                      <div className="aspect-video bg-gray-100">
                        <Image
                          src={media.url}
                          alt={media.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-900">
                        <video
                          src={media.url}
                          controls
                          className="w-full h-full object-cover"
                          preload="metadata"
                        >
                          Your browser does not support video playback.
                        </video>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="flex items-center justify-between text-white text-sm">
                        <span className="truncate">{media.name}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {media.type === "image" ? (
                            <ImageIcon className="w-3 h-3 mr-1" />
                          ) : (
                            <Video className="w-3 h-3 mr-1" />
                          )}
                          {media.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Content Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Publication Info
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Published
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span className="text-gray-900">
                      {formatDate(content.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="text-gray-900">
                      {formatDate(content.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Media Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Media:</span>
                    <span className="text-gray-900">
                      {content.mediaUrls?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Images:</span>
                    <span className="text-gray-900">{mediaCount.images}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Videos:</span>
                    <span className="text-gray-900">{mediaCount.videos}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
