import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { formatDateTime, formatPrice, formatWeight } from '../utils/format';
import type { Shipment } from '../types';

export function ShipmentTable({ items }: { items: Shipment[] }) {
  return (
    <div className="table-wrap">
      <table className="shipments">
        <thead>
          <tr>
            <th>کد رهگیری</th>
            <th>گیرنده</th>
            <th>شهر</th>
            <th>وزن</th>
            <th>هزینه‌ی ارسال</th>
            <th>پرداخت در محل</th>
            <th>وضعیت</th>
            <th>تاریخ ثبت</th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id}>
              <td>
                <Link to={`/shipments/${s.id}`} className="code">
                  {s.trackingCode}
                </Link>
              </td>
              <td>{s.receiver}</td>
              <td>{s.city}</td>
              <td>{formatWeight(s.weightKg)}</td>
              <td>{formatPrice(s.cost)}</td>
              <td>{s.cod > 0 ? formatPrice(s.cod) : '—'}</td>
              <td>
                <StatusBadge status={s.status} />
              </td>
              <td>{formatDateTime(s.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
