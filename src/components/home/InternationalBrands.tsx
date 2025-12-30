import { ChevronLeft, ChevronRight } from "lucide-react";

const brands = [
  {
    id: 1,
    name: "Skin1004 Madagascar Centella Cream",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
    price: 1200,
    originalPrice: 1450,
  },
  {
    id: 2,
    name: "Torriden Deep Marine Ceramic Capsule",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    price: 2200,
    originalPrice: 2600,
  },
  {
    id: 3,
    name: "Anua Heartleaf Pore Control",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400",
    price: 1800,
    originalPrice: 2100,
  },
  {
    id: 4,
    name: "COSRX Acne Pimple Master",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
    price: 650,
    originalPrice: 800,
  },
];

const InternationalBrands = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">International Brands</h2>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {brands.map((brand, index) => (
            <div
              key={brand.id}
              className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 group animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square overflow-hidden bg-secondary/30 p-4">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {brand.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">৳{brand.price}</span>
                  <span className="text-sm text-muted-foreground line-through">৳{brand.originalPrice}</span>
                </div>
                <button className="mt-3 text-primary text-sm font-medium hover:underline">
                  Add To Cart →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InternationalBrands;
