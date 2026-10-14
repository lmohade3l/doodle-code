export const TABS = [
  { value: '', label: 'همه' },
  { value: 'ACTIVE', label: 'فعال' },
  { value: 'PENDING_PAYMENT', label: 'در انتظار پرداخت' },
  { value: 'EXPIRED', label: 'منقضی' },
] as const;

export type StatusFilter = (typeof TABS)[number]['value'];

export function StatusTabs({ value, onChange }: { value: StatusFilter; onChange: (v: StatusFilter) => void }) {
  return (
    <div className="tabs" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={tab.value === value}
          className={tab.value === value ? 'tab tab--active' : 'tab'}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
