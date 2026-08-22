import React, { useState } from "react";
import { Car, ImageOff, Maximize2, ZoomIn } from "lucide-react";

interface SafeVehicleImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  aspectRatio?: "video" | "square" | "auto" | "wide";
  enableZoom?: boolean;
  overlayChildren?: React.ReactNode;
  placeholderText?: string;
}

export const SafeVehicleImage: React.FC<SafeVehicleImageProps> = ({
  src,
  alt,
  className = "",
  aspectRatio = "video",
  enableZoom = true,
  overlayChildren,
  placeholderText = "No vehicle photograph provided",
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  const aspectClass = {
    video: "aspect-video",
    square: "aspect-square",
    wide: "aspect-[21/9]",
    auto: "h-full w-full",
  }[aspectRatio];

  const renderFallback = () => (
    <div
      id="vehicle-image-fallback"
      className={`relative w-full h-full flex flex-col items-center justify-center bg-zinc-900/90 border border-zinc-800 rounded-lg p-6 text-center select-none ${aspectClass}`}
    >
      <div className="p-4 rounded-full bg-zinc-800/80 border border-zinc-700/50 mb-3 text-cyan-400">
        <Car className="w-8 h-8 opacity-80" />
      </div>
      <p className="text-xs text-zinc-400 font-medium max-w-[200px] leading-relaxed">
        {placeholderText}
      </p>
      <span className="mt-2 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
        AutoSight Telemetry Placeholder
      </span>
      {overlayChildren}
    </div>
  );

  if (!src || hasError) {
    return (
      <div className={`relative overflow-hidden rounded-lg ${className}`}>
        {renderFallback()}
      </div>
    );
  }

  return (
    <>
      <div
        id="vehicle-image-container"
        className={`group relative overflow-hidden rounded-lg bg-zinc-950 border border-zinc-800/80 ${aspectClass} ${className}`}
      >
        {/* Loading shimmer */}
        {isLoading && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
            <Car className="w-8 h-8 text-zinc-700 animate-bounce" />
          </div>
        )}

        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02] ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Subtle high-tech gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-zinc-950/20 pointer-events-none" />

        {/* Zoom trigger */}
        {enableZoom && !isLoading && (
          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            aria-label="Enlarge image"
            className="absolute top-2.5 right-2.5 p-2 rounded-md bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Overlay children (markers, badges, camera angle label) */}
        {overlayChildren}
      </div>

      {/* Lightbox / Zoom Modal */}
      {isZoomed && (
        <div
          id="vehicle-image-lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between py-2 text-zinc-300 mb-2">
              <span className="text-xs font-mono tracking-wider uppercase text-cyan-400">
                High-Resolution Diagnostic Photographic Evidence
              </span>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="px-3 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer font-medium"
              >
                Close (ESC)
              </button>
            </div>
            <img
              src={src}
              alt={alt}
              className="max-h-[80vh] w-auto object-contain rounded-lg border border-zinc-700 shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </>
  );
};
