"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/AuthStore";
import { useOrderStore } from "@/app/store/OrderStore";
import StepIndicator from "./components/StepIndicator";
import BasicInfoStep from "./components/BasicInfoStep";
import RiskStep from "./components/RiskStep";
import EntryStep from "./components/EntryStep";
import ProtectionStep from "./components/ProtectionStep";
import AdvancedStep from "./components/AdvancedStep";
import ReviewStep from "./components/ReviewStep";
import styles from "@/app/style/build.module.css";

function BuildContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuth, hasUsedTrial, fetchProfile } = useAuthStore();
  const { tiers, tiersLoading, fetchTiers, createOrder, initializePayment, createTrialOrder } = useOrderStore();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const isTrial = searchParams.get("trial") === "true";

  const STEPS = ["Basic Info", "Risk", "Entry", "Protection", "Advanced", isTrial ? "Review & Generate" : "Review & Pay"];

  const [config, setConfig] = useState({
    tierId: "",
    tierName: "basic",
    botName: "",
    symbol: "EURUSD",
    timeframe: "H1",
    platform: "MT4",
    tradingDirection: "both",
    riskManagement: { mode: "fixed", lotSize: 0.01, riskPercent: 1, maxOpenTrades: 1, maxTradesPerDay: 5 },
    entry: { strategy: "ma_crossover", indicators: [], logic: "AND", customDescription: "", patternType: "any", breakoutBars: 20 },
    exit: {
      takeProfit: 100,
      stopLoss: 50,
      trailingStop: { enabled: false, distance: 30, step: 15 },
      breakEven: { enabled: false, triggerPips: 20, lockPips: 5 },
      partialClose: { enabled: false, percent: 50, atPips: 50 },
    },
    filters: { maxSpread: 20, sessions: [], newsFilter: false },
    advanced: {
      magicNumber: 0,
      emailNotifications: false,
      pushNotifications: false,
      multiTimeframe: { enabled: false, confirmationTimeframe: "H4", indicator: "MA", period: 50 },
      grid: { enabled: false, distance: 50, maxLevels: 5, lotMultiplier: 1 },
      martingale: { enabled: false, multiplier: 2, maxLevel: 3 },
    },
  });
  const [durationHours, setDurationHours] = useState(10);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => {
    if (isTrial && isAuth) {
      fetchProfile().then(() => {
        const { hasUsedTrial: used } = useAuthStore.getState();
        if (used) {
          toast.error("You have already used your free trial");
          router.push("/tiers");
        }
      });
    }
  }, [isTrial, isAuth, fetchProfile, router]);

  useEffect(() => {
    fetchTiers().then((result) => {
      if (result?.success && result?.data?.length) {
        if (isTrial) {
          const basicTier = result.data.find((t) => t.name === "basic") || result.data[0];
          if (basicTier) {
            setConfig((p) => ({ ...p, tierId: basicTier._id, tierName: basicTier.name }));
          }
          setDurationHours(6);
        } else {
          const tierParam = searchParams.get("tier") || "basic";
          const found =
            result.data.find((t) => t._id === tierParam || t.name === tierParam) ||
            result.data[0];
          if (found) {
            setConfig((p) => ({ ...p, tierId: found._id, tierName: found.name }));
          }
        }
      }
    });
    if (!isTrial) {
      const dParam = searchParams.get("duration");
      if (dParam) setDurationHours(Number(dParam));
      const fParam = searchParams.get("features");
      if (fParam) setSelectedFeatures(fParam.split(",").map(decodeURIComponent).filter(Boolean));
    }
  }, [fetchTiers, searchParams, isTrial]);

  const selectedTier = tiers.find((t) => t._id === config.tierId);

  const update = (path, value) => {
    setConfig((prev) => {
      const keys = path.split(".");
      const next = { ...prev };
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const next = () => {
    if (step === 0 && !config.botName.trim()) {
      toast.error("Please enter a bot name");
      return;
    }
    if (step === 1 && config.riskManagement.mode === "fixed") {
      const lot = config.riskManagement.lotSize;
      if (!lot || lot < 0.01) {
        toast.error("Lot size must be at least 0.01");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onTierChange = (tier) => {
    const lim = tier.limits || {};
    setConfig((p) => ({
      ...p,
      tierId: tier._id,
      tierName: tier.name,
      entry: {
        ...p.entry,
        indicators: (lim.maxIndicators || 1) <= 1 ? [] : p.entry.indicators,
      },
      filters: {
        ...p.filters,
        sessions: !lim.sessionFilter ? [] : p.filters.sessions,
      },
      riskManagement: {
        ...p.riskManagement,
        mode: !lim.riskPercentMode && p.riskManagement.mode === "percent" ? "fixed" : p.riskManagement.mode,
      },
      exit: {
        ...p.exit,
        trailingStop: !lim.trailingStop ? { enabled: false, distance: 30, step: 15 } : p.exit.trailingStop,
        breakEven: !lim.breakEven ? { enabled: false, triggerPips: 20, lockPips: 5 } : p.exit.breakEven,
        partialClose: !lim.partialClose ? { enabled: false, percent: 50, atPips: 50 } : p.exit.partialClose,
      },
      advanced: {
        ...p.advanced,
        emailNotifications: !lim.notifications ? false : p.advanced.emailNotifications,
        pushNotifications: !lim.notifications ? false : p.advanced.pushNotifications,
        multiTimeframe: !lim.multiTimeframe ? { enabled: false, confirmationTimeframe: "H4", indicator: "MA", period: 50 } : p.advanced.multiTimeframe,
        grid: !lim.gridMartingale ? { enabled: false, distance: 50, maxLevels: 5, lotMultiplier: 1 } : p.advanced.grid,
        martingale: !lim.gridMartingale ? { enabled: false, multiplier: 2, maxLevel: 3 } : p.advanced.martingale,
      },
    }));
  };

  const handleSubmitOrder = async () => {
    if (!isAuth) {
      toast.error("Please sign in to continue");
      router.push("/authentication/login");
      return;
    }
    if (!config.botName.trim()) {
      toast.error("Please enter a bot name");
      setStep(0);
      return;
    }
    if (!config.tierId) {
      toast.error("Please select a tier");
      setStep(0);
      return;
    }

    setSubmitting(true);
    try {
      const orderResult = await createOrder(
        config.tierId,
        config.botName,
        {
          symbol: config.symbol,
          timeframe: config.timeframe,
          platform: config.platform,
          tradingDirection: config.tradingDirection,
          riskManagement: config.riskManagement,
          entry: config.entry,
          exit: config.exit,
          filters: config.filters,
          advanced: config.advanced,
        },
        selectedFeatures,
        durationHours
      );

      if (!orderResult.success) {
        toast.error(orderResult.message || "Failed to create order");
        setSubmitting(false);
        return;
      }

      const payResult = await initializePayment(orderResult.orderId);
      if (!payResult.success) {
        toast.error(payResult.message || "Payment initialization failed");
        setSubmitting(false);
        return;
      }

      if (payResult.freeMode) {
        toast.success("Bot is being generated for free!");
        router.push("/dashboard");
        return;
      }

      window.location.href = payResult.invoiceUrl;
    } catch {
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const handleSubmitTrial = async () => {
    if (!isAuth) {
      toast.error("Please sign in to continue");
      router.push("/authentication/login");
      return;
    }
    if (!config.botName.trim()) {
      toast.error("Please enter a bot name");
      setStep(0);
      return;
    }

    setSubmitting(true);
    try {
      const trialResult = await createTrialOrder(config.botName, {
        symbol: config.symbol,
        timeframe: config.timeframe,
        platform: config.platform,
        tradingDirection: config.tradingDirection,
        riskManagement: config.riskManagement,
        entry: config.entry,
        exit: config.exit,
        filters: config.filters,
        advanced: config.advanced,
      });

      if (!trialResult.success) {
        toast.error(trialResult.message || "Failed to generate trial bot");
        setSubmitting(false);
        return;
      }

      const expiryMsg = trialResult.trialExpiresAt
        ? `Valid until ${new Date(trialResult.trialExpiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        : "Valid for 6 hours";
      toast.success(`Trial bot generated! ${expiryMsg}`);
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (tiersLoading && tiers.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  const stepProps = { config, update, tiers, selectedTier, onTierChange: isTrial ? undefined : onTierChange, durationHours, selectedFeatures, isTrial };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        {isTrial && (
          <div className={styles.trialBadge}>Free Trial · Basic Bot · Valid 6 Hours</div>
        )}
        <h1>{isTrial ? "Try Your Trading Bot Free" : "Build Your Trading Bot"}</h1>
        <p>{isTrial ? "Configure a basic bot — generate free, valid for 6 hours" : "Configure every detail of your trading bot"}</p>
      </div>

      <StepIndicator steps={STEPS} current={step} onStepClick={(i) => setStep(i)} />

      <div className={styles.stepContent}>
        {step === 0 && <BasicInfoStep {...stepProps} />}
        {step === 1 && <RiskStep {...stepProps} />}
        {step === 2 && <EntryStep {...stepProps} />}
        {step === 3 && <ProtectionStep {...stepProps} />}
        {step === 4 && <AdvancedStep {...stepProps} />}
        {step === 5 && (
          <ReviewStep
            {...stepProps}
            onPay={isTrial ? handleSubmitTrial : handleSubmitOrder}
            paying={submitting}
            onDurationChange={isTrial ? undefined : setDurationHours}
            onFeaturesChange={isTrial ? undefined : setSelectedFeatures}
            isTrial={isTrial}
          />
        )}
      </div>

      <div className={styles.nav}>
        {step > 0 && (
          <button className={styles.backBtn} onClick={back}>
            ← Back
          </button>
        )}
        {step < STEPS.length - 1 && (
          <button className={styles.nextBtn} onClick={next}>
            Next →
          </button>
        )}
      </div>

      <div className={styles.pageDisclaimer}>
        <p>
          Forex Instincts does not guarantee profits or trading performance. Users are solely responsible for defining how their bots operate. The generated bots simply automate the rules and logic specified by the user.
        </p>
        <div className={styles.pageDisclaimerLinks}>
          <Link href="/terms">Terms of Use</Link>
          <span>·</span>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}

export default function BuildBotPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.page}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        </div>
      }
    >
      <BuildContent />
    </Suspense>
  );
}
