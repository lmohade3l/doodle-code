import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { NewShipmentPage } from './pages/NewShipmentPage';
import { ShipmentDetailPage } from './pages/ShipmentDetailPage';
import { ShipmentsPage } from './pages/ShipmentsPage';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<ShipmentsPage />} />
          <Route path="/shipments/:id" element={<ShipmentDetailPage />} />
          <Route path="/new" element={<NewShipmentPage />} />
        </Routes>
      </main>
    </div>
  );
}
