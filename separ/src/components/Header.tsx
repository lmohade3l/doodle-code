import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { formatClock } from '../utils/format';

export function Header() {
  const { user, now, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-inner">
        <strong className="brand">{import.meta.env.VITE_APP_NAME}</strong>
        {user && (
          <nav className="nav">
            <NavLink to="/" end>داشبورد</NavLink>
            <NavLink to="/policies">بیمه‌نامه‌ها</NavLink>
            <NavLink to="/travel">بیمه‌ی مسافرتی</NavLink>
          </nav>
        )}
        <div className="header-side">
          <span className="clock">{formatClock(now)}</span>
          {user && (
            <>
              <span className="muted">{user.name}</span>
              <button className="link" onClick={logout}>
                خروج
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
