import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ResourceListPage from './pages/ResourceListPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import ResourceFormPage from './pages/ResourceFormPage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import CreateBookingPage from './pages/CreateBookingPage';
import QrCheckinPage from './pages/QrCheckinPage';

const TokenHandler = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('token', token);
            navigate('/resources', { replace: true });
        }
    }, []);
    return null;
};

function App() {
    return (
        <Router>
            <TokenHandler />
            <Routes>
                <Route path="/" element={<Navigate to="/resources" />} />
                <Route path="/resources" element={<ResourceListPage />} />
                <Route path="/resources/create" element={<ResourceFormPage />} />
                <Route path="/resources/edit/:id" element={<ResourceFormPage />} />
                <Route path="/resources/:id" element={<ResourceDetailPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/bookings/create" element={<CreateBookingPage />} />
                <Route path="/bookings/:id" element={<BookingDetailPage />} />
                <Route path="/checkin" element={<QrCheckinPage />} />
            </Routes>
        </Router>
    );
}

export default App;