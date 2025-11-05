"use client";
import { db } from "@/lib/firebase";
import {
  collection,
  DocumentSnapshot,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Define the ContentItem interface
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

const ITEMS_PER_PAGE = 3; // Changed to 3 items per page

const Page = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageCursors, setPageCursors] = useState<(DocumentSnapshot | null)[]>(
    []
  );
  const [statusFilter] = useState("published"); // Assuming "Our Work" page only shows published content

  // Server-side pagination function
  const fetchContentForPage = async (page: number, forceRefetch = false) => {
    setLoading(true);
    setError(null);
    try {
      const contentCollection = collection(db, "content");
      let baseQuery = query(contentCollection);

      if (statusFilter !== "all") {
        baseQuery = query(
          baseQuery,
          where("active", "==", statusFilter === "published")
        );
      }

      if (page === 1 || forceRefetch) {
        const countSnapshot = await getCountFromServer(baseQuery);
        const count = countSnapshot.data().count;
        setTotalItems(count);
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }

      let pageQuery = query(baseQuery, orderBy("createdAt", "desc"));

      if (page > 1 && pageCursors[page - 2]) {
        pageQuery = query(pageQuery, startAfter(pageCursors[page - 2]));
      }

      pageQuery = query(pageQuery, limit(ITEMS_PER_PAGE));

      const querySnapshot = await getDocs(pageQuery);
      const contentData = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ContentItem[];

      setContent(contentData);

      // Store cursor for next page
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      if (lastVisible) {
        setPageCursors((prev) => {
          const newCursors = [...prev];
          newCursors[page - 1] = lastVisible;
          return newCursors;
        });
      }
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Failed to fetch content. Please try refreshing.");
      toast.error("Failed to fetch content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContentForPage(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return "Unknown date";
    try {
      const date = timestamp.toDate();
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-brand-light py-20">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-white">
            <nav className="flex mb-8 text-sm">
              <span className="opacity-90">HOME</span>
              <span className="mx-2 opacity-60">/</span>
              <span className="font-semibold">Our Work</span>
            </nav>
            <div className="max-w-3xl">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Our Work
              </h1>
              <p className="text-xl lg:text-2xl opacity-90 leading-relaxed">
                We are dedicated to making a positive impact in the community
                through various initiatives and projects.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto py-16">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-light"></div>
                <p className="text-gray-600 text-lg">Loading content...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-600 text-center">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              {content.length > 0 ? (
                <div className="space-y-8">
                  {content.map((item, index) => (
                    <Link
                      href={`/our-work/${item.slug}`}
                      key={item.id}
                      className={`group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${
                        index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                      } flex flex-col lg:flex`}
                    >
                      {/* Image Section */}
                      <div className="lg:w-2/5 relative overflow-hidden">
                        {item.thumbnailUrl ? (
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : item.mediaUrls.length > 0 &&
                          item.mediaUrls[0].type === "image" ? (
                          <Image
                            src={item.mediaUrls[0].url}
                            alt={item.title}
                            className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-64 lg:h-full bg-gradient-to-br from-brand-light to-blue-600 flex items-center justify-center">
                            <div className="text-white text-center">
                              <svg
                                className="w-16 h-16 mx-auto mb-4 opacity-80"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
                                />
                              </svg>
                              <p className="text-sm font-medium opacity-90">
                                Our Work
                              </p>
                            </div>
                          </div>
                        )}
                        {/* <div className="absolute top-4 left-4">
                          {item.mediaUrls.length > 0 && (
                            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              {item.mediaUrls.filter((m) => m.type === "image")
                                .length > 0 && (
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              )}
                              {item.mediaUrls.filter((m) => m.type === "video")
                                .length > 0 && (
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              )}
                              {item.mediaUrls.length} media
                            </span>
                          )}
                        </div> */}
                      </div>

                      {/* Content Section */}
                      <div className="lg:w-3/5 p-8 lg:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <time dateTime={formatDate(item.createdAt)}>
                            {formatDate(item.createdAt)}
                          </time>
                          <span>•</span>
                          <span className="capitalize">
                            {item.active ? "Published" : "Draft"}
                          </span>
                          {item.updatedAt &&
                            item.updatedAt !== item.createdAt && (
                              <>
                                <span>•</span>
                                <span>
                                  Updated {formatDate(item.updatedAt)}
                                </span>
                              </>
                            )}
                        </div>

                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-brand-light transition-colors duration-300 leading-tight">
                          {item.title}
                        </h2>

                        <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <button className="inline-flex items-center gap-2 text-brand-light hover:text-blue-700 font-semibold transition-colors duration-300 group/btn">
                            <span>Read More</span>
                            <svg
                              className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="bg-gray-50 rounded-2xl p-12">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg">
                      No published work found.
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Check back later for new content.
                    </p>
                  </div>
                </div>
              )}

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-brand-light hover:text-brand-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700 shadow-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Previous
                    </button>

                    <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">Page</span>
                      <span className="font-bold text-brand-light text-lg">
                        {currentPage}
                      </span>
                      <span className="text-gray-600">of</span>
                      <span className="font-bold text-gray-800">
                        {totalPages}
                      </span>
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || totalItems === 0}
                      className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-brand-light hover:text-brand-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-700 shadow-sm"
                    >
                      Next
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of{" "}
                    {totalItems} items
                  </div> */}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
