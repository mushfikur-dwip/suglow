import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  Star,
  Monitor,
  ClipboardList,
  Ticket,
  Gift,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  children?: { label: string; path: string }[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: "",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    ],
  },
  {
    title: "PRODUCT & STOCK",
    items: [
      { icon: Package, label: "Products", path: "/admin/products" },
      { icon: ShoppingCart, label: "Purchase", path: "/admin/purchase" },
      { icon: Warehouse, label: "Stock", path: "/admin/stock" },
      { icon: Star, label: "Reviews", path: "/admin/reviews" },
    ],
  },
  {
    title: "ORDERS",
    items: [
      // { icon: Monitor, label: "POS", path: "/admin/pos" }, // Commented out temporarily
      { 
        icon: ClipboardList, 
        label: "Order Management",
        children: [
          { label: "Online Orders", path: "/admin/online-orders" },
          // { label: "POS Orders", path: "/admin/pos-orders" }, // Commented out temporarily
          { label: "Return Orders", path: "/admin/return-orders" },
          { label: "Return And Refunds", path: "/admin/refunds" },
        ],
      },
    ],
  },
  {
    title: "PROMO",
    items: [
      { icon: Ticket, label: "Coupons", path: "/admin/coupons" },
      { icon: Gift, label: "Promotions", path: "/admin/promotions" },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { icon: Users, label: "Customers", path: "/admin/customers" },
      { icon: Settings, label: "Settings", path: "/admin/settings" },
    ],
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar = ({ isOpen, onToggle }: AdminSidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-background border-r border-border transition-all duration-300 flex flex-col",
          isOpen ? "w-64" : "w-0 lg:w-20",
          "lg:relative"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "h-16 flex items-center border-b border-border px-4",
          !isOpen && "lg:justify-center"
        )}>
          {isOpen ? (
            <Link to="/admin" className="flex items-center gap-2">
              <span className="font-display text-xl font-bold text-primary">suGlow</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </Link>
          ) : (
            <Link to="/admin" className="hidden lg:block">
              <span className="font-display text-xl font-bold text-primary">K</span>
            </Link>
          )}
          <button
            onClick={onToggle}
            className="ml-auto lg:hidden p-2 hover:bg-secondary rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 overflow-y-auto py-4",
          !isOpen && "hidden lg:block"
        )}>
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4">
              {group.title && isOpen && (
                <p className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </p>
              )}
              <ul className="space-y-1 px-2">
                {group.items.map((item) => (
                  <li key={item.label}>
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => toggleExpand(item.label)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                            "text-muted-foreground hover:bg-secondary hover:text-foreground",
                            !isOpen && "lg:justify-center"
                          )}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          {isOpen && (
                            <>
                              <span className="flex-1 text-left text-sm font-medium">
                                {item.label}
                              </span>
                              <ChevronDown
                                className={cn(
                                  "w-4 h-4 transition-transform",
                                  expandedItems.includes(item.label) && "rotate-180"
                                )}
                              />
                            </>
                          )}
                        </button>
                        {isOpen && expandedItems.includes(item.label) && (
                          <ul className="mt-1 ml-8 space-y-1">
                            {item.children.map((child) => (
                              <li key={child.path}>
                                <Link
                                  to={child.path}
                                  className={cn(
                                    "block px-3 py-2 rounded-lg text-sm transition-colors",
                                    isActive(child.path)
                                      ? "bg-primary text-primary-foreground"
                                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                  )}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.path || "#"}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                          isActive(item.path)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                          !isOpen && "lg:justify-center"
                        )}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {isOpen && (
                          <span className="text-sm font-medium">{item.label}</span>
                        )}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className={cn(
          "border-t border-border p-2",
          !isOpen && "hidden lg:block"
        )}>
          <Link
            to="/admin/login"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
              "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
              !isOpen && "lg:justify-center"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
