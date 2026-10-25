import Badge from "@/app/components/ui/Badge";

const TONES = { running: { tone: "up", label: "Running", pulse: true }, stopped: { tone: "plain", label: "Stopped" }, halted: { tone: "warn", label: "Halted" }, error: { tone: "down", label: "Error" } };

export default function BotStatus({ status }) {
  const { tone, label, pulse } = TONES[status] ?? TONES.stopped;
  return (
    <Badge tone={tone} pulse={pulse}>
      {label}
    </Badge>
  );
}
