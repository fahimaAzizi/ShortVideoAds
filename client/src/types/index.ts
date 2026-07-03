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
  name?: string;
  userId: string;
  user?: User;
  productName: string;
  productDescription?: string;
  productImage: string;
  modelImage: string;
  aspectRatio: string;
  targetLength?: number;
  generatedImage?: string;
  generatedVideo?: string;
  isGenerating: boolean;
  isPublished: boolean;
  error?: string;
  userPrompt?: string;
  resultImage?: string;
  createdAt: Date | string;
  updateAt?: Date | string;
  uploadedImages: string[];
}