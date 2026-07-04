import type { Project } from "../types"

const ProjectCard = (
  {
    gen,
  }: {
    gen: Project,
  }
) => {

  return (
  <div key={gen.id} className="mb-4 break-inside-avoid">
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition group">

     {/* preview */}
<div
  className={`${
    gen?.aspectRatio === "9:16" ? "aspect-9/16" : "aspect-video"
  } relative overflow-hidden`}
>
  {gen.generatedImage && (
    <img
      src={gen.generatedImage}
      alt={gen.productName}
      className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${
        gen.generatedVideo
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
      onMouseLeave={(e) => e.currentTarget.pause()}
    />
  )}
</div>
{/* details */}
<div className="p-4">

  {/* product name, date, aspect ration */}
  <div className="flex items-start justify-between gap-4">

    <div className="flex-1">
      <h3 className="font-medium text-lg mb-1">{gen.productName}</h3>

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

</div>

    </div>
  </div>
)
}

export default ProjectCard