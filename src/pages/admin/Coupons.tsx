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
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockCoupons = [
  {
    id: 1,
    code: "NEWYEAR26",
    type: "percentage",
    value: 20,
    minOrder: 1000,
    usageLimit: 100,
    used: 45,
    status: "active",
    expiry: "2026-01-31",
  },
  {
    id: 2,
    code: "FLAT500",
    type: "fixed",
    value: 500,
    minOrder: 2000,
    usageLimit: 50,
    used: 32,
    status: "active",
    expiry: "2026-02-15",
  },
  {
    id: 3,
    code: "WINTER25",
    type: "percentage",
    value: 25,
    minOrder: 1500,
    usageLimit: 200,
    used: 200,
    status: "exhausted",
    expiry: "2025-12-31",
  },
  {
    id: 4,
    code: "FREESHIP",
    type: "shipping",
    value: 0,
    minOrder: 500,
    usageLimit: 1000,
    used: 156,
    status: "active",
    expiry: "2026-03-31",
  },
];

const AdminCoupons = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">Coupons</h1>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Coupon
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Coupons</p>
            <p className="text-2xl font-bold text-foreground">24</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Active Coupons</p>
            <p className="text-2xl font-bold text-green-600">18</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Used</p>
            <p className="text-2xl font-bold text-blue-600">1,234</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Expired</p>
            <p className="text-2xl font-bold text-red-600">6</p>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search coupons..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="shipping">Free Shipping</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="exhausted">Exhausted</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Min Order</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium font-mono">{coupon.code}</TableCell>
                      <TableCell className="capitalize">{coupon.type}</TableCell>
                      <TableCell>
                        {coupon.type === "percentage"
                          ? `${coupon.value}%`
                          : coupon.type === "fixed"
                          ? `৳${coupon.value}`
                          : "Free"}
                      </TableCell>
                      <TableCell>৳{coupon.minOrder}</TableCell>
                      <TableCell>
                        {coupon.used}/{coupon.usageLimit}
                      </TableCell>
                      <TableCell>{coupon.expiry}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            coupon.status === "active"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : coupon.status === "exhausted"
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                              : "bg-red-100 text-red-700 hover:bg-red-100"
                          }
                        >
                          {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="w-4 h-4" />
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

export default AdminCoupons;
