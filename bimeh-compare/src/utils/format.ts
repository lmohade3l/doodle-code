export function formatPrice(value: number) {
  return `${value.toLocaleString('fa-IR')} تومان`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR');
}

export function toEnglishDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

}
