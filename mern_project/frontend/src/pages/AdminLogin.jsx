import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
    const [form, setForm] = useState({ name: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Signing in as admin...');
        try {
            const { data } = await axios.post('/api/admin/login', form);
            login(data);
            toast.success('Welcome, Admin!', { id: toastId });
            navigate('/admin');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid admin credentials', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', minHeight: '100vh' }}>
            <div className="form-card" style={{ maxWidth: '420px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.97)', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
                <div className="form-card-header" style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', borderRadius: '12px 12px 0 0', padding: '32px', textAlign: 'center' }}>
                    <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>
                        🛡️
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>Admin Portal</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '6px', fontSize: '13px' }}>Akxton Real Estate — Admin Access</p>
                </div>
                <div className="form-card-body" style={{ padding: '32px' }}>
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 600 }}>
                                <i className="fas fa-user-shield" style={{ marginRight: '6px', color: '#0f3460' }}></i>
                                Admin Username
                            </label>
                            <input
                                className="form-input"
                                type="text"
                                required
                                placeholder="Enter admin username"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                style={{ borderColor: '#0f3460' }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 600 }}>
                                <i className="fas fa-lock" style={{ marginRight: '6px', color: '#0f3460' }}></i>
                                Password
                            </label>
                            <input
                                className="form-input"
                                type="password"
                                required
                                placeholder="Enter admin password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                style={{ borderColor: '#0f3460' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '13px',
                                background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                marginTop: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: loading ? 0.8 : 1,
                            }}
                        >
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sign-in-alt"></i>}
                            {loading ? 'Signing In...' : 'Access Admin Panel'}
                        </button>
                    </form>
                    <div style={{ marginTop: '24px', padding: '14px', background: '#f0f4ff', borderRadius: '8px', border: '1px solid #d6e4ff' }}>
                        <p style={{ fontSize: '12px', color: '#555', margin: 0, textAlign: 'center' }}>
                            <i className="fas fa-info-circle" style={{ marginRight: '5px', color: '#0f3460' }}></i>
                            Default: username <strong>admin</strong> / password <strong>admin123</strong>
                        </p>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
                        <a href="/" style={{ color: '#0f3460', fontWeight: 600 }}>
                            <i className="fas fa-arrow-left" style={{ marginRight: '4px' }}></i>
                            Back to Home
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
