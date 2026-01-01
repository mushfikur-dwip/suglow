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
import { Search, Eye, Mail, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockCustomers = [
  {
    id: 1,
    name: "Fatima Rahman",
    email: "fatima@email.com",
    phone: "+880 1712-345678",
    orders: 12,
    totalSpent: 45000,
    status: "active",
    joinDate: "2025-06-15",
  },
  {
    id: 2,
    name: "Karim Ahmed",
    email: "karim@email.com",
    phone: "+880 1812-345678",
    orders: 5,
    totalSpent: 18000,
    status: "active",
    joinDate: "2025-08-20",
  },
  {
    id: 3,
    name: "Nadia Islam",
    email: "nadia@email.com",
    phone: "+880 1912-345678",
    orders: 28,
    totalSpent: 92000,
    status: "active",
    joinDate: "2025-03-10",
  },
  {
    id: 4,
    name: "Rahim Khan",
    email: "rahim@email.com",
    phone: "+880 1612-345678",
    orders: 2,
    totalSpent: 3500,
    status: "blocked",
    joinDate: "2025-11-05",
  },
];

const AdminCustomers = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Customers</p>
            <p className="text-2xl font-bold text-foreground">1,234</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Active Customers</p>
            <p className="text-2xl font-bold text-green-600">1,180</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">New This Month</p>
            <p className="text-2xl font-bold text-blue-600">87</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Blocked</p>
            <p className="text-2xl font-bold text-red-600">54</p>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search customers..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell>৳{customer.totalSpent.toLocaleString()}</TableCell>
                      <TableCell>{customer.joinDate}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            customer.status === "active"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-red-100 text-red-700 hover:bg-red-100"
                          }
                        >
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Ban className="w-4 h-4" />
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

export default AdminCustomers;
