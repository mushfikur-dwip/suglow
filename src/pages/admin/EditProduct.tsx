import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { useProductById, useUpdateProduct } from "@/hooks/useProducts";
import { toast } from "sonner";

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: productData, isLoading } = useProductById(Number(id));
  const updateProductMutation = useUpdateProduct();

  const product = productData?.data;

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
    best_seller: false,
    new_arrival: false,
    status: "active",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || "",
        name: product.name || "",
        slug: product.slug || "",
        short_description: product.short_description || "",
        description: product.description || "",
        category_id: product.category_id?.toString() || "",
        brand: product.brand || "",
        price: product.price?.toString() || "",
        sale_price: product.sale_price?.toString() || "",
        stock_quantity: product.stock_quantity?.toString() || "",
        main_image: product.main_image || "",
        featured: product.featured === 1,
        trending: product.trending === 1,
        best_seller: product.best_seller === 1,
        new_arrival: product.new_arrival === 1,
        status: product.status || "active",
      });
      setImagePreview(product.main_image || "");
    }
  }, [product]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });

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
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(formData.main_image);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.sku || !formData.category_id || !formData.price) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.sale_price && parseFloat(formData.sale_price) >= parseFloat(formData.price)) {
      toast.error("Sale price must be less than regular price");
      return;
    }

    const submitData = new FormData();
    submitData.append("sku", formData.sku);
    submitData.append("name", formData.name);
    submitData.append("slug", formData.slug);
    submitData.append("short_description", formData.short_description);
    submitData.append("description", formData.description);
    submitData.append("category_id", formData.category_id);
    submitData.append("brand", formData.brand);
    submitData.append("price", formData.price);
    if (formData.sale_price) submitData.append("sale_price", formData.sale_price);
    submitData.append("stock_quantity", formData.stock_quantity);
    submitData.append("featured", formData.featured ? "1" : "0");
    submitData.append("trending", formData.trending ? "1" : "0");
    submitData.append("best_seller", formData.best_seller ? "1" : "0");
    submitData.append("new_arrival", formData.new_arrival ? "1" : "0");
    submitData.append("status", formData.status);

    if (imageFile) {
      submitData.append("main_image", imageFile);
    } else if (formData.main_image) {
      submitData.append("main_image_url", formData.main_image);
    }

    updateProductMutation.mutate(
      { id: Number(id), data: submitData },
      {
        onSuccess: () => {
          toast.success("Product updated successfully");
          navigate("/admin/products");
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to update product");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <p className="text-xl text-muted-foreground">Product not found</p>
          <Button onClick={() => navigate("/admin/products")}>
            Back to Products
          </Button>
        </div>
      </AdminLayout>
    );
  }

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
          <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        value={formData.sku}
                        onChange={(e) => handleInputChange("sku", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => handleInputChange("brand", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange("slug", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="short_description">Short Description</Label>
                    <Textarea
                      id="short_description"
                      rows={3}
                      value={formData.short_description}
                      onChange={(e) => handleInputChange("short_description", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea
                      id="description"
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
                      value={formData.stock_quantity}
                      onChange={(e) => handleInputChange("stock_quantity", e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category</CardTitle>
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
                      <SelectItem value="1">Skincare</SelectItem>
                      <SelectItem value="2">Haircare</SelectItem>
                      <SelectItem value="3">Makeup</SelectItem>
                      <SelectItem value="4">Fragrance</SelectItem>
                      <SelectItem value="5">Body Care</SelectItem>
                      <SelectItem value="6">Men</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {imageFile && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="image">Upload New Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: 800x800px, Max 2MB
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or use URL
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.main_image}
                      onChange={(e) => {
                        handleInputChange("main_image", e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
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
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="best_seller"
                      checked={formData.best_seller}
                      onCheckedChange={(checked) => handleInputChange("best_seller", checked as boolean)}
                    />
                    <Label htmlFor="best_seller" className="cursor-pointer">
                      Best Seller
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new_arrival"
                      checked={formData.new_arrival}
                      onCheckedChange={(checked) => handleInputChange("new_arrival", checked as boolean)}
                    />
                    <Label htmlFor="new_arrival" className="cursor-pointer">
                      New Arrival
                    </Label>
                  </div>

                  <div className="pt-2 border-t">
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
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={updateProductMutation.isPending}
                >
                  {updateProductMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Product"
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
      </div>
    </AdminLayout>
  );
};

export default AdminEditProduct;
