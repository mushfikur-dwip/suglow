import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, AlertTriangle, Loader2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { useStock, useStockStats, useUpdateStock } from "@/hooks/useStock";
import { toast } from "sonner";

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

const getStockPercentage = (current: number, threshold: number) => {
  if (current === 0) return 0;
  if (current <= threshold) return 50;
  return 100;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
  }).format(amount);
};

const AdminStock = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updateDialog, setUpdateDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stockQuantity, setStockQuantity] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("");

  const { data: stockData, isLoading } = useStock({ status: statusFilter, search: searchQuery });
  const { data: statsData } = useStockStats();
  const updateStockMutation = useUpdateStock();

  const products = stockData?.data || [];
  const stats = statsData?.data || {};

  const handleOpenUpdateDialog = (product: any) => {
    setSelectedProduct(product);
    setStockQuantity(String(product.stock_quantity));
    setLowStockThreshold(String(product.low_stock_threshold));
    setUpdateDialog(true);
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct) return;

    if (!stockQuantity || isNaN(Number(stockQuantity)) || Number(stockQuantity) < 0) {
      toast.error("Please enter a valid stock quantity");
      return;
    }

    try {
      await updateStockMutation.mutateAsync({
        id: selectedProduct.id,
        data: {
          stock_quantity: Number(stockQuantity),
          low_stock_threshold: Number(lowStockThreshold),
        },
      });

      toast.success("Stock updated successfully");
      setUpdateDialog(false);
      setSelectedProduct(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update stock");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">Stock Management</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            title="Total Products"
            value={stats.total_products || 0}
            icon={Package}
            change=""
            changeType="neutral"
          />
          <AdminStatCard
            title="In Stock"
            value={stats.in_stock || 0}
            icon={Package}
            change=""
            changeType="positive"
            valueClassName="text-green-600"
          />
          <AdminStatCard
            title="Low Stock"
            value={stats.low_stock || 0}
            icon={AlertTriangle}
            change=""
            changeType="warning"
            valueClassName="text-yellow-600"
          />
          <AdminStatCard
            title="Out of Stock"
            value={stats.out_of_stock || 0}
            icon={AlertTriangle}
            change=""
            changeType="negative"
            valueClassName="text-red-600"
          />
        </div>

        {stats.total_stock_value && (
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Stock Value</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(stats.total_stock_value)}
            </p>
          </Card>
        )}

        {/* Filters and Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name or SKU..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Current / Threshold</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.category_name || "—"}</TableCell>
                        <TableCell className="w-40">
                          <Progress
                            value={getStockPercentage(
                              item.stock_quantity,
                              item.low_stock_threshold
                            )}
                            className={`h-2 ${
                              item.stock_status === "out_of_stock"
                                ? "[&>div]:bg-red-500"
                                : item.stock_status === "low_stock"
                                ? "[&>div]:bg-yellow-500"
                                : "[&>div]:bg-green-500"
                            }`}
                          />
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              item.stock_quantity <= item.low_stock_threshold
                                ? "text-red-600 font-semibold"
                                : ""
                            }
                          >
                            {item.stock_quantity}
                          </span>{" "}
                          / {item.low_stock_threshold}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.sale_price || item.price)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(item.stock_status)}>
                            {item.stock_status === "in_stock"
                              ? "In Stock"
                              : item.stock_status === "low_stock"
                              ? "Low Stock"
                              : "Out of Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenUpdateDialog(item)}
                          >
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Stock Dialog */}
        <Dialog open={updateDialog} onOpenChange={setUpdateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Stock</DialogTitle>
              <DialogDescription>
                Update stock quantity and threshold for {selectedProduct?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="Enter stock quantity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                <Input
                  id="low_stock_threshold"
                  type="number"
                  min="0"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  placeholder="Enter threshold"
                />
                <p className="text-xs text-muted-foreground">
                  You'll be alerted when stock falls below this level
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setUpdateDialog(false)}
                  disabled={updateStockMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateStock}
                  disabled={updateStockMutation.isPending}
                >
                  {updateStockMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Stock"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminStock;
