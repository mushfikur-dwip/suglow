import ProductCard from "../ui/ProductCard";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

const BestSellingProducts = () => {
  const { data: productsData, isLoading } = useProducts({
    featured: 1,
    limit: 5,
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-background">
        <div className="container-custom">
          <h2 className="section-title mb-8">Best Selling Products</h2>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  const products = productsData?.data || [];

  return (
    <section className="py-12 bg-background">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Best Selling Products</h2>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((product: any, index: number) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                slug={product.slug}
                image={product.main_image}
                price={product.sale_price || product.price}
                originalPrice={product.sale_price ? product.price : undefined}
                discount={product.sale_price ? Math.round(((product.price - product.sale_price) / product.price) * 100) : undefined}
                rating={product.rating || 0}
                reviewCount={product.review_count || 0}
                inStock={product.stock_quantity > 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellingProducts;
