import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Project } from "../types";
import 
  import { Loader2Icon } from "lucide-react";

const Result = () => {
  const { id } = useParams<{ id: string }>();

  const [project, setProjectData] = useState<Project>({} as Project);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchProjectData = () => {
    const stored = localStorage.getItem("generations");

    if (stored) {
      const generations: Project[] = JSON.parse(stored);

      const foundProject = generations.find((g) => g.id === id);

      if (foundProject) {
        setProjectData(foundProject);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

return loading ? (
  <div className="h-screen w-full flex items-center justify-center">
    <Loader2Icon className="animate-spin text-indigo-500 size-9" />
  </div>
) : (
  <div className="min-h-screen text-white p-6 md:p-12 mt-20">
    <div className="max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Generation Result</h1>
          <p className="text-gray-400 mt-2">{project.productName}</p>
        </div>

        <Link
          to="/my-generations"
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          Back to My Generations
        </Link>
      </header>
      {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main Result Display */}
          <div className="lg:col-span-2 space-y-6">

            <div className="glass-panel inline-block p-2 rounded-2xl">
              <div
                className={`${project?.aspectRatio === "9:16"
                    ? "aspect-[9/16]"
                    : "aspect-video"
                  } sm:max-h-[600px] rounded-xl bg-gray-900 overflow-hidden relative`}
              >
                {project?.generatedVideo ? (
                  <video
                    src={project.generatedVideo}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={project.generatedImage}
                    alt="Generated Result"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

          </div>
          {/* Sidebar Actions */}
<div className="space-y-6">

  {/* Download Buttons */}
  <div className="glass-panel p-6 rounded-2xl">
    <h3 className="text-xl font-semibold mb-4">Actions</h3>

    <div className="flex flex-col gap-3">

      <a href={project.generatedImage} download>
        <GhostButton
          disabled={!project.generatedImage}
          className="w-full justify-center rounded-md py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ImageIcon className="size-4.5" />
          Download Image
        </GhostButton>
      </a>

      <a href={project.generatedVideo} download>
        <GhostButton
          disabled={!project.generatedVideo}
          className="w-full justify-center rounded-md py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <VideoIcon className="size-4.5" />
          Download Video
        </GhostButton>
      </a>

    </div>
  </div>

</div>

</div>
    </div>
  </div>
);
};

export default Result;