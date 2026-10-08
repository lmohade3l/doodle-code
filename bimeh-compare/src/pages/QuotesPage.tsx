import { useState } from 'react';
import { Filters } from '../components/Filters';
import { OrderForm } from '../components/OrderForm';
import { Pagination } from '../components/Pagination';
import { PriceTimer } from '../components/PriceTimer';
import { QuoteCard } from '../components/QuoteCard';
import { PAGE_SIZE, useQuotes } from '../hooks/useQuotes';
import type { InsuranceType, Quote, SortOrder } from '../types';

export function QuotesPage() {
  const [type, setType] = useState<InsuranceType>('third-party');
  const [sort, setSort] = useState<SortOrder>('default');
  const [company, setCompany] = useState('');
  const [page, setPage] = useState(1);
  const [buying, setBuying] = useState<Quote | null>(null);

  const { data, isLoading } = useQuotes({ type, page, company });

  const items = data?.items ?? [];
  if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);

  const cheapest = items.length > 0 ? Math.min(...items.map((q) => q.price)) : null;

  return (
    <div className="page">
      <Filters
        type={type}
        sort={sort}
        company={company}
        onTypeChange={setType}
        onSortChange={setSort}
        onCompanyChange={setCompany}
      />

      <PriceTimer />

      {isLoading ? (
        <p className="status">در حال دریافت قیمت‌ها...</p>
      ) : data && items.length === 0 ? (
        <p className="status">نتیجه‌ای پیدا نشد.</p>
      ) : (
        <ul className="list">
          {items.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              isCheapest={quote.price === cheapest}
              onBuy={setBuying}
            />
          ))}
        </ul>
      )}

      {data && <Pagination page={page} total={data.total} pageSize={PAGE_SIZE} onChange={setPage} />}

      {buying && <OrderForm quote={buying} onClose={() => setBuying(null)} />}
    </div>
  );
}
