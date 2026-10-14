import { Link, useParams, useSearchParams } from 'react-router-dom';
import { usePayInstallment, usePolicy } from '../hooks/usePolicies';
import { StatusBadge } from '../components/StatusBadge';
import { formatJalali, formatToman } from '../utils/format';

export function PolicyDetailPage() {
  const { id = '' } = useParams();
  const { data: policy, isLoading, isError } = usePolicy(id);
  const pay = usePayInstallment();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? '';

  if (isLoading) return <p className="status">در حال دریافت...</p>;
  if (isError || !policy) return <p className="status">بیمه‌نامه پیدا نشد.</p>;

  return (
    <div className="page">
      <Link to={`/policies?tab=${tab}`} className="back">
        → بازگشت به بیمه‌نامه‌ها
      </Link>

      <section className="card">
        <div className="card-head">
          <h2>{policy.title}</h2>
          <StatusBadge status={policy.status} />
        </div>
        <dl className="details">
          <dt>شماره</dt>
          <dd>{policy.number}</dd>
          <dt>بیمه‌گر</dt>
          <dd>{policy.insurer}</dd>
          <dt>شروع</dt>
          <dd>{formatJalali(policy.startDate)}</dd>
          <dt>پایان</dt>
          <dd>{formatJalali(policy.endDate)}</dd>
          <dt>حق بیمه</dt>
          <dd>{formatToman(policy.premium)}</dd>
        </dl>
      </section>

      <section className="card">
        <h3>اقساط</h3>
        <table className="installments">
          <thead>
            <tr>
              <th>#</th>
              <th>سررسید</th>
              <th>مبلغ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {policy.installments.map((inst) => (
              <tr key={inst.n}>
                <td>{inst.n}</td>
                <td>{formatJalali(inst.dueDate)}</td>
                <td>{formatToman(inst.amount)}</td>
                <td>
                  {inst.paid ? (
                    <span className="paid">پرداخت‌شده ✓</span>
                  ) : (
                    <button
                      className="primary"
                      disabled={pay.isPending}
                      onClick={() => pay.mutate({ policyId: policy.id, n: inst.n })}
                    >
                      پرداخت
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pay.isError && <p className="error">پرداخت انجام نشد.</p>}
      </section>
    </div>
  );
}
