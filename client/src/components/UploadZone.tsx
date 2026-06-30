import { XIcon, UploadIcon } from "lucide-react";

const UploadZone = ({ label, file, onClear, onChange }) => {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onChange(selectedFile);
    }
  };

  return (
    <div className="relative group">
      <div
        className={`relative h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center bg-white/2 p-6 ${
          file
            ? "border-violet-600/50 bg-violet-500/5"
            : "border-white/10 hover:border-violet-500/30 hover:bg-white/5"
        }`}
      >
        {file ? (
          <>
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-60"
            />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm rounded-2xl">
              <button
                type="button"
                onClick={onClear}
                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <> 
           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center jusify-center mb-4 group-hover:scale110 transition-transform"> 
           <UploadIcon className="w-12 h-12 text-violet-400 mb-4" />
           </div>

        
           
            <p className="text-white font-medium">Drag & drop or click to upload</p>

            <input
              type="file"
              accept="image/*"
              onChange={onChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </>
        )}
        </div>
     </div>
   );
};

export default UploadZone; 