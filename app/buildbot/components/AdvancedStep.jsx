import Dropdown from "@/app/components/Dropdown";
import styles from "@/app/style/build.module.css";

const TF_OPTS = ["M5", "M15", "M30", "H1", "H4", "D1"].map((t) => ({ name: t, value: t }));

export default function AdvancedStep({ config, update, selectedTier }) {
  const adv = config.advanced;
  const lim = selectedTier?.limits || {};
  const canNotify    = !!lim.notifications;
  const canMTF       = !!lim.multiTimeframe;
  const canGridMart  = !!lim.gridMartingale;

  return (
    <div>
      <div className={styles.stepHeader}>
        <h2>Advanced Features</h2>
        <p>Fine-tune your strategy with advanced configurations</p>
      </div>

      <div className={styles.formGroup}>
        <label>Magic Number</label>
        <input
          className={styles.input}
          type="number"
          value={adv.magicNumber}
          onChange={(e) => update("advanced.magicNumber", parseInt(e.target.value))}
          min={0}
          max={999999}
        />
        <span>Unique identifier for this EA. 0 = auto-generate random.</span>
      </div>

      {canNotify && (
        <div className={styles.formGroup}>
          <label>Notifications</label>
          <div className={styles.checkboxRow}>
            <div className={styles.toggleGroup}>
              <div
                className={`${styles.toggleTrack} ${adv.emailNotifications ? styles.toggleTrackOn : ""}`}
                onClick={() => update("advanced.emailNotifications", !adv.emailNotifications)}
              >
                <div className={styles.toggleThumb} />
              </div>
              <span>Email Alerts</span>
            </div>
            <div className={styles.toggleGroup}>
              <div
                className={`${styles.toggleTrack} ${adv.pushNotifications ? styles.toggleTrackOn : ""}`}
                onClick={() => update("advanced.pushNotifications", !adv.pushNotifications)}
              >
                <div className={styles.toggleThumb} />
              </div>
              <span>Push Notifications</span>
            </div>
          </div>
        </div>
      )}

      {canMTF && (
        <>
          <div className={styles.toggleGroup}>
            <div
              className={`${styles.toggleTrack} ${adv.multiTimeframe.enabled ? styles.toggleTrackOn : ""}`}
              onClick={() => update("advanced.multiTimeframe.enabled", !adv.multiTimeframe.enabled)}
            >
              <div className={styles.toggleThumb} />
            </div>
            <span>Multi-Timeframe Trend Filter</span>
          </div>
          {adv.multiTimeframe.enabled && (
            <div className={styles.gridRow}>
              <div className={styles.formGroup}>
                <label>Confirmation Timeframe</label>
                <Dropdown
                  options={TF_OPTS}
                  value={TF_OPTS.find((o) => o.value === adv.multiTimeframe.confirmationTimeframe) || null}
                  onSelect={(opt) => update("advanced.multiTimeframe.confirmationTimeframe", opt.value)}
                  dropPlaceHolder="Select Timeframe"
                />
              </div>
              <div className={styles.formGroup}>
                <label>MA Period</label>
                <input
                  className={styles.input}
                  type="number"
                  value={adv.multiTimeframe.period}
                  onChange={(e) => update("advanced.multiTimeframe.period", parseInt(e.target.value))}
                  min={5}
                  max={500}
                />
              </div>
            </div>
          )}
        </>
      )}

      {canGridMart && (
        <>
          <div className={styles.toggleGroup}>
            <div
              className={`${styles.toggleTrack} ${adv.grid.enabled ? styles.toggleTrackOn : ""}`}
              onClick={() => { if (adv.martingale.enabled) return; update("advanced.grid.enabled", !adv.grid.enabled); }}
            >
              <div className={styles.toggleThumb} />
            </div>
            <span>Grid Trading{adv.martingale.enabled ? " (disable Martingale first)" : ""}</span>
          </div>
          {adv.grid.enabled && (
            <div className={styles.gridRow}>
              <div className={styles.formGroup}>
                <label>Grid Distance (pips)</label>
                <input className={styles.input} type="number" value={adv.grid.distance} onChange={(e) => update("advanced.grid.distance", parseInt(e.target.value))} min={10} max={500} />
              </div>
              <div className={styles.formGroup}>
                <label>Max Grid Levels</label>
                <input className={styles.input} type="number" value={adv.grid.maxLevels} onChange={(e) => update("advanced.grid.maxLevels", parseInt(e.target.value))} min={2} max={10} />
              </div>
            </div>
          )}

          <div className={styles.toggleGroup}>
            <div
              className={`${styles.toggleTrack} ${adv.martingale.enabled ? styles.toggleTrackOn : ""}`}
              onClick={() => { if (adv.grid.enabled) return; update("advanced.martingale.enabled", !adv.martingale.enabled); }}
            >
              <div className={styles.toggleThumb} />
            </div>
            <span>Martingale{adv.grid.enabled ? " (disable Grid first)" : ""}</span>
          </div>
          {adv.martingale.enabled && (
            <div className={styles.gridRow}>
              <div className={styles.formGroup}>
                <label>Lot Multiplier</label>
                <input className={styles.input} type="number" value={adv.martingale.multiplier} onChange={(e) => update("advanced.martingale.multiplier", parseFloat(e.target.value))} min={1.1} max={5} step={0.1} />
              </div>
              <div className={styles.formGroup}>
                <label>Max Levels</label>
                <input className={styles.input} type="number" value={adv.martingale.maxLevel} onChange={(e) => update("advanced.martingale.maxLevel", parseInt(e.target.value))} min={1} max={8} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
