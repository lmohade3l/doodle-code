import { useQueryClient } from '@tanstack/react-query';
import { useCountdown } from '../hooks/useCountdown';

const VALID_FOR_SECONDS = 30;

export function PriceTimer() {
  const queryClient = useQueryClient();
  const seconds = useCountdown(VALID_FOR_SECONDS, () => {
    queryClient.invalidateQueries({ queryKey: ['quotes'] });
  });

  return (
    <p className="timer">
      قیمت‌ها تا <strong>{seconds.toLocaleString('fa-IR')}</strong> ثانیه‌ی دیگر معتبرند و بعد
      به‌روز می‌شوند.
    </p>
  );
}
