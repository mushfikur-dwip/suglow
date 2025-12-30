import ProductCard from "../ui/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  {
    id: 1,
    name: "COSRX Advanced Snail Mucin Power Essence",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    price: 1350,
    originalPrice: 1650,
    discount: 18,
    rating: 5,
    reviewCount: 124,
  },
  {
    id: 2,
    name: "Some By Mi AHA BHA PHA 30 Days Miracle Toner",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400",
    price: 1200,
    originalPrice: 1450,
    discount: 17,
    rating: 4,
    reviewCount: 89,
  },
  {
    id: 3,
    name: "Klairs Freshly Juiced Vitamin Drop Serum",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
    price: 1650,
    originalPrice: 1850,
    discount: 11,
    rating: 5,
    reviewCount: 156,
  },
  {
    id: 4,
    name: "PURITO Centella Green Level Buffet Serum",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400",
    price: 1100,
    originalPrice: 1350,
    discount: 19,
    rating: 4,
    reviewCount: 67,
  },
  {
    id: 5,
    name: "Isntree Hyaluronic Acid Watery Sun Gel",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400",
    price: 1450,
    originalPrice: 1700,
    discount: 15,
    rating: 5,
    reviewCount: 203,
  },
];

const BestSellingProducts = () => {
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
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellingProducts;
