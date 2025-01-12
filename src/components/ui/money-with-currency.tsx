import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

const MoneyWithCurrency = ({ amount }: { amount: number }) => {
  return (
    <div
      className={cn("text-right font-medium", {
        "text-destructive": amount < 0,
      })}
    >
      {formatCurrency(amount)}
    </div>
  );
};

export default MoneyWithCurrency;
