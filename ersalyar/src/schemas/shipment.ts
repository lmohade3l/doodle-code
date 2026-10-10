import { z } from 'zod';

export const shipmentSchema = z.object({
  receiver: z.string().trim().min(3, 'نام گیرنده را کامل وارد کنید'),
  city: z.string().min(1, 'شهر مقصد را انتخاب کنید'),
  weightKg: z
    .number({ invalid_type_error: 'وزن باید عدد باشد', required_error: 'وزن را وارد کنید' })
    .positive('وزن باید بیشتر از صفر باشد')
    .max(30, 'حداکثر وزن ۳۰ کیلوگرم است'),
  hasCod: z.boolean(),
  codAmount: z.preprocess(
    (v) => (v === '' || v == null || (typeof v === 'number' && Number.isNaN(v)) ? undefined : v),
    z.number().positive('مبلغ باید بیشتر از صفر باشد').optional(),
  ),
}).superRefine((data, ctx) => {
  if (data.hasCod && data.codAmount === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['codAmount'],
      message: 'مبلغ پرداخت در محل را وارد کنید',
    });
  }
});

export type ShipmentForm = z.infer<typeof shipmentSchema>;
