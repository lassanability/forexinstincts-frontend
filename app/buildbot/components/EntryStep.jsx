import Dropdown from "@/app/components/Dropdown";
import styles from "@/app/style/build.module.css";

const INDICATOR_STRATEGIES = [
  { value: "ma_crossover",    label: "Moving Average Crossover" },
  { value: "rsi_breakout",    label: "RSI Breakout" },
  { value: "macd_signal",     label: "MACD Signal Cross" },
  { value: "bb_breakout",     label: "Bollinger Band Breakout" },
  { value: "multi_indicator", label: "Multi-Indicator (Custom)" },
];

const INDICATORS = [
  { value: "RSI",        label: "RSI" },
  { value: "MACD",       label: "MACD" },
  { value: "BB",         label: "Bollinger Bands" },
  { value: "Stochastic", label: "Stochastic" },
  { value: "ATR",        label: "ATR" },
  { value: "CCI",        label: "CCI" },
];

const PATTERN_TYPES = [
  { value: "any",        label: "All Patterns" },
  { value: "pin_bar",    label: "Pin Bar Only" },
  { value: "engulfing",  label: "Engulfing Only" },
  { value: "inside_bar", label: "Inside Bar Only" },
];

const LOGIC_OPTS = [
  { value: "AND", name: "AND — All conditions must be true" },
  { value: "OR",  name: "OR — Any condition can trigger" },
];

const PA_STRATEGIES = ["price_action_breakout", "candlestick_pattern"];

export default function EntryStep({ config, update, selectedTier }) {
  const entry = config.entry;
  const isComplex = config.tierName === "complex" || config.tierName === "advanced";
  const strategy = entry.strategy || "ma_crossover";

  const isPriceActionCategory = PA_STRATEGIES.includes(strategy);
  const indicatorAddon = selectedTier?.strategyPricing?.indicator || 0;
  const priceActionAddon = selectedTier?.strategyPricing?.priceAction || 0;

  const selectCategory = (cat) => {
    if (cat === "indicator" && isPriceActionCategory) {
      update("entry.strategy", "ma_crossover");
      update("entry.indicators", []);
    } else if (cat === "price_action" && !isPriceActionCategory) {
      update("entry.strategy", "price_action_breakout");
      update("entry.indicators", []);
    }
  };

  const toggleIndicator = (ind) => {
    const current = entry.indicators || [];
    const exists = current.some((i) => i.type === ind);
    update("entry.indicators", exists ? current.filter((i) => i.type !== ind) : [...current, { type: ind }]);
  };

  return (
    <div>
      <div className={styles.stepHeader}>
        <h2>Entry Strategy</h2>
        <p>Choose how your bot decides when to enter a trade</p>
      </div>

      <div className={styles.formGroup}>
        <label>Strategy Type</label>
        <div className={styles.categoryGrid}>
          <div
            className={`${styles.categoryCard} ${!isPriceActionCategory ? styles.categoryCardSelected : ""}`}
            onClick={() => selectCategory("indicator")}
          >
            <div className={styles.categoryCardTop}>
              <div className={styles.categoryCardTitle}>Indicator Based</div>
              {indicatorAddon > 0 && <div className={styles.categoryCardBadge}>+${indicatorAddon}</div>}
            </div>
            <div className={styles.categoryCardDesc}>MA, RSI, MACD, Bollinger Bands and other technical indicators</div>
          </div>
          <div
            className={`${styles.categoryCard} ${isPriceActionCategory ? styles.categoryCardSelected : ""}`}
            onClick={() => selectCategory("price_action")}
          >
            <div className={styles.categoryCardTop}>
              <div className={styles.categoryCardTitle}>Price Action</div>
              {priceActionAddon > 0 && <div className={styles.categoryCardBadge}>+${priceActionAddon}</div>}
            </div>
            <div className={styles.categoryCardDesc}>Breakout levels and candlestick patterns — no indicators needed</div>
          </div>
        </div>
      </div>

      {!isPriceActionCategory && (
        <>
          <div className={styles.formGroup}>
            <label>Primary Strategy</label>
            <Dropdown
              options={INDICATOR_STRATEGIES}
              value={INDICATOR_STRATEGIES.find((s) => s.value === strategy) || null}
              onSelect={(opt) => update("entry.strategy", opt.value)}
              dropPlaceHolder="Select Strategy"
            />
          </div>

          {isComplex && (
            <>
              <div className={styles.formGroup}>
                <label>Additional Indicators</label>
                <div className={styles.indicatorGrid}>
                  {INDICATORS.map((ind) => {
                    const selected = (entry.indicators || []).some((i) => i.type === ind.value);
                    return (
                      <div
                        key={ind.value}
                        className={`${styles.indicatorCard} ${selected ? styles.indicatorCardSelected : ""}`}
                        onClick={() => toggleIndicator(ind.value)}
                      >
                        <span>{ind.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {(entry.indicators || []).length > 1 && (
                <div className={styles.formGroup}>
                  <label>Indicator Logic</label>
                  <Dropdown
                    options={LOGIC_OPTS}
                    value={LOGIC_OPTS.find((o) => o.value === entry.logic) || null}
                    onSelect={(opt) => update("entry.logic", opt.value)}
                    dropPlaceHolder="Select Logic"
                  />
                </div>
              )}
            </>
          )}
        </>
      )}

      {isPriceActionCategory && (
        <>
          <div className={styles.formGroup}>
            <label>Price Action Type</label>
            <div className={styles.indicatorGrid}>
              <div
                className={`${styles.indicatorCard} ${strategy === "price_action_breakout" ? styles.indicatorCardSelected : ""}`}
                onClick={() => update("entry.strategy", "price_action_breakout")}
              >
                <span>N-Bar Breakout</span>
              </div>
              <div
                className={`${styles.indicatorCard} ${strategy === "candlestick_pattern" ? styles.indicatorCardSelected : ""}`}
                onClick={() => update("entry.strategy", "candlestick_pattern")}
              >
                <span>Candlestick Patterns</span>
              </div>
            </div>
          </div>

          {strategy === "price_action_breakout" && (
            <div className={styles.formGroup}>
              <label>Breakout Lookback (bars)</label>
              <input
                type="number"
                className={styles.input}
                value={entry.breakoutBars ?? 20}
                min={5}
                max={200}
                onChange={(e) => update("entry.breakoutBars", Number(e.target.value))}
              />
              <div className={styles.strategyHint}>
                <p>Buys when price closes above the highest high of the last <strong>{entry.breakoutBars ?? 20} bars</strong>. Sells when it closes below the lowest low. Works on any timeframe and any tier.</p>
              </div>
            </div>
          )}

          {strategy === "candlestick_pattern" && (
            <div className={styles.formGroup}>
              <label>Pattern Filter</label>
              <div className={styles.indicatorGrid}>
                {PATTERN_TYPES.map((pt) => (
                  <div
                    key={pt.value}
                    className={`${styles.indicatorCard} ${entry.patternType === pt.value ? styles.indicatorCardSelected : ""}`}
                    onClick={() => update("entry.patternType", pt.value)}
                  >
                    <span>{pt.label}</span>
                  </div>
                ))}
              </div>
              <div className={styles.strategyHint}>
                <p><strong>Pin Bar</strong> — long wick rejecting a level</p>
                <p><strong>Engulfing</strong> — full candle reversal</p>
                <p><strong>Inside Bar</strong> — consolidation then breakout in parent bar direction</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
