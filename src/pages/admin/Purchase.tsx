import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus, Package, Truck, DollarSign, Clock, Eye, FileText, Loader2, Trash2 } from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { usePurchaseOrders, usePurchaseStats, useUpdatePurchaseStatus, useDeletePurchaseOrder } from "@/hooks/usePurchase";
import { toast } from "sonner";
import { format } from "date-fns";

const Purchase = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);

  const { data: purchaseData, isLoading } = usePurchaseOrders({
    search: searchQuery,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const { data: statsData } = usePurchaseStats();
  const updateStatusMutation = useUpdatePurchaseStatus();
  const deleteOrderMutation = useDeletePurchaseOrder();

  const stats = [
    {
      title: "Total Purchases",
      value: `৳${(statsData?.data?.total_purchases || 0).toLocaleString()}`,
      icon: DollarSign,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Pending Orders",
      value: String(statsData?.data?.pending_orders || 0),
      icon: Clock,
      change: "2 urgent",
      changeType: "neutral" as const,
    },
    {
      title: "Items Received",
      value: String(statsData?.data?.items_received || 0),
      icon: Package,
      change: "+15%",
      changeType: "positive" as const,
    },
    {
      title: "Active Suppliers",
      value: String(statsData?.data?.active_suppliers || 0),
      icon: Truck,
      change: "+2",
      changeType: "positive" as const,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Received</Badge>;
      case "in_transit":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">In Transit</Badge>;
      case "approved":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const handleUpdateStatus = () => {
    if (!selectedOrder || !newStatus) return;

    const data: any = { status: newStatus };
    if (newStatus === "received") {
      data.received_date = new Date().toISOString().split("T")[0];
    }

    updateStatusMutation.mutate(
      { id: selectedOrder.id, data },
      {
        onSuccess: () => {
          toast.success("Purchase order status updated successfully");
          setShowStatusDialog(false);
          setSelectedOrder(null);
          setNewStatus("");
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to update status");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteOrderId) return;

    deleteOrderMutation.mutate(deleteOrderId, {
      onSuccess: () => {
        toast.success("Purchase order deleted successfully");
        setDeleteOrderId(null);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete purchase order");
      },
    });
  };

  const handleViewDetails = (id: number) => {
    navigate(`/admin/purchase/${id}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Purchase Orders</h1>
            <p className="text-muted-foreground">Manage inventory purchases and supplier orders</p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate("/admin/purchase/new")}
          >
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
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="hidden md:table-cell">Order Date</TableHead>
                      <TableHead className="hidden lg:table-cell">Expected Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseData?.data?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No purchase orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      purchaseData?.data?.map((purchase: any) => (
                        <TableRow key={purchase.id}>
                          <TableCell className="font-medium">{purchase.order_number}</TableCell>
                          <TableCell>{purchase.supplier_name}</TableCell>
                          <TableCell>{purchase.total_items} items</TableCell>
                          <TableCell className="font-semibold">৳{Number(purchase.total_amount).toLocaleString()}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {format(new Date(purchase.order_date), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {purchase.expected_delivery_date
                              ? format(new Date(purchase.expected_delivery_date), "MMM dd, yyyy")
                              : "-"}
                          </TableCell>
                          <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => handleViewDetails(purchase.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => {
                                  setSelectedOrder(purchase);
                                  setNewStatus(purchase.status);
                                  setShowStatusDialog(true);
                                }}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              {purchase.status === "pending" && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-red-600 hover:text-red-700"
                                  onClick={() => setDeleteOrderId(purchase.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Update Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of purchase order {selectedOrder?.order_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteOrderId} onOpenChange={() => setDeleteOrderId(null)}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Delete Purchase Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this purchase order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOrderId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteOrderMutation.isPending}
            >
              {deleteOrderMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Purchase;
