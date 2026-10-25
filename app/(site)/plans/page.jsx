import PlanCards from "@/app/components/billing/PlanCards";
import { getConfig } from "@/app/lib/api";
import { isSignedIn, request } from "@/app/lib/session";
import site from "@/app/styles/site.module.css";

export const metadata = {
  title: "Plans and pricing",
  description: "Free demo bots, then Starter, Pro and Elite plans for more bots, every strategy and deeper backtests. Paid through Whop.",
};

export default async function PlansPage({ searchParams }) {
  const [config, signedIn, query] = await Promise.all([getConfig(), isSignedIn(), searchParams]);
  const me = signedIn ? await request("/auth/me") : null;

  return (
    <div className={site.page}>
      <header className={site.header}>
        <span className={site.eyebrow}>Plans</span>
        <h1 className={site.title}>
          Pay for <span className="gradient-text">more bots, not more promises</span>
        </h1>
        <p className={site.lead}>Every plan, including free, has demo trading, every safety limit and the kill switch. Paid plans add real accounts, more bots, every strategy and deeper backtests. Cancel any time in Whop.</p>
        {query?.paid && <p className="up">Payment received. Your plan activates within a minute; refresh your dashboard if it hasn’t yet.</p>}
      </header>
      {config && <PlanCards plans={config.plans} limits={config.limits} signedIn={signedIn} current={me?.data?.access?.tier} />}
    </div>
  );
}
