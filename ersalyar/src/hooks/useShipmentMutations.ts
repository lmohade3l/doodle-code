import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelShipment, createShipment } from '../api/shipments';
import type { ShipmentDetail } from '../types';
import { QUERY_KEYS } from '../api/querykeys';

export function useCancelShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelShipment,
    onMutate: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SINGLE_SHIPMENT, QUERY_KEYS.STATS] })
    },
  });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHIPMENT_LIST, QUERY_KEYS.STATS] });
    },
  });
}
