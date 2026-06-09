import styles from "@/app/style/quoteSection.module.css";
import { FaQuoteLeft as QuoteIcon } from "react-icons/fa";

export default function QuoteSection() {
  return (
    <section className={styles.section}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <QuoteIcon className={styles.quoteIcon} />
        <p className={styles.quoteText}>
          The goal of a successful trader is to make the best trades.
          Money is secondary.
        </p>
        <div className={styles.divider} />
        <span className={styles.author}>Alexander Elder</span>
      </div>
    </section>
  );
}
