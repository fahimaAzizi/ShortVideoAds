import React, { useState } from "react";
import Title from "../components/Title";
import UploadZone from "../components/UploadZone";

const Generator = () => {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const handleGenerate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    console.log({
      productImage,
      modelImage,
      productName,
      productDescription,
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
          <div className="flex flex-col w-full sm:max-w-72 gap-8 mt-8 mb-12">
            <UploadZone
              label="Upload Product Image"
              file={productImage}
              onClear={() => setProductImage(null)}
              onChange={(file) => setProductImage(file)}
            />

            <UploadZone
              label="Upload Model Image"
              file={modelImage}
              onClear={() => setModelImage(null)}
              onChange={(file) => setModelImage(file)}
            />
          </div>

          {/* Right Column */}
          <div className="w-full max-w-xl mt-8">
            <div className="mb-6">
              <label
                htmlFor="productName"
                className="block text-sm mb-2"
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
                className="w-full bg-white/5 rounded-lg border border-white/10 p-4 text-sm outline-none focus:border-violet-500 transition-all"
              />
            </div>

            <div className="mb-8">
              <label
                htmlFor="productDescription"
                className="block text-sm mb-2"
              >
                Product Description{" "}
                <span className="text-gray-400">
                  (optional)
                </span>
              </label>

              <textarea
                id="productDescription"
                rows={5}
                value={productDescription}
                onChange={(e) =>
                  setProductDescription(e.target.value)
                }
                placeholder="Enter the product description"
                className="w-full bg-white/5 rounded-lg border border-white/10 p-4 text-sm outline-none focus:border-violet-500 transition-all resize-none"
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