import { useQuery } from '@tanstack/react-query';
import { fetchStats } from '../api/shipments';
import { QUERY_KEYS } from '../api/querykeys';

export function useStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.STATS],
    queryFn: fetchStats,
    staleTime: 10_000,
  });
}
