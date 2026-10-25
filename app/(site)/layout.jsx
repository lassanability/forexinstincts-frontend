import Footer from "@/app/components/layout/Footer";
import Navbar from "@/app/components/layout/Navbar";
import styles from "@/app/styles/site.module.css";

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  );
}
