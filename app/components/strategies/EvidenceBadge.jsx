import { TbFlask, TbScale, TbShieldCheck, TbAlertTriangle, TbStar } from "react-icons/tb";
import Badge from "@/app/components/ui/Badge";

const TONES = {
  moderate: { tone: "up", icon: TbShieldCheck },
  original: { tone: "up", icon: TbStar },
  mixed: { tone: "cyan", icon: TbScale },
  untested: { tone: "cyan", icon: TbFlask },
  "equities-only": { tone: "warn", icon: TbScale },
  "cost-sensitive": { tone: "warn", icon: TbScale },
  none: { tone: "warn", icon: TbFlask },
  against: { tone: "down", icon: TbAlertTriangle },
  negative: { tone: "down", icon: TbAlertTriangle },
};

export default function EvidenceBadge({ evidence, label }) {
  const { tone, icon } = TONES[evidence] ?? TONES.untested;
  return (
    <Badge tone={tone} icon={icon}>
      {label}
    </Badge>
  );
}
