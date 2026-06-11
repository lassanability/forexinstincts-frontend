import styles from "@/app/style/blog.module.css";
import { FiClock as ClockIcon, FiUser as UserIcon } from "react-icons/fi";
import { notFound } from "next/navigation";

const SITE_URL = "https://forexinstincts.com";

async function fetchBlog(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/blog/${id}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.blog : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await fetchBlog(id);
  if (!blog) return { title: "Post Not Found" };

  const description =
    blog.excerpt || blog.content?.replace(/<[^>]*>/g, "").substring(0, 160) || "";
  const canonical = `${SITE_URL}/blog/${id}`;
  const image = blog.coverImage || `${SITE_URL}/assets/banner.png`;

  return {
    title: blog.title,
    description,
    keywords: blog.tags?.length ? blog.tags : ["forex trading", "trading strategy", "expert advisor", "MetaTrader"],
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: blog.title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: blog.title }],
      publishedTime: blog.publishedAt || blog.createdAt,
      modifiedTime: blog.updatedAt || blog.publishedAt || blog.createdAt,
      authors: blog.author ? [blog.author] : ["ForexInstincts"],
      section: blog.category || "Trading",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: [image],
    },
  };
}

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

export default async function BlogPostPage({ params }) {
  const { id } = await params;
  const blog = await fetchBlog(id);
  if (!blog) notFound();

  const canonical = `${SITE_URL}/blog/${id}`;
  const description =
    blog.excerpt || blog.content?.replace(/<[^>]*>/g, "").substring(0, 160) || "";
  const image = blog.coverImage || `${SITE_URL}/assets/banner.png`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": canonical,
    headline: blog.title,
    description,
    image: { "@type": "ImageObject", url: image, width: 1200, height: 630 },
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
    author: {
      "@type": blog.author ? "Person" : "Organization",
      name: blog.author || "ForexInstincts",
      ...(blog.author ? {} : { url: SITE_URL }),
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    url: canonical,
    ...(blog.category ? { articleSection: blog.category } : {}),
    ...(blog.tags?.length ? { keywords: blog.tags.join(", ") } : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: blog.title, item: canonical },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <article className={styles.blogPost}>
        {blog.coverImage && (
          <div className={styles.postHeroImage}>
            <img src={blog.coverImage} alt={blog.title} />
          </div>
        )}
        <div className={styles.blogPostContent}>
          <div className={styles.blogMeta}>
            {blog.category && <span className={styles.blogCategory}>{blog.category}</span>}
            {blog.author && (
              <span>
                <UserIcon /> {blog.author}
              </span>
            )}
            {blog.readTime && (
              <span>
                <ClockIcon /> {blog.readTime}
              </span>
            )}
            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
          </div>
          <h1>{blog.title}</h1>
          <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </article>
    </>
  );
}
