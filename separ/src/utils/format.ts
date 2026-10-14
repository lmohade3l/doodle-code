const nf = new Intl.NumberFormat('fa-IR');

/** مبلغ ریالی → نمایش به تومان */
export function formatToman(rial: number) {
  return `${nf.format(Math.round(rial / 10))} تومان`;
}

/** تاریخ YYYY-MM-DD → تاریخ شمسی خوانا */
export function formatJalali(date: string) {
  return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    new Date(date)
  );
}

export function formatClock(ts: number) {
  return new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(ts);
}

export function daysUntil(date: string, now: number) {
  return Math.ceil((new Date(date).getTime() - now) / 86_400_000);
}
