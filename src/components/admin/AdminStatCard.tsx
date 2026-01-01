import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "pink" | "orange" | "purple" | "red" | "green" | "blue" | "yellow" | "cyan";
}

const variantClasses = {
  pink: "bg-gradient-to-r from-primary to-primary/80",
  orange: "bg-gradient-to-r from-orange-500 to-orange-400",
  purple: "bg-gradient-to-r from-purple-600 to-purple-500",
  red: "bg-gradient-to-r from-red-500 to-red-400",
  green: "bg-gradient-to-r from-emerald-500 to-emerald-400",
  blue: "bg-gradient-to-r from-blue-500 to-blue-400",
  yellow: "bg-gradient-to-r from-yellow-500 to-yellow-400",
  cyan: "bg-gradient-to-r from-cyan-500 to-cyan-400",
};

const AdminStatCard = ({ title, value, icon: Icon, variant = "pink" }: StatCardProps) => {
  return (
    <div className={cn(
      "p-5 rounded-xl text-white",
      variantClasses[variant]
    )}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminStatCard;
