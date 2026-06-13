"use client";

import { useEffect } from "react";
import Link from "next/link";
import SectionLabel from "@/app/components/ui/SectionLabel";
import AppImage from "@/app/components/ui/AppImage";
import styles from "@/app/style/blogPreview.module.css";
import { FiArrowRight as ArrowRight, FiClock as ClockIcon } from "react-icons/fi";
import { useBlogStore } from "@/app/store/BlogStore";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

export default function BlogPreviewSection() {
  const { blogs, loading, fetchBlogs } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const posts = blogs.slice(0, 3);

  if (loading && posts.length === 0) {
    return (
      <section className={styles.blogPreviewSection}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <SectionLabel text="Blog" heading="Latest Trading Insights" />
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
    <section className={styles.blogPreviewSection}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <SectionLabel text="Blog" heading="Latest Trading Insights" />
        </div>
        <Link href="/blog" className={styles.viewAllBtn}>
          View All Posts <ArrowRight />
        </Link>
      </div>

      <div className={styles.grid}>
        {posts.map((post) => (
          <div key={post._id} className={styles.card}>
            <Link href={`/blog/${post._id}`}>
              <div>
                {post.coverImage && (
                  <div className={styles.coverImg}>
                    <AppImage src={post.coverImage} alt={post.title} sizes="(min-width: 48em) 33vw, 100vw" />
                  </div>
                )}
                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    {post.category && (
                      <div className={styles.categoryBadge}>{post.category}</div>
                    )}
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className={styles.cardFooter}>
                    {post.readTime && (
                      <span>
                        <ClockIcon /> {post.readTime}
                      </span>
                    )}
                    <div className={styles.readMore}>
                      Read More <ArrowRight />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
