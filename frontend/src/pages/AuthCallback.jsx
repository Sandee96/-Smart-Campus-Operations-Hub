import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token);
      navigate('/bookings', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)' }}>
        Signing you in...
      </p>
    </div>
  );
};

export default AuthCallback;