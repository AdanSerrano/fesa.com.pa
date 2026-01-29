"use client";

import { memo, useCallback, useRef, useReducer } from "react";
import { Play } from "lucide-react";

interface AdminVideoPlayerProps {
  src: string;
  isPending?: boolean;
}

function AdminVideoPlayerComponent({ src, isPending }: AdminVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useReducer(() => true, false);

  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setHasStarted();
    }
  }, []);

  return (
    <div className="relative flex justify-center bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        controls
        playsInline
        preload="metadata"
        className={`w-full max-h-[400px] object-contain transition-opacity duration-300 ${hasStarted ? "opacity-100" : "opacity-0"}`}
        onPlay={setHasStarted}
      />
      {!hasStarted && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 cursor-pointer group"
          onClick={handlePlay}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 shadow-2xl">
              <Play className="h-8 w-8 text-white ml-1" fill="white" />
            </div>
            {isPending && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                Pendiente de guardar
              </span>
            )}
            <p className="text-white/50 text-xs">Click para previsualizar</p>
          </div>
        </div>
      )}
    </div>
  );
}

export const AdminVideoPlayer = memo(AdminVideoPlayerComponent);
AdminVideoPlayer.displayName = "AdminVideoPlayer";
