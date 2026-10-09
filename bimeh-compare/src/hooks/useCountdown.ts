import { useEffect, useState } from 'react';

// از `initial` تا صفر می‌شماره. به صفر که رسید onExpire رو صدا می‌زنه و از اول شروع می‌کنه.
export function useCountdown(initial: number, onExpire: () => void) {
  const [seconds, setSeconds] = useState(initial);

  useEffect(() => {
    const id = setInterval(() => {
      if (seconds > 0) setSeconds((prev) => prev -1);
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      onExpire();
      setSeconds(initial);
    }
  }, [seconds, initial, onExpire]);

  return seconds;
}
