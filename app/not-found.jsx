import { TbCompassOff } from "react-icons/tb";
import ButtonLink from "@/app/components/ui/ButtonLink";
import EmptyState from "@/app/components/ui/EmptyState";
import styles from "@/app/styles/signIn.module.css";

export default function NotFound() {
  return (
    <div className={styles.shell}>
      <EmptyState icon={TbCompassOff} title="This page drifted off the chart" message="The link may be old, or the page has moved." action={<ButtonLink href="/">Back to ForexInstincts</ButtonLink>} />
    </div>
  );
}
