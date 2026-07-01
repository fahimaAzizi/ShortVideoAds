import type React from "react";

export interface UploadZoneProps {
  label: string;
  file: File | null;
  onClear: () => void;
  onChange: (file: File) => void;
}

export interface User {
  id?: string;
  name?: string;
  email?: string;
}

export interface Project {
  id: string;
  userId: string;
  productName: string;
  productDescription?: string;
  productImage: string;
  modelImage: string;
  aspectRatio: "9:16" | "16:9";
  userPrompt?: string;
  resultImage?: string;
  createdAt: string;
}