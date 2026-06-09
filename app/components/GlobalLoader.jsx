import Image from "next/image";
import LogoImg from "@/public/assets/logo.png";
import styles from "@/app/style/loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loadingComponent}>
      <div className={styles.logoWrap}>
        <span className={styles.ringOuter} />
        <span className={styles.ringInner} />
        <Image
          className={styles.logo}
          src={LogoImg}
          alt="Loading"
          width={64}
          height={64}
          priority
        />
      </div>
    </div>
  );
}
