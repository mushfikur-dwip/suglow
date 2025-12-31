import { Copy, Ticket } from "lucide-react";
import AccountLayout from "@/components/account/AccountLayout";
import { useToast } from "@/hooks/use-toast";

const mockCoupons = [
  {
    id: 1,
    code: "WELCOME10",
    discount: "10% OFF",
    minPurchase: 500,
    validUntil: "Jan 31, 2025",
    isActive: true,
  },
  {
    id: 2,
    code: "BEAUTY20",
    discount: "20% OFF",
    minPurchase: 1000,
    validUntil: "Feb 15, 2025",
    isActive: true,
  },
  {
    id: 3,
    code: "FREESHIP",
    discount: "Free Shipping",
    minPurchase: 0,
    validUntil: "Dec 15, 2024",
    isActive: false,
  },
];

const MyCoupons = () => {
  const { toast } = useToast();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Coupon copied!",
      description: `${code} has been copied to clipboard.`,
    });
  };

  return (
    <AccountLayout title="My Coupons" breadcrumb="My Coupons">
      {mockCoupons.length === 0 ? (
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
          {mockCoupons.map((coupon) => (
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
              <p className="text-xs text-muted-foreground">
                {coupon.minPurchase > 0
                  ? `Min. purchase ৳${coupon.minPurchase}`
                  : "No minimum purchase"}
                {" • "}Valid until {coupon.validUntil}
              </p>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

export default MyCoupons;
