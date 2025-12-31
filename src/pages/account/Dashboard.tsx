import { Link } from "react-router-dom";
import {
  ShoppingBag,
  User,
  Shield,
  Ticket,
  Heart,
  Gift,
} from "lucide-react";
import AccountLayout from "@/components/account/AccountLayout";

const quickLinks = [
  { icon: ShoppingBag, label: "My Orders", path: "/account/orders" },
  { icon: User, label: "Account Details", path: "/account/details" },
  { icon: Shield, label: "Verify Product", path: "/account/verify" },
  { icon: Ticket, label: "My Coupons", path: "/account/coupons" },
  { icon: Heart, label: "My WishList", path: "/account/wishlist" },
  { icon: Gift, label: "My Rewards", path: "/account/rewards" },
];

const Dashboard = () => {
  const userName = "Tajlina Sultana Nira"; // Mock user name

  return (
    <AccountLayout title="Dashboard" breadcrumb="Dashboard">
      {/* Welcome Banner */}
      <div className="bg-pink-soft border border-primary/30 rounded-xl p-6 mb-8">
        <p className="text-muted-foreground">Hello,</p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          {userName}
        </h2>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center gap-3 p-6 bg-background border border-border rounded-xl hover:border-primary hover:shadow-card transition-all"
          >
            <item.icon className="w-8 h-8 text-foreground" />
            <span className="text-sm font-medium text-foreground text-center">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </AccountLayout>
  );
};

export default Dashboard;
