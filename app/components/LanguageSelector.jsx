"use client";

import { useState, useEffect, useRef } from "react";
import styles from "@/app/style/languageSelector.module.css";
import {
  IoGlobeOutline as GlobeIcon,
  IoChevronDownOutline as ChevronIcon,
  IoCheckmark as CheckIcon,
} from "react-icons/io5";

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Arabic", value: "ar" },
  { label: "Chinese", value: "zh-CN" },
  { label: "Japanese", value: "ja" },
  { label: "Hindi", value: "hi" },
  { label: "Swahili", value: "sw" },
  { label: "Indonesian", value: "id" },
];

function getActiveLang() {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/googtrans=\/[a-z-]+\/([a-z-]+)/i);
  return match ? match[1] : "en";
}

function setLang(value) {
  if (value === "en") {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + location.hostname;
  } else {
    const cookie = `/auto/${value}`;
    document.cookie = `googtrans=${cookie}; path=/`;
    document.cookie = `googtrans=${cookie}; path=/; domain=.${location.hostname}`;
  }
  location.reload();
}

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("en");
  const wrapRef = useRef(null);

  useEffect(() => {
    setActive(getActiveLang());
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeLabel = LANGUAGES.find((l) => l.value === active)?.label ?? "English";

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-label="Select language"
        aria-expanded={open}
      >
        <GlobeIcon className={styles.globe} />
        <span className={styles.label}>{activeLabel}</span>
        <ChevronIcon className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} />
      </button>

      {open && (
        <div className={styles.dropdown} role="listbox">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              className={`${styles.option} ${active === lang.value ? styles.optionActive : ""}`}
              onClick={() => {
                setOpen(false);
                if (lang.value !== active) setLang(lang.value);
              }}
              role="option"
              aria-selected={active === lang.value}
            >
              <span>{lang.label}</span>
              {active === lang.value && <CheckIcon className={styles.checkIcon} />}
            </button>
          ))}
        </div>
      )}

      <div id="google_translate_element" style={{ display: "none" }} />
    </div>
  );
}
