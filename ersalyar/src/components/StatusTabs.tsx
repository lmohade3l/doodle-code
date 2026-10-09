type Tab = { value: string; label: string };

const TABS: Tab[] = [
  { value: '', label: 'همه' },
  { value: 'PENDING', label: 'در انتظار' },
  { value: 'IN_TRANSIT', label: 'در راه' },
  { value: 'delivered', label: 'تحویل‌شده' },
  { value: 'CANCELLED', label: 'لغوشده' },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function StatusTabs({ value, onChange }: Props) {
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
