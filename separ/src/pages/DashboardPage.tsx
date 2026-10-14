import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useDashboard } from '../hooks/useDashboard';
import { formatJalali, formatToman } from '../utils/format';
import { useAuth } from '../auth/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { summary, expiring, notifications } = useDashboard();

  return (
    <div className="page">
      <div className="page-head">
        <h2>سلام {user?.name}</h2>
        <button onClick={() => queryClient.invalidateQueries({ queryKey: ['dashboard'] })}>به‌روزرسانی</button>
      </div>

      <section className="stats">
        <div className="stat card">
          <span className="muted">بیمه‌نامه‌ی فعال</span>
          <strong>{summary.data?.active ?? '—'}</strong>
        </div>
        <div className="stat card">
          <span className="muted">در انتظار پرداخت</span>
          <strong>{summary.data?.pendingPayment ?? '—'}</strong>
        </div>
        <div className="stat card">
          <span className="muted">مجموع اقساط پرداخت‌نشده</span>
          <strong className="unpaid-total">{summary.data ? formatToman(summary.data.unpaidTotal) : '—'}</strong>
        </div>
      </section>

      <section className="card">
        <h3>اعلان‌ها</h3>
        {notifications.isLoading && <p className="muted">...</p>}
        <ul className="notifications">
          {notifications.data?.map((n) => <li key={n.id}>{n.text}</li>)}
        </ul>
      </section>

      <section className="card">
        <h3>نزدیک به انقضا</h3>
        {expiring.isLoading && <p className="muted">...</p>}
        <ul className="expiring">
          {expiring.data?.map((p) => (
            <li key={p.id}>
              <Link to={`/policies/${p.id}`}>{p.title}</Link>
              <span className="muted"> · تا {formatJalali(p.endDate)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
