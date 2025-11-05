import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDocBySlug } from "@/services/firebaseServices";
import { Timestamp } from "firebase/firestore";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  });
};

const page = async ({ params }: { params: { slug: string } }) => {
  const slug = await params.slug;
  const contentData = await getDocBySlug("content", slug);

  if (!contentData) {
    notFound();
  }

  const content: ContentItem = contentData as ContentItem;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/20 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-brand-light via-brand-light/80 to-brand-light/60 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center text-sm text-gray-700 gap-4">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    {formatDate(content.createdAt)}
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {content.title}
              </h1>

              <span className="font-light">- Ahuti Yadav</span>
            </div>

            {/* Featured Image */}
            {content.thumbnailUrl && (
              <div className="order-1 lg:order-2">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-white/20 to-transparent rounded-3xl blur-xl opacity-70"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={content.thumbnailUrl}
                      alt={content.title}
                      className="w-full h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Description Section */}
        <Card className="mb-12 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-gray-900">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="whitespace-pre-wrap text-lg">
                {content.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Media Gallery */}
        {content.mediaUrls && content.mediaUrls.length > 0 && (
          <Card className="mb-12 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-gray-900">Gallery</CardTitle>
              <p className="text-gray-600 mt-2">
                Photos and videos from our work
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {content.mediaUrls.map((media, index) => (
                  <div
                    key={index}
                    className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10"></div>

                    {media.type === "image" ? (
                      <div className="aspect-[4/3] bg-gray-100">
                        <Image
                          src={media.url}
                          alt={media.name || "Gallery image"}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-gray-900">
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-brand-light via-brand-light/90 to-brand-light/70 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Want to Support Our Mission?
          </h3>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join us in making a positive impact. Every contribution helps us
            continue our work and reach more lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={"/donate"}>
              <Button
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-lg font-semibold"
              >
                Donate Now
              </Button>
            </Link>
            <Link href="/our-work">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/20 border-gray-900/20 text-gray-900 hover:bg-white/40 px-8 py-3 text-lg font-semibold"
              >
                View More Stories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
