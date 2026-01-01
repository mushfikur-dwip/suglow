import { Link } from "react-router-dom";
import {
  ShoppingBag,
  User,
  Shield,
  Ticket,
  Heart,
  Gift,
  Loader2,
} from "lucide-react";
import AccountLayout from "@/components/account/AccountLayout";
import { useProfile } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";

const quickLinks = [
  { icon: ShoppingBag, label: "My Orders", path: "/account/orders" },
  { icon: User, label: "Account Details", path: "/account/details" },
  { icon: Shield, label: "Verify Product", path: "/account/verify" },
  { icon: Ticket, label: "My Coupons", path: "/account/coupons" },
  { icon: Heart, label: "My WishList", path: "/account/wishlist" },
  { icon: Gift, label: "My Rewards", path: "/account/rewards" },
];

const Dashboard = () => {
  const { data: profileData, isLoading: loadingProfile } = useProfile();
  const { data: ordersData } = useOrders();
  
  const user = profileData?.data;
  const orders = ordersData?.data || [];
  const userName = user ? `${user.first_name} ${user.last_name}` : "Guest User";
  
  if (loadingProfile) {
    return (
      <AccountLayout title="Dashboard" breadcrumb="Dashboard">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title="Dashboard" breadcrumb="Dashboard">
      {/* Welcome Banner */}
      <div className="bg-pink-soft border border-primary/30 rounded-xl p-6 mb-8">
        <p className="text-muted-foreground">Hello,</p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          {userName}
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-background border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-foreground">{orders.length}</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter((o: any) => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-background border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Processing</p>
          <p className="text-2xl font-bold text-blue-600">
            {orders.filter((o: any) => o.status === 'processing').length}
          </p>
        </div>
        <div className="bg-background border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Delivered</p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter((o: any) => o.status === 'delivered').length}
          </p>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
