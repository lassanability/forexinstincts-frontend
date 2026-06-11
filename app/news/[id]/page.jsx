import styles from "@/app/style/blog.module.css";
import { FiCalendar as CalendarIcon } from "react-icons/fi";
import { notFound } from "next/navigation";

const SITE_URL = "https://forexinstincts.com";

async function fetchNewsArticle(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/news/${id}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.news : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const article = await fetchNewsArticle(id);
  if (!article) return { title: "Article Not Found" };

  const description = article.summary || "";
  const canonical = `${SITE_URL}/news/${id}`;
  const image = article.coverImage || `${SITE_URL}/assets/banner.png`;

  return {
    title: article.title,
    description,
    keywords: article.tags?.length
      ? article.tags
      : ["forex news", "trading platform update", "MetaTrader news", "ForexInstincts"],
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: article.title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.publishedAt || article.createdAt,
      modifiedTime: article.updatedAt || article.publishedAt || article.createdAt,
      section: article.category || "News",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [image],
    },
  };
}

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

export default async function NewsArticlePage({ params }) {
  const { id } = await params;
  const article = await fetchNewsArticle(id);
  if (!article) notFound();

  const canonical = `${SITE_URL}/news/${id}`;
  const description = article.summary || "";
  const image = article.coverImage || `${SITE_URL}/assets/banner.png`;

  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": canonical,
    headline: article.title,
    description,
    image: { "@type": "ImageObject", url: image, width: 1200, height: 630 },
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt || article.createdAt,
    author: {
      "@type": "Organization",
      name: "ForexInstincts",
      url: SITE_URL,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    url: canonical,
    ...(article.category ? { articleSection: article.category } : {}),
    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "News", item: `${SITE_URL}/news` },
      { "@type": "ListItem", position: 3, name: article.title, item: canonical },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <article className={styles.blogPost}>
        {article.coverImage && (
          <div className={styles.postHeroImage}>
            <img src={article.coverImage} alt={article.title} />
          </div>
        )}
        <div className={styles.blogPostContent}>
          <div className={styles.blogMeta}>
            {article.category && <span className={styles.blogCategory}>{article.category}</span>}
            <span><CalendarIcon /> {formatDate(article.publishedAt || article.createdAt)}</span>
          </div>
          <h1>{article.title}</h1>
          {article.content ? (
            <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            <p>{article.summary}</p>
          )}
        </div>
      </article>
    </>
  );
}
