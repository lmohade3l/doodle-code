import { useState } from 'react';
import type { Quote } from './types';

type Props = {
  quote: Quote;
  onRemove: (id: string) => void;
};

export function QuoteCard({ quote, onRemove }: Props) {
  const [selected, setSelected] = useState(false);

  return (
    <li className={`card ${selected ? 'card--selected' : ''}`}>
      <label>
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => setSelected(e.target.checked)}
        />
        مقایسه
      </label>
      <span className="company">{quote.company}</span>
      <span className="price">{quote.price.toLocaleString('fa-IR')} ریال</span>
      <button onClick={() => onRemove(quote.id)}>حذف</button>
    </li>
  );
}
