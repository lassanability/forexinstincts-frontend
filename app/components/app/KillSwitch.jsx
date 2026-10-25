"use client";

import { useState, useTransition } from "react";
import { TbAlertOctagon } from "react-icons/tb";
import { killAll } from "@/app/actions/trading";
import Button from "@/app/components/ui/Button";
import { toast } from "@/app/stores/toast";

export default function KillSwitch() {
  const [armed, setArmed] = useState(false);
  const [pending, start] = useTransition();

  const fire = () => {
    if (!armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 4000);
      return;
    }
    start(async () => {
      const result = await killAll();
      setArmed(false);
      if (result.error) toast.error(result.error);
      else toast.success(result.message);
    });
  };

  return (
    <Button variant="danger" size="sm" icon={TbAlertOctagon} loading={pending} onClick={fire} aria-label="Kill switch: stop every bot and close every trade">
      {armed ? "Tap again to close everything" : "Kill switch"}
    </Button>
  );
}
