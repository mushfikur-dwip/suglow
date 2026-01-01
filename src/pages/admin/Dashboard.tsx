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

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
  { name: "Jul", sales: 7000 },
];

const orderSummaryData = [
  { name: "Delivered", value: 45, color: "#22c55e" },
  { name: "Cancelled", value: 10, color: "#ef4444" },
  { name: "Pending", value: 25, color: "#f59e0b" },
  { name: "Returned", value: 5, color: "#8b5cf6" },
];

const AdminDashboard = () => {
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
            value="৳0.00"
            icon={DollarSign}
            variant="pink"
          />
          <AdminStatCard
            title="Total Orders"
            value="0"
            icon={ShoppingBag}
            variant="orange"
          />
          <AdminStatCard
            title="Total Customers"
            value="1"
            icon={Users}
            variant="purple"
          />
          <AdminStatCard
            title="Total Products"
            value="0"
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
                value="0"
                icon={ShoppingBag}
                iconBgColor="bg-pink-100"
                iconColor="text-primary"
              />
              <OrderStatItem
                title="Pending"
                value="0"
                icon={Clock}
                iconBgColor="bg-orange-100"
                iconColor="text-orange-500"
              />
              <OrderStatItem
                title="Confirmed"
                value="0"
                icon={CheckCircle}
                iconBgColor="bg-green-100"
                iconColor="text-green-500"
              />
              <OrderStatItem
                title="Ongoing"
                value="0"
                icon={TrendingUp}
                iconBgColor="bg-blue-100"
                iconColor="text-blue-500"
              />
              <OrderStatItem
                title="Delivered"
                value="0"
                icon={Truck}
                iconBgColor="bg-cyan-100"
                iconColor="text-cyan-500"
              />
              <OrderStatItem
                title="Cancelled"
                value="0"
                icon={XCircle}
                iconBgColor="bg-red-100"
                iconColor="text-red-500"
              />
              <OrderStatItem
                title="Returned"
                value="0"
                icon={RotateCcw}
                iconBgColor="bg-purple-100"
                iconColor="text-purple-500"
              />
              <OrderStatItem
                title="Rejected"
                value="0"
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
                    <p className="text-xl font-bold">৳0.00</p>
                    <p className="text-xs text-muted-foreground">Total Sales</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xl font-bold">৳0.00</p>
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
                    <p className="text-2xl font-bold">0</p>
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
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
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
