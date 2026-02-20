import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../api/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const formatPrice = (price) => {
    if (!price) return 'Price on Request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} Lac`;
    return `₹${price.toLocaleString('en-IN')}`;
};

const AMENITY_ICONS = {
    lift: { icon: 'fas fa-elevator', label: 'Lift' },
    securityGuard: { icon: 'fas fa-shield-alt', label: 'Security' },
    playGround: { icon: 'fas fa-child', label: 'Playground' },
    garden: { icon: 'fas fa-tree', label: 'Garden' },
    waterSupply: { icon: 'fas fa-tint', label: 'Water Supply' },
    powerBackup: { icon: 'fas fa-bolt', label: 'Power Backup' },
    parkingArea: { icon: 'fas fa-parking', label: 'Parking' },
    gym: { icon: 'fas fa-dumbbell', label: 'Gym' },
    shoppingMall: { icon: 'fas fa-shopping-bag', label: 'Mall Nearby' },
    hospital: { icon: 'fas fa-hospital', label: 'Hospital' },
    school: { icon: 'fas fa-school', label: 'School' },
    marketArea: { icon: 'fas fa-store', label: 'Market' },
};

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [activeImg, setActiveImg] = useState(0);
    const [showContact, setShowContact] = useState(false);
    const [enquirySent, setEnquirySent] = useState(false);
    const [saving, setSaving] = useState(false);

    const { data: property, isLoading, error } = useQuery({
        queryKey: ['property', id],
        queryFn: async () => {
            const { data } = await API.get(`/api/properties/${id}`);
            return data;
        },
    });

    // Check if already saved
    const { data: savedStatus } = useQuery({
        queryKey: ['savedCheck', id],
        queryFn: async () => {
            if (!user) return { saved: false };
            const { data } = await API.get(`/api/saved/check/${id}`);
            return data;
        },
        enabled: !!user,
    });

    const isSaved = savedStatus?.saved || false;

    const handleSave = async () => {
        if (!user) { toast.error('Please login to save properties'); navigate('/login'); return; }
        setSaving(true);
        try {
            const { data } = await API.post('/api/saved/toggle', { propertyId: id });
            toast.success(data.saved ? 'Added to saved!' : 'Removed from saved');
            queryClient.invalidateQueries(['savedCheck', id]);
            queryClient.invalidateQueries(['savedProperties']);
            queryClient.invalidateQueries(['dashboardStats']);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleEnquiry = async () => {
        if (!user) { toast.error('Please login to send an enquiry'); navigate('/login'); return; }
        if (enquirySent) return;
        try {
            await API.post('/api/requests', { propertyId: id });
            toast.success('Enquiry sent to the owner!');
            setEnquirySent(true);
            queryClient.invalidateQueries(['dashboardStats']);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to send enquiry';
            if (msg.includes('already sent')) {
                setEnquirySent(true);
                toast('Enquiry already sent', { icon: 'ℹ️' });
            } else {
                toast.error(msg);
            }
        }
    };

    if (isLoading) return (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--gray-500)' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '36px', marginBottom: '16px', display: 'block' }}></i>
            Loading property details...
        </div>
    );

    if (error || !property) return (
        <div style={{ padding: '80px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>😕</div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Property Not Found</h2>
            <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>The property you're looking for may have been removed.</p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
    );

    const images = property.images?.length > 0
        ? property.images
        : [`https://placehold.co/900x500/e5e7eb/9ca3af?text=${encodeURIComponent(property.propertyName || 'Property')}`];

    const activeAmenities = property.amenities
        ? Object.entries(property.amenities).filter(([, v]) => v === true)
        : [];

    const isOwner = user && property.user?._id === user._id;

    return (
        <div className="container" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
            {/* Breadcrumb */}
            <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '16px' }}>
                <Link to="/" style={{ color: 'var(--primary)' }}>Home</Link> &rsaquo; <Link to="/search" style={{ color: 'var(--primary)' }}>Properties</Link> &rsaquo; <span>{property.propertyName}</span>
            </div>

            {/* Image Gallery */}
            <div style={{ display: 'grid', gridTemplateColumns: images.length > 1 ? '1fr 280px' : '1fr', gap: '12px', marginBottom: '28px', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '440px', background: '#e5e7eb', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setActiveImg(0)}>
                    <img src={images[activeImg]} alt={property.propertyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span className={`property-badge ${property.offer}`} style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '13px', padding: '4px 14px' }}>{property.offer?.toUpperCase()}</span>
                    <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>
                        <i className="fas fa-camera" style={{ marginRight: '4px' }}></i>{images.length} Photos
                    </div>
                </div>
                {images.length > 1 && (
                    <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: '12px', height: '440px' }}>
                        {images.slice(1, 4).map((img, idx) => (
                            <div key={idx} onClick={() => setActiveImg(idx + 1)} style={{ background: '#e5e7eb', cursor: 'pointer', overflow: 'hidden', borderRadius: '4px', position: 'relative', border: activeImg === idx + 1 ? '2px solid var(--primary)' : 'none' }}>
                                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s' }} onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                                {idx === 2 && images.length > 4 && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '18px' }}>
                                        +{images.length - 4} Photos
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', alignItems: 'start' }}>
                {/* Left Column */}
                <div>
                    {/* Price & Title */}
                    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', padding: '24px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--gray-900)' }}>{formatPrice(property.price)}</div>
                                {property.carpet && <span style={{ fontSize: '13px', color: 'var(--gray-500)' }}>₹{Math.round(property.price / property.carpet).toLocaleString('en-IN')} per sqft</span>}
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                style={{
                                    background: isSaved ? '#fee2e2' : 'none',
                                    border: `1.5px solid ${isSaved ? '#fca5a5' : 'var(--gray-200)'}`,
                                    borderRadius: '8px', padding: '8px 16px', cursor: 'pointer',
                                    fontSize: '13px', fontWeight: 600,
                                    color: isSaved ? '#dc2626' : 'var(--gray-600)',
                                    display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
                                }}
                            >
                                <i className={isSaved ? 'fas fa-heart' : 'far fa-heart'} style={{ color: isSaved ? '#dc2626' : 'var(--primary)' }}></i>
                                {saving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                            </button>
                        </div>
                        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--gray-900)', margin: '12px 0 6px' }}>{property.propertyName}</h1>
                        <p style={{ fontSize: '14px', color: 'var(--gray-500)' }}>
                            <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)', marginRight: '6px' }}></i>{property.address}
                        </p>

                        <div style={{ display: 'flex', gap: '24px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--gray-100)', flexWrap: 'wrap' }}>
                            {[
                                { icon: 'fas fa-home', label: 'BHK', value: property.bhk > 0 ? property.bhk : null },
                                { icon: 'fas fa-ruler-combined', label: 'Carpet', value: property.carpet ? `${property.carpet} sqft` : null },
                                { icon: 'fas fa-bed', label: 'Bedrooms', value: property.bedroom > 0 ? property.bedroom : null },
                                { icon: 'fas fa-bath', label: 'Bathrooms', value: property.bathroom > 0 ? property.bathroom : null },
                                { icon: 'fas fa-couch', label: 'Furnished', value: property.furnished },
                                { icon: 'fas fa-building', label: 'Floor', value: property.roomFloor != null ? `${property.roomFloor} of ${property.totalFloors || '?'}` : null },
                            ].filter(item => item.value != null).map((item, i) => (
                                <div key={i} style={{ textAlign: 'center', minWidth: '80px' }}>
                                    <i className={item.icon} style={{ color: 'var(--primary)', fontSize: '20px', display: 'block', marginBottom: '4px' }}></i>
                                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{item.value}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', padding: '24px', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '14px' }}>About this Property</h3>
                        <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.8' }}>{property.description || 'No description provided.'}</p>
                    </div>

                    {/* Property Details Table */}
                    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', padding: '24px', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px' }}>Property Details</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                            {[
                                ['Property Type', property.type],
                                ['Offer Type', property.offer],
                                ['Status', property.status],
                                ['Property Age', property.age > 0 ? `${property.age} Years` : 'New'],
                                ['Home Loan', property.loan],
                                ['Security Deposit', property.deposit > 0 ? formatPrice(property.deposit) : 'N/A'],
                                ['Balcony', property.balcony > 0 ? property.balcony : 'N/A'],
                                ['Total Floors', property.totalFloors || 'N/A'],
                            ].map(([label, val], i) => (
                                <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--gray-500)' }}>{label}</span>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-800)', textTransform: 'capitalize', textAlign: 'right' }}>{val || 'N/A'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    {activeAmenities.length > 0 && (
                        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', padding: '24px' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '20px' }}>Amenities</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                                {activeAmenities.map(([key]) => {
                                    const a = AMENITY_ICONS[key];
                                    if (!a) return null;
                                    return (
                                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--gray-50)', borderRadius: '8px', padding: '10px 14px', border: '1px solid var(--gray-100)' }}>
                                            <i className={a.icon} style={{ color: 'var(--primary)', width: '18px', textAlign: 'center' }}></i>
                                            <span style={{ fontSize: '13px', fontWeight: 500 }}>{a.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Contact Sidebar ── */}
                <div style={{ position: 'sticky', top: '80px' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-md)', padding: '24px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--gray-100)' }}>
                            <div style={{ width: '52px', height: '52px', background: 'var(--secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '22px', color: '#fff', flexShrink: 0 }}>
                                {property.user?.name?.charAt(0) || 'O'}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '16px' }}>{property.user?.name || 'Property Owner'}</div>
                                <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
                                    Owner · Posted {new Date(property.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                        </div>

                        {isOwner ? (
                            <div style={{ padding: '14px', background: '#fef9c3', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#854d0e', textAlign: 'center', marginBottom: '12px' }}>
                                <i className="fas fa-crown" style={{ marginRight: '6px' }}></i> This is your listing
                            </div>
                        ) : (
                            <>
                                {showContact ? (
                                    <div style={{ background: 'var(--gray-50)', borderRadius: '8px', padding: '16px', marginBottom: '12px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginBottom: '4px' }}>Mobile Number</p>
                                        <a href={`tel:${property.user?.number}`} style={{ fontSize: '22px', fontWeight: 700, color: 'var(--gray-900)', textDecoration: 'none' }}>
                                            {property.user?.number || 'Not available'}
                                        </a>
                                    </div>
                                ) : (
                                    <button onClick={() => setShowContact(true)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginBottom: '12px', fontSize: '15px' }}>
                                        <i className="fas fa-phone-alt"></i> View Contact Number
                                    </button>
                                )}

                                <button
                                    onClick={handleEnquiry}
                                    disabled={enquirySent}
                                    className="btn btn-outline"
                                    style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px', marginBottom: '12px', background: enquirySent ? 'var(--gray-50)' : '', color: enquirySent ? 'var(--gray-400)' : '' }}
                                >
                                    <i className={enquirySent ? 'fas fa-check-circle' : 'fas fa-envelope'} style={{ color: enquirySent ? '#22c55e' : '' }}></i>
                                    {enquirySent ? 'Enquiry Sent!' : 'Send Enquiry'}
                                </button>
                            </>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '14px', background: isSaved ? '#fee2e2' : 'var(--gray-100)', border: 'none', borderRadius: '8px', fontWeight: 600, color: isSaved ? '#dc2626' : 'var(--gray-700)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                        >
                            <i className={isSaved ? 'fas fa-heart' : 'far fa-heart'} style={{ color: isSaved ? '#dc2626' : 'var(--primary)' }}></i>
                            {isSaved ? 'Saved' : 'Save for Later'}
                        </button>
                    </div>

                    <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius: '12px', padding: '20px', color: '#fff', textAlign: 'center' }}>
                        <i className="fas fa-shield-alt" style={{ fontSize: '28px', color: 'var(--accent)', marginBottom: '10px', display: 'block' }}></i>
                        <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Verified Listing</p>
                        <p style={{ fontSize: '12px', opacity: 0.7 }}>This property has been verified by our Akxton experts for your safety.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
