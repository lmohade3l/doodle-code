import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RequireAuth } from './auth/RequireAuth';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { PolicyDetailPage } from './pages/PolicyDetailPage';
import { TravelPage } from './pages/TravelPage';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RequireAuth><DashboardPage /></RequireAuth>} />
          <Route path="/policies" element={<RequireAuth><PoliciesPage /></RequireAuth>} />
          <Route path="/policies/:id" element={<RequireAuth><PolicyDetailPage /></RequireAuth>} />
          <Route path="/travel" element={<RequireAuth><TravelPage /></RequireAuth>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
