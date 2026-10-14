/**
 * مقدار <input type="date"> (مثل "2026-10-11") رو به فرمتی که API می‌خواد تبدیل می‌کنه.
 */
// export function toApiDate(value: string) {
//   const [y, m, d] = value.split('-').map(Number);
//   return new Date(y, m - 1, d).toISOString().slice(0, 10);
// }

export function toApiDate(value: string) {
  const [y, m, d] = value.split('-').map(Number);
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
