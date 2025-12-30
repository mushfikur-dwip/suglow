import ProductCard from "../ui/ProductCard";

const newProducts = [
  {
    id: 1,
    name: "COSRX Acne Heal Advanced Triple Action",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    price: 1250,
    originalPrice: 1500,
    discount: 17,
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 2,
    name: "Beauty of Joseon Revive Serum",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400",
    price: 1450,
    originalPrice: 1700,
    discount: 15,
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 3,
    name: "Skin1004 Madagascar Centella Ampoule",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
    price: 1350,
    originalPrice: 1600,
    discount: 16,
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 4,
    name: "Round Lab 1025 Dokdo Cleanser",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400",
    price: 1100,
    originalPrice: 1300,
    discount: 15,
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 5,
    name: "ILLIYOON Ceramide Ato Cream",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400",
    price: 1650,
    originalPrice: 1900,
    discount: 13,
    rating: 0,
    reviewCount: 0,
  },
];

const NewArrivals = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container-custom">
        <h2 className="section-title text-center mb-8">New Arrivals</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {newProducts.map((product, index) => (
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

export default NewArrivals;
