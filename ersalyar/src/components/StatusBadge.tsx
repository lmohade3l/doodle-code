import type { ShipmentStatus } from '../types';

const LABELS: Record<ShipmentStatus, string> = {
  PENDING: 'در انتظار',
  IN_TRANSIT: 'در راه',
  DELIVERED: 'تحویل‌شده',
  CANCELLED: 'لغوشده',
};

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  return <span className={`badge badge--${status.toLowerCase()}`}>{LABELS[status]}</span>;
}
