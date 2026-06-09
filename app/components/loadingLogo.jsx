import styles from "@/app/style/loadinglogo.module.css";
import Image from "next/image";

export default function LoadingLogo() {
  return (
    <div className={styles.loadingComponent}>
      <div className={styles.loader}>
        <div className={styles.logoWrap}>
          <Image src="/logo.png" alt="ForexInstincts" width={60} height={60} priority />
        </div>
        <div className={styles.brandName}>
          <div>Forex</div>
          <div className={styles.brandAccent}>Instincts</div>
        </div>
      </div>
    </div>
  );
}
