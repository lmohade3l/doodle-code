import { useCompare } from '../context/CompareContext';
import { formatPrice, toEnglishDigits } from '../utils/format';

export function CompareBar() {
  const { items, remove, clear } = useCompare();
  if (items.length === 0) return null;

  console.log({items})

  const total = items.reduce((sum, q) => sum + Number(toEnglishDigits(q.price.toString())), 0);

  return (
    <div className='compare-bar-container'>
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
    </div>
  );
}
