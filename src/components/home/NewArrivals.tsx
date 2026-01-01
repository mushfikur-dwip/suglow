import { Loader2 } from "lucide-react";
import ProductCard from "../ui/ProductCard";
import { useProducts } from "@/hooks/useProducts";

const NewArrivals = () => {
  const { data: productsData, isLoading } = useProducts({
    sort: "created_at",
    order: "desc",
    limit: 5,
  });

  const products = productsData?.data || [];

  return (
    <section className="py-12 bg-background">
      <div className="container-custom">
        <h2 className="section-title text-center mb-8">New Arrivals</h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {products.map((product: any, index: number) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
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
      </div>
    </section>
  );
};

export default NewArrivals;
