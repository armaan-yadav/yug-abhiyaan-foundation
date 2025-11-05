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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { db } from "@/lib/firebase";
import { ContentItem } from "@/types";
import { cva } from "class-variance-authority";
import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import {
  Edit,
  Eye,
  FileText,
  Image,
  MoreHorizontal,
  Plus,
  RefreshCw,
  ServerCrash,
  Trash2,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const badgeVariants = cva("capitalize", {
  variants: {
    status: {
      published: "bg-green-100 text-green-800 hover:bg-green-200",
      draft: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    },
  },
});

const Dashboard = () => {
  const router = useRouter();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageCursors, setPageCursors] = useState<unknown[]>([]);

  const ITEMS_PER_PAGE = 3;

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteDoc(doc(db, "content", id));
      toast.success(`"${title}" deleted successfully`);

      fetchContentForPage(currentPage, true);
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content");
    }
  };

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

      const querySnapshot = await getDocs(query(pageQuery));
      const contentData = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ContentItem[];
      setContent(contentData);

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
    setCurrentPage(1);
    setPageCursors([]);
    fetchContentForPage(1, true);
  }, [statusFilter]);

  useEffect(() => {
    fetchContentForPage(currentPage);
  }, [currentPage]);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <DashboardHeader
        onRefresh={() => fetchContentForPage(currentPage, true)}
        loading={loading}
      />

      <ContentTable
        loading={loading}
        error={error}
        content={content}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        filteredCount={totalItems}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
      />
    </div>
  );
};

const DashboardHeader = ({
  onRefresh,
  loading,
}: {
  onRefresh: () => void;
  loading: boolean;
}) => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Content Dashboard</h1>

      <p className="text-gray-600 mt-1">
        Manage all your content and media in one place.
      </p>
    </div>

    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={loading}
        size="sm"
      >
        <RefreshCw
          className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
        />
        Refresh
      </Button>

      <Link href="/dashboard/add">
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" /> Create Content
        </Button>
      </Link>
    </div>
  </header>
);

type ContentTableProps = {
  loading: boolean;
  error: string | null;
  content: ContentItem[];
  onDelete: (id: string, title: string) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (n: number) => void;
  filteredCount: number;
  ITEMS_PER_PAGE: number;
};

const ContentTable = ({
  loading,
  error,
  content,
  onDelete,
  currentPage,
  totalPages,
  setCurrentPage,
  filteredCount,
  ITEMS_PER_PAGE,
}: ContentTableProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Your Content</CardTitle>
      <CardDescription>
        Showing {filteredCount} items. Page {currentPage} of
        {totalPages || 1}
      </CardDescription>
    </CardHeader>

    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableBody>
            {loading ? (
              <TableSkeletonRows count={ITEMS_PER_PAGE} />
            ) : error ? (
              <TableErrorState message={error} />
            ) : content.length > 0 ? (
              content.map((item: ContentItem) => (
                <ContentRow key={item.id} item={item} onDelete={onDelete} />
              ))
            ) : (
              <TableEmptyState hasContent={filteredCount > 0} />
            )}
          </TableBody>
        </Table>
      </div>
    </CardContent>

    {totalPages > 1 && (
      <div className="p-4 border-t flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            <PaginationItem>
              <span className="px-4 text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    )}
  </Card>
);

const ContentRow = ({
  item,
  onDelete,
}: {
  item: ContentItem;
  onDelete: (id: string, title: string) => void;
}) => {
  const router = useRouter();
  const status = item.active ? "published" : "draft";

  const mediaCount = {
    images: item.mediaUrls?.filter((m) => m.type === "image").length || 0,
    videos: item.mediaUrls?.filter((m) => m.type === "video").length || 0,
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp?.toDate) return "N/A";
    return timestamp.toDate().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <TableRow className="border-b transition-colors hover:bg-muted/50">
      <TableCell className="w-32 p-2 md:p-4">
        <img
          src={item.thumbnailUrl || "https://via.placeholder.com/150"}
          alt={item.title}
          className="w-28 h-20 object-cover rounded-md"
        />
      </TableCell>

      <TableCell className="font-medium">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold break-words line-clamp-2">
            {item.title}
          </h3>

          <p className="text-sm text-muted-foreground hidden lg:block">
            {item.description.slice(0, 100)}...
          </p>

          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className={badgeVariants({ status })}>
              {status}
            </Badge>

            <span className="flex items-center gap-1">
              <span>Created:</span>
              <span>{formatDate(item.createdAt)}</span>
            </span>

            <span className="flex items-center gap-1">
              <span>Updated:</span>
              <span>{formatDate(item.updatedAt)}</span>
            </span>

            <span className="flex items-center gap-1">
              <span>Media:</span>
              <span className="flex items-center gap-1">
                {mediaCount.images}
                <Image size={18} />
              </span>

              <span className="flex items-center gap-1">
                {mediaCount.videos}
                <Video size={18} />
              </span>
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell className="w-16 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/view/${item.slug}`)}
            >
              <Eye className="h-4 w-4 mr-2" /> View
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/edit/${item.slug}`)}
            >
              <Edit className="h-4 w-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => onDelete(item.id, item.title)}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
const TableSkeletonRows = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <TableRow key={i}>
        <TableCell className="w-16 md:w-48 p-2 md:p-4">
          <Skeleton className="w-12 h-12 md:w-24 md:h-24 rounded-md" />
        </TableCell>

        <TableCell className="font-medium">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-[80px] rounded-full" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
          </div>
        </TableCell>

        <TableCell className="w-16 text-right">
          <Skeleton className="h-8 w-8 rounded-md" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

const TableEmptyState = ({ hasContent }: { hasContent: boolean }) => (
  <TableRow>
    <TableCell colSpan={3} className="h-48 text-center">
      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No content found
      </h3>

      <p className="text-gray-600 mb-4">
        {hasContent
          ? "Try adjusting your filter."
          : "Get started by creating your first piece of content."}
      </p>

      {!hasContent && (
        <Button asChild>
          <Link href="/dashboard/add">
            <Plus className="h-4 w-4 mr-2" /> Create Content
          </Link>
        </Button>
      )}
    </TableCell>
  </TableRow>
);

const TableErrorState = ({ message }: { message: string }) => (
  <TableRow>
    <TableCell colSpan={3} className="h-48 text-center text-red-600">
      <ServerCrash className="mx-auto h-12 w-12 text-red-400 mb-4" />
      <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
      <p>{message}</p>
    </TableCell>
  </TableRow>
);

export default Dashboard;
