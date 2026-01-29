"use client";

import { memo, useCallback, useRef, useReducer } from "react";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  title?: string;
}

function VideoPlayerComponent({ src, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useReducer(() => true, false);

  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setHasStarted();
    }
  }, []);

  return (
    <div className="relative flex justify-center bg-black">
      <video
        ref={videoRef}
        src={src}
        controls
        playsInline
        preload="metadata"
        className={`w-full max-h-[500px] object-contain transition-opacity duration-300 ${hasStarted ? "opacity-100" : "opacity-0"}`}
        title={title}
        onPlay={setHasStarted}
      />
      {!hasStarted && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 cursor-pointer group"
          onClick={handlePlay}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 shadow-2xl">
              <Play className="h-10 w-10 text-white ml-1" fill="white" />
            </div>
            {title && (
              <p className="text-white/90 text-base font-medium max-w-xs text-center px-4">
                {title}
              </p>
            )}
            <p className="text-white/50 text-sm">Click para reproducir</p>
          </div>
        </div>
      )}
    </div>
  );
}

export const VideoPlayer = memo(VideoPlayerComponent);
VideoPlayer.displayName = "VideoPlayer";
