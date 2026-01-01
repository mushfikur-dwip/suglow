import { Copy, Ticket } from "lucide-react";
import AccountLayout from "@/components/account/AccountLayout";
import { toast } from "sonner";

// Available coupons (same as Cart page)
const availableCoupons = [
  {
    id: 1,
    code: "JB15",
    discount: "15% OFF",
    discountValue: 15,
    type: "percentage",
    minPurchase: 1000,
    validUntil: "Feb 28, 2026",
    isActive: true,
    description: "15% off on J-Beauty products"
  },
  {
    id: 2,
    code: "KB10",
    discount: "10% OFF",
    discountValue: 10,
    type: "percentage",
    minPurchase: 500,
    validUntil: "Feb 28, 2026",
    isActive: true,
    description: "10% off on K-Beauty products"
  },
  {
    id: 3,
    code: "SAVE100",
    discount: "৳100 OFF",
    discountValue: 100,
    type: "fixed",
    minPurchase: 2000,
    validUntil: "Mar 31, 2026",
    isActive: true,
    description: "Flat ৳100 off on orders above ৳2000"
  },
  {
    id: 4,
    code: "SAVE200",
    discount: "৳200 OFF",
    discountValue: 200,
    type: "fixed",
    minPurchase: 3000,
    validUntil: "Mar 31, 2026",
    isActive: true,
    description: "Flat ৳200 off on orders above ৳3000"
  },
  {
    id: 5,
    code: "FREESHIP",
    discount: "Free Shipping",
    discountValue: 0,
    type: "shipping",
    minPurchase: 0,
    validUntil: "Dec 31, 2025",
    isActive: false,
    description: "Free shipping on all orders (Expired)"
  },
];

const MyCoupons = () => {
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon ${code} copied to clipboard!`);
  };

  return (
    <AccountLayout title="My Coupons" breadcrumb="My Coupons">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Use these coupons during checkout to get amazing discounts!
        </p>
      </div>
      
      {availableCoupons.length === 0 ? (
        <div className="text-center py-12">
          <Ticket className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium text-foreground mb-2">
            No coupons available
          </h2>
          <p className="text-muted-foreground">
            Check back later for exclusive offers!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`relative border rounded-xl p-5 ${
                coupon.isActive
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/30 opacity-60"
              }`}
            >
              {!coupon.isActive && (
                <span className="absolute top-3 right-3 text-xs font-medium text-red-500">
                  Expired
                </span>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-primary">
                  {coupon.discount}
                </span>
                <Ticket className="w-6 h-6 text-primary" />
              </div>
              <div className="flex items-center gap-2 bg-background border border-dashed border-border rounded-lg px-3 py-2 mb-3">
                <code className="flex-1 font-mono font-semibold text-foreground">
                  {coupon.code}
                </code>
                {coupon.isActive && (
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="text-primary hover:text-primary/80"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm text-foreground mb-2">
                {coupon.description}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Min: ৳{coupon.minPurchase}</span>
                <span>Valid until {coupon.validUntil}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

export default MyCoupons;
