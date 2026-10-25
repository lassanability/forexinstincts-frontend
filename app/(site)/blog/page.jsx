import Image from "next/image";
import Link from "next/link";
import { TbNotebook } from "react-icons/tb";
import EmptyState from "@/app/components/ui/EmptyState";
import { getPosts } from "@/app/lib/api";
import { longDate } from "@/app/lib/format";
import site from "@/app/styles/site.module.css";
import styles from "@/app/styles/blog.module.css";

export const revalidate = 300;

export const metadata = { title: "Learn", description: "Strategy breakdowns, backtest results and honest guides to automated trading on Deriv." };

export default async function BlogPage() {
  const posts = (await getPosts(24)) ?? [];

  return (
    <div className={site.page}>
      <header className={site.header}>
        <span className={site.eyebrow}>Learn</span>
        <h1 className={site.title}>
          Strategy breakdowns <span className="gradient-text">without the hype</span>
        </h1>
      </header>
      {posts.length === 0 ? (
        <EmptyState icon={TbNotebook} title="First articles coming soon" message="Strategy breakdowns and backtest write-ups land here." />
      ) : (
        <div className={site.grid}>
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className={`glass ${styles.card}`}>
              {post.cover && <Image src={post.cover} alt="" width={640} height={360} unoptimized className={styles.cover} />}
              <div className={styles.text}>
                <small className="faint">
                  {post.topic} · {longDate(post.publishedAt)}
                </small>
                <h2>{post.title}</h2>
                {post.excerpt && <p className="muted">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
