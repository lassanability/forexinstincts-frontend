import Link from "next/link";
import styles from "@/app/style/build.module.css";
import { useAuthStore } from "@/app/store/AuthStore";
import { calculateBotPrice, DURATION_OPTIONS } from "@/app/lib/pricingUtils";

export default function ReviewStep({
  config, selectedTier, onPay, paying,
  durationHours = 10, selectedFeatures = [],
  onDurationChange, onFeaturesChange, isTrial = false,
}) {
  const { isAuth } = useAuthStore();
  const price = calculateBotPrice(
    selectedTier?.basePrice,
    selectedTier?.ratePerHour,
    selectedTier?.features,
    selectedFeatures,
    durationHours
  );
  const exit = config.exit;
  const isComplex = config.tierName === "complex" || config.tierName === "advanced";
  const sessions = config.filters.sessions || [];
  const indicators = config.entry.indicators || [];

  const toggleFeature = (name) => {
    if (!onFeaturesChange) return;
    onFeaturesChange(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  return (
    <div>
      <div className={styles.stepHeader}>
        <h2>{isTrial ? "Review & Generate" : "Review & Pay"}</h2>
        <p>{isTrial ? "Confirm your bot configuration to generate your free trial" : "Confirm your bot configuration before checkout"}</p>
      </div>

      <div className={styles.reviewSection}>
        <div className={styles.reviewSectionHeader}>
          <h4>Bot Details</h4>
        </div>
        <div className={styles.reviewTable}>
          <div className={styles.reviewRow}>
            <div className={styles.reviewLabel}>Bot Name</div>
            <div className={styles.reviewValue}>{config.botName || "—"}</div>
          </div>
          <div className={styles.reviewRow}>
            <div className={styles.reviewLabel}>Tier</div>
            <div className={styles.reviewValue}>{selectedTier?.displayName || config.tierName}</div>
          </div>
          <div className={styles.reviewRow}>
            <div className={styles.reviewLabel}>Symbol</div>
            <div className={styles.reviewValue}>{config.symbol}</div>
          </div>
          <div className={styles.reviewRow}>
            <div className={styles.reviewLabel}>Timeframe</div>
            <div className={styles.reviewValue}>{config.timeframe}</div>
          </div>
          <div className={styles.reviewRow}>
            <div className={styles.reviewLabel}>Platform</div>
            <div className={styles.reviewValue}>{config.platform}</div>
          </div>
          <div className={styles.reviewRow}>
            <div className={styles.reviewLabel}>Direction</div>
            <div className={styles.reviewValue}>{config.tradingDirection}</div>
          </div>
        </div>
      </div>

      <div className={styles.reviewSection}>
        <div className={styles.reviewSectionHeader}>
          <h4>Risk Management</h4>
        </div>
        <div className={styles.reviewTable}>
          <div className={styles.reviewRow}>
            <div className={styles.reviewLabel}>Sizing Mode</div>
            <div className={styles.reviewValue}>
              {config.riskManagement.mode === "percent"
                ? `${config.riskManagement.riskPercent}% of Balance`
                : `Fixed ${config.riskManagement.lotSize} lots`}
            </div>
          </div>
          <div className={styles.reviewRow}>
            <div className={styles.reviewLabel}>Max Open Trades</div>
            <div className={styles.reviewValue}>{config.riskManagement.maxOpenTrades}</div>
          </div>
          <div className={styles.reviewRow}>
            <div className={styles.reviewLabel}>Max Trades/Day</div>
            <div className={styles.reviewValue}>{config.riskManagement.maxTradesPerDay}</div>
          </div>
        </div>
      </div>

      <div className={styles.reviewSection}>
        <div className={styles.reviewSectionHeader}>
          <h4>Strategy</h4>
        </div>
        <div className={styles.reviewTable}>
          <div className={styles.reviewRow}>
            <div className={styles.reviewLabel}>Strategy</div>
            <div className={styles.reviewValue}>{config.entry.strategy.replace(/_/g, " ")}</div>
          </div>
          {indicators.length > 0 && (
            <div className={styles.reviewRow}>
              <div className={styles.reviewLabel}>Indicators</div>
              <div className={styles.reviewValue}>{indicators.map((i) => i.type).join(", ")}</div>
            </div>
          )}
          <div className={styles.reviewRow}>
            <div className={styles.reviewLabel}>Take Profit</div>
            <div className={styles.reviewValue}>{exit.takeProfit} pips</div>
          </div>
          <div className={styles.reviewRow}>
            <div className={styles.reviewLabel}>Stop Loss</div>
            <div className={styles.reviewValue}>{exit.stopLoss} pips</div>
          </div>
          {isComplex && (
            <>
              <div className={styles.reviewRow}>
                <div className={styles.reviewLabel}>Trailing Stop</div>
                <div className={styles.reviewValue}>
                  {exit.trailingStop.enabled
                    ? `Yes (${exit.trailingStop.distance}p start, ${exit.trailingStop.step}p step)`
                    : "Off"}
                </div>
              </div>
              <div className={styles.reviewRow}>
                <div className={styles.reviewLabel}>Break-Even</div>
                <div className={styles.reviewValue}>
                  {exit.breakEven.enabled ? `Yes (trigger: ${exit.breakEven.triggerPips}p)` : "Off"}
                </div>
              </div>
              <div className={styles.reviewRow}>
                <div className={styles.reviewLabel}>Sessions</div>
                <div className={styles.reviewValue}>{sessions.length ? sessions.join(", ") : "All sessions"}</div>
              </div>
            </>
          )}
          <div className={styles.reviewRow}>
            <div className={styles.reviewLabel}>Max Spread</div>
            <div className={styles.reviewValue}>{config.filters.maxSpread} points</div>
          </div>
        </div>
      </div>

      {isTrial ? (
        <div className={styles.reviewSection}>
          <div className={styles.reviewSectionHeader}>
            <h4>Trial Details</h4>
          </div>
          <div className={styles.reviewTable}>
            <div className={styles.reviewRow}>
              <div className={styles.reviewLabel}>Duration</div>
              <div className={styles.reviewValue}>6 hours</div>
            </div>
            <div className={styles.reviewRow}>
              <div className={styles.reviewLabel}>Cost</div>
              <div className={styles.reviewValue}>Free</div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.reviewSection}>
          <div className={styles.reviewSectionHeader}>
            <h4>Duration & Features</h4>
          </div>
          <div className={styles.reviewPricingBody}>
            <div className={styles.formGroup}>
              <label>Bot Active Duration</label>
              <select
                value={durationHours}
                onChange={e => onDurationChange && onDurationChange(Number(e.target.value))}
                className={styles.select}
              >
                {DURATION_OPTIONS.map(d => (
                  <option key={d.hours} value={d.hours}>{d.fullLabel}</option>
                ))}
              </select>
            </div>

            {(selectedTier?.features || []).length > 0 && (
              <div className={styles.formGroup}>
                <label>Bot Features</label>
                <div className={styles.reviewFeatureGrid}>
                  {(selectedTier.features || []).map((f, i) => {
                    const isOn = selectedFeatures.includes(f.name);
                    return (
                      <div
                        key={i}
                        className={`${styles.reviewFeature}${isOn ? ` ${styles.reviewFeatureOn}` : ""}`}
                        onClick={() => toggleFeature(f.name)}
                      >
                        <div className={`${styles.reviewFeatureDot}${isOn ? ` ${styles.reviewFeatureDotOn}` : ""}`} />
                        <span>{f.name}</span>
                        <span className={styles.reviewFeatureMult}>×{f.multiplier}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isTrial ? (
        <div className={styles.trialFreeTotal}>
          <div>Total</div>
          <div>FREE · 6h Trial</div>
        </div>
      ) : (
        <div className={styles.priceTotal}>
          <div className={styles.priceTotalLabel}>Total</div>
          <div className={styles.priceTotalAmount}>
            ${price.toLocaleString()} USD
          </div>
        </div>
      )}

      {!isAuth ? (
        <div className={styles.authNotice}>
          <p>{isTrial ? "Create an account to access your free trial" : "You need to sign in before checkout"}</p>
          <Link href={isTrial ? "/authentication/signup" : "/authentication/login"} className={styles.payBtn}>
            {isTrial ? "Create Account" : "Sign in to Continue"}
          </Link>
        </div>
      ) : (
        <button
          className={styles.payBtn}
          onClick={onPay}
          disabled={paying || !config.botName.trim()}
        >
          {paying
            ? (isTrial ? "Generating..." : "Processing payment...")
            : isTrial
              ? "Generate Trial Bot (Free)"
              : `Pay $${price.toLocaleString()} & Generate Bot`}
        </button>
      )}

      <div className={styles.secureNote}>
        <p>
          {isTrial
            ? "Trial bot · Basic tier · Valid for 6 hours after generation"
            : "Secure crypto payment · Bot generated instantly after confirmation"}
        </p>
      </div>

      <div className={styles.disclaimer}>
        <p>
          Forex Instincts does not guarantee profits or trading performance. Users are solely responsible for defining how their bots operate. The generated bots simply automate the rules and logic specified by the user.
        </p>
        <div className={styles.disclaimerLinks}>
          <Link href="/terms">Terms of Use</Link>
          <span>·</span>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
