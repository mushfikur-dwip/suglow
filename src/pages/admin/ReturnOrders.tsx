import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Eye, Package, RotateCcw, Clock, Loader2 } from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { useReturns, useReturnStats } from "@/hooks/useReturns";
import { useAdminOrderDetails } from "@/hooks/useOrders";
import { format } from "date-fns";

const getPaymentStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    paid: "bg-green-100 text-green-700 hover:bg-green-100",
    refunded: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    failed: "bg-red-100 text-red-700 hover:bg-red-100",
  };
  return styles[status] || "";
};

const AdminReturnOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [viewDialog, setViewDialog] = useState(false);

  const { data: returnsData, isLoading } = useReturns({
    search: searchQuery,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const { data: statsData } = useReturnStats();
  const { data: orderDetailsData } = useAdminOrderDetails(selectedReturn?.id);

  const returns = returnsData?.data || [];
  const stats = statsData?.data || {};

  const handleViewOrder = (returnOrder: any) => {
    setSelectedReturn(returnOrder);
    setViewDialog(true);
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount || isNaN(amount)) return "৳0.00";
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Return Orders</h1>
            <p className="text-muted-foreground">View and manage product return requests</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            title="Total Returns"
            value={stats.total_returns || 0}
            icon={RotateCcw}
            change=""
            changeType="neutral"
          />
          <AdminStatCard
            title="Pending Refunds"
            value={stats.pending_refunds || 0}
            icon={Clock}
            change=""
            changeType="warning"
          />
          <AdminStatCard
            title="This Month"
            value={stats.this_month_returns || 0}
            icon={Package}
            change=""
            changeType="neutral"
          />
          <AdminStatCard
            title="Total Value"
            value={formatCurrency(stats.total_refunded_amount)}
            icon={Package}
            change=""
            changeType="neutral"
          />
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by order number, customer name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending Refund</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : returns.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No return orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {returns.map((returnOrder: any) => (
                      <TableRow key={returnOrder.id}>
                        <TableCell className="font-medium">#{returnOrder.order_number}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{returnOrder.customer_name || "Guest"}</span>
                            <span className="text-sm text-muted-foreground">{returnOrder.customer_email || returnOrder.guest_email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(returnOrder.updated_at), "MMM dd, yyyy")}</TableCell>
                        <TableCell>{returnOrder.item_count} items</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(parseFloat(returnOrder.total_amount))}</TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusBadge(returnOrder.payment_status)} variant="secondary">
                            {returnOrder.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrder(returnOrder)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
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

        {/* Order Details Dialog */}
        <Dialog open={viewDialog} onOpenChange={setViewDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Return Order Details #{selectedReturn?.order_number || selectedReturn?.id}</DialogTitle>
              <DialogDescription>
                View complete information about this returned order
              </DialogDescription>
            </DialogHeader>
            {selectedReturn && orderDetailsData?.data && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{orderDetailsData.data.customer_name || "Guest"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{orderDetailsData.data.customer_email || orderDetailsData.data.guest_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{orderDetailsData.data.customer_phone || orderDetailsData.data.shipping_address?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">{format(new Date(orderDetailsData.data.created_at), "PPp")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">{orderDetailsData.data.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <Badge className={getPaymentStatusBadge(orderDetailsData.data.payment_status)}>
                      {orderDetailsData.data.payment_status}
                    </Badge>
                  </div>
                </div>

                {orderDetailsData.data.shipping_address && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Shipping Address</p>
                    <div className="text-sm bg-muted/50 p-3 rounded-md">
                      <p className="font-medium">{orderDetailsData.data.shipping_address.first_name} {orderDetailsData.data.shipping_address.last_name}</p>
                      <p>{orderDetailsData.data.shipping_address.address_line1}</p>
                      {orderDetailsData.data.shipping_address.address_line2 && <p>{orderDetailsData.data.shipping_address.address_line2}</p>}
                      <p>{orderDetailsData.data.shipping_address.city}, {orderDetailsData.data.shipping_address.state} {orderDetailsData.data.shipping_address.postal_code}</p>
                      <p>{orderDetailsData.data.shipping_address.country || "Bangladesh"}</p>
                      {orderDetailsData.data.shipping_address.phone && <p className="mt-1 text-muted-foreground">Phone: {orderDetailsData.data.shipping_address.phone}</p>}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold mb-3">Returned Items</p>
                  <div className="border rounded-lg divide-y">
                    {orderDetailsData.data?.items?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3">
                        <div className="flex-1">
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × {formatCurrency(parseFloat(item.price))}
                          </p>
                        </div>
                        <p className="font-semibold">{formatCurrency(item.quantity * parseFloat(item.price))}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(parseFloat(orderDetailsData.data.subtotal))}</span>
                  </div>
                  {parseFloat(orderDetailsData.data.discount_amount || 0) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>- {formatCurrency(parseFloat(orderDetailsData.data.discount_amount))}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatCurrency(parseFloat(orderDetailsData.data.shipping_cost))}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total Amount</span>
                    <span>{formatCurrency(parseFloat(orderDetailsData.data.total_amount))}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminReturnOrders;
