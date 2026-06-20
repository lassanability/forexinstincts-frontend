import styles from "@/app/style/legal.module.css";

export const metadata = {
  title: "Terms of Use",
  description: "ForexInstincts Terms of Use: legally binding terms governing your use of the platform.",
};

export default function Terms() {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>Terms of Use</h1>
        <p>Effective Date: June 9, 2026</p>
      </div>

      <div className={styles.content}>
        <section>
          <h2>IMPORTANT NOTICE</h2>
          <p>
            PLEASE READ THESE TERMS OF USE CAREFULLY BEFORE USING THE FOREXINSTINCTS PLATFORM.
            BY CREATING AN ACCOUNT, SUBMITTING A BOT CONFIGURATION, OR MAKING A PAYMENT, YOU
            ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE LEGALLY BOUND BY THESE
            TERMS. IF YOU DO NOT AGREE, YOU MUST NOT ACCESS OR USE THE PLATFORM.
          </p>
        </section>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            These Terms of Use (&quot;Terms&quot;) constitute a legally binding agreement between you
            (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and ForexInstincts (&quot;ForexInstincts,&quot; &quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;) governing your access to and use of the ForexInstincts website and bot
            generation platform (collectively, the &quot;Platform&quot;).
          </p>
          <p>
            If you are accessing the Platform on behalf of a company or other legal entity, you
            represent and warrant that you have the authority to bind that entity to these Terms,
            and references to &quot;you&quot; and &quot;your&quot; include that entity.
          </p>
        </section>

        <section>
          <h2>2. Definitions</h2>
          <p>
            <strong>&quot;EA File&quot;</strong> or <strong>&quot;Bot File&quot;</strong> means an Expert Advisor file
            (.mq4 or .mq5) generated or sold by the Platform for use on MetaTrader 4 or MetaTrader 5.
          </p>
          <p>
            <strong>&quot;Custom Bot Order&quot;</strong> means a bot configuration submitted through the Bot Builder
            wizard by a user, resulting in a generated EA file based on the user&apos;s specified settings.
          </p>
          <p>
            <strong>&quot;Marketplace Bot&quot;</strong> means a pre-built Expert Advisor created by ForexInstincts
            and made available for purchase in the Bot Marketplace. Marketplace bots are not
            user-configured; they are built with fixed logic and settings intended as a starting
            point for new traders.
          </p>
          <p>
            <strong>&quot;Order&quot;</strong> means a successfully paid Custom Bot Order or Marketplace Bot purchase
            resulting in the delivery of an EA file to your account dashboard.
          </p>
          <p>
            <strong>&quot;Platform&quot;</strong> means the ForexInstincts website, web application, bot builder wizard,
            Bot Marketplace, user dashboard, and all related services and content.
          </p>
          <p>
            <strong>&quot;NowPayments&quot;</strong> means NOWPayments, the third-party cryptocurrency payment processor
            used by ForexInstincts to handle all payment transactions.
          </p>
        </section>

        <section>
          <h2>3. Description of Service</h2>
          <p>
            ForexInstincts offers two distinct products:
          </p>
          <p>
            <strong>(a) Bot Builder:</strong> A web-based wizard that enables users to configure and generate
            Expert Advisor files for MetaTrader 4 (MT4) and MetaTrader 5 (MT5) based on the user&apos;s
            own specified rules, indicators, risk settings, and strategy parameters. The generated bot
            automates exactly the logic and rules the user configures, nothing more.
          </p>
          <p>
            <strong>(b) Bot Marketplace:</strong> A catalogue of pre-built Expert Advisors created by
            ForexInstincts and made available for one-time purchase. Marketplace bots are designed
            to help new traders get started with automated trading. They use fixed configurations
            defined by ForexInstincts and are not customizable after purchase.
          </p>
          <p>
            ForexInstincts does not provide brokerage services, financial advisory services,
            asset management, signal services, or investment management services of any kind.
            We are a technology platform only.
          </p>
        </section>

        <section>
          <h2>4. Eligibility</h2>
          <p>
            You must be at least 18 years of age to register for or use the Platform. By
            registering, you represent and warrant that:
          </p>
          <p>
            (a) You are at least 18 years old and have the full legal capacity to enter into
            binding contracts in your jurisdiction;
          </p>
          <p>
            (b) Your use of the Platform does not violate any applicable law or regulation in
            your country of residence;
          </p>
          <p>
            (c) Algorithmic and automated forex trading is not prohibited or restricted in your
            jurisdiction;
          </p>
          <p>
            (d) You are not a resident of, or accessing the Platform from, any jurisdiction where
            the use of such services is prohibited by law.
          </p>
        </section>

        <section>
          <h2>5. Account Registration and Security</h2>
          <p>
            You must provide accurate, current, and complete information when creating your
            account. You are solely responsible for maintaining the confidentiality of your
            login credentials and for all activities that occur under your account.
          </p>
          <p>
            You must notify us immediately at support@forexinstincts.com if you suspect any
            unauthorized access to or use of your account. ForexInstincts is not liable for
            any loss or damage resulting from your failure to safeguard your credentials.
          </p>
          <p>
            We reserve the right to suspend or permanently terminate any account that provides
            false or misleading registration information, is used in violation of these Terms,
            or is involved in any fraudulent activity.
          </p>
        </section>

        <section>
          <h2>6. Orders, Pricing, and Payment</h2>
          <p>
            <strong>6.1 Pricing.</strong> Bot generation is priced according to the selected tier
            (Basic, Complex, or Advanced) and applicable configuration options. All prices are
            displayed in United States Dollars (USD). Cryptocurrency conversion is handled by
            NowPayments at the time of checkout.
          </p>
          <p>
            <strong>6.2 Payment Processing by NowPayments.</strong> ALL PAYMENTS ON THE FOREXINSTINCTS
            PLATFORM ARE PROCESSED EXCLUSIVELY BY NOWPAYMENTS, A THIRD-PARTY CRYPTOCURRENCY
            PAYMENT PROCESSOR. FOREXINSTINCTS DOES NOT COLLECT, RECEIVE, STORE, TRANSMIT, OR
            HAVE ACCESS TO YOUR WALLET DETAILS, PRIVATE KEYS, OR ANY OTHER PAYMENT CREDENTIALS.
            By proceeding with a payment, you agree to NowPayments&apos; Terms of Service and Privacy
            Policy. NowPayments is solely and exclusively responsible for the security, processing,
            and handling of your payment information.
          </p>
          <p>
            <strong>6.3 Payment Confirmation.</strong> An Order is confirmed when payment is
            successfully processed by NowPayments and ForexInstincts receives a verified payment
            notification. ForexInstincts is not responsible for payment processing delays,
            failures, or errors caused by NowPayments, blockchain network congestion, or your
            cryptocurrency wallet or exchange.
          </p>
          <p>
            <strong>6.4 Taxes.</strong> You are solely responsible for any taxes, duties, or levies
            applicable to your purchase in your jurisdiction. ForexInstincts does not collect or
            remit taxes on your behalf.
          </p>
        </section>

        <section>
          <h2>7. Digital Goods Delivery and No-Refund Policy</h2>
          <p>
            <strong>7.1 Immediate Digital Delivery.</strong> EA files, whether generated through the
            Bot Builder or purchased from the Marketplace, are digital products delivered
            automatically to your account dashboard upon confirmed payment. Delivery is considered
            complete when the EA file becomes available for download in your account.
          </p>
          <p>
            <strong>7.2 Express Consent to Immediate Delivery and Waiver of Withdrawal Rights.</strong> BY
            COMPLETING PAYMENT, YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT:
          </p>
          <p>
            (a) The EA file is a digital product delivered immediately and automatically upon
            payment confirmation;
          </p>
          <p>
            (b) You consent to the immediate commencement of delivery and performance of the
            service prior to the expiry of any applicable statutory withdrawal or cooling-off
            period;
          </p>
          <p>
            (c) You acknowledge that, as a consequence of your express consent to immediate
            delivery, you lose any applicable right of withdrawal under consumer protection
            legislation once the digital content has been made available in your account;
          </p>
          <p>
            (d) All sales of EA files are final and non-refundable upon delivery.
          </p>
          <p>
            <strong>7.3 Platform Failure Exception.</strong> If the ForexInstincts platform fails
            to generate or deliver your EA file due to a verified technical error attributable
            solely to our platform, we will, at our sole discretion, either re-generate the EA
            file or issue a full refund. This exception does not apply to: user configuration
            errors, incorrect settings selected, broker incompatibility, MetaTrader version
            mismatches, trading losses or drawdown, or dissatisfaction with trading performance.
          </p>
          <p>
            <strong>7.4 Chargebacks and Disputes.</strong> Initiating a chargeback, payment reversal,
            or dispute through your bank, exchange, or NowPayments for a successfully delivered
            EA file, without first contacting ForexInstincts and allowing us a reasonable
            opportunity to resolve the matter, constitutes a material breach of these Terms and
            may result in immediate account termination, reporting to relevant fraud prevention
            services, and recovery of associated costs.
          </p>
        </section>

        <section>
          <h2>8. Intellectual Property</h2>
          <p>
            <strong>8.1 Platform Ownership.</strong> The ForexInstincts Platform, including its
            website, design, interface, generation engine, underlying algorithms, templates,
            trademarks, trade name, and all related technology and content, is the exclusive
            intellectual property of ForexInstincts. All rights reserved.
          </p>
          <p>
            <strong>8.2 No Source Code Provided.</strong> Generated EA files are delivered as compiled
            binary files only. ForexInstincts does not provide, transfer, license, or disclose
            any MQL4 or MQL5 source code under any circumstances, at any tier, or for any price.
            The compiled format is an intentional and permanent feature of our service.
          </p>
          <p>
            <strong>8.3 License Grant.</strong> Upon confirmed payment and delivery of an EA file,
            ForexInstincts grants you a limited, personal, non-exclusive, non-transferable,
            non-sublicensable, revocable license to install and use the EA file solely for
            personal live or demo trading on your own MetaTrader account(s).
          </p>
          <p>
            <strong>8.4 Restrictions.</strong> You expressly agree that you shall NOT:
          </p>
          <p>
            (a) Decompile, disassemble, reverse-engineer, decrypt, or otherwise attempt to
            derive, access, or reconstruct the source code of any EA file;
          </p>
          <p>
            (b) Modify, adapt, translate, patch, or create derivative works based on any EA file;
          </p>
          <p>
            (c) Resell, redistribute, sublicense, rent, lease, lend, transfer, or otherwise
            make available any EA file to any third party;
          </p>
          <p>
            (d) Use any EA file in a commercial product, managed account service, fund, or
            copy-trading service;
          </p>
          <p>
            (e) Share your account credentials or EA files with any other person or entity;
          </p>
          <p>
            (f) Remove, alter, disable, or obscure any proprietary notices, watermarks, or
            identifiers embedded in EA files.
          </p>
          <p>
            Any breach of these restrictions constitutes copyright infringement and a material
            breach of these Terms, entitling ForexInstincts to seek all available legal remedies
            including injunctive relief and damages.
          </p>
        </section>

        <section>
          <h2>9. Trading Risk Disclaimer</h2>
          <p>
            <strong>FOREX, CFD, AND DERIVATIVES TRADING INVOLVES A SUBSTANTIAL RISK OF LOSS AND IS
            NOT APPROPRIATE FOR ALL INVESTORS OR TRADERS.</strong> The use of leverage can result in
            losses that substantially exceed your initial deposit. You may lose all of your
            invested capital.
          </p>
          <p>
            <strong>9.1 Custom Bot Builder.</strong> EA files generated through the Bot Builder automate
            exactly the rules and logic that you configure. Their real-world performance depends
            entirely on the quality of your strategy, market conditions, broker execution, server
            latency, liquidity, account type, leverage, and numerous other factors entirely outside
            ForexInstincts&apos;s control. ForexInstincts is not responsible for the trading outcomes
            of any configuration you submit.
          </p>
          <p>
            <strong>9.2 Marketplace Bots.</strong> Pre-built Marketplace bots are designed as educational
            starting points for new traders learning to use automated trading tools. They are
            <strong> not</strong> guaranteed to generate profits, positive returns, or trading success
            of any kind. A Marketplace bot&apos;s past behaviour, any described strategy, or any
            example shown on the Platform does not constitute a representation of future results.
            Market conditions, broker differences, and account parameters mean that no strategy
            can reliably perform the same way for all users. Purchasing a Marketplace bot does not
            entitle you to any specific trading outcome.
          </p>
          <p>
            <strong>FOREXINSTINCTS DOES NOT GUARANTEE ANY TRADING OUTCOME, PROFIT, MINIMUM RETURN,
            OR PRESERVATION OF CAPITAL FOR ANY PRODUCT, CUSTOM OR MARKETPLACE.</strong> Past
            performance does not guarantee future performance.
          </p>
          <p>
            You acknowledge that: (a) you trade exclusively at your own risk; (b) you are using
            capital you can afford to lose; and (c) you have independently evaluated whether
            automated forex trading is suitable for your financial situation and risk tolerance.
          </p>
        </section>

        <section>
          <h2>10. Not Financial Advice</h2>
          <p>
            Nothing on the ForexInstincts Platform, including bot configurations, strategy
            descriptions, indicator explanations, performance examples, documentation, blog
            posts, or any other content, constitutes financial, investment, tax, or trading
            advice. ForexInstincts is not registered, licensed, or regulated as a financial
            advisor, investment firm, broker-dealer, or money manager in any jurisdiction.
          </p>
          <p>
            You should seek independent, qualified financial and legal advice before deploying
            any automated trading strategy with real capital.
          </p>
        </section>

        <section>
          <h2>11. Prohibited Conduct</h2>
          <p>You agree not to engage in or attempt any of the following:</p>
          <p>
            (a) Circumventing, bypassing, or exploiting any feature limitation, access control,
            security mechanism, or tier restriction of the Platform;
          </p>
          <p>
            (b) Sharing, selling, or otherwise distributing access to your account;
          </p>
          <p>
            (c) Using automated bots, scrapers, crawlers, or scripts to interact with the
            Platform except through officially provided APIs;
          </p>
          <p>
            (d) Submitting false, misleading, or fraudulent information;
          </p>
          <p>
            (e) Impersonating any person or entity, or misrepresenting your affiliation with
            any person or organization;
          </p>
          <p>
            (f) Uploading, transmitting, or distributing malicious code, viruses, or other
            harmful software;
          </p>
          <p>
            (g) Interfering with or disrupting the Platform&apos;s servers, network, or infrastructure;
          </p>
          <p>
            (h) Using the Platform for any purpose that is unlawful, fraudulent, deceptive, or
            otherwise in violation of applicable law or these Terms;
          </p>
          <p>
            (i) Attempting to gain unauthorized access to any account, system, or network
            connected to the Platform.
          </p>
          <p>
            Violation of any of the above may result in immediate account termination without
            refund and may subject you to civil and criminal liability.
          </p>
        </section>

        <section>
          <h2>12. Disclaimer of Warranties</h2>
          <p>
            THE PLATFORM AND ALL GENERATED EA FILES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
            WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT,
            TITLE, ACCURACY, RELIABILITY, OR UNINTERRUPTED, ERROR-FREE OPERATION.
          </p>
          <p>
            FOREXINSTINCTS DOES NOT WARRANT THAT: (a) THE PLATFORM WILL MEET YOUR REQUIREMENTS;
            (b) ANY GENERATED EA FILE WILL FUNCTION CORRECTLY WITH ANY PARTICULAR BROKER,
            ACCOUNT TYPE, SERVER, OR MARKET CONDITION; (c) THE PLATFORM WILL BE AVAILABLE AT
            ALL TIMES WITHOUT INTERRUPTION; OR (d) ANY ERRORS OR DEFECTS WILL BE CORRECTED.
          </p>
        </section>

        <section>
          <h2>13. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, FOREXINSTINCTS AND ITS OWNERS,
            DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT
            NOT LIMITED TO TRADING LOSSES, LOST PROFITS, LOSS OF DATA, LOSS OF GOODWILL, COST
            OF SUBSTITUTE SERVICES, OR BUSINESS INTERRUPTION, ARISING OUT OF OR RELATING TO
            YOUR USE OF OR INABILITY TO USE THE PLATFORM OR ANY EA FILE, REGARDLESS OF THE
            THEORY OF LIABILITY AND EVEN IF FOREXINSTINCTS HAS BEEN ADVISED OF THE POSSIBILITY
            OF SUCH DAMAGES.
          </p>
          <p>
            IN NO EVENT SHALL FOREXINSTINCTS&apos;S TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS
            ARISING OUT OF OR RELATING TO THESE TERMS OR YOUR USE OF THE PLATFORM EXCEED THE
            TOTAL AMOUNT PAID BY YOU TO FOREXINSTINCTS IN THE SIX (6) CALENDAR MONTHS
            IMMEDIATELY PRECEDING THE CLAIM.
          </p>
          <p>
            Some jurisdictions do not allow the exclusion or limitation of certain damages. To
            the extent such restrictions apply to you, some of the above limitations may not
            apply to you in full, but shall be limited to the maximum extent permitted by law.
          </p>
        </section>

        <section>
          <h2>14. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless ForexInstincts and its owners,
            directors, employees, agents, and affiliates from and against any and all claims,
            demands, liabilities, losses, damages, costs, and expenses (including reasonable
            legal fees and court costs) arising out of or relating to: (a) your use of the
            Platform or any EA file; (b) your violation of these Terms; (c) your trading
            activities or financial decisions; (d) your violation of any applicable law or
            regulation; or (e) any claim by a third party arising from your use of the Platform.
          </p>
        </section>

        <section>
          <h2>15. Third-Party Services</h2>
          <p>
            <strong>15.1 NowPayments.</strong> Payment processing is provided by NOWPayments.
            ForexInstincts is not responsible for NowPayments&apos; availability, uptime,
            payment processing errors, security incidents, or data handling. All disputes
            relating to payment processing must be directed first to NowPayments.
          </p>
          <p>
            <strong>15.2 MetaTrader / MetaQuotes.</strong> EA files are designed for use with
            MetaTrader 4 and MetaTrader 5 platforms developed by MetaQuotes Software Corp.
            ForexInstincts is not affiliated with, endorsed by, sponsored by, or responsible
            for MetaTrader, MetaQuotes, or any broker&apos;s implementation of these platforms.
          </p>
          <p>
            <strong>15.3 Brokers.</strong> ForexInstincts is not responsible for your broker&apos;s
            execution quality, slippage, requotes, platform availability, account terms, or any
            losses incurred through your brokerage account. EA file performance may vary
            significantly across different brokers and account types.
          </p>
          <p>
            <strong>15.4 Self-Hosted Infrastructure.</strong> All ForexInstincts services are
            self-hosted on our own dedicated servers. No third-party cloud provider, SaaS
            platform, or managed service has access to your account data, orders, or EA files.
            Server infrastructure is provided by Linode (Akamai Cloud) as a bare server host
            only, with no application-level data access.
          </p>
          <p>
            <strong>15.5 Third-Party Links.</strong> The Platform may contain links to third-party
            websites. ForexInstincts does not endorse or assume responsibility for the content,
            privacy practices, or security of any third-party sites.
          </p>
        </section>

        <section>
          <h2>16. Termination</h2>
          <p>
            <strong>16.1 By You.</strong> You may close your account at any time by contacting
            support@forexinstincts.com. Account closure does not entitle you to a refund for
            any previously delivered EA files.
          </p>
          <p>
            <strong>16.2 By Us.</strong> ForexInstincts reserves the right to suspend or permanently
            terminate your account at any time, with or without notice, for: (a) violation of
            these Terms; (b) fraudulent, abusive, or illegal activity; (c) extended account
            inactivity; or (d) any conduct we reasonably determine to be harmful to the Platform
            or other users.
          </p>
          <p>
            <strong>16.3 Effect of Termination.</strong> Upon termination, your license to use any
            generated EA files is immediately revoked. Sections 7, 8, 9, 10, 12, 13, 14, and 17
            of these Terms survive any termination or expiry.
          </p>
        </section>

        <section>
          <h2>17. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of the
            jurisdiction in which ForexInstincts is registered, without regard to its
            conflict-of-laws provisions.
          </p>
          <p>
            In the event of any dispute arising out of or relating to these Terms or the
            Platform, you agree to first contact ForexInstincts at support@forexinstincts.com
            and provide a written description of the dispute. The parties agree to make a good
            faith effort to resolve the dispute informally within 30 days before initiating
            any formal legal proceedings.
          </p>
          <p>
            Any unresolved disputes shall be subject to the exclusive jurisdiction of the
            competent courts of the applicable jurisdiction.
          </p>
        </section>

        <section>
          <h2>18. Force Majeure</h2>
          <p>
            ForexInstincts shall not be liable for any delay or failure to perform any
            obligation under these Terms where such delay or failure results from any cause
            beyond our reasonable control, including but not limited to acts of God, natural
            disasters, war, terrorism, civil unrest, government orders, internet or
            infrastructure outages, cyberattacks, power failures, or third-party service
            provider failures (including NowPayments or hosting providers).
          </p>
        </section>

        <section>
          <h2>19. General Provisions</h2>
          <p>
            <strong>Severability.</strong> If any provision of these Terms is found to be
            invalid, illegal, or unenforceable by a court of competent jurisdiction, the
            remaining provisions shall continue in full force and effect. The invalid provision
            shall be modified to the minimum extent necessary to make it enforceable.
          </p>
          <p>
            <strong>Entire Agreement.</strong> These Terms, together with our Privacy Policy,
            constitute the entire agreement between you and ForexInstincts regarding your use
            of the Platform and supersede all prior or contemporaneous agreements,
            representations, or understandings.
          </p>
          <p>
            <strong>No Waiver.</strong> Failure by ForexInstincts to enforce any right or provision
            of these Terms shall not be construed as a waiver of that right or provision.
          </p>
          <p>
            <strong>No Assignment.</strong> You may not assign, transfer, or delegate your rights
            or obligations under these Terms without ForexInstincts&apos;s prior written consent.
            ForexInstincts may assign these Terms without restriction.
          </p>
          <p>
            <strong>Notices.</strong> All notices to ForexInstincts under these Terms must be
            sent to support@forexinstincts.com.
          </p>
        </section>

        <section>
          <h2>20. Changes to These Terms</h2>
          <p>
            ForexInstincts reserves the right to update or modify these Terms at any time.
            Material changes will be communicated via email to your registered address or via
            an in-platform notice at least 14 days before the changes take effect. The
            &quot;Effective Date&quot; at the top of this page will be updated accordingly. Your
            continued use of the Platform after the effective date of any changes constitutes
            your acceptance of the revised Terms. If you do not agree to the revised Terms,
            you must stop using the Platform.
          </p>
        </section>

        <section>
          <h2>21. Contact</h2>
          <p>
            For questions, concerns, or notices regarding these Terms of Use:
          </p>
          <p>Email: support@forexinstincts.com</p>
        </section>
      </div>
    </div>
  );
}
