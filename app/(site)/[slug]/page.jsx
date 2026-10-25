import { notFound } from "next/navigation";
import Markdown from "@/app/components/ui/Markdown";
import { getPage } from "@/app/lib/api";
import site from "@/app/styles/site.module.css";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const page = await getPage((await params).slug);
  return page ? { title: page.title, description: page.summary } : {};
}

export default async function LegalPage({ params }) {
  const { slug } = await params;
  if (slug === "contact") notFound();
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <article className={site.page}>
      <header className={site.header}>
        <h1 className={site.title}>{page.title}</h1>
        {page.summary && <p className={site.lead}>{page.summary}</p>}
      </header>
      <Markdown text={page.body} />
    </article>
  );
}
