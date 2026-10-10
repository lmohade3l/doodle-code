import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useCreateShipment } from '../hooks/useShipmentMutations';
import { shipmentSchema, type ShipmentForm } from '../schemas/shipment';
import { CITIES, calculateCost } from '../utils/pricing';
import { formatPrice } from '../utils/format';

export function NewShipmentPage() {
  const navigate = useNavigate();
  const create = useCreateShipment();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ShipmentForm>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: { receiver: '', city: '', hasCod: false },
  });

  const weight = watch('weightKg');
  const city = watch('city');
  const hasCod = watch('hasCod');

  console.log({errors})

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const estimatedCost = useMemo(() => calculateCost(city, Number(weight)), [weight , city]);

  const onSubmit = (values: ShipmentForm) => {
    create.mutate(
      {
        receiver: values.receiver,
        city: values.city,
        weightKg: values.weightKg,
        cod: values.hasCod ? Number(values.codAmount) : 0,
      },
      { onSuccess: () => navigate('/') }
    );
  };

  return (
    <div className="page">
      <form className="card form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2>ثبت مرسوله‌ی جدید</h2>

        <div className="field">
          <label htmlFor="receiver">نام گیرنده</label>
          <input id="receiver" {...register('receiver')} />
          {errors.receiver && <span className="error">{errors.receiver.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="city">شهر مقصد</label>
          <select id="city" {...register('city')}>
            <option value="">انتخاب کنید</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.city && <span className="error">{errors.city.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="weightKg">وزن (کیلوگرم)</label>
          <input id="weightKg" type="number" step={.5} {...register('weightKg', { valueAsNumber: true })} />
          {errors.weightKg && <span className="error">{errors.weightKg.message}</span>}
        </div>

        <label className="checkbox">
          <input type="checkbox" {...register('hasCod')} />
          پرداخت در محل
        </label>

        {hasCod && (
          <div className="field">
            <label htmlFor="codAmount">مبلغ پرداخت در محل (ریال)</label>
            <input id="codAmount" type="number" {...register('codAmount')} />
            {errors.codAmount && <span className="error">{errors.codAmount.message}</span>}
          </div>
        )}

        <p className="total">
          هزینه‌ی تخمینی ارسال: <strong>{estimatedCost ? formatPrice(estimatedCost) : '—'}</strong>
        </p>

        {create.isError && <p className="error">ثبت مرسوله با مشکل مواجه شد.</p>}

        <div className="form-actions">
          <button type="submit" className="primary" disabled={create.isPending}>
            {create.isPending ? 'در حال ثبت...' : 'ثبت مرسوله'}
          </button>
        </div>
      </form>
    </div>
  );
}
