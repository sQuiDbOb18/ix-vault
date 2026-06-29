import { Loader2 } from "lucide-react";

export function Spinner({ label = "Loading" }: { label?: string }) {
  return <Loader2 aria-label={label} className="animate-spin text-text-accent" size={20} />;
}
