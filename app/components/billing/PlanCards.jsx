"use client";

import { useState, useTransition } from "react";
import { TbCheck, TbRocket } from "react-icons/tb";
import { startCheckout } from "@/app/actions/billing";
import Badge from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";
import ButtonLink from "@/app/components/ui/ButtonLink";
import { cx } from "@/app/lib/cx";
import { toast } from "@/app/stores/toast";
import styles from "@/app/styles/planCards.module.css";

const TIERS = ["starter", "pro", "elite"];

const freeFeatures = (limits) => [`${limits.bots} bot on a demo account`, `${limits.backtests} backtests a month`, "Core strategies and synthetics", "Every safety limit and the kill switch"];

export default function PlanCards({ plans, limits, signedIn, current }) {
  const [period, setPeriod] = useState("monthly");
  const [pending, start] = useTransition();
  const [chosen, setChosen] = useState(null);

  const buy = (code) => {
    setChosen(code);
    start(async () => {
      const result = await startCheckout(code);
      if (result?.error) toast.error(result.error);
    });
  };

  const shown = TIERS.map((tier) => plans.find((plan) => plan.tier === tier && plan.period === period)).filter(Boolean);

  return (
    <div className="stack gap-xl">
      <div className={cx("glass", styles.toggle)} role="tablist" aria-label="Billing period">
        {["monthly", "yearly"].map((value) => (
          <button key={value} type="button" role="tab" aria-selected={period === value} className={cx(styles.option, period === value && styles.active)} onClick={() => setPeriod(value)}>
            {value === "monthly" ? "Monthly" : "Yearly"}
            {value === "yearly" && <span className={styles.save}>2 months free</span>}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        <article className={cx("glass", styles.card)}>
          <header className={styles.head}>
            <h3>Free</h3>
            <p className="muted">Learn the platform on demo money.</p>
          </header>
          <p className={styles.price}>
            <span className="mono">$0</span>
          </p>
          <ul className={styles.features}>
            {freeFeatures(limits.free).map((feature) => (
              <li key={feature}>
                <TbCheck aria-hidden="true" /> {feature}
              </li>
            ))}
          </ul>
          <ButtonLink href={signedIn ? "/dashboard" : "/login"} variant="glass" block>
            {current === "free" ? "Your plan" : "Start free"}
          </ButtonLink>
        </article>

        {shown.map((plan) => (
          <article key={plan.plan} className={cx("glass", styles.card, plan.tier === "pro" && styles.featured)}>
            <header className={styles.head}>
              <div className="row gap-sm">
                <h3>{plan.title}</h3>
                {plan.badge && <Badge tone="gradient">{plan.badge}</Badge>}
              </div>
              <p className="muted">{plan.description}</p>
            </header>
            <p className={styles.price}>
              <span className="mono">${plan.price}</span>
              <small className="faint">/{period === "monthly" ? "month" : "year"}</small>
            </p>
            <ul className={styles.features}>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <TbCheck aria-hidden="true" /> {feature}
                </li>
              ))}
            </ul>
            {signedIn ? (
              <Button variant={plan.tier === "pro" ? "primary" : "glass"} block icon={TbRocket} loading={pending && chosen === plan.plan} onClick={() => buy(plan.plan)}>
                {current === plan.tier ? "Extend plan" : `Get ${plan.title}`}
              </Button>
            ) : (
              <ButtonLink href="/login?next=/plans" variant={plan.tier === "pro" ? "primary" : "glass"} block icon={TbRocket}>
                Get {plan.title}
              </ButtonLink>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
