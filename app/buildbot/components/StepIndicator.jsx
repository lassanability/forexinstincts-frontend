import { Fragment } from "react";
import styles from "@/app/style/build.module.css";

export default function StepIndicator({ steps, current }) {
  return (
    <div className={styles.stepIndicator}>
      {steps.map((label, i) => (
        <Fragment key={i}>
          <div className={styles.stepItem}>
            <div
              className={`${styles.stepCircle}${i < current ? ` ${styles.stepCircleDone}` : ""}${i === current ? ` ${styles.stepCircleActive}` : ""}`}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span className={`${styles.stepLabel}${i === current ? ` ${styles.stepLabelActive}` : ""}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`${styles.stepConnector}${i < current ? ` ${styles.stepConnectorDone}` : ""}`} />
          )}
        </Fragment>
      ))}
    </div>
  );
}
