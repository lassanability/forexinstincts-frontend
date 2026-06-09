"use client";

import styles from "@/app/style/templateModal.module.css";
import {
  IoClose,
  IoBookmark,
  IoBookmarkOutline,
  IoChatbubbles,
} from "react-icons/io5";

export default function TemplateModal({
  template,
  currentTierInfo,
  onClose,
  onBookmarkToggle,
}) {
  if (!template) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          <IoClose />
        </button>

        <div className={styles.modalHeader}>
          <h2>{template.title}</h2>
          {currentTierInfo.limits.bookmarks && (
            <button
              className={styles.modalBookmark}
              onClick={() => onBookmarkToggle(template._id || template.id)}
            >
              {template.isBookmarked ? (
                <IoBookmark className={styles.bookmarked} />
              ) : (
                <IoBookmarkOutline />
              )}
            </button>
          )}
        </div>

        <div
          className={styles.modalBody}
          dangerouslySetInnerHTML={{ __html: template.content }}
        />

        <div className={styles.modalFooter}>
          <button className={styles.modalAskButton}>
            <IoChatbubbles />
            <span> Tailored For You</span>
          </button>
        </div>
      </div>
    </div>
  );
}