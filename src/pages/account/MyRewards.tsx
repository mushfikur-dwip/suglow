import { Gift, Star, TrendingUp } from "lucide-react";
import AccountLayout from "@/components/account/AccountLayout";

const MyRewards = () => {
  const totalPoints = 250;
  const nextTierPoints = 500;

  return (
    <AccountLayout title="My Rewards" breadcrumb="My Rewards">
      {/* Points Summary */}
      <div className="bg-gradient-to-r from-primary/10 to-pink-soft rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground mb-1">Your Points Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">
                {totalPoints}
              </span>
              <span className="text-muted-foreground">points</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Gift className="w-10 h-10 text-primary" />
            <div>
              <p className="font-medium text-foreground">Silver Member</p>
              <p className="text-sm text-muted-foreground">
                {nextTierPoints - totalPoints} points to Gold
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(totalPoints / nextTierPoints) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0</span>
            <span>{nextTierPoints} points</span>
          </div>
        </div>
      </div>

      {/* How to Earn */}
      <div className="mb-8">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          How to Earn Points
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 border border-border rounded-xl">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Make a Purchase</p>
              <p className="text-sm text-muted-foreground">
                Earn 1 point for every ৳10 spent
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border border-border rounded-xl">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Write Reviews</p>
              <p className="text-sm text-muted-foreground">
                Earn 10 points per review
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border border-border rounded-xl">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Refer Friends</p>
              <p className="text-sm text-muted-foreground">
                Earn 50 points per referral
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground">Order #ORD-2024-001</p>
              <p className="text-sm text-muted-foreground">Dec 28, 2024</p>
            </div>
            <span className="text-green-600 font-medium">+305 points</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground">Product Review</p>
              <p className="text-sm text-muted-foreground">Dec 25, 2024</p>
            </div>
            <span className="text-green-600 font-medium">+10 points</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground">Redeemed Coupon</p>
              <p className="text-sm text-muted-foreground">Dec 20, 2024</p>
            </div>
            <span className="text-red-500 font-medium">-100 points</span>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default MyRewards;
