import React, { useRef, useState } from "react";
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Eye,
  Info,
  Shield,
} from "lucide-react";

export type ImageAngle = "FRONT" | "REAR" | "LEFT" | "RIGHT" | "CLOSE_UP";

interface ImageUploadProps {
  primaryImage: string | null;
  onImageSelected: (base64: string, mimeType: string, angle?: ImageAngle) => void;
  onRemoveImage: () => void;
  additionalImages?: { angle: ImageAngle; url: string }[];
  onAddAdditionalAngle?: (angle: ImageAngle, base64: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  primaryImage,
  onImageSelected,
  onRemoveImage,
  additionalImages = [],
  onAddAdditionalAngle,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [selectedAngle, setSelectedAngle] = useState<ImageAngle>("FRONT");
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const angles: { id: ImageAngle; label: string }[] = [
    { id: "FRONT", label: "Front Angle" },
    { id: "REAR", label: "Rear Angle" },
    { id: "LEFT", label: "Left Side" },
    { id: "RIGHT", label: "Right Side" },
    { id: "CLOSE_UP", label: "Close-up Damage" },
  ];

  const handleFileProcess = (file: File) => {
    setErrorMessage(null);

    // Validate mime type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage("Please upload a valid image file (JPG, PNG, or WEBP).");
      return;
    }

    // Validate size (max 15MB)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage("Image file size exceeds 15MB. Please upload a compressed photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, file.type || "image/jpeg", selectedAngle);
      }
    };
    reader.onerror = () => {
      setErrorMessage("Error reading image file. Please try another file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <div id="image-upload-component" className="space-y-4">
      {/* Angle Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {angles.map((ang) => (
          <button
            key={ang.id}
            type="button"
            onClick={() => setSelectedAngle(ang.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedAngle === ang.id
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            {ang.label}
          </button>
        ))}
      </div>

      {/* Main Upload Dropzone or Active Preview */}
      {!primaryImage ? (
        <div
          id="dropzone-container"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
            dragOver
              ? "border-cyan-400 bg-cyan-950/20 scale-[0.99]"
              : "border-zinc-800 hover:border-cyan-500/50 bg-zinc-950/60 hover:bg-zinc-900/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileProcess(e.target.files[0]);
              }
            }}
          />

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileProcess(e.target.files[0]);
              }
            }}
          />

          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)] group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 stroke-[1.75]" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-1">
            Upload Damaged Vehicle Photograph
          </h3>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-5 leading-relaxed">
            Drag and drop your high-resolution image here, or browse from your device. Supported formats: JPG, PNG, WEBP up to 15MB.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Browse Device Photos</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
              className="px-4 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Take Live Photo (Mobile/Camera)</span>
            </button>
          </div>
        </div>
      ) : (
        <div id="image-preview-card" className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-xl">
          {/* Main Selected Image */}
          <div className="relative aspect-video w-full max-h-[380px] bg-black">
            <img
              src={primaryImage}
              alt="Uploaded damaged vehicle preview"
              className="w-full h-full object-contain object-center"
              referrerPolicy="no-referrer"
            />

            {/* Angle Indicator Badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-zinc-950/80 backdrop-blur-md border border-zinc-700 text-[11px] font-mono font-semibold text-cyan-300 uppercase">
              {selectedAngle} ANGLE CAPTURED
            </div>

            {/* Quick Actions overlay */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 backdrop-blur-md text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-colors"
                title="Replace Photograph"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Replace</span>
              </button>

              <button
                type="button"
                onClick={onRemoveImage}
                className="p-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/50 backdrop-blur-md text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-colors"
                title="Remove Photograph"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileProcess(e.target.files[0]);
              }
            }}
          />
        </div>
      )}

      {/* Error alert toast */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Best Practices & Privacy Note */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-zinc-200 block mb-0.5">Lighting & Angles:</strong>
            For best results, upload a clear, well-illuminated photo showing the entire damaged area with minimal glare or obstruction.
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-zinc-200 block mb-0.5">Privacy Notice:</strong>
            Uploaded images are used solely for preliminary visual inspection. Avoid uploading personal ID cards or sensitive documents.
          </div>
        </div>
      </div>
    </div>
  );
};
