import styles from "@/app/style/botInstallGuide.module.css";
import { IoHelpCircleOutline as GuideIcon } from "react-icons/io5";

const HOW_TO_STEPS = [
  {
    title: "Download Your Bot File",
    desc: "Click the MT4 or MT5 download button on your bot card above. You will receive a .mq4 or .mq5 source file.",
  },
  {
    title: "Open MetaTrader Data Folder",
    desc: "In MetaTrader, go to File → Open Data Folder. Navigate to MQL4/Experts (for MT4) or MQL5/Experts (for MT5).",
  },
  {
    title: "Copy the EA File",
    desc: "Paste the downloaded .mq4 or .mq5 file into the Experts folder you just opened.",
  },
  {
    title: "Compile in MetaEditor",
    desc: "Press F4 in MetaTrader to open MetaEditor. Open your EA file, then press F7 to compile. Wait for '0 error(s)' in the output at the bottom. This step is required — without it, MetaTrader will not recognise the bot.",
  },
  {
    title: "Refresh the Navigator",
    desc: "Switch back to MetaTrader, then right-click Navigator → Expert Advisors → Refresh (or press Ctrl+R). Your compiled bot will now appear in the list.",
  },
  {
    title: "Attach to a Chart",
    desc: "Drag your bot from Navigator → Expert Advisors onto the chart matching the symbol and timeframe you configured.",
  },
  {
    title: "Enable AutoTrading",
    desc: 'Check "Allow automated trading" in the EA settings popup, then click the AutoTrading button in the toolbar (or press Ctrl+E). A green smiley face on the chart confirms the bot is live.',
  },
];

export default function BotInstallGuide() {
  return (
    <div className={styles.howToSection}>
      <div className={styles.howToHeader}>
        <div className={styles.howToIconWrap}>
          <GuideIcon />
        </div>
        <div>
          <h2>How to Install Your Bot</h2>
          <p>
            Expert Advisors only run on the <strong>Windows desktop</strong> version of MetaTrader 4 or 5 — not on the mobile app. If you trade on your phone, install MT4/MT5 on a Windows PC or rent a VPS to run the bot.
          </p>
        </div>
      </div>
      <div className={styles.howToSteps}>
        {HOW_TO_STEPS.map((step, i) => (
          <div key={i} className={styles.howToStep}>
            <div className={styles.howToStepNum}>{i + 1}</div>
            <div className={styles.howToStepContent}>
              <strong>{step.title}</strong>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <p className={styles.howToNote}>
        If the bot shows a grey frowning face, check that AutoTrading is enabled in the toolbar and that &quot;Allow automated trading&quot; was checked when you attached it.
      </p>
    </div>
  );
}
