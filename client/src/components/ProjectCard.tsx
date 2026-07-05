import React, { useState } from "react";
import type { Project } from "../types";
import { useNavigate } from "react-router-dom";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";

type ProjectCardProps = {
  gen: Project;
  setGenerations: React.Dispatch<React.SetStateAction<Project[]>>;
  forCommunity?: boolean;
};

const ProjectCard = ({
  gen,
  setGenerations,
  forCommunity = false,
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const deleteGeneration = () => {
    if (!window.confirm("Delete this generation?")) return;

    const stored = localStorage.getItem("generations");

    if (stored) {
      const generations: Project[] = JSON.parse(stored);

      const updated = generations.filter((g) => g.id !== gen.id);

      localStorage.setItem("generations", JSON.stringify(updated));
      setGenerations(updated);
    }
  };

  return (
    <div className="mb-4 break-inside-avoid">
      <div className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition group">

        {/* Preview */}
        <div
          className={`${gen.aspectRatio === "9:16"
              ? "aspect-[9/16]"
              : "aspect-video"
            } relative overflow-hidden`}
        >
          {gen.generatedImage && (
            <img
              src={gen.generatedImage}
              alt={gen.productName}
              className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${gen.generatedVideo
                  ? "group-hover:opacity-0"
                  : "group-hover:scale-105"
                }`}
            />
          )}

          {gen.generatedVideo && (
            <video
              src={gen.generatedVideo}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500"
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
          )}

          {/* Uploaded Images */}
          {gen.uploadedImages?.length > 0 && (
            <div className="absolute bottom-3 left-3 flex -space-x-3">
              {gen.uploadedImages.slice(0, 2).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="uploaded"
                  className="w-12 h-12 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
          )}

          {/* Menu */}
          {!forCommunity && (
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="bg-black/40 p-2 rounded-full hover:bg-black/60 transition"
              >
                <EllipsisVertical size={18} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-white/10 rounded-lg shadow-lg overflow-hidden z-20">

                  <button
                    onClick={() => navigate(`/editor/${gen.id}`)}
                    className="flex items-center gap-2 w-full px-4 py-3 hover:bg-white/10"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={deleteGeneration}
                    className="flex items-center gap-2 w-full px-4 py-3 text-red-400 hover:bg-white/10"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
          {/* source images */}
          <div className="absolute right-3 bottom-3">
            <img
              src={gen.uploadedImages[0]}
              alt="product"
              className="w-16 h-16 object-cover rounded-full animate-float"
            />

            <img
              src={gen.uploadedImages[1]}
              alt="model"
              className="w-16 h-16 object-cover rounded-full animate-float -ml-8"
              style={{ animationDelay: "3s" }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="p-4">

          <div className="flex items-start justify-between gap-4">

            <div className="flex-1">
              <h3 className="font-medium text-lg mb-1">
                {gen.productName}
              </h3>

              <p className="text-sm text-gray-400">
                Created: {new Date(gen.createdAt).toLocaleString()}
              </p>

              {gen.updatedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Updated: {new Date(gen.updatedAt).toLocaleString()}
                </p>
              )}
            </div>

            <div className="text-right">
              <div className="mt-2 flex flex-col items-end gap-1">
                <span className="text-xs px-2 py-1 bg-white/5 rounded-full">
                  Aspect: {gen.aspectRatio}
                </span>
              </div>
            </div>

          </div>
           {/* Description */}
{gen.productDescription && (
  <div className="mt-3">
    <p className="text-xs text-gray-400 mb-1">Description</p>
    <div className="text-sm text-gray-300 bg-white/5 p-2 rounded-md break-words">
      {gen.productDescription}
    </div>
  </div>
)}

{/* User Prompt */}
          {gen.userPrompt && (
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-1">Prompt</p>
              <div className="text-sm text-gray-300 bg-white/5 p-2 rounded-md break-words">
                {gen.userPrompt}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;