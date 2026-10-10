import { useStats } from "../hooks/useStats";

type Tab = { value: string; label: string };


type Props = {
  value: string;
  onChange: (value: string) => void;
};

const TABS: Tab[] = [
  { value: '', label: 'همه' },
  { value: 'PENDING', label: 'در انتظار' },
  { value: 'IN_TRANSIT', label: 'در راه' },
  { value: 'DELIVERED', label: 'تحویل‌شده' },
  { value: 'CANCELLED', label: 'لغوشده' },
];
export function StatusTabs({ value, onChange }: Props) {
  const { data } = useStats()

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
          {tab.label + (data?.[tab.value] ?? '')}
        </button>
      ))}
    </div>
  );
}
