import { useEffect, useState } from "react";
import type { Project } from "../types";
import { dummyGenerations } from "../assets/assets";
import Loading from "./Loading";

const Community = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setTimeout(() => {
      setProjects(dummyGenerations);
      setLoading(false);
    }, 3000);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-white text-center">
        Community Creations
      </h1>

      <p className="text-center text-gray-400 mt-4 mb-12">
        Discover amazing AI-generated images created by the community.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/50 transition-all group"
          >
            {/* Preview */}
            <div
              className={`${
                project.aspectRatio === "9:16"
                  ? "aspect-[9/16]"
                  : "aspect-video"
              } relative overflow-hidden`}
            >
              {project.generatedImage && (
                <img
                  src={project.generatedImage}
                  alt={project.productName}
                  className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${
                    project.generatedVideo
                      ? "group-hover:opacity-0"
                      : "group-hover:scale-105"
                  }`}
                />
              )}

              {project.generatedVideo && (
                <video
                  src={project.generatedVideo}
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
            </div>

            {/* Details */}
            <div className="p-5">
              <h2 className="text-xl font-semibold text-white">
                {project.productName}
              </h2>

              <p className="text-gray-400 mt-2 line-clamp-3">
                {project.productDescription}
              </p>

              <div className="mt-4 text-sm text-violet-400">
                {project.user?.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;