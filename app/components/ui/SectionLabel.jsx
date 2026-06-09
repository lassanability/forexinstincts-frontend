import styles from "@/app/style/sectionLabel.module.css";

export default function SectionLabel({ text, heading, center = false }) {
  return (
    <div className={`${styles.wrapper} ${center ? styles.center : ""}`}>
      <div className={styles.label}>
        <span className={styles.line} />
        <span>{text}</span>
      </div>
      {heading && <h2>{heading}</h2>}
    </div>
  );
}
