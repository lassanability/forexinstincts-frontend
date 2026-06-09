import Dropdown from "@/app/components/Dropdown";
import styles from "@/app/style/build.module.css";

const MODE_OPTS_BASIC = [
  { value: "fixed", name: "Fixed Lot Size" },
];
const MODE_OPTS_ADVANCED = [
  { value: "fixed",   name: "Fixed Lot Size" },
  { value: "percent", name: "% of Balance" },
];

export default function RiskStep({ config, update }) {
  const rm = config.riskManagement;
  const isComplex = config.tierName === "complex" || config.tierName === "advanced";
  const isAdvanced = config.tierName === "advanced";

  const modeOpts = isAdvanced ? MODE_OPTS_ADVANCED : MODE_OPTS_BASIC;

  return (
    <div>
      <div className={styles.stepHeader}>
        <h2>Risk Management</h2>
        <p>Control position sizing, trade limits, and exposure</p>
      </div>

      <div className={styles.formGroup}>
        <label>Position Sizing Mode</label>
        <Dropdown
          options={modeOpts}
          value={modeOpts.find((o) => o.value === rm.mode) || modeOpts[0]}
          onSelect={(opt) => update("riskManagement.mode", opt.value)}
          dropPlaceHolder="Select Mode"
        />
        {!isAdvanced && (
          <span>% of Balance requires Advanced tier</span>
        )}
      </div>

      {rm.mode === "fixed" ? (
        <div className={styles.formGroup}>
          <label>Lot Size</label>
          <input
            className={styles.input}
            type="number"
            value={rm.lotSize}
            onChange={(e) => update("riskManagement.lotSize", parseFloat(e.target.value))}
            min={0.01}
            max={100}
            step={0.01}
          />
          <span>Standard lot = 1.0 | Mini lot = 0.1 | Micro lot = 0.01</span>
        </div>
      ) : (
        <div className={styles.formGroup}>
          <label>Risk % Per Trade</label>
          <input
            className={styles.input}
            type="number"
            value={rm.riskPercent}
            onChange={(e) => update("riskManagement.riskPercent", parseFloat(e.target.value))}
            min={0.1}
            max={10}
            step={0.1}
          />
          <span>Percentage of account balance to risk per trade</span>
        </div>
      )}

      <div className={styles.gridRow}>
        <div className={styles.formGroup}>
          <label>Max Concurrent Trades</label>
          <input
            className={styles.input}
            type="number"
            value={rm.maxOpenTrades}
            onChange={(e) => update("riskManagement.maxOpenTrades", parseInt(e.target.value))}
            min={1}
            max={20}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Max Trades Per Day</label>
          <input
            className={styles.input}
            type="number"
            value={rm.maxTradesPerDay}
            onChange={(e) => update("riskManagement.maxTradesPerDay", parseInt(e.target.value))}
            min={1}
            max={50}
            disabled={!isComplex}
          />
          <span>{!isComplex ? "Requires Complex or Advanced tier" : "Daily trade limit"}</span>
        </div>
      </div>
    </div>
  );
}
