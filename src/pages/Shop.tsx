import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "J-Beauty", count: 123 },
  { name: "K-Beauty", count: 189 },
  { name: "International Brands", count: 522 },
  { name: "Doctor Cosmetics", count: 44 },
  { name: "Omi Store", count: 24 },
  { name: "Combo", count: 11 },
  { name: "Omi's Offer", count: 2 },
  { name: "Aesthetic Treatment", count: 7 },
  { name: "Budget Friendly 🔥", count: 56 },
];

const skinTypes = ["Normal", "Dry", "Oily", "Combination", "Sensitive"];

const products = [
  { id: 1, name: "APLB Kojic Acid Vitamin C Ampoule...", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400", price: 1350, originalPrice: 1650, discount: 18, rating: 0, reviewCount: 0, inStock: true },
  { id: 2, name: "APLB AHA BHA PHA Centella Ampoule...", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400", price: 1320, originalPrice: 1550, discount: 15, rating: 0, reviewCount: 0, inStock: true },
  { id: 3, name: "Cos De BAHA Azelaic Acid 5% Niacinamid...", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", price: 1090, originalPrice: 1350, discount: 19, rating: 0, reviewCount: 0, inStock: true },
  { id: 4, name: "APLB Bakuchiol Propolis Ampoule...", image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400", price: 1050, originalPrice: 1350, discount: 22, rating: 0, reviewCount: 0, inStock: true },
  { id: 5, name: "APLB Tranexamic Acid Niacinamide...", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400", price: 1150, originalPrice: 1450, discount: 21, rating: 0, reviewCount: 0, inStock: true },
  { id: 6, name: "APLB Glutathione Niacinamide Ampoule...", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400", price: 1020, originalPrice: 1350, discount: 24, rating: 0, reviewCount: 0, inStock: true },
  { id: 7, name: "APLB Bakuchiol Propolis Facial Crea...", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400", price: 1150, originalPrice: 1450, discount: 21, rating: 0, reviewCount: 0, inStock: true },
  { id: 8, name: "APLB Kojic Acid Vitamin C Facial...", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400", price: 1150, originalPrice: 1450, discount: 21, rating: 0, reviewCount: 0, inStock: true },
  { id: 9, name: "Cos De BAHA AHA BHA Facial Toner (G...", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", price: 1600, originalPrice: 2000, discount: 20, rating: 0, reviewCount: 0, inStock: true },
  { id: 10, name: "APLB Retinol Vitamin C Vitamin E Beauty...", image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400", price: 1050, originalPrice: 1350, discount: 22, rating: 0, reviewCount: 0, inStock: true },
  { id: 11, name: "APLB Glutathione Niacinamide Facial...", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400", price: 1350, originalPrice: 1650, discount: 18, rating: 0, reviewCount: 0, inStock: false },
  { id: 12, name: "APLB Tranexamic Acid Niacinamide...", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400", price: 1050, originalPrice: 1350, discount: 22, rating: 0, reviewCount: 0, inStock: true },
];

const Shop = () => {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleSkinType = (type: string) => {
    setSelectedSkinTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        {/* Breadcrumb */}
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Shop</span>
          </div>
        </div>

        <div className="container-custom pb-12">
          <div className="flex gap-8">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden fixed bottom-4 left-4 z-50 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            {/* Sidebar */}
            <aside
              className={`${
                isMobileFilterOpen
                  ? "fixed inset-0 z-50 bg-background overflow-y-auto p-4"
                  : "hidden"
              } lg:block lg:relative lg:w-64 lg:flex-shrink-0`}
            >
              {/* Mobile Close Button */}
              {isMobileFilterOpen && (
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h2 className="font-semibold text-lg">Filters</h2>
                  <button onClick={() => setIsMobileFilterOpen(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
              )}

              {/* Categories */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Categories</h3>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <button
                        onClick={() => setSelectedCategory(
                          selectedCategory === category.name ? null : category.name
                        )}
                        className={`w-full text-left text-sm py-1 flex items-center justify-between hover:text-primary transition-colors ${
                          selectedCategory === category.name
                            ? "text-primary font-medium"
                            : "text-foreground/70"
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="text-muted-foreground">({category.count})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Pricing</h3>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full accent-primary"
                  />
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex-1">
                      <label className="text-muted-foreground text-xs">From</label>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="w-full border border-border rounded-lg px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-muted-foreground text-xs">To</label>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="w-full border border-border rounded-lg px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                  <button className="w-full btn-primary text-sm py-2">
                    Apply Price Filter
                  </button>
                </div>
              </div>

              {/* Skin Type */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Skin Type</h3>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
                <ul className="space-y-2">
                  {skinTypes.map((type) => (
                    <li key={type}>
                      <label className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedSkinTypes.includes(type)}
                          onChange={() => toggleSkinType(type)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span>{type}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile Apply Button */}
              {isMobileFilterOpen && (
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full btn-primary mt-6 lg:hidden"
                >
                  Apply Filters
                </button>
              )}
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort & View Options */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort By:</span>
                  <select className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background">
                    <option>Default</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                    <option>Best Selling</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">Show:</span>
                  <select className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background">
                    <option>24</option>
                    <option>48</option>
                    <option>96</option>
                  </select>
                </div>
              </div>

              {/* Products */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {[1, 2, 3, 4, 5, 6].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      currentPage === page
                        ? "bg-foreground text-background"
                        : "border border-border hover:bg-secondary"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
