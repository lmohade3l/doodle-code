import { NavLink } from 'react-router-dom';
import { useStats } from '../hooks/useStats';

export function Header() {
  const { data: stats } = useStats();

  return (
    <header className="header">
      <h1>ارسال‌یار</h1>
      <nav>
        <NavLink to="/" end>
          مرسوله‌ها
        </NavLink>
        <NavLink to="/new">مرسوله‌ی جدید</NavLink>
      </nav>
      <span className="in-transit">
        در راه: <strong>{stats ? stats.IN_TRANSIT.toLocaleString('fa-IR') : '…'}</strong>
      </span>
    </header>
  );
}
