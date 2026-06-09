import ContactSection from "@/app/components/ContactSection";
import Testimonials from "@/app/components/Testimonials";

const SITE_URL = "https://forexinstincts.com";

export const metadata = {
  title: "Contact Us — ForexInstincts Support",
  description: "Reach out to the ForexInstincts team for support, questions about your trading bot order, or partnership inquiries. We typically respond within 24 hours.",
  keywords: ["forex bot support", "contact forexinstincts", "trading bot help", "EA builder support"],
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/contact`,
    title: "Contact Us — ForexInstincts Support",
    description: "Have questions about your bot? Get in touch with our support team.",
  },
};

export default function ContactPage() {
  return (
    <>
      <ContactSection />
      <Testimonials />
    </>
  );
}
