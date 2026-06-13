import Dropdown from "@/app/components/Dropdown";
import styles from "@/app/style/build.module.css";

const INDICATORS = [
  { value: "RSI",        label: "RSI" },
  { value: "MACD",       label: "MACD" },
  { value: "BB",         label: "Bollinger Bands" },
  { value: "Stochastic", label: "Stochastic" },
  { value: "ATR",        label: "ATR" },
  { value: "CCI",        label: "CCI" },
];

const STRATEGIES = [
  { value: "ma_crossover",          label: "Moving Average Crossover" },
  { value: "rsi_breakout",          label: "RSI Breakout" },
  { value: "macd_signal",           label: "MACD Signal Cross" },
  { value: "bb_breakout",           label: "Bollinger Band Breakout" },
  { value: "multi_indicator",       label: "Multi-Indicator (Custom)" },
  { value: "price_action_breakout", label: "Price Action Breakout" },
  { value: "candlestick_pattern",   label: "Candlestick Patterns" },
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

export default function EntryStep({ config, update }) {
  const entry = config.entry;
  const isComplex = config.tierName === "complex" || config.tierName === "advanced";
  const strategy = entry.strategy || "ma_crossover";

  const toggleIndicator = (ind) => {
    const current = entry.indicators || [];
    const exists = current.some((i) => i.type === ind);
    if (exists) {
      update("entry.indicators", current.filter((i) => i.type !== ind));
    } else {
      update("entry.indicators", [...current, { type: ind }]);
    }
  };

  const isPriceAction    = strategy === "price_action_breakout";
  const isCandlestick    = strategy === "candlestick_pattern";
  const isIndicatorBased = !isPriceAction && !isCandlestick;

  return (
    <div>
      <div className={styles.stepHeader}>
        <h2>Entry Strategy</h2>
        <p>Configure the conditions that trigger trade entries</p>
      </div>

      <div className={styles.formGroup}>
        <label>Primary Strategy</label>
        <Dropdown
          options={STRATEGIES}
          value={STRATEGIES.find((s) => s.value === strategy) || null}
          onSelect={(opt) => update("entry.strategy", opt.value)}
          dropPlaceHolder="Select Strategy"
        />
      </div>

      {isPriceAction && (
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
            <p>Generates a buy signal when the closing price breaks above the highest high of the last <strong>{entry.breakoutBars ?? 20} bars</strong>, and a sell signal when it breaks below the lowest low.</p>
          </div>
        </div>
      )}

      {isCandlestick && (
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
            <p><strong>Pin Bar</strong> — long wick rejections at key levels</p>
            <p><strong>Engulfing</strong> — full candle reversal pattern</p>
            <p><strong>Inside Bar</strong> — consolidation breakout setup</p>
          </div>
        </div>
      )}

      {isIndicatorBased && isComplex && (
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
    </div>
  );
}
