export function formatPrice(value: number) {
  return `${value.toLocaleString('fa-IR')} تومان`;
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('fa-IR', { dateStyle: 'medium', timeStyle: 'short' });
}

export function formatWeight(kg: number) {
  return `${kg.toLocaleString('fa-IR')} کیلوگرم`;
}
