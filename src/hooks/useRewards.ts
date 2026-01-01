import { useQuery } from '@tanstack/react-query';
import { rewardsAPI } from '@/lib/api';

// Get user rewards
export const useRewards = () => {
  return useQuery({
    queryKey: ['rewards'],
    queryFn: () => rewardsAPI.getRewards(),
  });
};
