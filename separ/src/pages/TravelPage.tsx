import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { travelSchema, type TravelForm } from '../schemas/travel';
import { createTravelPolicy } from '../api/policies';
import { DestinationPicker } from '../components/DestinationPicker';
import { PassportScan } from '../components/PassportScan';
import { toApiDate } from '../utils/dates';
import { formatJalali, formatToman } from '../utils/format';
import type { TravelPolicy } from '../types';

const emptyPassenger = { fullName: '', birthDate: '', passportNo: '' };

export function TravelPage() {
  const [issued, setIssued] = useState<TravelPolicy | null>(null);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TravelForm>({
    resolver: zodResolver(travelSchema),
    defaultValues: { destination: '', startDate: '', passengers: [emptyPassenger] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'passengers' });
  console.log('data:' , watch('startDate') , toApiDate(watch('startDate')))

  const create = useMutation({ mutationFn: createTravelPolicy, onSuccess: setIssued });

  const onSubmit = (values: TravelForm) => {
    create.mutate({
      destination: values.destination,
      startDate: toApiDate(values.startDate),
      passengers: values.passengers.map((p) => ({ ...p, birthDate: toApiDate(p.birthDate) })),
    });
  };

  if (issued) {
    return (
      <div className="page">
        <section className="card issued">
          <h2>بیمه‌نامه‌ی مسافرتی صادر شد ✓</h2>
          <dl className="details">
            <dt>شماره</dt>
            <dd>{issued.number}</dd>
            <dt>شروع پوشش</dt>
            <dd className="issued-start">{formatJalali(issued.startDate)}</dd>
            <dt>حق بیمه</dt>
            <dd>{formatToman(issued.premium)}</dd>
          </dl>
          <h3>مسافران</h3>
          <ol className="issued-passengers">
            {issued.passengers.map((p) => (
              <li key={p.passportNo}>
                {p.fullName} · {p.passportNo}
              </li>
            ))}
          </ol>
          <button onClick={() => setIssued(null)}>صدور بیمه‌نامه‌ی جدید</button>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>بیمه‌ی مسافرتی</h2>
      <form className="card form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field">
          <label htmlFor="destination">مقصد</label>
          <DestinationPicker value={watch('destination')} onChange={(code) => setValue('destination', code)} />
          {errors.destination && <span className="error">{errors.destination.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="startDate">تاریخ شروع سفر</label>
          <input id="startDate" type="date" {...register('startDate')} />
          {errors.startDate && <span className="error">{errors.startDate.message}</span>}
        </div>

        <h3>مسافران</h3>
        {fields.map((field, index) => (
          <fieldset key={index} className="passenger">
            <legend>مسافر {index + 1}</legend>
            <div className="field">
              <label>نام و نام خانوادگی</label>
              <input {...register(`passengers.${index}.fullName`)} />
              {errors.passengers?.[index]?.fullName && (
                <span className="error">{errors.passengers[index]?.fullName?.message}</span>
              )}
            </div>
            <div className="field">
              <label>تاریخ تولد</label>
              <input type="date" {...register(`passengers.${index}.birthDate`)} />
            </div>
            <div className="field">
              <label>شماره‌ی گذرنامه</label>
              <input dir="ltr" {...register(`passengers.${index}.passportNo`)} />
              {errors.passengers?.[index]?.passportNo && (
                <span className="error">{errors.passengers[index]?.passportNo?.message}</span>
              )}
            </div>
            <PassportScan />
            {fields.length > 1 && (
              <button type="button" className="link danger-link" onClick={() => remove(index)}>
                حذف این مسافر
              </button>
            )}
          </fieldset>
        ))}
        {fields.length < 5 && (
          <button type="button" onClick={() => append(emptyPassenger)}>
            + افزودن مسافر
          </button>
        )}

        {create.isError && <p className="error">صدور بیمه‌نامه انجام نشد.</p>}
        <button type="submit" className="primary" disabled={create.isPending}>
          {create.isPending ? 'در حال صدور...' : 'صدور بیمه‌نامه'}
        </button>
      </form>
    </div>
  );
}
