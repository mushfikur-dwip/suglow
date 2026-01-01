import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockOrders = [
  {
    id: "ORD-001",
    customer: "Fatima Rahman",
    date: "2026-01-01",
    amount: 3500,
    items: 3,
    status: "pending",
    payment: "bKash",
  },
  {
    id: "ORD-002",
    customer: "Karim Ahmed",
    date: "2026-01-01",
    amount: 1800,
    items: 1,
    status: "confirmed",
    payment: "COD",
  },
  {
    id: "ORD-003",
    customer: "Nadia Islam",
    date: "2025-12-31",
    amount: 5200,
    items: 4,
    status: "delivered",
    payment: "Nagad",
  },
  {
    id: "ORD-004",
    customer: "Rahim Khan",
    date: "2025-12-30",
    amount: 900,
    items: 1,
    status: "cancelled",
    payment: "bKash",
  },
];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    confirmed: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    delivered: "bg-green-100 text-green-700 hover:bg-green-100",
    cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
    ongoing: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  };
  return styles[status] || "";
};

const AdminOnlineOrders = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">Online Orders</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search orders..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All Payment</SelectItem>
                  <SelectItem value="cod">COD</SelectItem>
                  <SelectItem value="bkash">bKash</SelectItem>
                  <SelectItem value="nagad">Nagad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>৳{order.amount}</TableCell>
                      <TableCell>{order.payment}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Printer className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOnlineOrders;
