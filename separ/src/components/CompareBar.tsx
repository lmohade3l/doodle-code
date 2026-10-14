export function CompareBar({ count, onClear }: { count: number; onClear: () => void }) {
  if (count === 0) return null;
  return (
    <div className="compare-bar">
      <span>{count} بیمه‌نامه برای مقایسه انتخاب شده</span>
      <button className="link" onClick={onClear}>
        پاک کردن
      </button>
    </div>
  );
}
