import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  Shield,
  Ticket,
  Heart,
  Gift,
  LogOut,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/account" },
  { icon: ShoppingBag, label: "My Orders", path: "/account/orders" },
  { icon: User, label: "Account Details", path: "/account/details" },
  { icon: Shield, label: "Verify Product", path: "/account/verify" },
  { icon: Ticket, label: "My Coupons", path: "/account/coupons" },
  { icon: Heart, label: "My WishList", path: "/account/wishlist" },
  { icon: Gift, label: "My Rewards", path: "/account/rewards" },
];

const AccountSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <nav className="bg-background rounded-xl overflow-hidden">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-5 py-4 transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary/50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
        <button className="w-full flex items-center gap-3 px-5 py-4 text-foreground hover:bg-secondary/50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
