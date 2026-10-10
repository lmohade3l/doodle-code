import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchShipment } from '../api/shipments';
import { QUERY_KEYS } from '../api/querykeys';

export function useShipment(id: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.SINGLE_SHIPMENT],
    queryFn: () => fetchShipment(id),
    refetchInterval: 5_000,
    staleTime: 0
  });

  return query;
}
