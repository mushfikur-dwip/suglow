import { useState } from "react";
import ProductCard from "../ui/ProductCard";

const tabs = ["J-Beauty", "K-Beauty", "International Brands"];

const productsByTab = {
  "J-Beauty": [
    { id: 1, name: "Hada Labo Gokujyun Hyaluronic Acid Lotion", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400", price: 950, originalPrice: 1150, discount: 17, rating: 5, reviewCount: 89 },
    { id: 2, name: "COSRX Advanced Snail 92 All-in-one Cream", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400", price: 1450, originalPrice: 1700, discount: 15, rating: 4, reviewCount: 67 },
    { id: 3, name: "Rohto Melano CC Vitamin C Essence", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", price: 1100, originalPrice: 1350, discount: 19, rating: 5, reviewCount: 145 },
    { id: 4, name: "Anessa Perfect UV Sunscreen Mild Milk", image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400", price: 2200, originalPrice: 2600, discount: 15, rating: 5, reviewCount: 203 },
    { id: 5, name: "DHC Deep Cleansing Oil", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400", price: 1800, originalPrice: 2100, discount: 14, rating: 4, reviewCount: 78 },
    { id: 6, name: "Kose Sekkisei Lotion", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400", price: 2500, originalPrice: 2900, discount: 14, rating: 5, reviewCount: 112 },
  ],
  "K-Beauty": [
    { id: 7, name: "COSRX Snail Mucin 96% Power Essence", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400", price: 1350, originalPrice: 1600, discount: 16, rating: 5, reviewCount: 234 },
    { id: 8, name: "Beauty of Joseon Glow Serum", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400", price: 1250, originalPrice: 1450, discount: 14, rating: 5, reviewCount: 189 },
    { id: 9, name: "Innisfree Green Tea Seed Serum", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", price: 1600, originalPrice: 1900, discount: 16, rating: 4, reviewCount: 156 },
    { id: 10, name: "Laneige Water Sleeping Mask", image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400", price: 1850, originalPrice: 2200, discount: 16, rating: 5, reviewCount: 312 },
    { id: 11, name: "Etude House Soon Jung 2x Barrier", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400", price: 1100, originalPrice: 1300, discount: 15, rating: 4, reviewCount: 98 },
    { id: 12, name: "Missha Time Revolution Essence", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400", price: 2100, originalPrice: 2500, discount: 16, rating: 5, reviewCount: 267 },
  ],
  "International Brands": [
    { id: 13, name: "The Ordinary Niacinamide 10%", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400", price: 850, originalPrice: 1000, discount: 15, rating: 5, reviewCount: 456 },
    { id: 14, name: "CeraVe Moisturizing Cream", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400", price: 1450, originalPrice: 1700, discount: 15, rating: 5, reviewCount: 378 },
    { id: 15, name: "Paula's Choice 2% BHA Exfoliant", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", price: 2800, originalPrice: 3200, discount: 13, rating: 5, reviewCount: 289 },
    { id: 16, name: "La Roche-Posay Anthelios SPF 50", image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400", price: 2200, originalPrice: 2600, discount: 15, rating: 4, reviewCount: 167 },
    { id: 17, name: "Neutrogena Hydro Boost Gel", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400", price: 1100, originalPrice: 1350, discount: 19, rating: 4, reviewCount: 234 },
    { id: 18, name: "Bioderma Sensibio H2O", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400", price: 1650, originalPrice: 1900, discount: 13, rating: 5, reviewCount: 189 },
  ],
};

const TrendingProducts = () => {
  const [activeTab, setActiveTab] = useState("J-Beauty");

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {productsByTab[activeTab as keyof typeof productsByTab].map((product, index) => (
            <div
              key={product.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button className="btn-outline">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
