import AdminLayout from "@/components/admin/AdminLayout";
import AdminStatCard from "@/components/admin/AdminStatCard";
import OrderStatItem from "@/components/admin/OrderStatItem";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RotateCcw,
  Ban,
  AlertTriangle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useDashboardStats } from "@/hooks/useAdmin";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  // Prepare sales data from backend
  const salesByDay = stats?.data?.salesByDay || [];
  const salesData = salesByDay.map((day: any) => ({
    name: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sales: parseFloat(day.revenue) || 0
  }));

  // Calculate order status counts
  const orderStatusCounts: Record<string, number> = {};
  (stats?.data?.orderStatusCount || []).forEach((item: any) => {
    orderStatusCounts[item.status] = parseInt(item.count);
  });

  const totalOrdersCount = Object.values(orderStatusCounts).reduce((a: any, b: any) => a + b, 0);

  // Prepare order summary data for pie chart
  const orderSummaryData = [
    { name: "Delivered", value: orderStatusCounts.delivered || 0, color: "#22c55e" },
    { name: "Cancelled", value: orderStatusCounts.cancelled || 0, color: "#ef4444" },
    { name: "Pending", value: orderStatusCounts.pending || 0, color: "#f59e0b" },
    { name: "Processing", value: orderStatusCounts.processing || 0, color: "#3b82f6" },
  ];

  // Calculate total sales and average
  const totalSales = salesData.reduce((sum: number, day: any) => sum + day.sales, 0);
  const avgSalesPerDay = salesData.length > 0 ? totalSales / salesData.length : 0;
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            title="Total Earnings"
            value={`৳${(stats?.data?.stats?.totalRevenue || 0).toLocaleString()}`}
            icon={DollarSign}
            variant="pink"
          />
          <AdminStatCard
            title="Total Orders"
            value={stats?.data?.stats?.totalOrders?.toString() || "0"}
            icon={ShoppingBag}
            variant="orange"
          />
          <AdminStatCard
            title="Total Customers"
            value={stats?.data?.stats?.totalCustomers?.toString() || "0"}
            icon={Users}
            variant="purple"
          />
          <AdminStatCard
            title="Total Products"
            value={stats?.data?.stats?.totalProducts?.toString() || "0"}
            icon={Package}
            variant="red"
          />
        </div>

        {/* Order Statistics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Order Statistics</CardTitle>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Date Range" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <OrderStatItem
                title="Total Orders"
                value={stats?.data?.stats?.totalOrders?.toString() || "0"}
                icon={ShoppingBag}
                iconBgColor="bg-pink-100"
                iconColor="text-primary"
              />
              <OrderStatItem
                title="Pending"
                value={orderStatusCounts.pending?.toString() || "0"}
                icon={Clock}
                iconBgColor="bg-orange-100"
                iconColor="text-orange-500"
              />
              <OrderStatItem
                title="Processing"
                value={orderStatusCounts.processing?.toString() || "0"}
                icon={CheckCircle}
                iconBgColor="bg-green-100"
                iconColor="text-green-500"
              />
              <OrderStatItem
                title="Shipped"
                value={orderStatusCounts.shipped?.toString() || "0"}
                icon={TrendingUp}
                iconBgColor="bg-blue-100"
                iconColor="text-blue-500"
              />
              <OrderStatItem
                title="Delivered"
                value={orderStatusCounts.delivered?.toString() || "0"}
                icon={Truck}
                iconBgColor="bg-cyan-100"
                iconColor="text-cyan-500"
              />
              <OrderStatItem
                title="Cancelled"
                value={orderStatusCounts.cancelled?.toString() || "0"}
                icon={XCircle}
                iconBgColor="bg-red-100"
                iconColor="text-red-500"
              />
              <OrderStatItem
                title="Returned"
                value={orderStatusCounts.returned?.toString() || "0"}
                icon={RotateCcw}
                iconBgColor="bg-purple-100"
                iconColor="text-purple-500"
              />
              <OrderStatItem
                title="Rejected"
                value={orderStatusCounts.rejected?.toString() || "0"}
                icon={Ban}
                iconBgColor="bg-rose-100"
                iconColor="text-rose-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Sales Summary</CardTitle>
              <Button variant="outline" size="sm">
                01/01/2026 - 01/31/2026
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xl font-bold">৳{totalSales.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Sales (Last 7 Days)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xl font-bold">৳{avgSalesPerDay.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Avg Sales Per Day</p>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Orders Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Orders Summary</CardTitle>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Date Range" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderSummaryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {orderSummaryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{totalOrdersCount}</p>
                  </div>
                </div>
                <div className="ml-6 space-y-3">
                  {orderSummaryData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.data?.recentOrders || []).length > 0 ? (
                    stats.data.recentOrders.map((order: any) => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 text-sm font-medium">#{order.order_number}</td>
                        <td className="py-3 px-4 text-sm">
                          {order.first_name} {order.last_name}
                          <br />
                          <span className="text-xs text-muted-foreground">{order.email || order.guest_email}</span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">৳{order.total_amount}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : order.status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'shipped'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
