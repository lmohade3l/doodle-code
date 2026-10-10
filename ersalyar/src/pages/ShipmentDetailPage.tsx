import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusBadge } from '../components/StatusBadge';
import { useShipment } from '../hooks/useShipment';
import { useCancelShipment } from '../hooks/useShipmentMutations';
import { formatDateTime, formatPrice, formatWeight } from '../utils/format';

export function ShipmentDetailPage() {
  const { id = '' } = useParams();
  const { data: shipment, isLoading, isError , isFetching } = useShipment(id);
  const cancel = useCancelShipment();
  const [confirming, setConfirming] = useState(false);

  if (isLoading || isFetching) return <p className="status">در حال دریافت جزئیات...</p>;
  if (isError || !shipment) return <p className="status">مرسوله پیدا نشد.</p>;

  return (
    <>
    <div className="page">
      <Link to="/" className="back">
        → بازگشت به لیست
      </Link>

      <section className="card">
        <div className="card-head">
          <h2 className="code">{shipment.trackingCode}</h2>
          <StatusBadge status={shipment.status} />
        </div>
        <dl className="details">
          <dt>گیرنده</dt>
          <dd>{shipment.receiver}</dd>
          <dt>شهر مقصد</dt>
          <dd>{shipment.city}</dd>
          <dt>وزن</dt>
          <dd>{formatWeight(shipment.weightKg)}</dd>
          <dt>هزینه‌ی ارسال</dt>
          <dd>{formatPrice(shipment.cost)}</dd>
          <dt>پرداخت در محل</dt>
          <dd>{shipment.cod > 0 ? formatPrice(shipment.cod) : '—'}</dd>
        </dl>
      </section>

      <section className="card">
        <h3>تاریخچه‌ی مرسوله</h3>
        <ol className="timeline">
          {shipment.events.map((event, index) => (
            <li key={index}>
              <strong>{event.title}</strong>
              <span className="muted">
                {event.location} · {formatDateTime(event.at)}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {shipment.status !== 'CANCELLED' && shipment.status!=='DELIVERED' && (
        <button className="danger" onClick={() => setConfirming(true)}>
          لغو مرسوله
        </button>
      )}

    </div>
      {confirming && (
        <ConfirmDialog
          title="لغو مرسوله"
          message={`مطمئنید که می‌خواهید مرسوله‌ی ${shipment.trackingCode} را لغو کنید؟`}
          confirmLabel="بله، لغو شود"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            cancel.mutate(shipment.id);
            setConfirming(false);
          }}
        />
      )}
    </>
  );
}
