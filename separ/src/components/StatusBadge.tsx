import type { PolicyStatus } from '../types';

const LABELS: Record<PolicyStatus, string> = {
  ACTIVE: 'فعال',
  EXPIRED: 'منقضی',
  PENDING_PAYMENT: 'در انتظار پرداخت',
};

export function StatusBadge({ status }: { status: PolicyStatus }) {
  return <span className={`badge badge--${status.toLowerCase()}`}>{LABELS[status]}</span>;
}
