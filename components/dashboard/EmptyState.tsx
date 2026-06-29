import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="premium-card flex min-h-64 flex-col items-center justify-center p-8 text-center">
      <PlusCircle size={38} className="mb-4 text-text-accent" />
      <h3 className="text-lg">No payments yet</h3>
      <p className="mb-5 max-w-sm text-sm text-text-secondary">Start the treasury ledger with the first recorded clan payment.</p>
      <Button onClick={onAdd}>Add First Payment</Button>
    </div>
  );
}
