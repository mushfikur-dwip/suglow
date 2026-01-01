import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Package, Truck, DollarSign, Clock, Eye, FileText, Download } from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";

const Purchase = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { title: "Total Purchases", value: "৳2,45,000", icon: DollarSign, change: "+8%", changeType: "positive" as const },
    { title: "Pending Orders", value: "8", icon: Clock, change: "2 urgent", changeType: "neutral" as const },
    { title: "Items Received", value: "1,234", icon: Package, change: "+15%", changeType: "positive" as const },
    { title: "Active Suppliers", value: "12", icon: Truck, change: "+2", changeType: "positive" as const },
  ];

  const purchases = [
    {
      id: "PO-001",
      supplier: "Beauty Wholesale BD",
      items: 25,
      total: 45000,
      orderDate: "2024-01-10",
      expectedDate: "2024-01-18",
      status: "received",
    },
    {
      id: "PO-002",
      supplier: "Cosmetics Import Ltd",
      items: 50,
      total: 85000,
      orderDate: "2024-01-12",
      expectedDate: "2024-01-20",
      status: "in_transit",
    },
    {
      id: "PO-003",
      supplier: "Skin Care Suppliers",
      items: 30,
      total: 32000,
      orderDate: "2024-01-14",
      expectedDate: "2024-01-22",
      status: "pending",
    },
    {
      id: "PO-004",
      supplier: "Natural Products Co",
      items: 15,
      total: 18500,
      orderDate: "2024-01-15",
      expectedDate: "2024-01-25",
      status: "pending",
    },
    {
      id: "PO-005",
      supplier: "Beauty Wholesale BD",
      items: 40,
      total: 62000,
      orderDate: "2024-01-08",
      expectedDate: "2024-01-16",
      status: "received",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received":
        return <Badge className="bg-green-100 text-green-800">Received</Badge>;
      case "in_transit":
        return <Badge className="bg-blue-100 text-blue-800">In Transit</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Purchase Orders</h1>
            <p className="text-muted-foreground">Manage inventory purchases and supplier orders</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            New Purchase Order
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <AdminStatCard key={index} {...stat} />
          ))}
        </div>

        {/* Purchase Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>All Purchase Orders</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="hidden md:table-cell">Expected Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.id}</TableCell>
                    <TableCell>{purchase.supplier}</TableCell>
                    <TableCell>{purchase.items} items</TableCell>
                    <TableCell className="font-semibold">৳{purchase.total.toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell">{purchase.expectedDate}</TableCell>
                    <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Purchase;
