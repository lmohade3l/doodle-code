import { useOrders } from '../hooks/useOrders';
import { formatDate, formatPrice } from '../utils/format';

export function OrdersPage() {
  const { data, isLoading, isError } = useOrders();

  if (isLoading) return <p className="status">در حال دریافت سفارش‌ها...</p>;
  if (isError) return <p className="status error">دریافت سفارش‌ها با مشکل مواجه شد.</p>;
  if (!data || data.length === 0) return <p className="status">هنوز سفارشی ثبت نکرده‌اید.</p>;

  return (
    <div className="page">
      <h2>سفارش‌های من ({data.length.toLocaleString('fa-IR')})</h2>
      <table className="orders">
        <thead>
          <tr>
            <th>شرکت</th>
            <th>نام</th>
            <th>کد ملی</th>
            <th>مبلغ</th>
            <th>تاریخ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr key={order.id}>
              <td>بیمه {order.company}</td>
              <td>{order.fullName}</td>
              <td>{order.nationalCode}</td>
              <td>{formatPrice(order.total)}</td>
              <td>{formatDate(order.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
