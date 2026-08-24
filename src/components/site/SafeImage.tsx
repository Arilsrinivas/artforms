import { useEffect, useState } from "react";
import { MediaStorage } from "@/lib/media-storage";

interface SafeImageProps {
  src?: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
  title?: string;
}

export function SafeImage({
  src,
  alt = "",
  className = "h-full w-full object-cover",
  onClick,
  title
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || "");

  useEffect(() => {
    let isMounted = true;

    const resolve = async () => {
      const raw = (src || "").trim();
      if (
        raw.startsWith("indexeddb://") ||
        raw.startsWith("img_") ||
        raw.startsWith("before_") ||
        raw.startsWith("after_")
      ) {
        const id = raw.replace("indexeddb://", "");
        const url = await MediaStorage.getMediaUrl(id, raw);
        if (isMounted) setImgSrc(url);
      } else {
        if (isMounted) setImgSrc(raw);
      }
    };

    resolve();

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onClick={onClick}
      title={title}
      loading="lazy"
    />
  );
}
