import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProjectCard from "../components/ProjectCard";
import PrimaryButton from "../components/PrimaryButton";
import type { Project } from "../types";

const MyGenerations = () => {
  const navigate = useNavigate();

  const [generations, setGenerations] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGenerations = async () => {
      try {
        const stored = localStorage.getItem("generations");

        if (stored) {
          setGenerations(JSON.parse(stored));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadGenerations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6 md:p-12 my-28">
      <div className="max-w-6xl mx-auto">

        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            My Generations
          </h1>

          <p className="text-gray-400">
            View and manage your AI-generated content
          </p>
        </header>

        {/* Generations List */}
        {generations.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {generations.map((gen) => (
              <ProjectCard
                key={gen.id}
                gen={gen}
                setGenerations={setGenerations}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h3 className="text-2xl font-semibold mb-3">
              No generations yet
            </h3>

            <p className="text-gray-400 mb-8">
              Start creating stunning product photos today.
            </p>

            <PrimaryButton onClick={() => navigate("/")}>
              Create Your First Project
            </PrimaryButton>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyGenerations;