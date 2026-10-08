export function formatPrice(value: number) {
  return `${value.toLocaleString('fa-IR')} تومان`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR');
}
