import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

// Mock order items
const orderItems = [
  {
    id: 1,
    name: "Omi Brotherhood Menturm Acne Lotion 110ml",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=100",
    price: 1650,
    quantity: 1,
  },
  {
    id: 2,
    name: "COSRX Advanced Snail 96 Mucin Power Essence",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100",
    price: 1200,
    quantity: 2,
  },
];

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 2000 ? 0 : 100;
  const total = subtotal + shipping;

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
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <div className="bg-background border border-border rounded-xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-6">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Enter last name" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="Enter email" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" placeholder="01XXXXXXXXX" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input id="address" placeholder="House/Road/Area" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" placeholder="Enter city" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Input id="district" placeholder="Enter district" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" placeholder="Enter postal code" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" defaultValue="Bangladesh" disabled />
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
                      <Input id="billingFirstName" placeholder="Enter first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingLastName">Last Name *</Label>
                      <Input id="billingLastName" placeholder="Enter last name" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="billingAddress">Street Address *</Label>
                      <Input id="billingAddress" placeholder="House/Road/Area" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingCity">City *</Label>
                      <Input id="billingCity" placeholder="Enter city" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingDistrict">District *</Label>
                      <Input id="billingDistrict" placeholder="Enter district" />
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
              </div>

              {/* Order Notes */}
              <div className="bg-background border border-border rounded-xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                  Order Notes (Optional)
                </h2>
                <textarea
                  className="w-full min-h-[100px] p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="Notes about your order, e.g. special notes for delivery"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary/30 rounded-xl p-6 sticky top-4">
                <h2 className="font-display text-lg font-semibold text-foreground mb-6">
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-background rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
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
                        ৳{item.price * item.quantity}
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
                  <hr className="border-border" />
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-xl text-primary">৳{total}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button className="btn-primary w-full mb-4">Place Order</button>

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
