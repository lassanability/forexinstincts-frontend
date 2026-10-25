import ContactForm from "@/app/components/account/ContactForm";
import { getConfig } from "@/app/lib/api";
import site from "@/app/styles/site.module.css";
import styles from "@/app/styles/signIn.module.css";

export const metadata = { title: "Contact us", description: "Questions about a bot, your plan or your Deriv link? Send us a message." };

export default async function ContactPage() {
  const config = await getConfig();
  const email = config?.links?.supportEmail;

  return (
    <div className={site.page}>
      <header className={site.header}>
        <span className={site.eyebrow}>Support</span>
        <h1 className={site.title}>
          Talk to <span className="gradient-text">a real person</span>
        </h1>
        <p className={site.lead}>Questions about a bot, a payment or linking Deriv? Write to us and a human replies.{email && ` You can also email ${email}.`}</p>
      </header>
      <div className={`glass ${styles.card}`}>
        <ContactForm />
      </div>
    </div>
  );
}
