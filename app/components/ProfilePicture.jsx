"use client";

import { useState, useRef } from "react";
import { useAuthStore } from "@/app/store/AuthStore";
import { toast } from "sonner";
import { IoCamera } from "react-icons/io5";
import styles from "@/app/style/profilePicture.module.css";

export default function ProfilePicture({ size = "medium", editable = true }) {
  const { username, profileImage, uploadProfilePicture } = useAuthStore();
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const displayImage = preview || profileImage || null;

  const handleClick = () => {
    if (!editable) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    const result = await uploadProfilePicture(file);
    setUploading(false);

    if (result.success) {
      toast.success(result.message || "Profile picture updated!");
      setPreview(null);
    } else {
      toast.error(result.message || "Failed to upload");
      setPreview(null);
    }

    e.target.value = "";
  };

  return (
    <div
      className={`${styles.avatarWrapper} ${styles[size]} ${editable ? styles.editable : ""}`}
      onClick={handleClick}
      title={editable ? "Click to change profile picture" : undefined}
    >
      {displayImage ? (
        <img
          src={displayImage}
          alt={`${username || "User"} profile`}
          className={styles.avatarImage}
          onError={(e) => {
            e.target.style.display = "none";
          }}
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
