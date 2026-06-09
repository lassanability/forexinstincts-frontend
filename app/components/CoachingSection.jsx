"use client";

import { useState } from "react";
import styles from "@/app/style/coachingSection.module.css";
import {
  IoSend,
  IoChatbubbles,
  IoCalendar,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { FaCrown, FaTelegram } from "react-icons/fa";
import { toast } from "sonner";

export default function CoachingSection({ currentTier, currentTierInfo }) {
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    toast.success("Reply sent! Our team will respond within 24 hours.");
    setReplyText("");
  };

  const handleTelegramClick = () => {
    window.open("https://t.me/forexinstincts", "_blank");
  };

  return (
    <div className={styles.coachingSection}>
      {currentTier === "elite" && (
        <div className={styles.coachingCard}>
          <div className={styles.coachingIcon}>
            <FaTelegram />
          </div>
          <h2>Join Our Telegram Community</h2>
          <p>
            Connect with other queens, get instant support, and access exclusive
            content in our private Telegram group.
          </p>
          <button className={styles.coachingBookButton} onClick={handleTelegramClick}>
            <FaTelegram />
            <span>Join Telegram Group</span>
          </button>
        </div>
      )}

      <div className={styles.coachingCard}>
        <div className={styles.coachingIcon}>
          <IoChatbubbles />
        </div>
        <h2>Ask Our Experts</h2>
        <p>
          Have questions about using a template? Need personalized advice? Our
          team is here to help!
        </p>
        <textarea
          className={styles.coachingTextarea}
          placeholder="Type your question here..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={5}
        />
        <button className={styles.coachingSendButton} onClick={handleReplySubmit}>
          <IoSend />
          <span>Send Message</span>
        </button>
      </div>

      {currentTier === "elite" && (
        <div className={styles.coachingCard}>
          <div className={styles.coachingIcon}>
            <FaCrown />
          </div>
          <h2>1-on-1 Coaching Session</h2>
          <p>
            As a Queen Elite member, you have access to a 60-minute coaching
            session!
          </p>
          <button className={styles.coachingBookButton}>
            <IoCalendar />
            <span>Book Your Session</span>
          </button>
        </div>
      )}

      <div className={styles.responseTimes}>
        <div className={styles.responseTimeItem}>
          <IoCheckmarkCircle />
          <div>
            <strong>Response Time</strong>
            <p>{currentTierInfo.limits.responseTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}