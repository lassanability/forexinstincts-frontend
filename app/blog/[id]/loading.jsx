import styles from "@/app/style/blog.module.css";

const bodyLines = [
  "postSkeletonLine",
  "postSkeletonLineMid",
  "postSkeletonLine",
  "postSkeletonLineShort",
  "postSkeletonLine",
  "postSkeletonLine",
  "postSkeletonLineMid",
  "postSkeletonSubheading",
  "postSkeletonLine",
  "postSkeletonLine",
  "postSkeletonLineShort",
  "postSkeletonLine",
  "postSkeletonLineMid",
  "postSkeletonLine",
  "postSkeletonLineShort",
];

export default function BlogPostLoading() {
  return (
    <div className={styles.postSkeleton}>
      <div className={`${styles.postSkeletonHero} skeleton`} />
      <div className={styles.postSkeletonMeta}>
        <div className={`${styles.postSkeletonBadge} skeleton`} />
        <div className={`${styles.postSkeletonMetaItem} skeleton`} />
        <div className={`${styles.postSkeletonMetaItem} skeleton`} />
      </div>
      <div className={styles.postSkeletonTitleArea}>
        <div className={`${styles.postSkeletonTitle} skeleton`} />
        <div className={`${styles.postSkeletonTitleLine2} skeleton`} />
      </div>
      <div className={styles.postSkeletonBody}>
        {bodyLines.map((cls, i) => (
          <div key={i} className={`${styles[cls]} skeleton`} />
        ))}
      </div>
    </div>
  );
}
