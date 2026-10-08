import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateOrder } from '../hooks/useOrders';
import { formatPrice } from '../utils/format';
import { isValidMobile, isValidNationalCode } from '../utils/validators';
import type { Quote } from '../types';

const EXTRA_COVERAGE_PRICE = 350_000;

type Props = {
  quote: Quote;
  onClose: () => void;
};

type Errors = Partial<Record<'fullName' | 'nationalCode' | 'mobile', string>>;

export function OrderForm({ quote, onClose }: Props) {
  const navigate = useNavigate();
  const { mutate, isError } = useCreateOrder();

  const [fullName, setFullName] = useState('');
  const [nationalCode, setNationalCode] = useState('');
  const [mobile, setMobile] = useState('');
  const [extraCoverage, setExtraCoverage] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const total = quote.price + (extraCoverage ? EXTRA_COVERAGE_PRICE : 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const nextErrors: Errors = {};
    if (fullName.trim().length < 3) nextErrors.fullName = 'نام و نام خانوادگی را کامل وارد کنید';
    if (!isValidNationalCode(nationalCode)) nextErrors.nationalCode = 'کد ملی باید ۱۰ رقم باشد';
    if (!isValidMobile(mobile)) nextErrors.mobile = 'شماره موبایل معتبر نیست';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    mutate(
      { quoteId: quote.id, fullName, nationalCode, mobile, extraCoverage },
      {
        onSuccess: () => {
          onClose();
          navigate('/orders');
        },
      }
    );
  };

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={handleSubmit} noValidate>
        <h2>خرید بیمه {quote.company}</h2>
        <p className="muted">
          طرح {quote.plan} · {quote.coverage}
        </p>

        <div className="field">
          <label htmlFor="fullName">نام و نام خانوادگی</label>
          <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>

        <div className="field">
          <label htmlFor="nationalCode">کد ملی</label>
          <input
            id="nationalCode"
            inputMode="numeric"
            value={nationalCode}
            onChange={(e) => setNationalCode(e.target.value)}
          />
          {errors.nationalCode && <span className="error">{errors.nationalCode}</span>}
        </div>

        <div className="field">
          <label htmlFor="mobile">شماره موبایل</label>
          <input
            id="mobile"
            inputMode="numeric"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          {errors.mobile && <span className="error">{errors.mobile}</span>}
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={extraCoverage}
            onChange={(e) => setExtraCoverage(e.target.checked)}
          />
          پوشش حوادث راننده ({formatPrice(EXTRA_COVERAGE_PRICE)})
        </label>

        <p className="total">
          مبلغ قابل پرداخت: <strong>{formatPrice(total)}</strong>
        </p>

        {isError && <p className="error">ثبت سفارش با مشکل مواجه شد. دوباره تلاش کنید.</p>}

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            انصراف
          </button>
          <button type="submit" className="primary">
            ثبت سفارش
          </button>
        </div>
      </form>
    </div>
  );
}
