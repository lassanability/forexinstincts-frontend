"use client";

import Image from "next/image";
import styles from "@/app/style/notfound.module.css";
import NotfoundImg from "@/public/assets/notfound.png";

export default function NotFound() {
  return (
    <div className={styles.pageLayout}>
      <div className={styles.notFound}>
        <Image
          className={styles.notFoundImg}
          src={NotfoundImg}
          alt="Animated Logo "
          height={400}
        />
        <p>You seem lost trader.</p>
      </div>
    </div>
  );
}
