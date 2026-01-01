import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatItemProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

const OrderStatItem = ({ title, value, icon: Icon, iconBgColor, iconColor }: OrderStatItemProps) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-background rounded-xl">
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", iconBgColor)}>
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
};

export default OrderStatItem;
