import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Loader2, Search } from "lucide-react";
import { useSuppliers, useCreatePurchaseOrder, useCreateSupplier } from "@/hooks/usePurchase";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";

interface PurchaseItem {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const NewPurchaseOrder = () => {
  const navigate = useNavigate();
  const { data: suppliersData, isLoading: suppliersLoading } = useSuppliers();
  const { data: productsData } = useProducts({ limit: 1000 });
  const createPurchaseMutation = useCreatePurchaseOrder();
  const createSupplierMutation = useCreateSupplier();

  const [formData, setFormData] = useState({
    supplier_id: "",
    order_date: new Date().toISOString().split("T")[0],
    expected_delivery_date: "",
    payment_method: "",
    notes: "",
  });

  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Supplier dialog state
  const [showSupplierDialog, setShowSupplierDialog] = useState(false);
  const [supplierFormData, setSupplierFormData] = useState({
    name: "",
    company_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Bangladesh",
  });

  const products = productsData?.data || [];
  const suppliers = suppliersData?.data || [];

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const addItem = () => {
    if (!selectedProductId || !quantity || !unitPrice) {
      toast.error("Please fill all item fields");
      return;
    }

    const product = products.find((p: any) => p.id === parseInt(selectedProductId));
    if (!product) return;

    const existingItem = items.find((item) => item.product_id === parseInt(selectedProductId));
    if (existingItem) {
      toast.error("Product already added");
      return;
    }

    const newItem: PurchaseItem = {
      product_id: parseInt(selectedProductId),
      product_name: product.name,
      quantity: parseInt(quantity),
      unit_price: parseFloat(unitPrice),
      total_price: parseInt(quantity) * parseFloat(unitPrice),
    };

    setItems([...items, newItem]);
    setSelectedProductId("");
    setSelectedProductName("");
    setQuantity("");
    setUnitPrice("");
    setSearchProduct("");
    setShowDropdown(false);
  };

  const removeItem = (productId: number) => {
    setItems(items.filter((item) => item.product_id !== productId));
  };

  const updateItemQuantity = (productId: number, newQuantity: number) => {
    setItems(
      items.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity, total_price: newQuantity * item.unit_price }
          : item
      )
    );
  };

  const updateItemPrice = (productId: number, newPrice: number) => {
    setItems(
      items.map((item) =>
        item.product_id === productId
          ? { ...item, unit_price: newPrice, total_price: item.quantity * newPrice }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total_price, 0);
  };

  const handleSubmitSupplier = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supplierFormData.name) {
      toast.error("Supplier name is required");
      return;
    }

    try {
      const response = await createSupplierMutation.mutateAsync(supplierFormData);
      
      if (response.data.success) {
        toast.success("Supplier created successfully");
        setShowSupplierDialog(false);
        setSupplierFormData({
          name: "",
          company_name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          country: "Bangladesh",
        });
        
        // Auto-select the newly created supplier
        if (response.data.data?.id) {
          setFormData({ ...formData, supplier_id: String(response.data.data.id) });
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create supplier");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.supplier_id) {
      toast.error("Please select a supplier");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    const purchaseData = {
      ...formData,
      supplier_id: parseInt(formData.supplier_id),
      items: items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
    };

    createPurchaseMutation.mutate(purchaseData, {
      onSuccess: () => {
        toast.success("Purchase order created successfully");
        navigate("/admin/purchase");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to create purchase order");
      },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/purchase")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">New Purchase Order</h1>
            <p className="text-muted-foreground">Create a new purchase order for inventory</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Supplier & Date Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="supplier">Supplier *</Label>
                        <Dialog open={showSupplierDialog} onOpenChange={setShowSupplierDialog}>
                          <DialogTrigger asChild>
                            <Button type="button" variant="outline" size="sm">
                              <Plus className="w-4 h-4 mr-1" />
                              Add Supplier
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Add New Supplier</DialogTitle>
                              <DialogDescription>
                                Create a new supplier to add to your purchase orders
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmitSupplier} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                  <Label htmlFor="name">Supplier Name *</Label>
                                  <Input
                                    id="name"
                                    value={supplierFormData.name}
                                    onChange={(e) =>
                                      setSupplierFormData({ ...supplierFormData, name: e.target.value })
                                    }
                                    placeholder="Enter supplier name"
                                    required
                                  />
                                </div>

                                <div className="col-span-2 space-y-2">
                                  <Label htmlFor="company_name">Company Name</Label>
                                  <Input
                                    id="company_name"
                                    value={supplierFormData.company_name}
                                    onChange={(e) =>
                                      setSupplierFormData({ ...supplierFormData, company_name: e.target.value })
                                    }
                                    placeholder="Enter company name"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="email">Email</Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    value={supplierFormData.email}
                                    onChange={(e) =>
                                      setSupplierFormData({ ...supplierFormData, email: e.target.value })
                                    }
                                    placeholder="supplier@example.com"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="phone">Phone</Label>
                                  <Input
                                    id="phone"
                                    value={supplierFormData.phone}
                                    onChange={(e) =>
                                      setSupplierFormData({ ...supplierFormData, phone: e.target.value })
                                    }
                                    placeholder="+880 1XXX XXXXXX"
                                  />
                                </div>

                                <div className="col-span-2 space-y-2">
                                  <Label htmlFor="address">Address</Label>
                                  <Textarea
                                    id="address"
                                    value={supplierFormData.address}
                                    onChange={(e) =>
                                      setSupplierFormData({ ...supplierFormData, address: e.target.value })
                                    }
                                    placeholder="Enter full address"
                                    rows={2}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="city">City</Label>
                                  <Input
                                    id="city"
                                    value={supplierFormData.city}
                                    onChange={(e) =>
                                      setSupplierFormData({ ...supplierFormData, city: e.target.value })
                                    }
                                    placeholder="Dhaka"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="country">Country</Label>
                                  <Input
                                    id="country"
                                    value={supplierFormData.country}
                                    onChange={(e) =>
                                      setSupplierFormData({ ...supplierFormData, country: e.target.value })
                                    }
                                    placeholder="Bangladesh"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end gap-3 pt-4">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setShowSupplierDialog(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  disabled={createSupplierMutation.isPending}
                                >
                                  {createSupplierMutation.isPending ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Creating...
                                    </>
                                  ) : (
                                    "Create Supplier"
                                  )}
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                      {suppliersLoading ? (
                        <div className="flex items-center justify-center h-10 border rounded-md">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      ) : (
                        <Select
                          value={formData.supplier_id}
                          onValueChange={(value) =>
                            setFormData({ ...formData, supplier_id: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            {suppliers.map((supplier: any) => (
                              <SelectItem key={supplier.id} value={String(supplier.id)}>
                                {supplier.name}
                                {supplier.company_name && ` (${supplier.company_name})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="order_date">Order Date *</Label>
                      <Input
                        id="order_date"
                        type="date"
                        value={formData.order_date}
                        onChange={(e) =>
                          setFormData({ ...formData, order_date: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expected_delivery_date">Expected Delivery Date</Label>
                      <Input
                        id="expected_delivery_date"
                        type="date"
                        value={formData.expected_delivery_date}
                        onChange={(e) =>
                          setFormData({ ...formData, expected_delivery_date: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment_method">Payment Method</Label>
                      <Select
                        value={formData.payment_method}
                        onValueChange={(value) =>
                          setFormData({ ...formData, payment_method: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="credit">Credit</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Add any additional notes..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Add Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Product</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search products..."
                          value={selectedProductName || searchProduct}
                          onChange={(e) => {
                            setSearchProduct(e.target.value);
                            setSelectedProductName("");
                            setSelectedProductId("");
                            setShowDropdown(true);
                          }}
                          onFocus={() => setShowDropdown(true)}
                          className="pl-10"
                        />
                      </div>
                      {showDropdown && searchProduct && !selectedProductName && (
                        <div className="absolute z-10 w-full max-h-60 overflow-y-auto bg-background border rounded-md shadow-lg mt-1">
                          {filteredProducts.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">
                              No products found
                            </div>
                          ) : (
                            filteredProducts.map((product: any) => (
                              <div
                                key={product.id}
                                className="p-3 hover:bg-accent cursor-pointer border-b"
                                onClick={() => {
                                  setSelectedProductId(String(product.id));
                                  setSelectedProductName(product.name);
                                  setSearchProduct("");
                                  setUnitPrice(product.price || "");
                                  setShowDropdown(false);
                                }}
                              >
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  SKU: {product.sku} | Stock: {product.stock_quantity}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Unit Price (৳)</Label>
                      <Input
                        type="number"
                        placeholder="Price"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <Button type="button" onClick={addItem} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </CardContent>
              </Card>

              {/* Items List */}
              {items.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items ({items.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item) => (
                            <TableRow key={item.product_id}>
                              <TableCell className="font-medium">
                                {item.product_name}
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateItemQuantity(
                                      item.product_id,
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-20"
                                  min="1"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={item.unit_price}
                                  onChange={(e) =>
                                    updateItemPrice(
                                      item.product_id,
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-24"
                                  min="0"
                                  step="0.01"
                                />
                              </TableCell>
                              <TableCell className="font-semibold">
                                ৳{item.total_price.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => removeItem(item.product_id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Summary Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <span className="font-medium">{items.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Quantity:</span>
                      <span className="font-medium">
                        {items.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="text-xl font-bold text-primary">
                          ৳{calculateTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createPurchaseMutation.isPending || items.length === 0}
                    >
                      {createPurchaseMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Purchase Order"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate("/admin/purchase")}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {formData.supplier_id && (
                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {(() => {
                      const supplier = suppliers.find(
                        (s: any) => s.id === parseInt(formData.supplier_id)
                      );
                      if (!supplier) return null;
                      return (
                        <>
                          <div>
                            <div className="text-muted-foreground">Name</div>
                            <div className="font-medium">{supplier.name}</div>
                          </div>
                          {supplier.company_name && (
                            <div>
                              <div className="text-muted-foreground">Company</div>
                              <div className="font-medium">{supplier.company_name}</div>
                            </div>
                          )}
                          {supplier.phone && (
                            <div>
                              <div className="text-muted-foreground">Phone</div>
                              <div className="font-medium">{supplier.phone}</div>
                            </div>
                          )}
                          {supplier.email && (
                            <div>
                              <div className="text-muted-foreground">Email</div>
                              <div className="font-medium">{supplier.email}</div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewPurchaseOrder;
