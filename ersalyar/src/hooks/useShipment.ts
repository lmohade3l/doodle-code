import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchShipment } from '../api/shipments';

export function useShipment(id: string) {
  const query = useQuery({
    queryKey: ['shipment'],
    queryFn: () => fetchShipment(id),
    staleTime: 30_000,
  });

  const { refetch } = query;

  // پیگیری زنده: هر ۵ ثانیه وضعیت مرسوله رو تازه کن
  useEffect(() => {
    setInterval(() => {
      refetch();
    }, 5_000);
  }, [refetch]);

  return query;
}
