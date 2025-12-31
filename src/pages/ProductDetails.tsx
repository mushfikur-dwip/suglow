import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, ChevronLeft, ChevronRight, Minus, Plus, HelpCircle, Download, Tag } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock product data
const mockProduct = {
  id: 1,
  name: "Omi Brotherhood Menturm Acne Lotion 110ml",
  price: 1650,
  originalPrice: 1850,
  brand: "OMI Brotherhood",
  category: ["J-beauty", "Toner/lotion"],
  rating: 0,
  reviewCount: 0,
  images: [
    "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500&h=600&fit=crop",
    "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&h=600&fit=crop",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=600&fit=crop",
  ],
  description: "This acne lotion helps treat and prevent acne breakouts while soothing irritated skin. Formulated with salicylic acid and natural ingredients.",
  inStock: true,
};

// Mock recommended products
const recommendedProducts = [
  { id: 2, name: "COSRX Advanced Snail Mucin", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300", price: 1200, rating: 5 },
  { id: 3, name: "Innisfree Green Tea Serum", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300", price: 980, rating: 4 },
  { id: 4, name: "Laneige Water Sleeping Mask", image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=300", price: 2100, rating: 5 },
  { id: 5, name: "Some By Mi AHA BHA PHA Toner", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=300", price: 1450, rating: 4 },
];

const ProductDetails = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = mockProduct; // In real app, fetch by id

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container-custom py-4">
          <nav className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-primary">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        {/* Product Section */}
        <section className="container-custom py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-secondary/20 rounded-lg overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              </div>

              {/* Thumbnail Slider */}
              <div className="relative flex items-center gap-2">
                <button
                  onClick={prevImage}
                  className="w-8 h-8 flex items-center justify-center border border-border rounded-full hover:border-primary transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex-1 flex gap-2 overflow-x-auto py-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextImage}
                  className="w-8 h-8 flex items-center justify-center border border-border rounded-full hover:border-primary transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-5">
              {/* Title & Navigation */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  {product.name}
                </h1>
                <div className="flex gap-2">
                  <button className="w-8 h-8 flex items-center justify-center border border-border rounded-full hover:border-primary transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center border border-border rounded-full hover:border-primary transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < product.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  (There is no review yet.)
                </span>
              </div>

              {/* Price */}
              <div className="text-2xl font-bold text-foreground">
                ৳{product.price}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="ml-2 text-lg font-normal text-muted-foreground line-through">
                    ৳{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Brand */}
              <p className="text-muted-foreground">
                Brand: <span className="text-foreground">{product.brand}</span>
              </p>

              {/* Concerned Button */}
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:border-primary transition-colors">
                <HelpCircle className="w-4 h-4" />
                Concerned About the Product?
              </button>

              <hr className="border-border" />

              {/* Category */}
              <div className="flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Category:</span>
                <span className="text-foreground">{product.category.join(", ")}</span>
              </div>

              {/* App Download Banner */}
              <div className="inline-flex items-center gap-2 px-4 py-3 bg-pink-soft rounded-lg text-sm">
                <Download className="w-4 h-4 text-primary" />
                <span>Download App for</span>
                <a href="#" className="text-foreground underline font-medium">iOS</a>
                <span>or</span>
                <a href="#" className="text-foreground underline font-medium">Android</a>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-secondary/50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-secondary/50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button className="btn-primary px-8">Add To Cart</button>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="w-10 h-10 flex items-center justify-center border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted ? "fill-primary text-primary" : "text-muted-foreground"
                    }`}
                  />
                </button>
              </div>

              {/* Share */}
              <div className="flex items-center gap-4">
                <span className="text-foreground font-medium">Share with:</span>
                <div className="flex gap-3">
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <FaFacebookF className="w-4 h-4" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <FaInstagram className="w-4 h-4" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <FaLinkedinIn className="w-4 h-4" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <FaXTwitter className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="container-custom py-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-6">
              <TabsTrigger
                value="description"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 pb-3 text-base"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="guides"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 pb-3 text-base"
              >
                Guides
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 pb-3 text-base"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="questions"
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 pb-3 text-base"
              >
                Questions About This Products
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </TabsContent>
            <TabsContent value="guides" className="pt-6">
              <p className="text-muted-foreground">Usage guides will be available soon.</p>
            </TabsContent>
            <TabsContent value="reviews" className="pt-6">
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </TabsContent>
            <TabsContent value="questions" className="pt-6">
              <p className="text-muted-foreground">Have questions? Ask us anything about this product.</p>
            </TabsContent>
          </Tabs>
        </section>

        {/* Recommended Products */}
        <section className="container-custom py-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
              Recommended For You
            </h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center border border-border rounded-full hover:border-primary transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedProducts.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="group bg-background border border-border rounded-xl overflow-hidden hover:shadow-card transition-shadow"
              >
                <div className="aspect-square bg-secondary/20 p-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < item.rating ? "fill-amber-400 text-amber-400" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="font-bold text-foreground">৳{item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
