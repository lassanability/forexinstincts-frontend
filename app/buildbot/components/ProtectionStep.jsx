import styles from "@/app/style/build.module.css";

const SESSIONS = [
  { id: "london", label: "London", time: "08:00–17:00 GMT" },
  { id: "newyork", label: "New York", time: "13:00–22:00 GMT" },
  { id: "tokyo", label: "Tokyo", time: "00:00–09:00 GMT" },
  { id: "sydney", label: "Sydney", time: "21:00–06:00 GMT" },
];

export default function ProtectionStep({ config, update }) {
  const exit = config.exit;
  const filters = config.filters;
  const isComplex = config.tierName === "complex" || config.tierName === "advanced";

  const toggleSession = (id) => {
    const sessions = filters.sessions || [];
    const next = sessions.includes(id)
      ? sessions.filter((s) => s !== id)
      : [...sessions, id];
    update("filters.sessions", next);
  };

  return (
    <div>
      <div className={styles.stepHeader}>
        <h2>Exit & Protection</h2>
        <p>Configure stop loss, take profit, and trade protection features</p>
      </div>

      <div className={styles.gridRow}>
        <div className={styles.formGroup}>
          <label>Take Profit (pips)</label>
          <input
            className={styles.input}
            type="number"
            value={exit.takeProfit}
            onChange={(e) => update("exit.takeProfit", parseInt(e.target.value))}
            min={0}
            max={5000}
          />
          <span>0 = No take profit</span>
        </div>
        <div className={styles.formGroup}>
          <label>Stop Loss (pips)</label>
          <input
            className={styles.input}
            type="number"
            value={exit.stopLoss}
            onChange={(e) => update("exit.stopLoss", parseInt(e.target.value))}
            min={0}
            max={5000}
          />
          <span>0 = No stop loss (not recommended)</span>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Max Spread Filter (points)</label>
        <input
          className={styles.input}
          type="number"
          value={filters.maxSpread}
          onChange={(e) => update("filters.maxSpread", parseInt(e.target.value))}
          min={0}
          max={200}
        />
        <span>Skip trading if spread exceeds this. 0 = disabled.</span>
      </div>

      {isComplex && (
        <>
          <div className={styles.toggleGroup}>
            <div
              className={`${styles.toggleTrack} ${exit.trailingStop.enabled ? styles.toggleTrackOn : ""}`}
              onClick={() => update("exit.trailingStop.enabled", !exit.trailingStop.enabled)}
            >
              <div className={styles.toggleThumb} />
            </div>
            <span>Trailing Stop</span>
          </div>
          {exit.trailingStop.enabled && (
            <div className={styles.gridRow}>
              <div className={styles.formGroup}>
                <label>Trail Start (pips profit)</label>
                <input className={styles.input} type="number" value={exit.trailingStop.distance} onChange={(e) => update("exit.trailingStop.distance", parseInt(e.target.value))} min={5} max={500} />
              </div>
              <div className={styles.formGroup}>
                <label>Trail Step (pips)</label>
                <input className={styles.input} type="number" value={exit.trailingStop.step} onChange={(e) => update("exit.trailingStop.step", parseInt(e.target.value))} min={1} max={200} />
              </div>
            </div>
          )}

          <div className={styles.toggleGroup}>
            <div
              className={`${styles.toggleTrack} ${exit.breakEven.enabled ? styles.toggleTrackOn : ""}`}
              onClick={() => update("exit.breakEven.enabled", !exit.breakEven.enabled)}
            >
              <div className={styles.toggleThumb} />
            </div>
            <span>Break-Even</span>
          </div>
          {exit.breakEven.enabled && (
            <div className={styles.gridRow}>
              <div className={styles.formGroup}>
                <label>Trigger (pips profit)</label>
                <input className={styles.input} type="number" value={exit.breakEven.triggerPips} onChange={(e) => update("exit.breakEven.triggerPips", parseInt(e.target.value))} min={5} max={500} />
              </div>
              <div className={styles.formGroup}>
                <label>Lock Pips (offset)</label>
                <input className={styles.input} type="number" value={exit.breakEven.lockPips} onChange={(e) => update("exit.breakEven.lockPips", parseInt(e.target.value))} min={0} max={50} />
              </div>
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Trading Sessions</label>
            <div className={styles.sessionGrid}>
              {SESSIONS.map((s) => (
                <div
                  key={s.id}
                  className={`${styles.sessionCard} ${(filters.sessions || []).includes(s.id) ? styles.sessionCardSelected : ""}`}
                  onClick={() => toggleSession(s.id)}
                >
                  <span>{s.label}</span>
                  <span>{s.time}</span>
                </div>
              ))}
            </div>
            <span>Leave all unchecked to trade all sessions</span>
          </div>
        </>
      )}
    </div>
  );
}
