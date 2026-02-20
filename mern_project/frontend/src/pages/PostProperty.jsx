import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import toast from 'react-hot-toast';

const PROPERTY_TYPES = ['flat', 'house', 'villa', 'shop', 'plot', 'pg'];
const OFFERS = ['sale', 'resale', 'rent'];
const STATUS = ['ready to move', 'under construction', 'new launch'];
const FURNISHED = ['furnished', 'semi-furnished', 'unfurnished'];
const LOAN = ['available', 'not available'];

const AMENITIES = [
    { key: 'lift', label: 'Lift', icon: 'fas fa-elevator' },
    { key: 'securityGuard', label: 'Security Guard', icon: 'fas fa-shield-alt' },
    { key: 'playGround', label: 'Play Ground', icon: 'fas fa-child' },
    { key: 'garden', label: 'Garden', icon: 'fas fa-tree' },
    { key: 'waterSupply', label: 'Water Supply', icon: 'fas fa-tint' },
    { key: 'powerBackup', label: 'Power Backup', icon: 'fas fa-bolt' },
    { key: 'parkingArea', label: 'Parking', icon: 'fas fa-parking' },
    { key: 'gym', label: 'Gym', icon: 'fas fa-dumbbell' },
    { key: 'shoppingMall', label: 'Shopping Mall', icon: 'fas fa-shopping-bag' },
    { key: 'hospital', label: 'Hospital Nearby', icon: 'fas fa-hospital' },
    { key: 'school', label: 'School Nearby', icon: 'fas fa-school' },
    { key: 'marketArea', label: 'Market Area', icon: 'fas fa-store' },
];

const PostProperty = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        propertyName: '', price: '', deposit: '', address: '',
        offer: 'sale', type: 'flat', status: 'ready to move',
        furnished: 'furnished', bhk: '', bedroom: '', bathroom: '',
        balcony: '', carpet: '', age: '', totalFloors: '', roomFloor: '',
        loan: 'not available', description: ''
    });
    const [amenities, setAmenities] = useState({});
    const [loading, setLoading] = useState(false);

    const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const toggleAmenity = key => setAmenities(prev => ({ ...prev, [key]: !prev[key] }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Posting your property...');
        try {
            const payload = { ...form, ...amenities };
            await API.post('/api/properties', payload);
            toast.success('Property posted successfully!', { id: toastId });
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post property', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '11px 14px', border: '1.5px solid var(--gray-200)',
        borderRadius: '8px', fontSize: '14px', outline: 'none',
        transition: 'border-color 0.2s', background: '#fff', boxSizing: 'border-box'
    };
    const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '6px' };
    const sectionHeader = (num, title) => (
        <div style={{ background: 'var(--secondary)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '28px', height: '28px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>{num}</span>
            <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>{title}</h3>
        </div>
    );

    const PillSelect = ({ field, options }) => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {options.map(opt => (
                <button key={opt} type="button"
                    onClick={() => setForm(f => ({ ...f, [field]: opt }))}
                    style={{
                        padding: '8px 16px', borderRadius: '20px',
                        border: `1.5px solid ${form[field] === opt ? 'var(--primary)' : 'var(--gray-200)'}`,
                        background: form[field] === opt ? '#fde8e8' : '#fff',
                        color: form[field] === opt ? 'var(--primary)' : 'var(--gray-600)',
                        fontWeight: 600, fontSize: '13px', cursor: 'pointer', textTransform: 'capitalize'
                    }}
                >
                    {opt}
                </button>
            ))}
        </div>
    );

    // Show/hide residential-only fields
    const isResidential = ['flat', 'house', 'villa', 'pg'].includes(form.type);
    const isRent = ['rent'].includes(form.offer);

    return (
        <div className="container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
            <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '24px' }}>
                <Link to="/" style={{ color: 'var(--primary)' }}>Home</Link> &rsaquo; <span>Post Property</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>
                <form onSubmit={handleSubmit}>

                    {/* ── Step 1: Basic Info ── */}
                    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', marginBottom: '20px' }}>
                        {sectionHeader(1, 'Basic Information')}
                        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Property Title *</label>
                                <input name="propertyName" required value={form.propertyName} onChange={onChange} style={inputStyle} placeholder="e.g. Spacious 3BHK Apartment near Metro, Bandra West" />
                            </div>
                            <div>
                                <label style={labelStyle}>Listing Type *</label>
                                <PillSelect field="offer" options={OFFERS} />
                            </div>
                            <div>
                                <label style={labelStyle}>Property Type *</label>
                                <PillSelect field="type" options={PROPERTY_TYPES} />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Full Address *</label>
                                <input name="address" required value={form.address} onChange={onChange} style={inputStyle} placeholder="Building, Street, Locality, City, State, Pincode" />
                            </div>
                        </div>
                    </div>

                    {/* ── Step 2: Pricing ── */}
                    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', marginBottom: '20px' }}>
                        {sectionHeader(2, 'Pricing Details')}
                        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>{isRent ? 'Monthly Rent (₹) *' : 'Expected Price (₹) *'}</label>
                                <input name="price" type="number" required value={form.price} onChange={onChange} style={inputStyle} placeholder="e.g. 5500000" min="0" />
                            </div>
                            {isRent && (
                                <div>
                                    <label style={labelStyle}>Security Deposit (₹)</label>
                                    <input name="deposit" type="number" value={form.deposit} onChange={onChange} style={inputStyle} placeholder="e.g. 100000" min="0" />
                                </div>
                            )}
                            <div>
                                <label style={labelStyle}>Carpet Area (sqft) *</label>
                                <input name="carpet" type="number" required value={form.carpet} onChange={onChange} style={inputStyle} placeholder="e.g. 1200" min="1" />
                            </div>
                            <div>
                                <label style={labelStyle}>Home Loan</label>
                                <PillSelect field="loan" options={LOAN} />
                            </div>
                        </div>
                    </div>

                    {/* ── Step 3: Property Details ── */}
                    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', marginBottom: '20px' }}>
                        {sectionHeader(3, 'Property Details')}
                        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Status *</label>
                                <PillSelect field="status" options={STATUS} />
                            </div>
                            {isResidential && (
                                <div>
                                    <label style={labelStyle}>Furnishing *</label>
                                    <PillSelect field="furnished" options={FURNISHED} />
                                </div>
                            )}
                            {isResidential && [
                                { name: 'bhk', label: 'BHK', placeholder: '2' },
                                { name: 'bedroom', label: 'Bedrooms', placeholder: '2' },
                                { name: 'bathroom', label: 'Bathrooms', placeholder: '2' },
                                { name: 'balcony', label: 'Balconies', placeholder: '1' },
                                { name: 'totalFloors', label: 'Total Floors', placeholder: '10' },
                                { name: 'roomFloor', label: 'Property on Floor', placeholder: '3' },
                            ].map(field => (
                                <div key={field.name}>
                                    <label style={labelStyle}>{field.label}</label>
                                    <input name={field.name} type="number" value={form[field.name]} onChange={onChange} style={inputStyle} placeholder={field.placeholder} min="0" />
                                </div>
                            ))}
                            <div>
                                <label style={labelStyle}>Property Age (years)</label>
                                <input name="age" type="number" value={form.age} onChange={onChange} style={inputStyle} placeholder="0 = New" min="0" max="99" />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Description *</label>
                                <textarea
                                    name="description" required value={form.description} onChange={onChange}
                                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                                    placeholder="Describe key features, nearby landmarks, unique selling points, transport links..."
                                />
                                <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--gray-400)', marginTop: '4px' }}>{form.description.length}/2000</div>
                            </div>
                        </div>
                    </div>

                    {/* ── Step 4: Amenities ── */}
                    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', marginBottom: '24px' }}>
                        {sectionHeader(4, 'Amenities & Features')}
                        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                            {AMENITIES.map(a => (
                                <label key={a.key} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '12px 14px', borderRadius: '8px', cursor: 'pointer',
                                    border: `1.5px solid ${amenities[a.key] ? 'var(--primary)' : 'var(--gray-200)'}`,
                                    background: amenities[a.key] ? '#fde8e8' : '#fff',
                                    transition: 'all 0.15s', userSelect: 'none'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={!!amenities[a.key]}
                                        onChange={() => toggleAmenity(a.key)}
                                        style={{ display: 'none' }}
                                    />
                                    <i className={a.icon} style={{ color: amenities[a.key] ? 'var(--primary)' : 'var(--gray-400)', width: '16px', textAlign: 'center' }}></i>
                                    <span style={{ fontSize: '13px', fontWeight: 500, color: amenities[a.key] ? 'var(--primary)' : 'var(--gray-600)' }}>{a.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', fontSize: '16px', opacity: loading ? 0.7 : 1 }}>
                        <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>
                        {loading ? 'Submitting...' : 'Submit Property Listing'}
                    </button>
                </form>

                {/* ── Tips Sidebar ── */}
                <div style={{ position: 'sticky', top: '80px' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', padding: '24px', marginBottom: '20px' }}>
                        <h4 style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--gray-800)' }}>📋 Listing Tips</h4>
                        {[
                            'Use a descriptive title with BHK & location',
                            'Mention exact carpet area for credibility',
                            'Upload high-quality photos (will increase views 5x)',
                            'Add nearby landmarks and transport links',
                            'Set a realistic price based on current market',
                            'Check all applicable amenities to get more enquiries',
                        ].map((tip, i) => (
                            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '13px', color: 'var(--gray-600)' }}>
                                <span style={{ color: 'var(--success)', fontWeight: 700, flexShrink: 0 }}>✓</span>{tip}
                            </div>
                        ))}
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, var(--primary), #c0392b)', borderRadius: '12px', padding: '24px', color: '#fff' }}>
                        <h4 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '16px' }}>Need Help?</h4>
                        <p style={{ fontSize: '13px', opacity: 0.85, marginBottom: '16px' }}>Our property experts are ready to help you list your property effectively.</p>
                        <a href="tel:+1800123456" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                            <i className="fas fa-phone-alt" style={{ marginRight: '6px' }}></i> 1800-41-99099
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostProperty;
