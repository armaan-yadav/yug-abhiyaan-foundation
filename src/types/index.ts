import { Timestamp } from "firebase/firestore";

export interface ContentItem {
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

export interface MediaFile {
  id: string;
  file?: File;
  type: "image" | "video";
  preview: string;
  name: string;
  uploadStatus?: "pending" | "uploading" | "completed" | "error";
  uploadedUrl?: string;
  uploadProgress?: number; // 0-100
  isExisting?: boolean;
  isObjectUrl?: boolean;
}
