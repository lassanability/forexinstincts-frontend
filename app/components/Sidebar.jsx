"use client";

import ProfilePicture from "@/app/components/ProfilePicture";
import styles from "@/app/style/sidebar.module.css";
import {
  IoSparkles,
  IoTime,
  IoBookmark,
  IoChatbubbles,
  IoStar,
  IoRocket,
  IoLockClosed,
  IoMenu,
  IoClose,
} from "react-icons/io5";
import { toast } from "sonner";
import { useState } from "react";

const navigationItems = [
  {
    id: "templates",
    icon: IoSparkles,
    label: "Templates",
    locked: false,
  },
  {
    id: "previous",
    icon: IoTime,
    label: "Previous Templates",
    requiresPro: true,
    lockMessage: "Upgrade to Pro to access previous templates",
  },
  {
    id: "bookmarks",
    icon: IoBookmark,
    label: "Bookmarked",
    requiresPro: true,
    lockMessage: "Upgrade to Pro to bookmark templates",
  },
  {
    id: "coaching",
    icon: IoChatbubbles,
    label: "Coaching & Support",
    requiresElite: true,
    lockMessage: "Upgrade to Queen Elite for coaching & support",
  },
  {
    id: "success-stories",
    icon: IoStar,
    label: "Success Stories",
    locked: false,
  },
];

const NavButton = ({ icon: Icon, label, active, locked, onClick, lockMessage }) => {
  const handleClick = () => {
    if (locked && lockMessage) {
      toast.info(lockMessage);
      return;
    }
    onClick();
  };

  return (
    <button
      className={`${styles.navItem} ${active ? styles.navItemActive : ""} ${locked ? styles.navItemLocked : ""}`}
      onClick={handleClick}
    >
      <Icon />
      <span>{label}</span>
      {locked && <IoLockClosed className={styles.lockIcon} />}
    </button>
  );
};

export default function Sidebar({ username, currentTier, currentTierInfo, activeTab, onTabChange, onUpgradeClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavItems = () => {
    return navigationItems.map(item => {
      let isLocked = false;

      if (!currentTierInfo?.limits) {
        isLocked = item.requiresPro || item.requiresElite;
      } else {
        if (item.requiresPro && !currentTierInfo.limits.previousAccess && item.id === "previous") {
          isLocked = true;
        } else if (item.requiresPro && !currentTierInfo.limits.bookmarks && item.id === "bookmarks") {
          isLocked = true;
        } else if (item.requiresElite && !currentTierInfo.limits.coaching) {
          isLocked = true;
        }
      }

      return { ...item, locked: isLocked };
    });
  };

  const handleNavClick = (itemId) => {
    onTabChange(itemId);
    setIsMobileMenuOpen(false);
  };

  const navItems = getNavItems();
  const activeItem = navItems.find(item => item.id === activeTab);
  const safeActiveTab = activeItem?.locked ? null : activeTab;

  return (
    <>
      <button
        className={styles.mobileMenuButton}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
      </button>

      {isMobileMenuOpen && (
        <div 
          className={styles.mobileOverlay} 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.userProfile}>
            <ProfilePicture />
            <div className={styles.userInfo}>
              <h3>{username || "Queen"}</h3>
              <span className={styles.userTier}>{currentTierInfo?.name || "Loading..."}</span>
            </div>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <NavButton
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={safeActiveTab === item.id}
              locked={item.locked}
              lockMessage={item.lockMessage}
              onClick={() => handleNavClick(item.id)}
            />
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button 
            className={styles.upgradeButton} 
            onClick={() => {
              onUpgradeClick();
              setIsMobileMenuOpen(false);
            }}
          >
            <IoRocket />
            <span>Upgrade Plan</span>
          </button>
        </div>
      </aside>
    </>
  );
}