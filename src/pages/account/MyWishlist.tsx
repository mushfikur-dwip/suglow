import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import AccountLayout from "@/components/account/AccountLayout";

const mockWishlistItems = [
  {
    id: 1,
    name: "Omi Brotherhood Menturm Acne Lotion 110ml",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=200",
    price: 1650,
    originalPrice: 1850,
    inStock: true,
  },
  {
    id: 2,
    name: "COSRX Advanced Snail 96 Mucin Power Essence",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200",
    price: 1200,
    inStock: true,
  },
  {
    id: 3,
    name: "Innisfree Green Tea Seed Serum",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200",
    price: 980,
    inStock: false,
  },
];

const MyWishlist = () => {
  return (
    <AccountLayout title="My WishList" breadcrumb="My WishList">
      {mockWishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium text-foreground mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Save items you love by clicking the heart icon.
          </p>
          <Link to="/shop" className="btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {mockWishlistItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-border rounded-xl"
            >
              <Link
                to={`/product/${item.id}`}
                className="w-20 h-20 bg-secondary/20 rounded-lg overflow-hidden flex-shrink-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.id}`}
                  className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-primary">৳{item.price}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ৳{item.originalPrice}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs ${
                    item.inStock ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  className={`flex-1 sm:flex-none btn-primary text-sm px-4 py-2 ${
                    !item.inStock && "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!item.inStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-border rounded-lg text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

export default MyWishlist;
