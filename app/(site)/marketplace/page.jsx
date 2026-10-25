import { TbBuildingStore } from "react-icons/tb";
import PresetCard from "@/app/components/strategies/PresetCard";
import EmptyState from "@/app/components/ui/EmptyState";
import ButtonLink from "@/app/components/ui/ButtonLink";
import { getMarketplace } from "@/app/lib/api";
import site from "@/app/styles/site.module.css";

export const revalidate = 60;

export const metadata = {
  title: "Bot marketplace",
  description: "Ready-made Deriv bots with platform-measured live results, drawdown and sample size instead of seller screenshots.",
};

export default async function MarketplacePage() {
  const presets = (await getMarketplace()) ?? [];

  return (
    <div className={site.page}>
      <header className={site.header}>
        <span className={site.eyebrow}>Marketplace</span>
        <h1 className={site.title}>
          Ready-made bots, <span className="gradient-text">measured by us, not the seller</span>
        </h1>
        <p className={site.lead}>Every number on these cards comes from real bots running on ForexInstincts, compared with a random-direction twin so a lucky streak can’t pass for skill. Add one, set your own limits, and start on demo.</p>
      </header>

      {presets.length === 0 ? (
        <EmptyState icon={TbBuildingStore} title="The first bots are being tested" message="Build your own from the strategy library while the marketplace fills up." action={<ButtonLink href="/strategies">Browse strategies</ButtonLink>} />
      ) : (
        <div className={site.grid}>
          {presets.map((preset) => (
            <PresetCard key={preset.id} preset={preset} />
          ))}
        </div>
      )}
    </div>
  );
}
