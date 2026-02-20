import { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../api/api';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', number: '', message: '' });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Sending your message...');
        try {
            await API.post('/api/messages', form);
            toast.success('Message sent! We will get back to you shortly.', { id: toastId });
            setSent(true);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send. Please try again.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Hero */}
            <section style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '80px 0', textAlign: 'center' }}>
                <div className="container">
                    <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Contact <span style={{ color: '#f39c12' }}>Us</span></h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px' }}>Have questions? Our team is here to help you 24/7.</p>
                </div>
            </section>

            <section style={{ padding: '80px 0' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
                    {/* Info */}
                    <div>
                        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px' }}>Get In Touch</h2>
                        {[
                            { icon: 'fas fa-map-marker-alt', title: 'Head Office', value: '14th Floor, Tower B, DLF Cyber Park, Gurugram, Haryana 122002' },
                            { icon: 'fas fa-phone-alt', title: 'Call Us', value: '1800-41-99099 (Toll Free) • Mon–Sat: 9 AM – 9 PM' },
                            { icon: 'fas fa-envelope', title: 'Email Us', value: 'info@akxton.com • support@akxton.com' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
                                <div style={{ width: '44px', height: '44px', background: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <i className={item.icon} style={{ color: 'var(--primary)', fontSize: '18px' }}></i>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>{item.title}</div>
                                    <div style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.6 }}>{item.value}</div>
                                </div>
                            </div>
                        ))}

                        {/* Map placeholder */}
                        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--gray-200)', height: '200px', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', color: 'var(--gray-400)' }}>
                            <i className="fas fa-map-marked-alt" style={{ fontSize: '36px' }}></i>
                            <span style={{ fontSize: '14px' }}>Gurugram, Haryana, India</span>
                        </div>
                    </div>

                    {/* Form */}
                    <div style={{ background: '#fff', borderRadius: '16px', boxShadow: 'var(--shadow-md)', padding: '36px' }}>
                        {sent ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
                                <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Message Sent!</h3>
                                <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>Our team will respond to you within 24 hours.</p>
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => { setSent(false); setForm({ name: '', email: '', number: '', message: '' }); }}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={onSubmit}>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Send us a Message</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    {[
                                        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Rajesh Kumar', full: false },
                                        { name: 'email', label: 'Email', type: 'email', placeholder: 'you@email.com', full: false },
                                        { name: 'number', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210', full: true },
                                    ].map(f => (
                                        <div key={f.name} style={{ gridColumn: f.full ? 'span 2' : 'span 1' }} className="form-group">
                                            <label className="form-label">{f.label}</label>
                                            <input
                                                className="form-input"
                                                type={f.type}
                                                placeholder={f.placeholder}
                                                required
                                                value={form[f.name]}
                                                onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                                            />
                                        </div>
                                    ))}
                                    <div style={{ gridColumn: 'span 2' }} className="form-group">
                                        <label className="form-label">Message</label>
                                        <textarea
                                            className="form-input"
                                            rows={4}
                                            placeholder="Tell us how we can help..."
                                            required
                                            value={form.message}
                                            onChange={e => setForm({ ...form, message: e.target.value })}
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                    style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '8px' }}
                                >
                                    {loading ? (
                                        <><i className="fas fa-spinner fa-spin"></i> Sending...</>
                                    ) : (
                                        <><i className="fas fa-paper-plane"></i> Send Message</>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
