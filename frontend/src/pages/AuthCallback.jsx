import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('token', token);
            navigate('/', { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '14px',
            background: 'linear-gradient(135deg, #f0fdfa, #f8fafc)'
        }}>
            <div className="spinner spinner-lg" />
            <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                Signing you in…
            </p>
        </div>
    );
}