import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', number: '', password: '', confirmPassword: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        const toastId = toast.loading('Creating your account...');
        try {
            const { data } = await axios.post('/api/users/register', { name: form.name, email: form.email, number: form.number, password: form.password });
            login(data);
            toast.success('Account created successfully!', { id: toastId });
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed', { id: toastId });
        }
    };

    return (
        <div className="form-page">
            <div className="form-card" style={{ maxWidth: '520px' }}>
                <div className="form-card-header">
                    <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent)', marginBottom: '8px' }}>Akxton</div>
                    <h2>Create Account</h2>
                    <p>Join India's fastest growing property portal</p>
                </div>
                <div className="form-card-body">
                    <form onSubmit={onSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Full Name</label>
                                <input className="form-input" type="text" required placeholder="Rajesh Kumar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input className="form-input" type="email" required placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mobile Number</label>
                                <input className="form-input" type="tel" required placeholder="+91 98765 43210" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input className="form-input" type="password" required placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <input className="form-input" type="password" required placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
                            </div>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginBottom: '16px' }}>
                            By registering, you agree to Akxton's <a href="#" style={{ color: 'var(--primary)' }}>Terms of Use</a> and <a href="#" style={{ color: 'var(--primary)' }}>Privacy Policy</a>.
                        </p>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px' }}>
                            Create Free Account
                        </button>
                    </form>
                    <p className="form-footer">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
