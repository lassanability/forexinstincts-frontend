"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import LogoImage from "@/public/assets/logo.png";
import styles from "@/app/style/navbar.module.css";
import { useDrawerStore } from "@/app/store/Drawer";
import { useAuthStore } from "@/app/store/AuthStore";
import ProfilePicture from "@/app/components/ProfilePicture";
import LanguageSelector from "@/app/components/LanguageSelector";
import { LiquidGlass } from "@liquidglass/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  Suspense,
} from "react";
import {
  IoClose as CloseIcon,
  IoPersonOutline as PersonIcon,
  IoChevronDownOutline as ChevronDownIcon,
  IoAdd as IoPlusIcon,
  IoRemove as IoMinusIcon,
  IoRocketOutline as RocketIcon,
} from "react-icons/io5";
import { CgMenuGridO as MenuIcon } from "react-icons/cg";
import { MdLogout as LogoutIcon } from "react-icons/md";

const MOBILE_BREAKPOINT = 768;

const GLASS_PROPS = {
  borderRadius: 22,
  blur: 0.4,
  contrast: 1.25,
  brightness: 1.1,
  saturation: 1.4,
  shadowIntensity: 0.18,
  displacementScale: 1,
  elasticity: 0.65,
  zIndex: 50,
};

const useResponsive = () => {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile };
};

const useNavLinks = () => {
  const { isAuth } = useAuthStore();

  const NAV_LINKS = useMemo(
    () =>
      [
        { href: "/", label: "Home", exact: true },
        { href: "/about", label: "About" },
        { href: "/tiers", label: "Pricing" },
        { href: "/blog", label: "Blog" },
        { href: "/news", label: "News" },
        isAuth && { href: "/dashboard", label: "Dashboard" },
        { href: "/contact", label: "Contact" },
      ].filter(Boolean),
    [isAuth]
  );

  return { NAV_LINKS };
};

const isLinkActive = (pathname, link) => {
  if (!pathname) return false;
  if (link.exact) return pathname === link.href;
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
};

const NavItemDropdown = ({ item, setActiveDropdown, isMobile, onNavItemClick }) => {
  const handleDropdownItemClick = () => {
    setActiveDropdown(null);
    if (isMobile) onNavItemClick();
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownContent}>
        {(item.title || item.description) && (
          <div className={styles.dropdownInfo}>
            {item.title && <h2>{item.title}</h2>}
            {item.description && <p>{item.description}</p>}
          </div>
        )}
        <div className={styles.dropdownLinks}>
          {item.dropdown && item.dropdown.length > 0 ? (
            item.dropdown.map((dropdownItem, dropIndex) => (
              <Link
                key={dropdownItem.href || `dropdown-${dropIndex}`}
                href={dropdownItem.href}
                className={styles.dropdownItem}
                onClick={handleDropdownItemClick}
              >
                {dropdownItem.name}
              </Link>
            ))
          ) : (
            <div className={styles.dropdownLoading}>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

const NavigationLinks = ({
  pathname,
  onLinkClick,
  activeDropdown,
  setActiveDropdown,
  isMobile,
  navLinks,
}) => {
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    if (activeDropdown !== null && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, [activeDropdown, setActiveDropdown, isMobile]);

  const handleMouseEnter = (index, hasDropdown) => {
    if (!isMobile) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      if (hasDropdown) setActiveDropdown(index);
      setHoveredLink(index);
    }
  };

  const handleMouseLeave = (index) => {
    if (!isMobile) {
      closeTimeoutRef.current = setTimeout(() => {
        setActiveDropdown(null);
        setHoveredLink((prev) => (prev === index ? null : prev));
      }, 150);
    }
  };

  return (
    <div className={styles.navigationLinks}>
      {navLinks.map((link, index) => {
        const isDropdownOpen = activeDropdown === index;
        const isCurrentPage = isLinkActive(pathname, link);
        const showGlass = !isMobile && (isCurrentPage || hoveredLink === index);

        if (isMobile) {
          return (
            <div
              key={link.href || `nav-link-${index}`}
              className={styles.navLinkWrapper}
            >
              <div className={styles.navItemLinkContainer}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${isCurrentPage ? styles.activeNavLink : ""}`}
                  onClick={(e) => {
                    if (link.hasDropdown) {
                      e.preventDefault();
                      setActiveDropdown(isDropdownOpen ? null : index);
                    } else {
                      onLinkClick();
                    }
                  }}
                >
                  {link.label}
                  {link.hasDropdown && (
                    isDropdownOpen ? (
                      <IoMinusIcon className={styles.mobileIcon} />
                    ) : (
                      <IoPlusIcon className={styles.mobileIcon} />
                    )
                  )}
                </Link>
              </div>
              {link.hasDropdown && isDropdownOpen && (
                <NavItemDropdown
                  item={link}
                  setActiveDropdown={setActiveDropdown}
                  isMobile={true}
                  onNavItemClick={onLinkClick}
                />
              )}
            </div>
          );
        }

        const desktopContent = (
          <div
            className={styles.navItems}
            onMouseEnter={() => handleMouseEnter(index, link.hasDropdown)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <Link
              href={link.href}
              className={`${styles.navLink} ${isCurrentPage ? styles.activeNavLink : ""}`}
              onClick={() => { if (!link.hasDropdown) onLinkClick(); }}
            >
              {isCurrentPage && <span className={styles.dot} />}
              {link.label}
              {link.hasDropdown && (
                <ChevronDownIcon
                  className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ""}`}
                />
              )}
            </Link>
          </div>
        );

        return (
          <div key={link.href || `nav-link-${index}`} className={styles.navLinkWrapper}>
            {showGlass ? (
              <div className={styles.glassWrapper}>
                <LiquidGlass {...GLASS_PROPS}>
                  {desktopContent}
                </LiquidGlass>
              </div>
            ) : (
              desktopContent
            )}
            {link.hasDropdown && isDropdownOpen && (
              <div
                ref={dropdownRef}
                onMouseEnter={() => {
                  if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                }}
                onMouseLeave={() => { if (!isMobile) setActiveDropdown(null); }}
              >
                <NavItemDropdown
                  item={link}
                  setActiveDropdown={setActiveDropdown}
                  isMobile={false}
                  onNavItemClick={onLinkClick}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const MobileMenuOverlay = ({
  isOpen,
  onClose,
  pathname,
  activeDropdown,
  setActiveDropdown,
  navLinks,
  onLogoClick,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`${styles.mobileMenuOverlay} ${
        isOpen && !isClosing ? styles.slideIn : ""
      } ${isClosing ? styles.slideOut : ""}`}
      onClick={handleOverlayClick}
    >
      <div className={styles.mobileMenuContent}>
        <div className={styles.mobileMenuHeader}>
          <div className={styles.logoContainer} onClick={onLogoClick}>
            <Image
              src={LogoImage}
              alt="ForexInstincts"
              className={styles.logoImage}
              width={50}
              height={50}
              priority
            />
          </div>
          <button
            onClick={handleClose}
            className={styles.mobileMenuClose}
            aria-label="Close menu"
          >
            <CloseIcon className={styles.closeIcon} />
          </button>
        </div>
        <NavigationLinks
          pathname={pathname}
          onLinkClick={handleClose}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
          isMobile={true}
          navLinks={navLinks}
        />
        <div className={styles.mobileLanguageSelector}>
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};

const LogoSection = ({ onLogoClick }) => (
  <div className={styles.logoContainer} onClick={onLogoClick}>
    <Image
      src={LogoImage}
      alt="ForexInstincts"
      className={styles.logoImage}
      width={50}
      height={50}
      priority
    />
  </div>
);

const RightSection = ({ isAuth, onLogout, isLoggingOut }) => (
  <div className={styles.rightSection}>
    {isAuth ? (
      <div className={styles.userSection}>
        <ProfilePicture />
        <button
          onClick={onLogout}
          className={styles.logoutButton}
          disabled={isLoggingOut}
          aria-label="Logout"
        >
          <LogoutIcon className={styles.logoutIcon} />
        </button>
      </div>
    ) : (
      <Link href="/authentication/login" className={styles.accountSection}>
        <PersonIcon className={styles.accountIcon} />
      </Link>
    )}
  </div>
);

const CTASection = () => (
  <Link href="/tiers" className={styles.ctaButton}>
    <RocketIcon className={styles.sparkleIcon} />
    <span>Build Your Bot</span>
  </Link>
);

const NavbarSkeleton = () => (
  <nav className={styles.navbarWrapper}>
    <div className={styles.navbarContainer}>
      <div className={styles.skeletonLoader}></div>
    </div>
  </nav>
);

const NavbarContent = () => {
  const {
    isOpen: isMobileMenuOpen,
    toggleOpen: toggleMobileMenu,
    setClose: closeMobileMenu,
  } = useDrawerStore();

  const { isMobile } = useResponsive();
  const { NAV_LINKS } = useNavLinks();
  const router = useRouter();
  const pathname = usePathname();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const { isAuth, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLinkClick = useCallback(() => {
    if (isMobile) closeMobileMenu();
    setActiveDropdown(null);
  }, [isMobile, closeMobileMenu]);

  const handleLogoClick = useCallback(() => {
    setActiveDropdown(null);
    if (isMobile) closeMobileMenu();
    router.push("/");
  }, [isMobile, router, closeMobileMenu]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const result = await logout();
      if (result?.success) {
        toast.success("Logged out successfully");
        closeMobileMenu();
        router.push("/");
      } else {
        toast.error("Logout failed");
      }
    } catch {
      toast.error("An error occurred during logout");
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, logout, closeMobileMenu, router]);

  const handleMobileMenuToggle = useCallback(() => {
    setActiveDropdown(null);
    toggleMobileMenu();
  }, [toggleMobileMenu]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) closeMobileMenu();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen, closeMobileMenu]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className={styles.navbarWrapper}>
        <div className={styles.navbarContainer}>
          <LogoSection onLogoClick={handleLogoClick} />

          {!isMobile && (
            <NavigationLinks
              pathname={pathname}
              onLinkClick={handleLinkClick}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              isMobile={false}
              navLinks={NAV_LINKS}
            />
          )}

          <div className={styles.navActions}>
            {!isMobile && <LanguageSelector />}
            <RightSection
              isAuth={isAuth}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
            {!isMobile && <CTASection />}
            {isMobile && (
              <button
                onClick={handleMobileMenuToggle}
                className={styles.mobileMenuButton}
                aria-label="Toggle menu"
              >
                {!isMobileMenuOpen ? (
                  <MenuIcon className={styles.menuIcon} />
                ) : (
                  <CloseIcon className={styles.closeIcon} />
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        pathname={pathname}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
        navLinks={NAV_LINKS}
        onLogoClick={handleLogoClick}
      />
    </>
  );
};

export default function Navbar() {
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <NavbarContent />
    </Suspense>
  );
}
