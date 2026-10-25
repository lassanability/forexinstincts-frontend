import { notFound } from "next/navigation";
import { TbChecklist, TbRocket } from "react-icons/tb";
import PresetCard from "@/app/components/strategies/PresetCard";
import ButtonLink from "@/app/components/ui/ButtonLink";
import Markdown from "@/app/components/ui/Markdown";
import Panel from "@/app/components/ui/Panel";
import { getPreset } from "@/app/lib/api";
import site from "@/app/styles/site.module.css";
import styles from "@/app/styles/strategyPage.module.css";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const preset = await getPreset((await params).slug);
  return preset ? { title: preset.title, description: preset.summary } : {};
}

export default async function PresetPage({ params }) {
  const preset = await getPreset((await params).slug);
  if (!preset) notFound();

  return (
    <div className={site.page}>
      <header className={site.header}>
        <span className={site.eyebrow}>Marketplace bot</span>
        <h1 className={site.title}>{preset.title}</h1>
        <p className={site.lead}>{preset.summary}</p>
        <ButtonLink href={`/bots/new?preset=${preset.slug}`} icon={TbRocket}>
          Add this bot
        </ButtonLink>
      </header>

      <div className={styles.layout}>
        <div className="stack gap-lg">
          {preset.body && <Markdown text={preset.body} />}
          {preset.strategyInfo && (
            <Panel title={`Built on ${preset.strategyInfo.name}`} icon={TbChecklist}>
              <ol className={styles.rules}>
                {preset.strategyInfo.rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ol>
            </Panel>
          )}
        </div>
        <PresetCard preset={preset} />
      </div>
    </div>
  );
}
