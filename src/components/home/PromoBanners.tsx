import { Users, Gift } from "lucide-react";

const PromoBanners = () => {
  return (
    <section className="py-8 bg-background">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Group Shopping Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-pink-soft to-secondary p-6 md:p-8 group cursor-pointer hover:shadow-hover transition-all duration-300">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Group Shopping</span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
                Save More with Group Shopping!
              </h3>
              <p className="text-muted-foreground text-sm mb-4 max-w-xs">
                Team up with friends and family to unlock exclusive group discounts on your favorite beauty products.
              </p>
              <button className="btn-primary text-sm">
                Start Group Shopping
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 md:w-48 md:h-48 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute right-8 bottom-8 text-6xl md:text-8xl opacity-20 group-hover:opacity-30 transition-opacity">
              👥
            </div>
          </div>

          {/* Gift Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-pink-medium/20 to-primary/5 p-6 md:p-8 group cursor-pointer hover:shadow-hover transition-all duration-300">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Special Offer</span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
                Get Surprise Gift!
              </h3>
              <p className="text-muted-foreground text-sm mb-4 max-w-xs">
                Subscribe now and receive exclusive surprise gifts with every order over ৳2000.
              </p>
              <button className="btn-outline text-sm">
                Subscribe Now
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 md:w-48 md:h-48 bg-primary/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute right-8 bottom-8 text-6xl md:text-8xl opacity-20 group-hover:opacity-30 transition-opacity">
              🎁
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
