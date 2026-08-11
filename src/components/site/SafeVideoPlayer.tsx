import { useEffect, useState } from "react";

const SAMPLE_FALLBACK_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-architecture-and-interior-41589-large.mp4";

interface SafeVideoPlayerProps {
  src?: string;
  className?: string;
}

export function SafeVideoPlayer({ src, className = "h-full w-full object-cover" }: SafeVideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string>(src || SAMPLE_FALLBACK_VIDEO);
  const [isFailed, setIsFailed] = useState(false);

  useEffect(() => {
    // If no src is provided or empty, use fallback stream
    if (!src || src.trim() === "" || src.startsWith("blob:")) {
      setVideoUrl(src || SAMPLE_FALLBACK_VIDEO);
    } else {
      setVideoUrl(src);
    }
    setIsFailed(false);
  }, [src]);

  const handleError = () => {
    if (!isFailed) {
      console.warn("Video player error encountered, switching to fallback MP4 stream.");
      setIsFailed(true);
      setVideoUrl(SAMPLE_FALLBACK_VIDEO);
    }
  };

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden">
      <video
        key={videoUrl}
        src={videoUrl}
        controls
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        onError={handleError}
        className={className}
      />
    </div>
  );
}
