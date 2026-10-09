import { z } from 'zod';

export const shipmentSchema = z.object({
  receiver: z.string().trim().min(3, 'نام گیرنده را کامل وارد کنید'),
  city: z.string().min(1, 'شهر مقصد را انتخاب کنید'),
  weightKg: z
    .number({ invalid_type_error: 'وزن باید عدد باشد', required_error: 'وزن را وارد کنید' })
    .positive('وزن باید بیشتر از صفر باشد')
    .max(30, 'حداکثر وزن ۳۰ کیلوگرم است'),
  hasCod: z.boolean(),
  codAmount: z
    .number({
      invalid_type_error: 'مبلغ را به عدد وارد کنید',
      required_error: 'مبلغ پرداخت در محل را وارد کنید',
    })
    .positive('مبلغ باید بیشتر از صفر باشد'),
});

export type ShipmentForm = z.infer<typeof shipmentSchema>;
