import { useEffect, useState } from "react";

export default function PlayerPhoto({ src, alt, className }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) return null;

  return (
    <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />
  );
}
