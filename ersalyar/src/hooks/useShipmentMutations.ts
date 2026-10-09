import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelShipment, createShipment } from '../api/shipments';
import type { ShipmentDetail } from '../types';

export function useCancelShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelShipment,
    // به‌روزرسانی خوش‌بینانه: کاربر فوراً نتیجه رو ببینه
    onMutate: () => {
      queryClient.setQueryData<ShipmentDetail>(['shipment'], (old) =>
        old ? { ...old, status: 'CANCELLED' } : old
      );
    },
  });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    },
  });
}
