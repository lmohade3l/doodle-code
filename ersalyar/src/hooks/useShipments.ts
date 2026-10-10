import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchShipments } from '../api/shipments';

export function useShipments(status: string, q: string) {
  return useInfiniteQuery({
    queryKey: ['shipments', status, q],
    queryFn: ({ pageParam }) => fetchShipments({ status, q, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });
}
