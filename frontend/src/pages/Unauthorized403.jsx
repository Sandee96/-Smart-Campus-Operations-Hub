import { useNavigate } from 'react-router-dom';

export default function Unauthorized403() {
    const navigate = useNavigate();

    return (
        <div className="page-403">
            <div className="page-403-inner">
                <div className="page-403-code">403</div>
                <h2 className="page-403-title">Access Denied</h2>
                <p className="page-403-desc">
                    You don't have permission to view this page.
                    Contact an administrator if you think this is a mistake.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button className="btn btn-outline" onClick={() => navigate(-1)}>
                        ← Go Back
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
}