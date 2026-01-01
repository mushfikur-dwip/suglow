import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAddToCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
}

const ProductCard = ({
  id,
  name,
  slug,
  image,
  price,
  originalPrice,
  discount,
  rating = 0,
  reviewCount = 0,
  inStock = true,
}: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addToCartMutation = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCartMutation.mutate(
      { product_id: id, quantity: 1 },
      {
        onSuccess: () => {
          toast.success("Product added to cart!");
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to add to cart");
        },
      }
    );
  };

  return (
    <div className="card-product relative">
      {/* Discount Badge */}
      {discount && discount > 0 && (
        <span className="badge-discount">-{discount}%</span>
      )}

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsWishlisted(!isWishlisted);
        }}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-background rounded-full flex items-center justify-center shadow-soft hover:shadow-card transition-all duration-200"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isWishlisted ? "fill-primary text-primary" : "text-muted-foreground"
          }`}
        />
      </button>

      <Link to={`/product/${slug}`} className="block">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-secondary/30 p-4">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
            {reviewCount > 0 && (
              <span className="text-xs text-muted-foreground ml-1">
                ({reviewCount})
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="price-current">৳{price}</span>
            {originalPrice && originalPrice > price && (
              <span className="price-original">৳{originalPrice}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      {inStock ? (
        <div className="px-4 pb-4">
          <button 
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
            className="w-full btn-outline text-sm py-2"
          >
            {addToCartMutation.isPending ? "Adding..." : "Add To Cart"}
          </button>
        </div>
      ) : (
        <div className="px-4 pb-4">
          <button className="w-full bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
            Out Of Stock
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
