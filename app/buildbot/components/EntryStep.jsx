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
  { value: "ma_crossover",    label: "Moving Average Crossover" },
  { value: "rsi_breakout",    label: "RSI Breakout" },
  { value: "macd_signal",     label: "MACD Signal Cross" },
  { value: "bb_breakout",     label: "Bollinger Band Breakout" },
  { value: "multi_indicator", label: "Multi-Indicator (Custom)" },
];

const LOGIC_OPTS = [
  { value: "AND", name: "AND — All conditions must be true" },
  { value: "OR",  name: "OR — Any condition can trigger" },
];

export default function EntryStep({ config, update }) {
  const entry = config.entry;
  const isComplex = config.tierName === "complex" || config.tierName === "advanced";

  const toggleIndicator = (ind) => {
    const current = entry.indicators || [];
    const exists = current.some((i) => i.type === ind);
    if (exists) {
      update("entry.indicators", current.filter((i) => i.type !== ind));
    } else {
      update("entry.indicators", [...current, { type: ind }]);
    }
  };

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
          value={STRATEGIES.find((s) => s.value === entry.strategy) || null}
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
    </div>
  );
}
