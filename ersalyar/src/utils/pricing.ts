// تعرفه‌ها به ریال (همون جدول بک‌اند)
export const CITY_BASE: Record<string, number> = {
  'تهران': 450_000,
  'کرج': 520_000,
  'اصفهان': 650_000,
  'شیراز': 720_000,
  'مشهد': 780_000,
  'تبریز': 760_000,
  'اهواز': 820_000,
  'رشت': 640_000,
  'یزد': 700_000,
  'کرمان': 880_000,
};

export const PER_KG = 120_000;

export const CITIES = Object.keys(CITY_BASE);

export function calculateCost(city: string, weightKg: number) {
  if (!city || !weightKg) return 0;
  return (CITY_BASE[city] ?? 0) + weightKg * PER_KG;
}
