import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2, Upload, Plus } from "lucide-react";
import { useCreateProduct } from "@/hooks/useProducts";
import { useCategories, useCreateCategory } from "@/hooks/useCategories";
import { toast } from "sonner";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const createProductMutation = useCreateProduct();
  const { data: categoriesData } = useCategories();
  const createCategoryMutation = useCreateCategory();

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    slug: "",
    short_description: "",
    description: "",
    category_id: "",
    brand: "",
    price: "",
    sale_price: "",
    stock_quantity: "",
    main_image: "",
    featured: false,
    trending: false,
    status: "active",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const categories = categoriesData?.data || [];
  
  console.log('📋 Categories data:', categoriesData);
  console.log('📋 Categories array:', categories);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });

    // Auto-generate slug from name
    if (field === "name") {
      const slug = value
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, name: value as string, slug }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('📎 Image selected:', file.name, file.size, 'bytes');
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.sku || !formData.category_id || !formData.price) {
      toast.error("Please fill all required fields");
      return;
    }

    console.log('🖼️ Image file before submit:', imageFile);

    const submitData = new FormData();
    submitData.append("sku", formData.sku);
    submitData.append("name", formData.name);
    submitData.append("slug", formData.slug);
    submitData.append("short_description", formData.short_description);
    submitData.append("description", formData.description);
    submitData.append("category_id", formData.category_id);
    submitData.append("brand", formData.brand);
    submitData.append("price", formData.price);
    submitData.append("sale_price", formData.sale_price);
    submitData.append("stock_quantity", formData.stock_quantity);
    submitData.append("featured", formData.featured ? "1" : "0");
    submitData.append("trending", formData.trending ? "1" : "0");
    submitData.append("status", formData.status);
    
    if (imageFile) {
      console.log('✅ Appending image to FormData:', imageFile.name);
      submitData.append("main_image", imageFile);
    } else if (formData.main_image) {
      console.log('🔗 Using image URL:', formData.main_image);
      submitData.append("main_image_url", formData.main_image);
    } else {
      console.log('⚠️ No image provided');
    }

    console.log('📤 Submitting FormData...');

    createProductMutation.mutate(submitData, {
      onSuccess: () => {
        toast.success("Product created successfully");
        navigate("/admin/products");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to create product");
      },
    });
  };

  const handleAddCategory = () => {
    console.log('🏷️ Creating category with data:', newCategoryData);
    
    if (!newCategoryData.name) {
      toast.error("Category name is required");
      return;
    }

    console.log('📨 Sending category request to backend...');
    createCategoryMutation.mutate(newCategoryData, {
      onSuccess: (response: any) => {
        console.log('✅ Category created successfully:', response);
        toast.success("Category created successfully");
        setFormData({ ...formData, category_id: response.data.id.toString() });
        setCategoryDialog(false);
        setNewCategoryData({ name: "", slug: "", description: "" });
      },
      onError: (error: any) => {
        console.log('❌ Category creation failed:', error);
        console.log('❌ Error response:', error.response);
        toast.error(error.response?.data?.message || "Failed to create category");
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
            onClick={() => navigate("/admin/products")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU *</Label>
                      <Input
                        id="sku"
                        placeholder="PRD-001"
                        value={formData.sku}
                        onChange={(e) => handleInputChange("sku", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        placeholder="Brand name"
                        value={formData.brand}
                        onChange={(e) => handleInputChange("brand", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      placeholder="product-slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange("slug", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="short_description">Short Description</Label>
                    <Textarea
                      id="short_description"
                      placeholder="Brief description for product card"
                      rows={3}
                      value={formData.short_description}
                      onChange={(e) => handleInputChange("short_description", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed product description"
                      rows={6}
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Stock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Regular Price (৳) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sale_price">Sale Price (৳)</Label>
                      <Input
                        id="sale_price"
                        type="number"
                        placeholder="0.00"
                        value={formData.sale_price}
                        onChange={(e) => handleInputChange("sale_price", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      placeholder="0"
                      value={formData.stock_quantity}
                      onChange={(e) => handleInputChange("stock_quantity", e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Category</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCategoryDialog(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange("category_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {categories.map((category: any) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground text-center">OR</div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.main_image}
                      onChange={(e) => handleInputChange("main_image", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange("featured", checked as boolean)}
                    />
                    <Label htmlFor="featured" className="cursor-pointer">
                      Featured Product
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trending"
                      checked={formData.trending}
                      onCheckedChange={(checked) => handleInputChange("trending", checked as boolean)}
                    />
                    <Label htmlFor="trending" className="cursor-pointer">
                      Trending Product
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createProductMutation.isPending}
                >
                  {createProductMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Product"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/admin/products")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Add Category Dialog */}
        <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new product category
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category_name">
                  Category Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="category_name"
                  value={newCategoryData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    console.log('📝 Category name changed:', name, '→ slug:', slug);
                    setNewCategoryData({ ...newCategoryData, name, slug });
                  }}
                  placeholder="e.g., Skincare"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category_slug">Slug</Label>
                <Input
                  id="category_slug"
                  value={newCategoryData.slug}
                  onChange={(e) =>
                    setNewCategoryData({ ...newCategoryData, slug: e.target.value })
                  }
                  placeholder="e.g., skincare"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category_description">Description</Label>
                <Textarea
                  id="category_description"
                  value={newCategoryData.description}
                  onChange={(e) =>
                    setNewCategoryData({ ...newCategoryData, description: e.target.value })
                  }
                  placeholder="Category description (optional)"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCategoryDialog(false);
                  setNewCategoryData({ name: "", slug: "", description: "" });
                }}
                disabled={createCategoryMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCategory}
                disabled={createCategoryMutation.isPending}
              >
                {createCategoryMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminAddProduct;
