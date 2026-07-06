import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Project } from "../types";

const Result = () => {
  const { id } = useParams();

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

  return (
    <div>
      {/* Your Result UI */}
    </div>
  );
};

export default Result;