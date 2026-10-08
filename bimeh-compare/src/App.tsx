import { NavLink, Route, Routes } from 'react-router-dom';
import { CompareBar } from './components/CompareBar';
import { OrdersPage } from './pages/OrdersPage';
import { QuotesPage } from './pages/QuotesPage';

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>بیمه‌یاب</h1>
        <nav>
          <NavLink to="/" end>
            مقایسه‌ی قیمت
          </NavLink>
          <NavLink to="/orders">سفارش‌های من</NavLink>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<QuotesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </main>

      <CompareBar />
    </div>
  );
}
