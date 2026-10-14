import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePolicies } from '../hooks/usePolicies';
import { useDebounce } from '../hooks/useDebounce';
import { PolicyCard } from '../components/PolicyCard';
import { StatusTabs, TABS, type StatusFilter } from '../components/StatusTabs';
import { CompareBar } from '../components/CompareBar';

const isValidTab = (value: string): value is StatusFilter =>
  TABS.some((t) => t.value === value);

export function PoliciesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') ?? '1';
  const tab = searchParams.get('tab')

  const [status, setStatus] = useState<StatusFilter>(tab && isValidTab(tab) ? tab : '');
  const [sort, setSort] = useState('endDate');
  const [search, setSearch] = useState('');
  const q = useDebounce(search, 400);

  const [compare, setCompare] = useState<string[]>([]);
  const toggleCompare = (id: string) =>
    setCompare((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-3)));

  const { data, isLoading, isError, refetch } = usePolicies({ status, sort, q, page: Number(page) });

  return (
    <div className="page">
      <h2>بیمه‌نامه‌های من</h2>

      <div className="toolbar">
        <StatusTabs
          value={status}
          onChange={(v) => {
            setStatus(v);
            setSearchParams({ tab: v });
          }}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="مرتب‌سازی">
          <option value="endDate">نزدیک‌ترین انقضا</option>
          <option value="premium">بیشترین حق بیمه</option>
        </select>
        <input
          className="search"
          placeholder="جستجو: شماره، عنوان یا بیمه‌گر"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && <p className="status">در حال دریافت...</p>}
      {isError && (
        <p className="status">
          خطا در دریافت. <button onClick={() => refetch()}>تلاش دوباره</button>
        </p>
      )}
      {data && data.items.length === 0 && <p className="status">بیمه‌نامه‌ای پیدا نشد.</p>}

      <div className="grid">
        {data?.items.map((p) => (
          <PolicyCard
            key={p.id}
            policy={p}
            selected={compare.includes(p.id)}
            onCompare={() => toggleCompare(p.id)}
          />
        ))}
      </div>

      {data && data.totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={Number(page) <= 1}
            onClick={() => setSearchParams({ page: String(Number(page) - 1) })}
          >
            قبلی
          </button>
          <span>
            صفحه‌ی {page} از {data.totalPages}
          </span>
          <button disabled={Number(page) >= data.totalPages} onClick={() => setSearchParams({ page: (Number(page) + 1).toString() })}>
            بعدی
          </button>
        </div>
      )}

      <CompareBar count={compare.length} onClear={() => setCompare([])} />
    </div>
  );
}
