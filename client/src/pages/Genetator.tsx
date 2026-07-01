import React, { useState } from "react";
import {
  RectangleVerticalIcon,
  RectangleHorizontalIcon,
} from "lucide-react";

import Title from "../components/Title";
import UploadZone from "../components/UploadZone";

const Generator = () => {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [userPrompt, setUserPrompt] = useState("");

  const handleGenerate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    console.log({
      productImage,
      modelImage,
      productName,
      productDescription,
      aspectRatio,
      userPrompt,
    });
  };

  return (
    <div className="min-h-screen text-white p-6 md:p-12 mt-28">
      <form
        className="max-w-6xl mx-auto mb-40"
        onSubmit={handleGenerate}
      >
        <Title
          heading="Create In-Context Image"
          description="Upload your model and product images to generate stunning UGC, short-form videos and social media posts"
        />

        <div className="flex gap-20 max-sm:flex-col items-start justify-between">
          {/* Left Column */}
          <div className="flex flex-col w-full sm:max-w-72 gap-8 mt-8">
            <UploadZone
              label="Product Image"
              file={productImage}
              onClear={() => setProductImage(null)}
              onChange={(file) => setProductImage(file)}
            />

            <UploadZone
              label="Model Image"
              file={modelImage}
              onClear={() => setModelImage(null)}
              onChange={(file) => setModelImage(file)}
            />
          </div>

          {/* Right Column */}
          <div className="w-full max-w-xl mt-8">
            <div className="mb-4 text-gray-300">
              <label
                htmlFor="productName"
                className="block text-sm mb-4"
              >
                Product Name
              </label>

              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) =>
                  setProductName(e.target.value)
                }
                placeholder="Enter the product name"
                required
                className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-violet-200/10 focus:border-violet-500/50 outline-none transition-all"
              />
            </div>

            <div className="mb-4 text-gray-300">
              <label
                htmlFor="productDescription"
                className="block text-sm mb-4"
              >
                Product Description{" "}
                <span className="text-xs text-violet-400">
                  (optional)
                </span>
              </label>

              <textarea
                id="productDescription"
                rows={4}
                value={productDescription}
                onChange={(e) =>
                  setProductDescription(e.target.value)
                }
                placeholder="Enter the product description"
                className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-violet-200/10 focus:border-violet-500/50 outline-none transition-all"
              />
            </div>

            <div className="mb-4 text-gray-300">
              <label className="block text-sm mb-4">
                Aspect Ratio
              </label>

              <div className="flex gap-3">
                <RectangleVerticalIcon
                  onClick={() => setAspectRatio("9:16")}
                  className={`p-2.5 size-12 bg-white/6 rounded-lg transition-all ring-2 ring-transparent cursor-pointer ${
                    aspectRatio === "9:16"
                      ? "ring-violet-500/50 bg-white/10"
                      : ""
                  }`}
                />

                <RectangleHorizontalIcon
                  onClick={() => setAspectRatio("16:9")}
                  className={`p-2.5 size-12 bg-white/6 rounded-lg transition-all ring-2 ring-transparent cursor-pointer ${
                    aspectRatio === "16:9"
                      ? "ring-violet-500/50 bg-white/10"
                      : ""
                  }`}
                />
              </div>
            </div>

            <div className="mb-6 text-gray-300">
              <label
                htmlFor="userPrompt"
                className="block text-sm mb-4"
              >
                User Prompt{" "}
                <span className="text-xs text-violet-400">
                  (optional)
                </span>
              </label>

              <textarea
                id="userPrompt"
                rows={4}
                value={userPrompt}
                onChange={(e) =>
                  setUserPrompt(e.target.value)
                }
                placeholder="Describe how you want the generated image to look."
                className="w-full bg-white/3 rounded-lg border-2 p-4 text-sm border-violet-200/10 focus:border-violet-500/50 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-700 transition-all font-semibold"
            >
              Generate Image
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Generator;