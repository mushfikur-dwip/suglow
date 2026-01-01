import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Omi Brotherhood Menturm Acne Lotion 110ml",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=200",
    price: 1650,
    quantity: 1,
  },
  {
    id: 2,
    name: "COSRX Advanced Snail 96 Mucin Power Essence",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200",
    price: 1200,
    quantity: 2,
  },
  {
    id: 3,
    name: "Innisfree Green Tea Seed Serum",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200",
    price: 980,
    quantity: 1,
  },
];

const Cart = () => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string; discount: number; type: 'percentage' | 'fixed'} | null>(null);

  // Fetch cart data
  const { data: cartData, isLoading, error } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();

  const cartItems = cartData?.data || [];
  const apiTotal = cartData?.total || 0;

  // Available coupons (you can fetch from API later)
  const availableCoupons = [
    { code: 'JB15', discount: 15, type: 'percentage' as const, minOrder: 1000 },
    { code: 'KB10', discount: 10, type: 'percentage' as const, minOrder: 500 },
    { code: 'SAVE100', discount: 100, type: 'fixed' as const, minOrder: 2000 },
    { code: 'SAVE200', discount: 200, type: 'fixed' as const, minOrder: 3000 },
  ];

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    const coupon = availableCoupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
    
    if (!coupon) {
      toast.error("Invalid coupon code");
      return;
    }

    if (apiTotal < coupon.minOrder) {
      toast.error(`Minimum order amount ৳${coupon.minOrder} required for this coupon`);
      return;
    }

    setAppliedCoupon(coupon);
    localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
    toast.success(`Coupon "${coupon.code}" applied successfully!`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    localStorage.removeItem('appliedCoupon');
    toast.info("Coupon removed");
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    updateCartItem.mutate(
      { id, quantity: newQuantity },
      {
        onError: () => {
          toast.error("Failed to update quantity");
        },
      }
    );
  };

  const removeItem = (id: number) => {
    removeFromCart.mutate(id, {
      onSuccess: () => {
        toast.success("Item removed from cart");
      },
      onError: () => {
        toast.error("Failed to remove item");
      },
    });
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart.mutate(undefined, {
        onSuccess: () => {
          toast.success("Cart cleared");
        },
      });
    }
  };

  const subtotal = apiTotal;
  const shipping = subtotal > 2000 ? 0 : 100;
  
  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discount) / 100);
    } else {
      discount = appliedCoupon.discount;
    }
  }
  
  const total = subtotal + shipping - discount;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container-custom py-4">
          <nav className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Shopping Cart</span>
          </nav>
        </div>

        <section className="container-custom py-6 pb-16">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8">
            Shopping Cart
          </h1>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">Failed to load cart</p>
              <button onClick={() => window.location.reload()} className="btn-primary">
                Retry
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium text-foreground mb-2">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/shop" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Header - Desktop */}
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-sm font-medium text-muted-foreground">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                {/* Items */}
                {cartItems.map((item: any) => {
                  const itemPrice = item.sale_price || item.price;
                  const itemSubtotal = itemPrice * item.quantity;
                  
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 border-b border-border items-center"
                    >
                      {/* Product */}
                      <div className="md:col-span-6 flex items-center gap-4">
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={removeFromCart.isPending}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="w-20 h-20 bg-secondary/20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.main_image || "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=200"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Link
                          to={`/shop/${item.slug}`}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                      </div>

                      {/* Price */}
                      <div className="md:col-span-2 text-center">
                        <span className="md:hidden text-muted-foreground text-sm mr-2">
                          Price:
                        </span>
                        <span className="font-medium">৳{itemPrice}</span>
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-2 flex justify-center">
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updateCartItem.isPending || item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center hover:bg-secondary/50 transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updateCartItem.isPending || item.quantity >= item.stock_quantity}
                            className="w-8 h-8 flex items-center justify-center hover:bg-secondary/50 transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="md:col-span-2 text-right">
                        <span className="md:hidden text-muted-foreground text-sm mr-2">
                          Subtotal:
                        </span>
                        <span className="font-semibold">৳{itemSubtotal}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Continue Shopping */}
                <div className="pt-4 flex justify-between items-center">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    ← Continue Shopping
                  </Link>
                  {cartItems.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      className="text-sm text-red-500 hover:text-red-700 transition-colors"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-secondary/30 rounded-xl p-6 sticky top-4">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-6">
                    Cart Totals
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">৳{subtotal}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `৳${shipping}`
                        )}
                      </span>
                    </div>

                    {shipping > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Free shipping on orders over ৳2,000
                      </p>
                    )}

                    <hr className="border-border" />

                    {/* Coupon */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Coupon Code
                      </label>
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-green-700 dark:text-green-300">
                              {appliedCoupon.code}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400">
                              {appliedCoupon.type === 'percentage' 
                                ? `${appliedCoupon.discount}% off` 
                                : `৳${appliedCoupon.discount} off`}
                            </p>
                          </div>
                          <button
                            onClick={removeCoupon}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Enter code (e.g., JB15, KB10)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                            className="flex-1"
                          />
                          <button 
                            onClick={applyCoupon}
                            className="btn-outline px-4 text-sm"
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>Discount</span>
                        <span className="font-medium">-৳{discount}</span>
                      </div>
                    )}

                    <hr className="border-border" />

                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-xl text-primary">
                        ৳{total}
                      </span>
                    </div>

                    <Link
                      to="/checkout"
                      className="btn-primary w-full text-center block"
                    >
                      Proceed to Checkout
                    </Link>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <span>🔒</span>
                      <span>Secure Checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
