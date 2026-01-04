import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Eye, Users, UserCheck, UserX, Award, Loader2, ShoppingBag, MapPin, Plus, Edit } from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { useCustomers, useCustomerStats, useCustomerDetails, useCreateCustomer, useUpdateCustomer, useUpdateCustomerStatus } from "@/hooks/useCustomers";
import { toast } from "sonner";
import { format } from "date-fns";

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-700 hover:bg-green-100",
    inactive: "bg-gray-100 text-gray-700 hover:bg-gray-100",
    blocked: "bg-red-100 text-red-700 hover:bg-red-100",
  };
  return styles[status] || "";
};

const AdminCustomers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [formDialog, setFormDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [statusDialog, setStatusDialog] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    status: "active"
  });

  const { data: customersData, isLoading } = useCustomers({
    search: searchQuery,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const { data: statsData } = useCustomerStats();
  const { data: customerDetailsData } = useCustomerDetails(selectedCustomer?.id);
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const updateStatusMutation = useUpdateCustomerStatus();

  const customers = customersData?.data || [];
  const stats = statsData?.data || {};

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setViewDialog(true);
  };

  const handleAddCustomer = () => {
    setEditMode(false);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      status: "active"
    });
    setFormDialog(true);
  };

  const handleEditCustomer = (customer: any) => {
    setEditMode(true);
    setSelectedCustomer(customer);
    setFormData({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone || "",
      password: "", // Don't pre-fill password
      status: customer.status
    });
    setFormDialog(true);
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error("First name, last name, and email are required");
      return;
    }

    if (!editMode && !formData.password) {
      toast.error("Password is required for new customers");
      return;
    }

    if (editMode) {
      // Update existing customer
      const updateData: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
      };

      // Only include password if it's been changed
      if (formData.password && formData.password.trim() !== "") {
        updateData.password = formData.password;
      }

      updateMutation.mutate(
        { id: selectedCustomer.id, data: updateData },
        {
          onSuccess: () => {
            toast.success("Customer updated successfully");
            setFormDialog(false);
            setSelectedCustomer(null);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update customer");
          },
        }
      );
    } else {
      // Create new customer
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Customer created successfully");
          setFormDialog(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to create customer");
        },
      });
    }
  };

  const handleUpdateStatus = () => {
    if (!statusDialog || !newStatus) return;

    updateStatusMutation.mutate(
      { id: statusDialog.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success("Customer status updated successfully");
          setStatusDialog(null);
          setNewStatus("");
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to update customer status");
        },
      }
    );
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
            <h1 className="text-2xl font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground">Manage your customer database</p>
          </div>
          <Button onClick={handleAddCustomer}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            title="Total Customers"
            value={stats.total_customers || 0}
            icon={Users}
            change=""
            changeType="neutral"
          />
          <AdminStatCard
            title="Active Customers"
            value={stats.active_customers || 0}
            icon={UserCheck}
            change=""
            changeType="positive"
          />
          <AdminStatCard
            title="New This Month"
            value={stats.new_this_month || 0}
            icon={UserX}
            change=""
            changeType="neutral"
          />
          <AdminStatCard
            title="Total Reward Points"
            value={stats.total_reward_points || 0}
            icon={Award}
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
                  placeholder="Search by name, email or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No customers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Rewards</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer: any) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {customer.first_name} {customer.last_name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ID: {customer.id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span>{customer.email}</span>
                            <span className="text-muted-foreground">
                              {customer.phone || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(customer.created_at), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>{customer.order_count || 0}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(parseFloat(customer.total_spent || 0))}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-amber-600">
                            {customer.reward_points || 0} pts
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusBadge(customer.status)}
                            variant="secondary"
                          >
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewCustomer(customer)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCustomer(customer)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setStatusDialog(customer);
                                setNewStatus(customer.status);
                              }}
                            >
                              Status
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Details Dialog */}
        <Dialog open={viewDialog} onOpenChange={setViewDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>
                Complete customer information including order history and addresses
              </DialogDescription>
            </DialogHeader>
            {selectedCustomer && customerDetailsData?.data && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {customerDetailsData.data.first_name} {customerDetailsData.data.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{customerDetailsData.data.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      {customerDetailsData.data.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Join Date</p>
                    <p className="font-medium">
                      {format(new Date(customerDetailsData.data.created_at), "PPp")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusBadge(customerDetailsData.data.status)}>
                      {customerDetailsData.data.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reward Points</p>
                    <p className="font-medium text-amber-600">
                      {customerDetailsData.data.reward_points || 0} points
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                      </div>
                      <p className="text-2xl font-bold">
                        {customerDetailsData.data.order_count || 0}
                      </p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-5 w-5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                      </div>
                      <p className="text-2xl font-bold">
                        {formatCurrency(parseFloat(customerDetailsData.data.total_spent || 0))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag className="h-5 w-5" />
                    <p className="font-semibold">Recent Orders</p>
                  </div>
                  {customerDetailsData.data.recent_orders?.length > 0 ? (
                    <div className="border rounded-lg divide-y">
                      {customerDetailsData.data.recent_orders.map((order: any) => (
                        <div
                          key={order.id}
                          className="flex justify-between items-center p-3"
                        >
                          <div>
                            <p className="font-medium">#{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(order.created_at), "MMM dd, yyyy")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatCurrency(parseFloat(order.total_amount))}
                            </p>
                            <Badge
                              className={getStatusBadge(order.status)}
                              variant="secondary"
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No orders yet</p>
                  )}
                </div>

                {/* Addresses */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5" />
                    <p className="font-semibold">Saved Addresses</p>
                  </div>
                  {customerDetailsData.data.addresses?.length > 0 ? (
                    <div className="grid gap-3">
                      {customerDetailsData.data.addresses.map((address: any) => (
                        <div
                          key={address.id}
                          className="border rounded-lg p-3 bg-muted/30"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium">
                              {address.first_name} {address.last_name}
                            </p>
                            <Badge variant="outline">{address.type}</Badge>
                          </div>
                          <p className="text-sm">{address.address_line1}</p>
                          {address.address_line2 && (
                            <p className="text-sm">{address.address_line2}</p>
                          )}
                          <p className="text-sm">
                            {address.city}, {address.state} {address.postal_code}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Phone: {address.phone}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No saved addresses</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Update Status Dialog */}
        <AlertDialog
          open={!!statusDialog}
          onOpenChange={() => setStatusDialog(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Update Customer Status</AlertDialogTitle>
              <AlertDialogDescription>
                Change status for{" "}
                <strong>
                  {statusDialog?.first_name} {statusDialog?.last_name}
                </strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleUpdateStatus}
                disabled={updateStatusMutation.isPending || !newStatus}
              >
                {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Add/Edit Customer Dialog */}
        <Dialog open={formDialog} onOpenChange={setFormDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editMode ? "Edit Customer" : "Add New Customer"}
              </DialogTitle>
              <DialogDescription>
                {editMode
                  ? "Update customer information. Leave password blank to keep current password."
                  : "Enter customer details to create a new account."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+880 1234567890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password {!editMode && <span className="text-red-500">*</span>}
                  {editMode && (
                    <span className="text-muted-foreground text-sm ml-2">
                      (leave blank to keep current)
                    </span>
                  )}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setFormDialog(false)}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : editMode
                  ? "Update Customer"
                  : "Create Customer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
