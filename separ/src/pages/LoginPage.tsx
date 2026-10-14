import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAuth } from '../auth/AuthContext';

export function LoginPage() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setPending(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(isAxiosError(err) ? err.response?.data?.message ?? 'خطا در ورود' : 'خطا در ورود');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="page login">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>ورود به پنل بیمه‌گذار</h2>
        <div className="field">
          <label htmlFor="username">نام کاربری</label>
          <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} dir="ltr" />
        </div>
        <div className="field">
          <label htmlFor="password">رمز عبور</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            dir="ltr"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="primary" disabled={pending}>
          {pending ? 'در حال ورود...' : 'ورود'}
        </button>
        <p className="muted hint">کاربرهای آزمایشی: mina / 1234 و reza / 1234</p>
      </form>
    </div>
  );
}
