import { TbArrowRight, TbBolt, TbChartCandle, TbClockPlay, TbFlask, TbKey, TbLink, TbPlayerStop, TbRocket, TbScale, TbShieldLock } from "react-icons/tb";
import LiveChart from "@/app/components/charts/LiveChart";
import Ticker from "@/app/components/charts/Ticker";
import PlanCards from "@/app/components/billing/PlanCards";
import StrategyCard from "@/app/components/strategies/StrategyCard";
import Badge from "@/app/components/ui/Badge";
import ButtonLink from "@/app/components/ui/ButtonLink";
import { getConfig, getStrategies } from "@/app/lib/api";
import { isSignedIn } from "@/app/lib/session";
import styles from "@/app/styles/home.module.css";
import site from "@/app/styles/site.module.css";

export const revalidate = 300;

const REASONS = [
  { icon: TbClockPlay, title: "Runs when you close the tab", text: "Bots live on our servers, not in your browser. They keep trading through restarts, sleep and dead phone batteries." },
  { icon: TbFlask, title: "Backtests that charge real costs", text: "Every test pays the spread and Deriv’s commission, and is compared with a coin-flip twin so luck can’t pass as skill." },
  { icon: TbPlayerStop, title: "Limits that actually stop", text: "Max stake, daily loss, losing streak and drawdown limits on every bot, plus a kill switch that closes everything." },
  { icon: TbShieldLock, title: "Your money never leaves Deriv", text: "You link a trade-only token. We can place and close trades, never withdraw. Revoke it on Deriv any time." },
];

const STEPS = [
  { icon: TbLink, title: "Link Deriv", text: "Create a token with the Trade scope on Deriv and paste it in. Demo accounts are free on every plan." },
  { icon: TbChartCandle, title: "Pick a strategy", text: "Start from a researched strategy or a marketplace bot, each labelled with how strong its evidence is." },
  { icon: TbScale, title: "Test it honestly", text: "Backtest on real Deriv history with costs, or see the exact odds and expected loss for synthetics." },
  { icon: TbRocket, title: "Go live with limits", text: "Set your stake and loss limits, start on demo, then switch to real when the numbers convince you." },
];

const FAQ = [
  ["Will a bot make me money?", "Nobody can promise that, and you should distrust anyone who does. We give you the tools to find out honestly: backtests with real costs, a random-direction benchmark, and live results tied to Deriv contract IDs."],
  ["Can I download the bot code?", "No. Bots run inside ForexInstincts on our servers, so there is nothing to install and nothing that stops when your computer sleeps."],
  ["Why do you warn me about synthetic indices?", "Deriv generates them with a random number generator, so no pattern predicts the next tick and every contract loses a little on average. We show the exact expected loss before you start, and keep martingale off by default."],
  ["Can ForexInstincts withdraw from my account?", "No. Create your Deriv token with the Trade scope only. It can place and close trades but not move money, and you can delete it on Deriv at any time."],
  ["What happens when my plan ends?", "Bots above the free limit stop on their own, open trades keep their stops and targets, and your history stays."],
];

export default async function HomePage() {
  const [config, strategies, signedIn] = await Promise.all([getConfig(), getStrategies(), isSignedIn()]);
  const featured = (strategies ?? []).filter((strategy) => ["london-breakout", "regime-guardian", "trend-pullback", "synthetic-runner"].includes(strategy.key));

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <span className={site.eyebrow}>Deriv trading bots, hosted</span>
          <h1 className={styles.title}>
            Trade on instinct.
            <br />
            <span className="gradient-text">Prove it with data.</span>
          </h1>
          <p className={styles.lead}>Run research-backed forex, gold and synthetic bots on your own Deriv account. They trade around the clock on our servers, test against real costs, and stop the moment a limit is hit.</p>
          <div className={styles.ctas}>
            <ButtonLink href="/dashboard" size="lg" icon={TbRocket}>
              Launch terminal
            </ButtonLink>
            <ButtonLink href="/strategies" size="lg" variant="glass" icon={TbArrowRight}>
              See the strategies
            </ButtonLink>
          </div>
          <ul className={styles.proof}>
            <li>
              <TbBolt aria-hidden="true" /> Free demo bots
            </li>
            <li>
              <TbKey aria-hidden="true" /> Trade-only tokens
            </li>
            <li>
              <TbShieldLock aria-hidden="true" /> No withdrawals, ever
            </li>
          </ul>
        </div>

        <div className={`glass ${styles.terminal}`}>
          <header className={styles.terminalHead}>
            <span className={styles.lights} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <strong>Volatility 100 · 1m</strong>
            <Badge tone="up" pulse>
              Live
            </Badge>
          </header>
          <LiveChart symbol="R_100" granularity={60} size="md" />
          <footer className={styles.terminalFoot}>
            <span>Server-side · 24/7</span>
            <span>Kill switch armed</span>
            <span>Costs included</span>
          </footer>
        </div>
      </section>

      <Ticker />

      <section className={site.page} aria-labelledby="why">
        <header className={site.header}>
          <span className={site.eyebrow}>Why traders switch</span>
          <h2 id="why" className={site.title}>
            Built for the complaints <span className="gradient-text">every bot site ignores</span>
          </h2>
        </header>
        <div className={styles.reasons}>
          {REASONS.map((reason) => (
            <article key={reason.title} className={`glass ${styles.reason}`}>
              <span className={styles.reasonIcon}>
                <reason.icon aria-hidden="true" />
              </span>
              <h3>{reason.title}</h3>
              <p className="muted">{reason.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={site.page} aria-labelledby="strategies">
        <header className={styles.split}>
          <div className={site.header}>
            <span className={site.eyebrow}>Strategy library</span>
            <h2 id="strategies" className={site.title}>
              Not SMA crossovers. <span className="gradient-text">What traders run in 2026.</span>
            </h2>
            <p className={site.lead}>Eleven strategies chosen from forums, YouTube breakdowns and published backtests, plus Regime Guardian, our own. Each one tells you how strong the evidence behind it is.</p>
          </div>
          <ButtonLink href="/strategies" variant="glass" icon={TbArrowRight}>
            All strategies
          </ButtonLink>
        </header>
        <div className={site.grid}>
          {featured.map((strategy) => (
            <StrategyCard key={strategy.key} strategy={strategy} />
          ))}
        </div>
      </section>

      <section className={site.page} aria-labelledby="how">
        <header className={site.header}>
          <span className={site.eyebrow}>How it works</span>
          <h2 id="how" className={site.title}>
            From token to live bot in <span className="gradient-text">four steps</span>
          </h2>
        </header>
        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={`glass ${styles.step}`}>
              <span className={`mono ${styles.number}`}>0{index + 1}</span>
              <step.icon className={styles.stepIcon} aria-hidden="true" />
              <h3>{step.title}</h3>
              <p className="muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {config?.plans?.length > 0 && (
        <section className={site.page} aria-labelledby="plans">
          <header className={`${site.header} ${styles.centered}`}>
            <span className={site.eyebrow}>Plans</span>
            <h2 id="plans" className={site.title}>
              Start free. <span className="gradient-text">Scale when it works.</span>
            </h2>
          </header>
          <PlanCards plans={config.plans} limits={config.limits} signedIn={signedIn} />
        </section>
      )}

      <section className={site.page} aria-labelledby="faq">
        <header className={site.header}>
          <span className={site.eyebrow}>Straight answers</span>
          <h2 id="faq" className={site.title}>
            Questions traders <span className="gradient-text">actually ask</span>
          </h2>
        </header>
        <div className={styles.faq}>
          {FAQ.map(([question, answer]) => (
            <details key={question} className={`glass ${styles.question}`}>
              <summary>{question}</summary>
              <p className="muted">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={`glass ${styles.cta}`}>
        <h2>
          Your next bot should <span className="gradient-text">earn your trust first.</span>
        </h2>
        <p className="muted">Start on demo for free. Upgrade only when the numbers convince you.</p>
        <ButtonLink href="/dashboard" size="lg" icon={TbRocket}>
          Launch terminal
        </ButtonLink>
      </section>
    </>
  );
}
