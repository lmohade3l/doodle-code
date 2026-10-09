import { useQuery } from '@tanstack/react-query';
import { fetchStats } from '../api/shipments';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    staleTime: Infinity,
  });
}
