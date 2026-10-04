import { useEffect, useState } from 'react';
import { fetchQuotes } from './api';
import { QuoteCard } from './QuoteCard';
import type { InsuranceType, Quote } from './types';

export default function App() {
  const [type, setType] = useState<InsuranceType>('third-party');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchQuotes(type).then((data) => {
      setQuotes(data);
      setLoading(false);
    });
  }, [type]);

  const sortByPrice = () => {
    setQuotes((prev) => {
      return [...prev.sort((a , b) => a.price - b.price)]
    })
  };

  const removeQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  console.log({quotes})

  return (
    <main className="container">
      <h1>مقایسه‌ی قیمت بیمه</h1>

      <div className="toolbar">
        <select value={type} onChange={(e) => setType(e.target.value as InsuranceType)}>
          <option value="third-party">شخص ثالث</option>
          <option value="body">بدنه</option>
        </select>
        <button onClick={sortByPrice}>مرتب‌سازی بر اساس قیمت</button>
      </div>

      {loading ? (
        <p>در حال دریافت قیمت‌ها...</p>
      ) : (
        <ul className="list">
          {quotes.map((quote, index) => (
            <QuoteCard key={quote?.id} quote={quote} onRemove={removeQuote} />
          ))}
        </ul>
      )}
    </main>
  );
}
