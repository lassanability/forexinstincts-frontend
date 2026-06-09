import styles from "@/app/style/legal.module.css";

export const metadata = {
  title: "Privacy Policy",
  description: "ForexInstincts Privacy Policy — how we collect, use, and protect your personal information.",
};

export default function Privacy() {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>Privacy Policy</h1>
        <p>Effective Date: June 9, 2026</p>
      </div>

      <div className={styles.content}>
        <section>
          <h2>1. Introduction and Data Controller</h2>
          <p>
            ForexInstincts (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the ForexInstincts platform
            (the &quot;Platform&quot;). This Privacy Policy describes how we collect, use, store,
            disclose, and protect your personal information when you access or use our Platform.
          </p>
          <p>
            By accessing or using the Platform, you acknowledge that you have read and understood
            this Privacy Policy and consent to the data practices described herein. If you do
            not agree, you must not use the Platform.
          </p>
          <p>
            This Privacy Policy should be read in conjunction with our Terms of Use, which are
            incorporated herein by reference.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>
            <strong>2.1 Account Information.</strong> When you register, we collect your name,
            email address, and a securely hashed version of your chosen password. We do not
            collect your payment card number, CVV, or bank account details at registration or
            at any point.
          </p>
          <p>
            <strong>2.2 Order and Transaction Data.</strong> When you submit a bot configuration
            and complete payment, we record: a unique order ID, your selected tier and
            configuration parameters, the payment reference number issued by Paystack, the
            transaction amount, and timestamp. We do not receive, store, or process your
            raw payment credentials — those remain exclusively with Paystack.
          </p>
          <p>
            <strong>2.3 Usage and Technical Data.</strong> We automatically collect certain
            technical data when you use the Platform, including: IP address, browser type and
            version, operating system, referring URL, pages visited, session duration, bot
            configurations submitted, and download activity. This data is used to operate,
            maintain, and improve the Platform.
          </p>
          <p>
            <strong>2.4 Communications.</strong> If you contact us via email or our contact form,
            we retain a record of your correspondence, including your name, email address, and
            the content of your message, in order to respond to your inquiry.
          </p>
          <p>
            <strong>2.5 Data We Do Not Collect.</strong> We do not collect: payment card numbers,
            CVV codes, bank account information, government-issued identification, biometric
            data, or sensitive personal data as defined under applicable data protection laws.
          </p>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <p>
            (a) To create and manage your account and verify your identity;
          </p>
          <p>
            (b) To process your bot generation orders and deliver EA files to your dashboard;
          </p>
          <p>
            (c) To send transactional communications, including order confirmations, bot delivery
            notifications, account alerts, and support responses;
          </p>
          <p>
            (d) To monitor, maintain, and improve Platform performance, reliability, and security;
          </p>
          <p>
            (e) To detect, investigate, and prevent fraud, abuse, unauthorized access, and other
            illegal or harmful activity;
          </p>
          <p>
            (f) To comply with applicable legal obligations, court orders, or regulatory requests;
          </p>
          <p>
            (g) To send promotional communications, where you have opted in (you may opt out at
            any time).
          </p>
          <p>
            We do not use your personal information for automated decision-making that produces
            legal or similarly significant effects without human review. We do not sell, rent,
            or trade your personal information to third parties for their marketing purposes.
          </p>
        </section>

        <section>
          <h2>4. Payment Processing — Paystack</h2>
          <p>
            All payments on the ForexInstincts Platform are processed exclusively by
            <strong> Paystack Payments Limited</strong> (&quot;Paystack&quot;), a PCI-DSS-compliant
            third-party payment processor.
          </p>
          <p>
            <strong>FOREXINSTINCTS DOES NOT COLLECT, RECEIVE, STORE, TRANSMIT, SEE, OR HAVE
            ACCESS TO YOUR PAYMENT CARD NUMBERS, CVV CODES, BANK ACCOUNT DETAILS, OR ANY OTHER
            SENSITIVE PAYMENT CREDENTIALS AT ANY POINT IN THE PAYMENT PROCESS.</strong> When you
            make a payment, your card or bank details are entered directly and exclusively into
            Paystack&apos;s secure, encrypted payment interface — never into ForexInstincts systems.
          </p>
          <p>
            ForexInstincts receives only a payment confirmation reference, the transaction
            amount, and a success or failure status from Paystack — never your raw financial
            credentials.
          </p>
          <p>
            The collection, processing, storage, and security of your payment information is
            governed entirely by Paystack&apos;s Privacy Policy and Terms of Service. Any concerns
            about the security or handling of your payment information should be directed to
            Paystack. ForexInstincts accepts no liability for any payment data breaches,
            errors, or incidents that occur within Paystack&apos;s systems.
          </p>
        </section>

        <section>
          <h2>5. Legal Basis for Processing</h2>
          <p>
            We process your personal data on the following legal bases, consistent with
            applicable data protection laws including the GDPR (where applicable):
          </p>
          <p>
            <strong>(a) Contract Performance:</strong> Processing necessary to deliver the services
            you have contracted for, including account creation, order processing, EA file
            generation, and delivery.
          </p>
          <p>
            <strong>(b) Legitimate Interests:</strong> Processing necessary for our legitimate
            business interests, including operating and improving the Platform, ensuring security,
            and preventing fraud — provided such interests are not overridden by your rights.
          </p>
          <p>
            <strong>(c) Legal Obligation:</strong> Processing required to comply with applicable
            laws, regulations, or binding legal orders.
          </p>
          <p>
            <strong>(d) Consent:</strong> Where you have given specific, informed consent to
            processing, such as subscribing to marketing communications. You may withdraw consent
            at any time without affecting the lawfulness of prior processing.
          </p>
        </section>

        <section>
          <h2>6. Data Sharing and Disclosure</h2>
          <p>
            We do not sell your personal data. We share your information only in the following
            limited circumstances:
          </p>
          <p>
            <strong>(a) Payment Processor (Paystack):</strong> Limited information necessary to
            initiate a payment transaction (such as order amount and reference) is passed to
            Paystack. Paystack does not receive your full account data.
          </p>
          <p>
            <strong>(b) Server Infrastructure (Linode):</strong> All ForexInstincts services are
            self-hosted on dedicated servers provided by Linode (Akamai Cloud). Linode provides
            raw server infrastructure only — it does not have access to, process, or control
            any application data, user accounts, personal information, or EA files stored on
            the Platform. No third-party cloud service, SaaS database, or managed infrastructure
            provider holds or processes your data.
          </p>
          <p>
            <strong>(c) Legal Requirements:</strong> We may disclose your information where
            required by law, regulation, court order, or governmental authority, or where
            necessary to protect the rights, property, or safety of ForexInstincts, our users,
            or the public.
          </p>
          <p>
            <strong>(d) Business Transfers:</strong> In connection with a merger, acquisition,
            restructuring, or sale of assets, your information may be transferred to the
            successor entity, subject to equivalent privacy protections.
          </p>
          <p>
            We do not share your data with marketing partners, data brokers, advertising
            networks, or any third party for marketing or profiling purposes.
          </p>
        </section>

        <section>
          <h2>7. Cookies and Local Storage</h2>
          <p>
            ForexInstincts does not use third-party tracking cookies, advertising cookies, or
            behavioral analytics cookies.
          </p>
          <p>
            We use browser <strong>local storage</strong> for the following strictly necessary
            purposes:
          </p>
          <p>
            (a) Maintaining your authenticated session (login state);
          </p>
          <p>
            (b) Storing interface preferences and state within the Platform.
          </p>
          <p>
            Local storage data is stored on your own device and is not transmitted to third
            parties. You may clear local storage at any time through your browser settings,
            which will log you out of the Platform. No consent is required for strictly necessary
            local storage.
          </p>
        </section>

        <section>
          <h2>8. Data Security</h2>
          <p>
            All ForexInstincts services — including the web application, database, and file
            storage — are entirely self-hosted on our own servers (Linode infrastructure).
            No application data is stored in or processed by any third-party cloud service,
            managed database provider, or external SaaS platform. We maintain full custody
            and control of all data at all times.
          </p>
          <p>
            We implement reasonable and appropriate technical and organizational security
            measures to protect your personal data against unauthorized access, disclosure,
            alteration, or destruction. These measures include:
          </p>
          <p>
            (a) Encrypted data transmission using HTTPS/TLS for all communications between your
            browser and our servers;
          </p>
          <p>
            (b) Secure hashing of passwords using industry-standard algorithms (bcrypt or
            equivalent) — we never store passwords in plain text;
          </p>
          <p>
            (c) Server-side authentication token validation and session management;
          </p>
          <p>
            (d) Restricted, role-based access to personal data on a strict need-to-know basis.
          </p>
          <p>
            No method of data transmission over the internet or electronic storage is 100%
            secure. While we employ industry-standard security practices, we cannot guarantee
            the absolute security of your personal data. In the event of a data breach that is
            likely to result in a risk to your rights and freedoms, we will notify affected
            users and relevant authorities as required by applicable law.
          </p>
        </section>

        <section>
          <h2>9. Data Retention</h2>
          <p>
            We retain your personal data for as long as your account remains active and for a
            reasonable period thereafter as necessary to: fulfill the purposes described in this
            Privacy Policy, comply with legal obligations (including financial record-keeping
            requirements), resolve disputes, and enforce our agreements.
          </p>
          <p>
            Transaction and order records may be retained for a minimum period required by
            applicable financial regulations, even after account deletion.
          </p>
          <p>
            You may request deletion of your account and personal data by contacting
            support@forexinstincts.com. We will honor such requests within 30 days, subject
            to any legal retention obligations that prevent immediate or full deletion.
          </p>
        </section>

        <section>
          <h2>10. Your Privacy Rights</h2>
          <p>
            Depending on your location and applicable data protection law, you may have the
            following rights with respect to your personal data:
          </p>
          <p>
            <strong>(a) Right of Access:</strong> The right to request a copy of the personal
            data we hold about you.
          </p>
          <p>
            <strong>(b) Right of Rectification:</strong> The right to request correction of
            inaccurate or incomplete personal data.
          </p>
          <p>
            <strong>(c) Right of Erasure:</strong> The right to request deletion of your personal
            data, subject to applicable legal retention requirements.
          </p>
          <p>
            <strong>(d) Right to Restrict Processing:</strong> The right to request that we
            limit certain processing of your personal data.
          </p>
          <p>
            <strong>(e) Right to Data Portability:</strong> The right to receive your personal
            data in a structured, commonly used, machine-readable format.
          </p>
          <p>
            <strong>(f) Right to Object:</strong> The right to object to processing based on
            legitimate interests, including for direct marketing.
          </p>
          <p>
            <strong>(g) Right to Withdraw Consent:</strong> Where processing is based on consent,
            the right to withdraw that consent at any time without affecting prior processing.
          </p>
          <p>
            To exercise any of these rights, contact us at support@forexinstincts.com with a
            clear description of your request. We will respond within 30 days. We may require
            reasonable identity verification before processing your request. We will not
            discriminate against you for exercising your privacy rights.
          </p>
        </section>

        <section>
          <h2>11. International Data Transfers</h2>
          <p>
            Your personal data may be transferred to and processed in countries other than
            your country of residence, including countries that may have different or less
            comprehensive data protection laws than those in your jurisdiction.
          </p>
          <p>
            Where we transfer personal data internationally, we take appropriate safeguards —
            such as standard contractual clauses, data processing agreements, or reliance on
            adequacy decisions — to ensure that your personal data receives adequate protection
            consistent with applicable data protection law.
          </p>
        </section>

        <section>
          <h2>12. Children&apos;s Privacy</h2>
          <p>
            The Platform is not directed to, and we do not knowingly collect personal data
            from, individuals under the age of 18. If you are under 18, you must not use the
            Platform or provide any personal information to us.
          </p>
          <p>
            If we become aware that we have inadvertently collected personal data from a person
            under 18, we will delete that information as promptly as reasonably practicable.
            If you believe a minor has provided us with personal data, please contact us at
            support@forexinstincts.com.
          </p>
        </section>

        <section>
          <h2>13. Third-Party Services and Links</h2>
          <p>
            The Platform may contain links to or integrations with third-party websites,
            applications, or services, including Paystack (payment processing) and MetaTrader
            (trading platform). ForexInstincts is not responsible for the privacy practices,
            security, or content of those third-party services.
          </p>
          <p>
            Your interactions with third-party services are governed by their respective
            privacy policies. We encourage you to review those policies before providing any
            personal information to any third party.
          </p>
        </section>

        <section>
          <h2>14. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our
            data practices, legal requirements, or Platform features. We will notify you of
            material changes by sending an email to your registered address or by displaying
            a prominent notice on the Platform at least 14 days before the changes take effect.
            The &quot;Effective Date&quot; at the top of this page will be updated to reflect the most
            recent revision.
          </p>
          <p>
            Your continued use of the Platform after the effective date of any changes to this
            Privacy Policy constitutes your acceptance of the revised policy. If you do not
            agree to the revised policy, you must stop using the Platform and may request
            deletion of your data.
          </p>
        </section>

        <section>
          <h2>15. Contact Us</h2>
          <p>
            For privacy-related questions, data access requests, data deletion requests, or
            to exercise any of your rights under applicable data protection law, please contact:
          </p>
          <p>Email: support@forexinstincts.com</p>
          <p>
            We will acknowledge receipt of your request promptly and respond within 30 days.
          </p>
        </section>
      </div>
    </div>
  );
}
