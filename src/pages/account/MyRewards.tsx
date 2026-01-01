import { Gift, Star, TrendingUp, Loader2 } from "lucide-react";
import AccountLayout from "@/components/account/AccountLayout";
import { useRewards } from "@/hooks/useRewards";

const MyRewards = () => {
  const { data: rewardsData, isLoading } = useRewards();
  
  const totalPoints = rewardsData?.data?.totalPoints || 0;
  const history = rewardsData?.data?.history || [];
  const nextTierPoints = 500;

  if (isLoading) {
    return (
      <AccountLayout title="My Rewards" breadcrumb="My Rewards">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AccountLayout>
    );
  }

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
              <p className="font-medium text-foreground">
                {totalPoints >= 500 ? 'Gold' : totalPoints >= 250 ? 'Silver' : 'Bronze'} Member
              </p>
              <p className="text-sm text-muted-foreground">
                {totalPoints < 500 ? `${nextTierPoints - totalPoints} points to next tier` : 'Top Tier Achieved!'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min((totalPoints / nextTierPoints) * 100, 100)}%` }}
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
              <p className="font-medium text-foreground">Birthday Bonus</p>
              <p className="text-sm text-muted-foreground">
                Get 50 points on your birthday
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Points History */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Points History
        </h3>
        {history.length === 0 ? (
          <div className="text-center py-8 border border-border rounded-xl">
            <Gift className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No reward points yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start shopping to earn your first points!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-border rounded-xl"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className={`font-bold ${item.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.points > 0 ? '+' : ''}{item.points}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default MyRewards;
