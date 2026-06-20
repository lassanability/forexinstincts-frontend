import Dropdown from "@/app/components/Dropdown";
import styles from "@/app/style/build.module.css";
import {
  IoBarChart as ChartIcon,
  IoTrendingUp as TrendIcon,
  IoStatsChart as StatsIcon,
} from "react-icons/io5";

const SYMBOLS_OPTS = ["EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "USDCAD", "NZDUSD", "EURJPY", "GBPJPY", "XAUUSD"].map((s) => ({ name: s, value: s }));
const TIMEFRAME_OPTS = ["M1", "M5", "M15", "M30", "H1", "H4", "D1", "W1"].map((tf) => ({ name: tf, value: tf }));
const PLATFORM_OPTS = [
  { value: "MT4",         name: "MT4 (MetaTrader 4)" },
  { value: "MT5",         name: "MT5 (MetaTrader 5)" },
  { value: "both",        name: "MT4 & MT5" },
  { value: "TradingView", name: "TradingView (Pine Script)" },
  { value: "Capital.com", name: "Capital.com (Web Trading)" },
  { value: "OANDA",       name: "OANDA (Web Trading)" },
];
const DIRECTION_OPTS = [
  { value: "both",      name: "Both Buy & Sell" },
  { value: "buy_only",  name: "Buy Only" },
  { value: "sell_only", name: "Sell Only" },
];

const TIER_ICONS = {
  basic:    <ChartIcon />,
  complex:  <TrendIcon />,
  advanced: <StatsIcon />,
};

export default function BasicInfoStep({ config, update, selectedTier }) {
  const canTradingDirection = !!selectedTier?.limits?.tradingDirection;

  return (
    <div>
      <div className={styles.stepHeader}>
        <h2>Basic Information</h2>
        <p>Set the core parameters for your trading bot</p>
      </div>

      {selectedTier && (
        <div className={styles.selectedTierBadge}>
          <div className={styles.selectedTierIcon}>
            {TIER_ICONS[selectedTier.name] || <ChartIcon />}
          </div>
          <div className={styles.selectedTierInfo}>
            <span>{selectedTier.displayName} Plan</span>
            <span>From ${selectedTier.basePrice?.toLocaleString()} USD</span>
          </div>
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="botName">Bot Name</label>
        <input
          id="botName"
          className={styles.input}
          type="text"
          value={config.botName}
          onChange={(e) => update("botName", e.target.value)}
          placeholder="e.g. MyEURUSD_Scalper"
        />
        <span>Give your bot a unique name for identification</span>
      </div>

      <div className={styles.gridRow}>
        <div className={styles.formGroup}>
          <label>Symbol</label>
          <Dropdown
            options={SYMBOLS_OPTS}
            value={SYMBOLS_OPTS.find((o) => o.value === config.symbol) || null}
            onSelect={(opt) => update("symbol", opt.value)}
            dropPlaceHolder="Select Symbol"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Timeframe</label>
          <Dropdown
            options={TIMEFRAME_OPTS}
            value={TIMEFRAME_OPTS.find((o) => o.value === config.timeframe) || null}
            onSelect={(opt) => update("timeframe", opt.value)}
            dropPlaceHolder="Select Timeframe"
          />
        </div>
      </div>

      <div className={styles.gridRow}>
        <div className={styles.formGroup}>
          <label>Platform</label>
          <Dropdown
            options={PLATFORM_OPTS}
            value={PLATFORM_OPTS.find((o) => o.value === config.platform) || null}
            onSelect={(opt) => update("platform", opt.value)}
            dropPlaceHolder="Select Platform"
          />
        </div>
        {canTradingDirection && (
          <div className={styles.formGroup}>
            <label>Trading Direction</label>
            <Dropdown
              options={DIRECTION_OPTS}
              value={DIRECTION_OPTS.find((o) => o.value === config.tradingDirection) || null}
              onSelect={(opt) => update("tradingDirection", opt.value)}
              dropPlaceHolder="Select Direction"
            />
          </div>
        )}
      </div>
    </div>
  );
}
