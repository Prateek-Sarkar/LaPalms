import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import DineInOrder from './pages/DineInOrder';
import EventBooking from './pages/EventBooking';
import HomeDelivery from './pages/HomeDelivery';
import KitchenDisplay from './pages/KitchenDisplay';
import WaiterPanel from './pages/WaiterPanel';
import AdminDashboard from './pages/Admin/AdminDashboard';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderTracking from './pages/OrderTracking';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Customer Side */}
        <Route path="/home" element={<LandingPage />} />
        <Route path="/order" element={<DineInOrder />} />
        <Route path="/book" element={<EventBooking />} />
        <Route path="/delivery" element={<HomeDelivery />} />
        <Route path="/confirmation" element={<OrderConfirmation />} />
        <Route path="/track-order" element={<OrderTracking />} />

        {/* Internal Side */}
        <Route path="/kitchen" element={<KitchenDisplay />} />
        <Route path="/waiter" element={<WaiterPanel />} />

        {/* Admin Side */}
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
