import { useState } from "react";
import { Loader2 } from "lucide-react";
import ProductCard from "../ui/ProductCard";
import { useProducts } from "@/hooks/useProducts";

const tabs = ["All", "Skincare", "Haircare", "Makeup"];

const TrendingProducts = () => {
  const [activeTab, setActiveTab] = useState("All");

  // Map tab names to category IDs
  const categoryMap: { [key: string]: number | undefined } = {
    "All": undefined,
    "Skincare": 1,
    "Haircare": 2,
    "Makeup": 3,
  };

  const { data: productsData, isLoading } = useProducts({
    trending: 1,
    category_id: categoryMap[activeTab],
    limit: 6,
  });

  const products = productsData?.data || [];

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container-custom">
        <h2 className="section-title text-center mb-8">Trending Products</h2>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-background text-foreground hover:bg-secondary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((product: any, index: number) => (
              <div
                key={product.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  image={product.main_image}
                  price={product.sale_price || product.price}
                  originalPrice={product.sale_price ? product.price : undefined}
                  discount={
                    product.sale_price
                      ? Math.round(((product.price - product.sale_price) / product.price) * 100)
                      : undefined
                  }
                  rating={product.average_rating || 0}
                  reviewCount={product.review_count || 0}
                  inStock={product.stock_quantity > 0}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button className="btn-outline" onClick={() => window.location.href = '/shop'}>
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
