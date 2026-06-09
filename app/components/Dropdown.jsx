"use client";

import { useState, useRef, useEffect } from "react";
import { IoCheckmark as CheckIcon, IoChevronDown as ChevronIcon } from "react-icons/io5";
import styles from "@/app/style/dropdown.module.css";

export default function Dropdown({ options = [], value, onSelect, dropPlaceHolder }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selectedLabel = value?.name || value?.label || dropPlaceHolder;

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
      >
        <span>{selectedLabel}</span>
        <div className={`${styles.chevron}${isOpen ? ` ${styles.chevronOpen}` : ""}`}>
          <ChevronIcon />
        </div>
      </button>
      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          {options.length > 0 ? (
            options.map((opt) => {
              const isActive = value?.value === opt.value;
              return (
                <button
                  key={opt.value ?? opt.code ?? opt.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`${styles.option}${isActive ? ` ${styles.optionActive}` : ""}`}
                  onClick={() => { onSelect(opt); setIsOpen(false); }}
                >
                  <span>{opt.name || opt.label}</span>
                  {isActive && <CheckIcon className={styles.checkIcon} />}
                </button>
              );
            })
          ) : (
            <div className={styles.option}>No options available</div>
          )}
        </div>
      )}
    </div>
  );
}
