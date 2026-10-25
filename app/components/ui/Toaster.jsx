"use client";

import { TbAlertTriangle, TbBellRinging, TbCircleCheck } from "react-icons/tb";
import { cx } from "@/app/lib/cx";
import { useToasts } from "@/app/stores/toast";
import styles from "@/app/styles/toaster.module.css";

const ICON = { success: TbCircleCheck, error: TbAlertTriangle, info: TbBellRinging };

export default function Toaster() {
  const items = useToasts((state) => state.items);

  return (
    <ul className={styles.toaster} role="status" aria-live="polite">
      {items.map((item) => {
        const Icon = ICON[item.tone];
        return (
          <li key={item.id} className={cx("glass", styles.toast, styles[item.tone])}>
            <Icon aria-hidden="true" />
            <div className={styles.text}>
              {item.title && <strong>{item.title}</strong>}
              <span>{item.message}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
