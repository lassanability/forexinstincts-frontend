"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import styles from "@/app/style/blog.module.css";
import AppImage from "@/app/components/ui/AppImage";
import { useBlogStore } from "@/app/store/BlogStore";
import SectionLabel from "@/app/components/ui/SectionLabel";
import { IoSearch as SearchIcon } from "react-icons/io5";
import { FiArrowRight as ArrowRight, FiClock as ClockIcon, FiUser as UserIcon } from "react-icons/fi";

export default function BlogSection() {
  const { blogs, categories, loading, fetchBlogs, fetchCategories } = useBlogStore();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [fetchBlogs, fetchCategories]);

  const filtered = useMemo(() => {
    let list = blogs;
    if (activeCategory) list = list.filter((b) => b.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.excerpt?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activeCategory, blogs]);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "";

  if (loading && blogs.length === 0) {
    return (
      <section className={styles.blogSection}>
        <div className={styles.blogHeader}>
          <div className={`${styles.skeletonLabel} skeleton`} />
          <div className={`${styles.skeletonHeading} skeleton`} />
        </div>
        <div className={styles.blogGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
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

  return (
    <section className={styles.blogSection}>
      <div className={styles.blogHeader}>
        <SectionLabel text="Blog" heading="Trading Insights & Updates" center={true} />
        <div className={styles.searchBar}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {categories.length > 0 && (
          <div className={styles.categoryFilters}>
            <div
              className={`${styles.categoryChip} ${activeCategory === "" ? styles.categoryChipActive : ""}`}
              onClick={() => setActiveCategory("")}
            >
              All
            </div>
            {categories.map((cat, i) => (
              <div
                key={i}
                className={`${styles.categoryChip} ${activeCategory === cat ? styles.categoryChipActive : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>No articles found. Check back soon for trading insights!</div>
      ) : (
        <div className={styles.blogGrid}>
          {filtered.map((post, i) => {
            const isFeatured = i === 0;
            return (
              <div
                key={post._id || i}
                className={`${styles.blogCard} ${isFeatured ? styles.blogCardFeatured : ""}`}
              >
                <Link href={`/blog/${post._id}`}>
                  <div className={isFeatured ? styles.featuredInner : undefined}>
                    {post.coverImage && (
                      <div className={isFeatured ? styles.featuredImgWrap : styles.cardImgWrap}>
                        <AppImage
                          src={post.coverImage}
                          alt={post.title}
                          sizes={isFeatured ? "(min-width: 64em) 860px, 100vw" : "(min-width: 64em) 33vw, (min-width: 48em) 50vw, 100vw"}
                        />
                      </div>
                    )}
                    <div className={styles.cardContent}>
                      <div className={styles.cardMeta}>
                        {post.category && (
                          <div className={styles.categoryBadge}>{post.category}</div>
                        )}
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      </div>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      {(post.author || post.readTime) && (
                        <div className={styles.cardInfo}>
                          {post.author && (
                            <span><UserIcon /> {post.author}</span>
                          )}
                          {post.readTime && (
                            <span><ClockIcon /> {post.readTime}</span>
                          )}
                        </div>
                      )}
                      <div className={styles.cardFooter}>
                        <div className={styles.readMoreLink}>
                          Read More <ArrowRight />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
