"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import styles from "@/app/style/news.module.css";
import { useNewsStore } from "@/app/store/NewsStore";
import SectionLabel from "@/app/components/ui/SectionLabel";
import { IoSearch as SearchIcon } from "react-icons/io5";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

export default function NewsSection() {
  const { news, loading, fetchNews } = useNewsStore();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const categories = useMemo(() => {
    const cats = [...new Set(news.map((n) => n.category).filter(Boolean))];
    return cats;
  }, [news]);

  const filtered = useMemo(() => {
    let list = news;
    if (activeCategory) list = list.filter((n) => n.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.summary?.toLowerCase().includes(q) ||
          n.content?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activeCategory, news]);

  if (loading && news.length === 0) {
    return (
      <section className={styles.newsSection}>
        <div className={styles.newsHeader}>
          <SectionLabel text="News" heading="Platform Updates & Announcements" center={true} />
        </div>
        <div className={styles.newsGrid}>
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
    <section className={styles.newsSection}>
      <div className={styles.newsHeader}>
        <SectionLabel text="News" heading="Platform Updates & Announcements" center={true} />
        <div className={styles.searchBar}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search news..."
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
        <div className={styles.emptyState}>No news articles found. Check back soon!</div>
      ) : (
        <div className={styles.newsGrid}>
          {filtered.map((item, i) => (
            <div key={item._id || i} className={styles.newsCard}>
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
      )}
    </section>
  );
}
