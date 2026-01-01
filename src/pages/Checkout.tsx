import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrders";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading: loadingCart } = useCart();
  const createOrderMutation = useCreateOrder();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [notes, setNotes] = useState("");

  // Get coupon from localStorage if applied in cart
  const savedCoupon = localStorage.getItem('appliedCoupon');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string; discount: number; type: 'percentage' | 'fixed'} | null>(
    savedCoupon ? JSON.parse(savedCoupon) : null
  );

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    country: "Bangladesh",
  });

  // Billing address state
  const [billingAddress, setBillingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    district: "",
  });

  const cartItems = cartData?.data || [];
  const subtotal = cartData?.total || 0;
  const shipping = subtotal > 2000 ? 0 : 100;
  
  // Calculate discount from applied coupon
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discount) / 100);
    } else {
      discount = appliedCoupon.discount;
    }
  }
  
  const total = subtotal + shipping - discount;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!shippingAddress.firstName || !shippingAddress.lastName || 
        !shippingAddress.email || !shippingAddress.phone || 
        !shippingAddress.address || !shippingAddress.city || 
        !shippingAddress.district) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderData = {
      items: cartItems.map((item: any) => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: item.sale_price || item.price
      })),
      shippingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
        addressLine1: shippingAddress.address,
        addressLine2: '',
        city: shippingAddress.city,
        state: shippingAddress.district,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country
      },
      billingAddress: sameAsShipping ? {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
        addressLine1: shippingAddress.address,
        addressLine2: '',
        city: shippingAddress.city,
        state: shippingAddress.district,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country
      } : {
        firstName: billingAddress.firstName,
        lastName: billingAddress.lastName,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
        addressLine1: billingAddress.address,
        addressLine2: '',
        city: billingAddress.city,
        state: billingAddress.district,
        postalCode: '',
        country: 'Bangladesh'
      },
      paymentMethod: paymentMethod,
      couponCode: appliedCoupon?.code || null,
      guestEmail: shippingAddress.email,
      notes: notes
    };

    createOrderMutation.mutate(orderData, {
      onSuccess: (data) => {
        toast.success("Order placed successfully!");
        navigate(`/account/my-orders`);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to place order");
      }
    });
  };

  if (loadingCart) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

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
            <Link to="/cart" className="hover:text-primary">
              Cart
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Checkout</span>
          </nav>
        </div>

        <section className="container-custom py-6 pb-16">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Billing & Shipping Form */}
            <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <div className="bg-background border border-border rounded-xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-6">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Enter first name" 
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Enter last name" 
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter email" 
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="01XXXXXXXXX" 
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input 
                      id="address" 
                      placeholder="House/Road/Area" 
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      id="city" 
                      placeholder="Enter city" 
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Input 
                      id="district" 
                      placeholder="Enter district" 
                      value={shippingAddress.district}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input 
                      id="postalCode" 
                      placeholder="Enter postal code" 
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country" 
                      defaultValue="Bangladesh" 
                      disabled 
                    />
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="bg-background border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Billing Information
                  </h2>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="sameAsShipping"
                      checked={sameAsShipping}
                      onCheckedChange={(checked) =>
                        setSameAsShipping(checked as boolean)
                      }
                    />
                    <Label htmlFor="sameAsShipping" className="text-sm cursor-pointer">
                      Same as shipping
                    </Label>
                  </div>
                </div>

                {!sameAsShipping && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingFirstName">First Name *</Label>
                      <Input 
                        id="billingFirstName" 
                        placeholder="Enter first name" 
                        value={billingAddress.firstName}
                        onChange={(e) => setBillingAddress({ ...billingAddress, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingLastName">Last Name *</Label>
                      <Input 
                        id="billingLastName" 
                        placeholder="Enter last name" 
                        value={billingAddress.lastName}
                        onChange={(e) => setBillingAddress({ ...billingAddress, lastName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="billingAddress">Street Address *</Label>
                      <Input 
                        id="billingAddress" 
                        placeholder="House/Road/Area" 
                        value={billingAddress.address}
                        onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingCity">City *</Label>
                      <Input 
                        id="billingCity" 
                        placeholder="Enter city" 
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingDistrict">District *</Label>
                      <Input 
                        id="billingDistrict" 
                        placeholder="Enter district" 
                        value={billingAddress.district}
                        onChange={(e) => setBillingAddress({ ...billingAddress, district: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-background border border-border rounded-xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-6">
                  Payment Method
                </h2>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <div
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === "cod"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-sm text-muted-foreground">
                          Pay when you receive your order
                        </p>
                      </Label>
                      <span className="text-2xl">💵</span>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === "bkash"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value="bkash" id="bkash" />
                      <Label htmlFor="bkash" className="flex-1 cursor-pointer">
                        <span className="font-medium">bKash</span>
                        <p className="text-sm text-muted-foreground">
                          Pay with bKash mobile banking
                        </p>
                      </Label>
                      <span className="text-2xl">📱</span>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === "nagad"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value="nagad" id="nagad" />
                      <Label htmlFor="nagad" className="flex-1 cursor-pointer">
                        <span className="font-medium">Nagad</span>
                        <p className="text-sm text-muted-foreground">
                          Pay with Nagad mobile banking
                        </p>
                      </Label>
                      <span className="text-2xl">📲</span>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <span className="font-medium">Credit/Debit Card</span>
                        <p className="text-sm text-muted-foreground">
                          Visa, Mastercard, American Express
                        </p>
                      </Label>
                      <span className="text-2xl">💳</span>
                    </div>
                  </div>
                </RadioGroup>

                {/* COD Info Message */}
                {paymentMethod === 'cod' && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Cash on Delivery:</strong> Pay in cash when you receive your order at your doorstep. Please keep the exact amount ready.
                    </p>
                  </div>
                )}

                {/* Online Payment Info */}
                {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>Mobile Banking:</strong> You will receive payment instructions via SMS after placing your order.
                    </p>
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div className="bg-background border border-border rounded-xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                  Order Notes (Optional)
                </h2>
                <textarea
                  className="w-full min-h-[100px] p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="Notes about your order, e.g. special notes for delivery"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </form>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary/30 rounded-xl p-6 sticky top-4">
                <h2 className="font-display text-lg font-semibold text-foreground mb-6">
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-background rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.main_image || 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=100'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-foreground flex-shrink-0">
                        ৳{((item.sale_price || item.price) * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>

                <hr className="border-border mb-4" />

                {/* Totals */}
                <div className="space-y-3 mb-6">
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
                  
                  {/* Coupon Discount */}
                  {appliedCoupon && discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 dark:text-green-400">
                        Discount ({appliedCoupon.code})
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        -৳{discount}
                      </span>
                    </div>
                  )}
                  
                  <hr className="border-border" />
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-xl text-primary">৳{total}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button 
                  type="submit" 
                  form="checkout-form" 
                  className="btn-primary w-full mb-4"
                  disabled={createOrderMutation.isPending || cartItems.length === 0}
                  onClick={handlePlaceOrder}
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing your order, you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </p>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
                  <span>🔒</span>
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
