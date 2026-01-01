import { Heart, ShoppingCart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import AccountLayout from "@/components/account/AccountLayout";
import { Button } from "@/components/ui/button";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { useAddToCart } from "@/hooks/useCart";

const MyWishlist = () => {
  const { data: wishlistData, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  const wishlistItems = wishlistData?.data || [];

  const handleAddToCart = async (productId: number, productName: string) => {
    try {
      await addToCart.mutateAsync({ product_id: productId, quantity: 1 });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await removeFromWishlist.mutateAsync(id);
    } catch (error) {
      // Error handled in hook
    }
  };

  if (isLoading) {
    return (
      <AccountLayout title="My Wishlist" breadcrumb="My Wishlist">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title="My Wishlist" breadcrumb="My Wishlist">
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium text-foreground mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Save items you love to your wishlist
          </p>
          <Link to="/shop">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item: any) => (
            <div
              key={item.id}
              className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link to={`/product/${item.slug}`}>
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/product/${item.slug}`}>
                  <h3 className="font-medium text-foreground mb-2 hover:text-primary line-clamp-2">
                    {item.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-primary">
                    ৳{item.price}
                  </span>
                  {item.original_price && item.original_price > item.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ৳{item.original_price}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(item.product_id, item.name)}
                    disabled={!item.in_stock || addToCart.isPending}
                    className="flex-1"
                    size="sm"
                  >
                    {addToCart.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {item.in_stock ? "Add to Cart" : "Out of Stock"}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleRemove(item.id)}
                    disabled={removeFromWishlist.isPending}
                    variant="outline"
                    size="sm"
                  >
                    {removeFromWishlist.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Heart className="w-4 h-4 fill-current" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

export default MyWishlist;
