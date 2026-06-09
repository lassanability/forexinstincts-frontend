"use client";

import { useEffect, useState } from "react";
import SectionLabel from "@/app/components/ui/SectionLabel";
import styles from "@/app/style/testimonials.module.css";
import { FaStar as StarIcon } from "react-icons/fa";

function TestimonialCard({ t }) {
  return (
    <div className={styles.testimonialCard}>
      <div className={styles.quoteIcon}>&ldquo;</div>
      <p>{t.content}</p>
      <div className={styles.reviewer}>
        <div className={styles.reviewerInitial}>
          {t.name?.charAt(0).toUpperCase()}
        </div>
        <div className={styles.reviewerInfo}>
          <strong>{t.name}</strong>
          {t.position && <span>{t.position}</span>}
        </div>
        <div className={styles.stars}>
          {[...Array(t.rating || 5)].map((_, j) => (
            <StarIcon key={j} className={styles.starIcon} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/testimonials`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setTestimonials(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className={styles.testimonialsSection}>
        <div className={styles.header}>
          <SectionLabel
            text="Testimonials"
            heading="Traders Building Faster with ForexInstincts"
            center={true}
          />
        </div>
        <div className={styles.skeletonTrack}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={`${styles.skeletonQuote} skeleton`} />
              <div className={styles.skeletonLines}>
                <div className={`${styles.skeletonLine} skeleton`} />
                <div className={`${styles.skeletonLine} skeleton`} />
                <div className={`${styles.skeletonLine} skeleton`} />
                <div className={`${styles.skeletonLineShort} skeleton`} />
              </div>
              <div className={styles.skeletonReviewer}>
                <div className={`${styles.skeletonAvatar} skeleton`} />
                <div className={styles.skeletonReviewerInfo}>
                  <div className={`${styles.skeletonName} skeleton`} />
                  <div className={`${styles.skeletonPosition} skeleton`} />
                </div>
                <div className={styles.skeletonStars}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className={`${styles.skeletonStar} skeleton`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  // Duplicate enough times so the marquee has at least 8 cards per row
  const times = Math.ceil(8 / testimonials.length);
  const repeated = Array.from({ length: times }, () => testimonials).flat();
  const row1 = [...repeated, ...repeated];
  const row2 = [...repeated, ...repeated];

  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.header}>
        <SectionLabel
          text="Testimonials"
          heading="Traders Building Faster with ForexInstincts"
          center={true}
        />
      </div>
      <div className={styles.marqueeWrapper}>
        <div className={styles.trackLeft}>
          {row1.map((t, i) => (
            <TestimonialCard key={`l-${t._id}-${i}`} t={t} />
          ))}
        </div>
        <div className={styles.trackRight}>
          {row2.map((t, i) => (
            <TestimonialCard key={`r-${t._id}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
