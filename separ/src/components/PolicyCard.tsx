import { memo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { daysUntil, formatJalali, formatToman } from '../utils/format';
import { estimateClaimRisk } from '../utils/risk';
import { StatusBadge } from './StatusBadge';
import type { PolicyListItem } from '../types';

type Props = {
  policy: PolicyListItem;
  selected: boolean;
  onCompare: () => void;
};

export const PolicyCard = memo(function PolicyCard({ policy, selected, onCompare }: Props) {
  const { now } = useAuth();
  const risk = estimateClaimRisk(policy);
  const daysLeft = daysUntil(policy.endDate, now);
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? '';

  return (
    <article className={selected ? 'card policy-card policy-card--selected' : 'card policy-card'}>
      <div className="card-head">
        <Link to={`/policies/${policy.id}?tab=${tab}`} className="policy-title">
          {policy.title}
        </Link>
        <StatusBadge status={policy.status} />
      </div>
      <div className="muted">
        {policy.number} · {policy.insurer}
      </div>
      <dl className="mini">
        <dt>حق بیمه</dt>
        <dd>{formatToman(policy.premium)}</dd>
        <dt>انقضا</dt>
        <dd>{daysLeft > 0 ? `${daysLeft} روز دیگر` : formatJalali(policy.endDate)}</dd>
        <dt>قسط بعدی</dt>
        <dd>{policy.nextDue ? `${formatJalali(policy.nextDue.dueDate)} · پرداخت‌نشده` : 'تسویه‌شده'}</dd>
        <dt>ریسک خسارت</dt>
        <dd>{risk}٪</dd>
      </dl>
      <label className="compare">
        <input type="checkbox" checked={selected} onChange={onCompare} /> مقایسه
      </label>
    </article>
  );
});
