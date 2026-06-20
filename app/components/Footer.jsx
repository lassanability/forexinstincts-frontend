"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/app/style/footer.module.css";

import {
  MdEmail as EmailIcon,
  MdLocationOn as LocationIcon,
} from "react-icons/md";
import { IoCall as PhoneIcon } from "react-icons/io5";
import { FaTelegram as TelegramIcon } from "react-icons/fa";
import { FaXTwitter as TwitterIcon } from "react-icons/fa6";
import { BsInstagram as InstagramIcon } from "react-icons/bs";
import { IoShieldCheckmark as ShieldIcon } from "react-icons/io5";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/terminal")) return null;

  const handleTwitterClick = () => window.open("https://twitter.com/forexinstincts", "_blank");
  const handleInstagramClick = () => window.open("https://www.instagram.com/forexinstincts", "_blank");
  const handleTelegramClick = () => window.open("https://t.me/forexinstincts", "_blank");
  const currentYear = new Date().getFullYear();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.newsletter}>

        <div className={styles.newsletterContent}>
          <div className={styles.newsletterText}>
            <h3>Stay Updated with ForexInstincts</h3>
            <p>
              Subscribe for the latest updates on new bot features, strategy guides, and trading tips.
            </p>
          </div>
          <div className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter your email address"
              className={styles.newsletterInput}
            />
            <button className={styles.subscribeBtn}>Subscribe</button>
          </div>
        </div>
      </div>

      <div className={styles.footerContent}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <h4>ForexInstincts</h4>
            <p>
              Build professional automated trading bots without writing a single line of code.
              Automated trading made accessible.
            </p>
            <div className={styles.socialBlock}>
              <h5>Follow Us</h5>
              <div className={styles.socialIcons}>
                <button onClick={handleTwitterClick} aria-label="Twitter">
                  <TwitterIcon />
                </button>
                {/* <button onClick={handleInstagramClick} aria-label="Instagram">
                  <InstagramIcon />
                </button>
                <button onClick={handleTelegramClick} aria-label="Telegram">
                  <TelegramIcon />
                </button> */}
              </div>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h4>Navigation</h4>
            <div className={styles.footerLinksContainer}>
              <div className={isActive("/") ? styles.activeLinkItem : undefined}><Link href="/">Home</Link></div>
              <div className={isActive("/tiers") ? styles.activeLinkItem : undefined}><Link href="/tiers">Pricing</Link></div>
              <div className={isActive("/about") ? styles.activeLinkItem : undefined}><Link href="/about">About Us</Link></div>
              <div className={isActive("/contact") ? styles.activeLinkItem : undefined}><Link href="/contact">Contact</Link></div>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h4>Bot Builder</h4>
            <div className={styles.footerLinksContainer}>
              <div className={isActive("/tiers") ? styles.activeLinkItem : undefined}><Link href="/tiers">Build a Bot</Link></div>
              <div className={isActive("/dashboard") ? styles.activeLinkItem : undefined}><Link href="/dashboard">My Dashboard</Link></div>
              <div className={isActive("/privacy") ? styles.activeLinkItem : undefined}><Link href="/privacy">Privacy Policy</Link></div>
              <div className={isActive("/terms") ? styles.activeLinkItem : undefined}><Link href="/terms">Terms of Use</Link></div>
            </div>
          </div>

          <div className={styles.footerContact}>
            <h4>Get in Touch</h4>
            <p>Need help? Reach out to our support team for bot configuration assistance.</p>
            <div className={styles.contactInfo}>
              {/* <div className={styles.contactItem}>
                <LocationIcon />
                <span>USA</span>
              </div>
              <div className={styles.contactItem}>
                <PhoneIcon />
                <span>via Telegram</span>
              </div> */}
              <div className={styles.contactItem}>
                <EmailIcon />
                <span>support@forexinstincts.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottomSection}>
            <p>&copy; {currentYear} ForexInstincts. All rights reserved.</p>
       
      </div>
    </footer>
  );
}
