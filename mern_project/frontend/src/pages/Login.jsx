import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Signing in...');
        try {
            const { data } = await axios.post('/api/users/login', form);
            login(data);
            toast.success('Welcome back!', { id: toastId });
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials', { id: toastId });
        }
    };

    return (
        <div className="form-page">
            <div className="form-card">
                <div className="form-card-header">
                    <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent)', marginBottom: '8px' }}>Akxton</div>
                    <h2>Welcome Back</h2>
                    <p>Login to access your property dashboard</p>
                </div>
                <div className="form-card-body">
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input className="form-input" type="email" required placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input className="form-input" type="password" required placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                        </div>
                        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                            <a href="#" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>Forgot Password?</a>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px' }}>
                            Sign In
                        </button>
                    </form>
                    <p className="form-footer">
                        Don't have an account? <Link to="/register">Register Free</Link>
                    </p>
                    <div style={{ marginTop: '20px', padding: '16px', background: 'var(--gray-50)', borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginBottom: '8px' }}>Are you a property dealer?</p>
                        <a href="#" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>Register as Agent / Builder →</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
