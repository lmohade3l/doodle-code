import { useState } from 'react';
import { ShipmentTable } from '../components/ShipmentTable';
import { StatusTabs } from '../components/StatusTabs';
import { useDebounce } from '../hooks/useDebounce';
import { useShipments } from '../hooks/useShipments';

export function ShipmentsPage() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const q = useDebounce(search, 300);

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useShipments(status, q);

  const items = data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return (
    <div className="page">
      <div className="toolbar">
        <StatusTabs value={status} onChange={setStatus} />
        <div className="field">
          <label htmlFor="search">جستجوی کد رهگیری</label>
          <input
            id="search"
            value={search}
            placeholder="مثلاً EX-4814"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <p className="status">در حال دریافت مرسوله‌ها...</p>
      ) : isError ? (
        <div className="status" role="alert">
          <p>دریافت مرسوله‌ها با مشکل مواجه شد.</p>
          <button onClick={() => refetch()}>تلاش مجدد</button>
        </div>
      ) : items.length === 0 ? (
        <p className="status">مرسوله‌ای پیدا نشد.</p>
      ) : (
        <>
          <p className="muted">
            نمایش {items.length.toLocaleString('fa-IR')} از {total.toLocaleString('fa-IR')} مرسوله
          </p>
          <ShipmentTable items={items} />
          {hasNextPage && (
            <div className="more">
              <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? 'در حال دریافت...' : 'نمایش بیشتر'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
