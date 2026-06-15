"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuthStore } from "@/app/store/AuthStore";
import { toast } from "sonner";
import { IoCamera } from "react-icons/io5";
import styles from "@/app/style/profilePicture.module.css";

export default function ProfilePicture({ size = "medium", editable = true }) {
  const { username, profileImage, uploadProfilePicture } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef(null);

  const displayImage = profileImage || null;

  useEffect(() => {
    setImgError(false);
  }, [displayImage]);

  const handleClick = () => {
    if (!editable) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const result = await uploadProfilePicture(file);
    setUploading(false);

    if (result.success) {
      toast.success(result.message || "Profile picture updated!");
    } else {
      toast.error(result.message || "Failed to upload");
    }

    e.target.value = "";
  };

  return (
    <div
      className={`${styles.avatarWrapper} ${styles[size]} ${editable ? styles.editable : ""}`}
      onClick={handleClick}
      title={editable ? "Click to change profile picture" : undefined}
    >
      {displayImage && !imgError ? (
        <Image
          src={displayImage}
          alt={`${username || "User"} profile`}
          fill
          sizes="64px"
          className={styles.avatarImage}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={styles.avatarPlaceholder}>
          {username?.charAt(0).toUpperCase() || "?"}
        </div>
      )}

      {editable && (
        <div className={styles.avatarOverlay}>
          {uploading ? (
            <div className={styles.spinner} />
          ) : (
            <IoCamera className={styles.overlayIcon} />
          )}
        </div>
      )}

      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className={styles.fileInput}
          disabled={uploading}
        />
      )}
    </div>
  );
}
