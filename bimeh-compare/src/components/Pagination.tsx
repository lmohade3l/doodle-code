type Props = {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, total, pageSize, onChange }: Props) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;

  return (
    <nav className="pagination" aria-label="صفحه‌بندی">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>
        قبلی
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          className={p === page ? 'primary' : ''}
          aria-current={p === page ? 'page' : undefined}
          onClick={() => onChange(p)}
        >
          {p.toLocaleString('fa-IR')}
        </button>
      ))}
      <button disabled={page === pages} onClick={() => onChange(page + 1)}>
        بعدی
      </button>
    </nav>
  );
}
