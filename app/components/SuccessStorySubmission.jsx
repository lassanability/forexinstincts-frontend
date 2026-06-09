"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/AuthStore";
import { useSuccessStoryStore } from "@/app/store/SuccessStoryStore";
import { toast } from "sonner";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTime,
  IoStar,
  IoLockClosed,
} from "react-icons/io5";
import styles from "@/app/style/successStory.module.css";

export default function SuccessStorySubmission() {
  const { currentTier } = useAuthStore();
  const {
    myStories,
    submitStory,
    getMyStories,
    submitLoading,
    storiesLoading,
  } = useSuccessStoryStore();

  const [formData, setFormData] = useState({
    title: "",
    story: "",
  });

  const isLocked = currentTier === "starter";

  useEffect(() => {
    if (!isLocked) {
      getMyStories();
    }
  }, [isLocked]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.story.trim()) {
      toast.error("Please fill in both title and story");
      return;
    }

    if (formData.title.length > 100) {
      toast.error("Title must be 100 characters or less");
      return;
    }

    if (formData.story.length > 1000) {
      toast.error("Story must be 1000 characters or less");
      return;
    }

    const result = await submitStory(formData);

    if (result.success) {
      toast.success(result.message);
      setFormData({ title: "", story: "" });
    } else {
      toast.error(result.message);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <IoCheckmarkCircle className={styles.iconApproved} />;
      case "rejected":
        return <IoCloseCircle className={styles.iconRejected} />;
      default:
        return <IoTime className={styles.iconPending} />;
    }
  };

  const getStatusBadge = (status) => {
    const badgeClass =
      status === "approved"
        ? styles.badgeApproved
        : status === "rejected"
        ? styles.badgeRejected
        : styles.badgePending;

    return <span className={`${styles.badge} ${badgeClass}`}>{status}</span>;
  };

  if (isLocked) {
    return (
      <div className={styles.lockedContainer}>
        <IoLockClosed className={styles.lockIcon} />
        <h2>Success Stories</h2>
        <p>Upgrade to Pro or Elite to share your success story with the community!</p>
        <button className={styles.upgradeButton} onClick={() => window.location.href = "/tiers"}>
          Upgrade Now
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Story Title</label>
          <input
            id="title"
            type="text"
            placeholder="Give your story a catchy title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            maxLength={100}
            className={styles.input}
          />
          <span className={styles.charCount}>{formData.title.length}/100</span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="story">Your Story</label>
          <textarea
            id="story"
            placeholder="Share your experience with ForexInstincts... How did it help you? What results did you achieve?"
            value={formData.story}
            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
            maxLength={1000}
            rows={6}
            className={styles.textarea}
          />
          <span className={styles.charCount}>{formData.story.length}/1000</span>
        </div>

        <button
          type="submit"
          disabled={submitLoading}
          className={styles.submitButton}
        >
          {submitLoading ? "Submitting..." : "Submit Story"}
        </button>

        <p className={styles.note}>
          Your story will be reviewed by our team before being published.
        </p>
      </form>

      <div className={styles.myStories}>
        <h3>My Submitted Stories</h3>

        {storiesLoading ? (
          <div className={styles.loading}>Loading your stories...</div>
        ) : myStories.length === 0 ? (
          <div className={styles.empty}>
            <p>You haven&apos;t submitted any stories yet.</p>
          </div>
        ) : (
          <div className={styles.storiesList}>
            {myStories.map((story) => (
              <div key={story._id} className={styles.storyCard}>
                <div className={styles.storyHeader}>
                  <h4>{story.title}</h4>
                  <div className={styles.storyStatus}>
                    {getStatusIcon(story.status)}
                    {getStatusBadge(story.status)}
                  </div>
                </div>
                <p className={styles.storyContent}>{story.story}</p>
                <div className={styles.storyFooter}>
                  <span className={styles.storyDate}>
                    Submitted {new Date(story.submittedAt).toLocaleDateString()}
                  </span>
                  {story.status === "rejected" && story.rejectionReason && (
                    <span className={styles.rejectionReason}>
                      Reason: {story.rejectionReason}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
