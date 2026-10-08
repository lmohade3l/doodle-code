import { useCompare } from '../context/CompareContext';
import { formatPrice } from '../utils/format';

export function CompareBar() {
  const { items, remove, clear } = useCompare();
  if (items.length === 0) return null;

  const total = items.reduce((sum, q) => sum + q.price, 0);

  return (
    <aside className="compare-bar">
      <div className="compare-items">
        {items.map((q) => (
          <span key={q.id} className="chip">
            {q.company} ({q.plan})
            <button aria-label={`حذف ${q.company}`} onClick={() => remove(q.id)}>
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="compare-summary">
        <span>
          {items.length.toLocaleString('fa-IR')} مورد · جمع: <strong>{formatPrice(total)}</strong>
        </span>
        <button onClick={clear}>پاک کردن</button>
      </div>
    </aside>
  );
}
