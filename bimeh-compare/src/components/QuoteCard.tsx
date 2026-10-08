import { useCompare } from '../context/CompareContext';
import { formatPrice } from '../utils/format';
import type { Quote } from '../types';

type Props = {
  quote: Quote;
  isCheapest: boolean;
  onBuy: (quote: Quote) => void;
};

export function QuoteCard({ quote, isCheapest, onBuy }: Props) {
  const compare = useCompare();
  const inCompare = compare.has(quote.id);

  return (
    <li className="card">
      {isCheapest && <span className="badge">ارزان‌ترین</span>}
      <div className="card-info">
        <strong>بیمه {quote.company}</strong>
        <span className="muted">
          طرح {quote.plan} · {quote.coverage}
        </span>
      </div>
      <span className="price">{formatPrice(quote.price)}</span>
      <div className="card-actions">
        <button onClick={() => compare.toggle(quote)}>
          {inCompare ? 'حذف از مقایسه' : 'مقایسه'}
        </button>
        <button className="primary" onClick={() => onBuy(quote)}>
          خرید
        </button>
      </div>
    </li>
  );
}
