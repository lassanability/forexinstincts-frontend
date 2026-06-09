"use client";

import { useEffect } from "react";
import Link from "next/link";
import SectionLabel from "@/app/components/ui/SectionLabel";
import styles from "@/app/style/newsPreview.module.css";
import { FiArrowRight as ArrowRight } from "react-icons/fi";
import { useNewsStore } from "@/app/store/NewsStore";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

export default function NewsPreviewSection() {
  const { news, loading, fetchNews } = useNewsStore();

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const posts = news.slice(0, 3);

  if (loading && posts.length === 0) {
    return (
      <section className={styles.newsPreviewSection}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <SectionLabel text="News" heading="Latest Platform Updates" />
          </div>
        </div>
        <div className={styles.grid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={`${styles.skeletonImg} skeleton`} />
              <div className={styles.skeletonBody}>
                <div className={`${styles.skeletonTag} skeleton`} />
                <div className={`${styles.skeletonTitle} skeleton`} />
                <div className={`${styles.skeletonTitleShort} skeleton`} />
                <div className={`${styles.skeletonLine} skeleton`} />
                <div className={`${styles.skeletonLine} skeleton`} />
                <div className={`${styles.skeletonLineShort} skeleton`} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className={styles.newsPreviewSection}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <SectionLabel text="News" heading="Latest Platform Updates" />
        </div>
        <Link href="/news" className={styles.viewAllBtn}>
          View All News <ArrowRight />
        </Link>
      </div>

      <div className={styles.grid}>
        {posts.map((item) => (
          <div key={item._id} className={styles.card}>
            <Link href={`/news/${item._id}`}>
              <div>
                {item.coverImage && (
                  <img src={item.coverImage} alt={item.title} className={styles.coverImg} />
                )}
                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    {item.category && (
                      <div className={styles.categoryBadge}>{item.category}</div>
                    )}
                    <span>{formatDate(item.publishedAt || item.createdAt)}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
