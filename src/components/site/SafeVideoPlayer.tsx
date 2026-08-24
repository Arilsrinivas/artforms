import { useEffect, useState } from "react";
import { MediaStorage } from "@/lib/media-storage";

const SAMPLE_FALLBACK_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-architecture-and-interior-41589-large.mp4";

interface SafeVideoPlayerProps {
  src?: string;
  className?: string;
  poster?: string;
  autoPlay?: boolean;
}

export function SafeVideoPlayer({
  src,
  className = "h-full w-full object-cover",
  poster,
  autoPlay = false
}: SafeVideoPlayerProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string>("");
  const [isYouTube, setIsYouTube] = useState<string | null>(null);
  const [isVimeo, setIsVimeo] = useState<string | null>(null);
  const [isFailed, setIsFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsFailed(false);
    setIsYouTube(null);
    setIsVimeo(null);

    const resolveSource = async () => {
      const rawSrc = (src || "").trim();

      if (!rawSrc) {
        if (isMounted) {
          setResolvedUrl(SAMPLE_FALLBACK_VIDEO);
          setIsLoading(false);
        }
        return;
      }

      // Check YouTube URL
      const ytMatch = rawSrc.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (ytMatch && ytMatch[1]) {
        if (isMounted) {
          setIsYouTube(ytMatch[1]);
          setIsLoading(false);
        }
        return;
      }

      // Check Vimeo URL
      const vimeoMatch = rawSrc.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
      if (vimeoMatch && vimeoMatch[1]) {
        if (isMounted) {
          setIsVimeo(vimeoMatch[1]);
          setIsLoading(false);
        }
        return;
      }

      // Check IndexedDB reference
      if (rawSrc.startsWith("indexeddb://") || rawSrc.startsWith("media_") || rawSrc.startsWith("vid_")) {
        const mediaId = rawSrc.replace("indexeddb://", "");
        const liveBlobUrl = await MediaStorage.getMediaUrl(mediaId, SAMPLE_FALLBACK_VIDEO);
        if (isMounted) {
          setResolvedUrl(liveBlobUrl || SAMPLE_FALLBACK_VIDEO);
          setIsLoading(false);
        }
        return;
      }

      // Check if rawSrc is a blob URL that may be expired
      if (rawSrc.startsWith("blob:")) {
        // Test if the blob URL is still readable
        try {
          const res = await fetch(rawSrc, { method: "HEAD" });
          if (res.ok && isMounted) {
            setResolvedUrl(rawSrc);
            setIsLoading(false);
            return;
          }
        } catch {
          // Expired blob - try resolving from cache or fallback
        }
      }

      if (isMounted) {
        setResolvedUrl(rawSrc);
        setIsLoading(false);
      }
    };

    resolveSource();

    return () => {
      isMounted = false;
    };
  }, [src]);

  const handleError = () => {
    if (!isFailed) {
      console.warn("Video playback error for URL:", resolvedUrl, "- falling back to default stream.");
      setIsFailed(true);
      setResolvedUrl(SAMPLE_FALLBACK_VIDEO);
    }
  };

  // Render YouTube Embed
  if (isYouTube) {
    return (
      <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${isYouTube}?autoplay=${autoPlay ? 1 : 0}&mute=1&playsinline=1&rel=0&modestbranding=1`}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  // Render Vimeo Embed
  if (isVimeo) {
    return (
      <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden">
        <iframe
          src={`https://player.vimeo.com/video/${isVimeo}?autoplay=${autoPlay ? 1 : 0}&muted=1&playsinline=1`}
          title="Video player"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center text-canvas/50 text-xs">
          Loading video stream...
        </div>
      ) : (
        <video
          key={resolvedUrl}
          src={resolvedUrl}
          poster={poster}
          controls
          muted={autoPlay}
          autoPlay={autoPlay}
          loop
          playsInline
          preload="metadata"
          onError={handleError}
          className={className}
        />
      )}
    </div>
  );
}
