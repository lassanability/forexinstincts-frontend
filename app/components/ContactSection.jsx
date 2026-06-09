"use client";

import { useState } from "react";
import { toast } from "sonner";
import styles from "@/app/style/contact.module.css";
import SectionLabel from "@/app/components/ui/SectionLabel";
import { MdEmail as EmailIcon } from "react-icons/md";
import { FaTelegram as TelegramIcon } from "react-icons/fa";
import { FiClock as ClockIcon } from "react-icons/fi";
import { MdSupportAgent as SupportIcon } from "react-icons/md";
import Dropdown from "@/app/components/Dropdown";

const SUBJECT_OPTIONS = [
  "Bot Inquiry",
  "Payment Issue",
  "Download Issue",
  "Technical Support",
  "Custom Bot Request",
  "Feedback",
  "Other",
].map((s) => ({ name: s, value: s }));

const INFO_CARDS = [
  {
    icon: EmailIcon,
    label: "Email Support",
    lines: ["support@forexinstincts.com"],
  },
  {
    icon: TelegramIcon,
    label: "Telegram",
    lines: ["@forexinstincts"],
  },
  {
    icon: ClockIcon,
    label: "Response Time",
    lines: ["Within 24 hours"],
  },
  {
    icon: SupportIcon,
    label: "Support Hours",
    lines: ["Mon – Fri, 9am – 6pm WAT"],
  },
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.contactSection}>
      <div className={styles.contactHeader}>
        <SectionLabel text="Get In Touch" heading="Reach Out to Us" center={true} />
      </div>

      <div className={styles.contactBody}>
        {submitted ? (
          <div className={styles.successState}>
            <h4>Message received!</h4>
            <p>We will get back to you within 24 hours. Thank you for reaching out.</p>
          </div>
        ) : (
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <input
                type="text"
                name="name"
                placeholder="Your Name *"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <Dropdown
              options={SUBJECT_OPTIONS}
              value={form.subject ? { name: form.subject, value: form.subject } : null}
              onSelect={(opt) => setForm((p) => ({ ...p, subject: opt.value }))}
              dropPlaceHolder="Select Subject..."
            />
            <textarea
              name="message"
              placeholder="Your Message *"
              value={form.message}
              onChange={handleChange}
              rows={6}
              required
            />
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}

        <div className={styles.contactInfo}>
          {INFO_CARDS.map(({ icon: Icon, label, lines }) => (
            <div key={label} className={styles.infoCard}>
              <div className={styles.infoIconWrap}>
                <Icon className={styles.infoIcon} />
              </div>
              <div className={styles.infoText}>
                <span>{label}</span>
                {lines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
