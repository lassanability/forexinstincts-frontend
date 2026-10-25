import { cx } from "@/app/lib/cx";
import { signedMoney, toneOf } from "@/app/lib/format";

export default function Pnl({ value, currency, className }) {
  return <span className={cx("mono", toneOf(value), className)}>{signedMoney(value, currency)}</span>;
}
