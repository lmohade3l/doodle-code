import { z } from 'zod';

export const passengerSchema = z.object({
  fullName: z.string().trim().min(3, 'نام کامل مسافر را وارد کنید'),
  birthDate: z.string().min(1, 'تاریخ تولد را وارد کنید'),
  passportNo: z.string().trim().regex(/^[A-Z]\d{8}$/, 'شماره‌ی گذرنامه: یک حرف بزرگ و ۸ رقم'),
});

export const travelSchema = z.object({
  destination: z.string().min(1, 'مقصد را انتخاب کنید'),
  startDate: z.string().min(1, 'تاریخ شروع سفر را وارد کنید'),
  passengers: z.array(passengerSchema).min(1).max(5),
});

export type TravelForm = z.infer<typeof travelSchema>;
