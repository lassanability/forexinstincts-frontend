import Image from "next/image";
import { notFound } from "next/navigation";
import { getPost } from "@/app/lib/api";
import { longDate } from "@/app/lib/format";
import site from "@/app/styles/site.module.css";
import styles from "@/app/styles/blog.module.css";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const post = await getPost((await params).slug);
  return post ? { title: post.title, description: post.excerpt, openGraph: { images: post.cover ? [post.cover] : [] } } : {};
}

export default async function PostPage({ params }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  return (
    <article className={site.page}>
      <header className={site.header}>
        <span className={site.eyebrow}>{post.topic}</span>
        <h1 className={site.title}>{post.title}</h1>
        <small className="faint">
          {post.author && `${post.author} · `}
          {longDate(post.publishedAt)}
        </small>
      </header>
      {post.cover && <Image src={post.cover} alt="" width={1200} height={630} unoptimized priority className={styles.hero} />}
      <div className={`${site.prose} ${styles.body}`} dangerouslySetInnerHTML={{ __html: post.body }} />
    </article>
  );
}
