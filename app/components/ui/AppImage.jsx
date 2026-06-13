"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "@/app/style/appImage.module.css";

export default function AppImage({ src, alt, sizes = "100vw", quality = 85, priority = false }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [src]);

  if (!src) return null;

  return (
    <>
      {!loaded && <div className={`${styles.imageSkeleton} skeleton`} />}
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        className={styles.appImage}
        priority={priority}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}
