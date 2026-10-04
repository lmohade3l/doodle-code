import type { InsuranceType, Quote } from './types';

const DATA: Record<InsuranceType, Quote[]> = {
  'third-party': [
    { id: 'tp-1', company: 'بیمه ایران', price: 4_200_000 },
    { id: 'tp-2', company: 'بیمه آسیا', price: 3_850_000 },
    { id: 'tp-3', company: 'بیمه پارسیان', price: 4_050_000 },
    { id: 'tp-4', company: 'بیمه دانا', price: 3_990_000 },
  ],
  body: [
    { id: 'b-1', company: 'بیمه ایران', price: 9_800_000 },
    { id: 'b-2', company: 'بیمه سامان', price: 11_200_000 },
    { id: 'b-3', company: 'بیمه کوثر', price: 10_400_000 },
  ],
};

// شبیه‌سازی API: بعد از ۴۰۰ms لیست قیمت‌ها رو برمی‌گردونه
export function fetchQuotes(type: InsuranceType): Promise<Quote[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DATA[type].map((q) => ({ ...q }))), 400);
  });
}
