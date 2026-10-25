import { TbPlus, TbRobot } from "react-icons/tb";
import BotList from "@/app/components/app/BotList";
import ButtonLink from "@/app/components/ui/ButtonLink";
import EmptyState from "@/app/components/ui/EmptyState";
import Panel from "@/app/components/ui/Panel";
import { request } from "@/app/lib/session";
import styles from "@/app/styles/appPage.module.css";

export const metadata = { title: "Bots" };

export default async function BotsPage() {
  const bots = (await request("/web/bots")).data ?? [];

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1>
            Your <span className="gradient-text">bots</span>
          </h1>
          <p>Running bots trade on our servers even when this page is closed. Stopped bots keep their history.</p>
        </div>
        <div className={styles.actions}>
          <ButtonLink href="/marketplace" variant="glass">
            Marketplace
          </ButtonLink>
          <ButtonLink href="/bots/new" icon={TbPlus}>
            New bot
          </ButtonLink>
        </div>
      </header>
      <Panel padded={false}>{bots.length ? <BotList bots={bots} /> : <EmptyState icon={TbRobot} title="No bots yet" message="Pick a researched strategy, set your limits and start on demo." action={<ButtonLink href="/bots/new" icon={TbPlus}>Build your first bot</ButtonLink>} />}</Panel>
    </>
  );
}
