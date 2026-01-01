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
import { Search, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const mockStock = [
  {
    id: 1,
    name: "Vitamin C Serum",
    sku: "VCS-001",
    category: "Serums",
    currentStock: 50,
    minStock: 20,
    maxStock: 200,
    status: "in_stock",
  },
  {
    id: 2,
    name: "Hyaluronic Acid Moisturizer",
    sku: "HAM-002",
    category: "Moisturizers",
    currentStock: 15,
    minStock: 20,
    maxStock: 150,
    status: "low_stock",
  },
  {
    id: 3,
    name: "Retinol Night Cream",
    sku: "RNC-003",
    category: "Creams",
    currentStock: 0,
    minStock: 10,
    maxStock: 100,
    status: "out_of_stock",
  },
  {
    id: 4,
    name: "Sunscreen SPF 50",
    sku: "SUN-004",
    category: "Sun Care",
    currentStock: 100,
    minStock: 30,
    maxStock: 300,
    status: "in_stock",
  },
  {
    id: 5,
    name: "Niacinamide Serum",
    sku: "NCS-005",
    category: "Serums",
    currentStock: 8,
    minStock: 15,
    maxStock: 120,
    status: "low_stock",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "in_stock":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case "low_stock":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    case "out_of_stock":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    default:
      return "";
  }
};

const getStockPercentage = (current: number, max: number) => {
  return Math.min((current / max) * 100, 100);
};

const AdminStock = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">Stock Management</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="text-2xl font-bold text-foreground">156</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">In Stock</p>
            <p className="text-2xl font-bold text-green-600">120</p>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">24</p>
            </div>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">12</p>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="serums">Serums</SelectItem>
                  <SelectItem value="moisturizers">Moisturizers</SelectItem>
                  <SelectItem value="creams">Creams</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Current / Max</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStock.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="w-40">
                        <Progress
                          value={getStockPercentage(item.currentStock, item.maxStock)}
                          className={`h-2 ${
                            item.status === "out_of_stock"
                              ? "[&>div]:bg-red-500"
                              : item.status === "low_stock"
                              ? "[&>div]:bg-yellow-500"
                              : "[&>div]:bg-green-500"
                          }`}
                        />
                      </TableCell>
                      <TableCell>
                        {item.currentStock} / {item.maxStock}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(item.status)}>
                          {item.status === "in_stock"
                            ? "In Stock"
                            : item.status === "low_stock"
                            ? "Low Stock"
                            : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Update Stock
                        </Button>
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

export default AdminStock;
