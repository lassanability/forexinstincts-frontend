export const DURATION_OPTIONS = [
  { label: '10h',      fullLabel: '10 Hours',  hours: 10   },
  { label: '24h',      fullLabel: '24 Hours',  hours: 24   },
  { label: '48h',      fullLabel: '48 Hours',  hours: 48   },
  { label: '1 Week',   fullLabel: '1 Week',    hours: 168  },
  { label: '1 Month',  fullLabel: '1 Month',   hours: 720  },
  { label: 'Lifetime', fullLabel: 'Lifetime',  hours: 8760 },
];

export function calculateBotPrice(basePrice, ratePerHour, tierFeatures, selectedFeatures, durationHours, strategyAddon = 0) {
  const opt = DURATION_OPTIONS.find(d => d.hours === Number(durationHours)) || DURATION_OPTIONS[0];
  const featureSum = (selectedFeatures || []).reduce((sum, fname) => {
    const feat = (tierFeatures || []).find(f => f.name === fname);
    return sum + (feat ? feat.multiplier : 0);
  }, 0);
  const base = (basePrice || 0) * Math.max(featureSum, 1);
  return Math.round(base + (ratePerHour || 0) * opt.hours + (strategyAddon || 0));
}

const PA_STRATEGIES = ['price_action_breakout', 'candlestick_pattern'];

export function getStrategyAddon(tier, strategy) {
  if (!tier?.strategyPricing) return 0;
  return PA_STRATEGIES.includes(strategy)
    ? (tier.strategyPricing.priceAction || 0)
    : (tier.strategyPricing.indicator || 0);
}
