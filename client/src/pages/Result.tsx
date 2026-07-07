import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Project } from "../types";

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

      </header>
    </div>
  </div>
);
};

export default Result;