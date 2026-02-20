import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import API from '../api/api';

const QUICK_LINKS = [
    { icon: '🏙️', label: 'Flats for Sale', color: '#fde8e8', params: 'offer=sale&type=flat' },
    { icon: '🏠', label: 'Houses/Villas', color: '#e8f4fd', params: 'offer=sale&type=house' },
    { icon: '🔑', label: 'Residential Rent', color: '#e8fde8', params: 'offer=rent&type=flat' },
    { icon: '🏢', label: 'Commercial', color: '#fdfde8', params: 'type=shop' },
    { icon: '🏗️', label: 'New Projects', color: '#f4e8fd', params: 'status=new launch' },
    { icon: '🛋️', label: 'PG / Co-living', color: '#fde8f4', params: 'type=pg&offer=rent' },
];

const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} Lac`;
    return `₹${price.toLocaleString('en-IN')}`;
};

const PropertyCard = ({ property }) => (
    <Link to={`/property/${property._id}`} className="property-card">
        <div className="property-card-img">
            <img
                src={property.images?.[0] || `https://placehold.co/600x400/e5e7eb/9ca3af?text=${encodeURIComponent(property.propertyName?.slice(0, 10) || 'Property')}`}
                alt={property.propertyName}
                loading="lazy"
            />
            <span className={`property-badge ${property.offer}`}>{property.offer}</span>
            <div className="property-like"><i className="far fa-heart" style={{ color: '#e74c3c', fontSize: '14px' }}></i></div>
            {property.images?.length > 1 && (
                <div className="property-photo-count"><i className="fas fa-camera" style={{ marginRight: '4px', fontSize: '10px' }}></i>{property.images.length}</div>
            )}
        </div>
        <div className="property-card-body">
            <div>
                <span className="property-price">{formatPrice(property.price)}</span>
                {property.carpet && <span className="property-price-sub">· ₹{Math.round(property.price / property.carpet)}/sqft</span>}
            </div>
            <div className="property-name">{property.propertyName}</div>
            <div className="property-location">
                <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)', fontSize: '11px' }}></i>
                {property.address}
            </div>
            <div className="property-meta">
                {property.bhk && <div className="property-meta-item"><i className="fas fa-home"></i>{property.bhk} BHK</div>}
                {property.carpet && <div className="property-meta-item"><i className="fas fa-ruler-combined"></i>{property.carpet} sqft</div>}
                {property.furnished && <div className="property-meta-item"><i className="fas fa-couch"></i>{property.furnished.split('-')[0]}</div>}
            </div>
        </div>
        <div className="property-footer">
            <span className="property-poster"><i className="fas fa-user-circle" style={{ marginRight: '4px' }}></i>{property.user?.name || 'Owner'}</span>
            <span className="property-contact-btn">Contact</span>
        </div>
    </Link>
);

const SkeletonCard = () => (
    <div className="property-card">
        <div className="skeleton" style={{ height: '200px' }}></div>
        <div className="property-card-body">
            <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '8px' }}></div>
            <div className="skeleton" style={{ height: '18px', width: '80%', marginBottom: '6px' }}></div>
            <div className="skeleton" style={{ height: '14px', width: '50%' }}></div>
        </div>
    </div>
);

const Home = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('buy');
    const [searchForm, setSearchForm] = useState({ location: '', type: 'flat', offer: 'sale', bhk: '' });

    const { data, isLoading } = useQuery({
        queryKey: ['latestProperties'],
        queryFn: async () => {
            const { data } = await API.get('/api/properties?pageSize=8');
            return data.properties || [];
        },
        staleTime: 5 * 60 * 1000,
    });

    const properties = data || [];

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchForm.location) params.set('keyword', searchForm.location);
        if (searchForm.type) params.set('type', searchForm.type);
        if (searchForm.offer) params.set('offer', searchForm.offer);
        if (searchForm.bhk) params.set('bhk', searchForm.bhk);
        navigate(`/search?${params.toString()}`);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const offerMap = { buy: 'sale', rent: 'rent', resale: 'resale' };
        setSearchForm(prev => ({ ...prev, offer: offerMap[tab] }));
    };

    return (
        <div>
            {/* ─── HERO ─── */}
            <section className="hero">
                <div className="container hero-content">
                    <h1>India's No.1 <span>Real Estate</span> Portal</h1>
                    <p>Over 50 Lakh+ Properties for Buy, Sell & Rent</p>

                    <div className="search-tabs">
                        {['buy', 'rent', 'resale'].map(tab => (
                            <button key={tab} className={`search-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => handleTabChange(tab)}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="search-box">
                        <form className="search-form" onSubmit={handleSearch}>
                            <div className="search-field" style={{ flex: 3 }}>
                                <label>Location</label>
                                <input
                                    type="text"
                                    placeholder="Enter city, locality or project..."
                                    value={searchForm.location}
                                    onChange={e => setSearchForm(p => ({ ...p, location: e.target.value }))}
                                />
                            </div>
                            <div className="search-field">
                                <label>Property Type</label>
                                <select value={searchForm.type} onChange={e => setSearchForm(p => ({ ...p, type: e.target.value }))}>
                                    <option value="">Any Type</option>
                                    <option value="flat">Flat / Apartment</option>
                                    <option value="house">House / Villa</option>
                                    <option value="villa">Villa</option>
                                    <option value="shop">Shop / Commercial</option>
                                    <option value="plot">Plot / Land</option>
                                    <option value="pg">PG / Co-living</option>
                                </select>
                            </div>
                            <div className="search-field">
                                <label>BHK</label>
                                <select value={searchForm.bhk} onChange={e => setSearchForm(p => ({ ...p, bhk: e.target.value }))}>
                                    <option value="">Any BHK</option>
                                    <option value="1">1 BHK</option>
                                    <option value="2">2 BHK</option>
                                    <option value="3">3 BHK</option>
                                    <option value="4">4 BHK</option>
                                    <option value="5">5+ BHK</option>
                                </select>
                            </div>
                            <button type="submit" className="search-btn"><i className="fas fa-search" style={{ marginRight: '8px' }}></i>Search</button>
                        </form>
                    </div>

                    <div className="hero-stats">
                        <div className="hero-stat"><span className="hero-stat-num">50L+</span><span className="hero-stat-label">Properties Listed</span></div>
                        <div className="hero-stat"><span className="hero-stat-num">40K+</span><span className="hero-stat-label">Verified Dealers</span></div>
                        <div className="hero-stat"><span className="hero-stat-num">20L+</span><span className="hero-stat-label">Happy Customers</span></div>
                        <div className="hero-stat"><span className="hero-stat-num">15+</span><span className="hero-stat-label">Years of Trust</span></div>
                    </div>
                </div>
            </section>

            {/* ─── QUICK LINKS ─── */}
            <section className="section" style={{ paddingBottom: '20px' }}>
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Browse by Category</h2>
                            <p className="section-subtitle">Find properties that match your needs</p>
                        </div>
                    </div>
                    <div className="quick-links">
                        {QUICK_LINKS.map((item, i) => (
                            <Link to={`/search?${item.params}`} key={i} className="quick-link-card">
                                <div className="quick-link-icon" style={{ background: item.color, fontSize: '28px' }}>{item.icon}</div>
                                <div className="quick-link-label">{item.label}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── LATEST LISTINGS ─── */}
            <section className="section" style={{ background: '#fff', borderTop: '1px solid var(--gray-100)', borderBottom: '1px solid var(--gray-100)' }}>
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Latest <span>Property</span> Listings</h2>
                            <p className="section-subtitle">Handpicked properties across India</p>
                        </div>
                        <Link to="/search" className="see-all">See all →</Link>
                    </div>
                    <div className="properties-grid">
                        {isLoading
                            ? [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
                            : properties.length > 0
                                ? properties.slice(0, 8).map(p => <PropertyCard key={p._id} property={p} />)
                                : (
                                    <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '60px 0', color: 'var(--gray-400)' }}>
                                        <i className="fas fa-home" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
                                        <p style={{ fontSize: '18px', fontWeight: 600 }}>No properties listed yet</p>
                                        <p style={{ marginTop: '8px', marginBottom: '20px' }}>Be the first to list a property!</p>
                                        <Link to="/post-property" className="btn btn-primary">Post Free Property</Link>
                                    </div>
                                )
                        }
                    </div>
                </div>
            </section>

            {/* ─── WHY AKXTON ─── */}
            <section className="section">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 className="section-title" style={{ textAlign: 'center' }}>Why Choose <span>Akxton</span>?</h2>
                        <p className="section-subtitle" style={{ fontSize: '15px' }}>India's most trusted real estate platform</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                        {[
                            { icon: 'fas fa-shield-alt', color: '#e8f4fd', iconColor: '#3498db', title: 'Verified Listings', desc: 'All properties are verified by our experts before going live.' },
                            { icon: 'fas fa-rupee-sign', color: '#fde8e8', iconColor: '#e74c3c', title: 'Zero Brokerage', desc: 'Connect directly with owners — no middlemen, no commission.' },
                            { icon: 'fas fa-search-location', color: '#e8fde8', iconColor: '#27ae60', title: 'Smart Search', desc: 'Advanced filters to find exactly what you are looking for.' },
                            { icon: 'fas fa-headset', color: '#fdfde8', iconColor: '#f39c12', title: '24/7 Support', desc: 'Our experts are available round the clock to assist you.' },
                        ].map((item, i) => (
                            <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)', textAlign: 'center' }}>
                                <div style={{ width: '64px', height: '64px', background: item.color, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '26px', color: item.iconColor }}>
                                    <i className={item.icon}></i>
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
                                <p style={{ fontSize: '13px', color: 'var(--gray-500)', lineHeight: '1.7' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA BANNER ─── */}
            <section style={{ background: 'linear-gradient(135deg, var(--primary), #c0392b)', padding: '60px 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Ready to List Your Property?</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>Post for FREE and get genuine buyers directly to your inbox.</p>
                    </div>
                    <Link to="/post-property" className="btn btn-white btn-lg" style={{ fontWeight: 700 }}>
                        <i className="fas fa-plus-circle"></i> Post Property FREE
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
