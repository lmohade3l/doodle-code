import { useMemo, useState } from 'react';
import { Filters } from '../components/Filters';
import { OrderForm } from '../components/OrderForm';
import { Pagination } from '../components/Pagination';
import { PriceTimer } from '../components/PriceTimer';
import { QuoteCard } from '../components/QuoteCard';
import { PAGE_SIZE, useQuotes } from '../hooks/useQuotes';
import type { InsuranceType, Quote, SortOrder } from '../types';
import { useCompare } from '../context/CompareContext';

export function QuotesPage() {
  const [type, setType] = useState<InsuranceType>('third-party');
  const [sort, setSort] = useState<SortOrder>('default');
  const [company, setCompany] = useState('');
  const [page, setPage] = useState(1);
  const [buying, setBuying] = useState<Quote | null>(null);

  const resetFilters = () => {
    setType('third-party')
    setSort('default')
    setCompany('')
  }

  const { data, isLoading, error } = useQuotes({ type, page, company });

  const { items: comparedItems} = useCompare();

  const items = useMemo(() => {
    return data?.items ? (sort === 'price-asc' ? data?.items.sort((a, b) => a.price - b.price) :
      sort === 'price-desc' ? data?.items.sort((a, b) => b.price - a.price) :
        sort === 'default' ? data?.items :
          []) : []
  }, [sort, data])

  // console.log({sort} , {items})

  const cheapest = items && items.length > 0 ? Math.min(...items.map((q) => q.price)) : null;

  return (
    <div className="page">
      <Filters
        type={type}
        sort={sort}
        company={company}
        onTypeChange={(type) => {
          setType(type)
          setPage(1)
        }}
        onSortChange={setSort}
        onCompanyChange={setCompany}
        resetFilters={resetFilters}
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
              disableCompare={comparedItems?.length > 2}
            />
          ))}
        </ul>
      )}

      {data && <Pagination page={page} total={data.total} pageSize={PAGE_SIZE} onChange={setPage} />}

      {buying && <OrderForm quote={buying} onClose={() => setBuying(null)} />}

      {error && (
        <p>{error?.response?.data?.message || 'خطایی رخ داد'}</p>

      )}
    </div>
  );
}
