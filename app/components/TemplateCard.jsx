"use client";

import styles from "@/app/style/templateCard.module.css";
import {
  IoLockClosed,
  IoBookmark,
  IoBookmarkOutline,
  IoArrowForward,
} from "react-icons/io5";
import { toast } from "sonner";

export default function TemplateCard({
  template,
  currentTier,
  currentTierInfo,
  onTemplateClick,
  onBookmarkToggle,
  showUpgradeModal,
}) {
  const tierHierarchy = { starter: 0, pro: 1, elite: 2 };
  const userTierLevel = tierHierarchy[currentTier] || 0;
  const templateTierLevel = tierHierarchy[template.tier] || 0;
  const isLocked = templateTierLevel > userTierLevel;

  return (
    <div
      className={`${styles.templateCard} ${isLocked ? styles.templateCardLocked : ""}`}
      onClick={() => onTemplateClick(template)}
    >
      <div className={styles.templateHeader}>
        <h3>{template.title}</h3>
        {!currentTierInfo.limits.bookmarks ? (
          <button
            className={`${styles.bookmarkButton} ${styles.bookmarkLocked}`}
            onClick={(e) => {
              e.stopPropagation();
              toast.info("Upgrade to Pro to bookmark templates");
              showUpgradeModal();
            }}
          >
            <IoLockClosed />
          </button>
        ) : (
          <button
            className={styles.bookmarkButton}
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle(template._id || template.id);
            }}
          >
            {template.isBookmarked ? (
              <IoBookmark className={styles.bookmarked} />
            ) : (
              <IoBookmarkOutline />
            )}
          </button>
        )}
      </div>

      <p className={styles.templateDescription}>{template.description}</p>

      <div className={styles.templateFooter}>
        <div className={styles.templateMeta}>
          <span className={styles.templateCategory}>{template.category}</span>
          {isLocked && (
            <span className={styles.tierBadge}>
              <IoLockClosed />
              {template.tier === "pro" ? "Pro" : "Elite"}
            </span>
          )}
        </div>
        <div className={styles.templateActions}>
          {!isLocked && (
            <span className={styles.readButton}>
              Read <IoArrowForward />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}