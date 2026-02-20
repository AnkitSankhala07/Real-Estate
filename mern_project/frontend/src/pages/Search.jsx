import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import API from '../api/api';

const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} Lac`;
    return `₹${price.toLocaleString('en-IN')}`;
};

const PROPERTY_TYPES = ['flat', 'house', 'villa', 'shop', 'plot', 'pg'];
const OFFERS = ['sale', 'resale', 'rent'];
const BHK_OPTIONS = ['1', '2', '3', '4', '5'];
const FURNISHED_OPTIONS = ['furnished', 'semi-furnished', 'unfurnished'];
const STATUS_OPTIONS = ['ready to move', 'under construction', 'new launch'];

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Init filters from URL params
    const [activeType, setActiveType] = useState(searchParams.get('type') || '');
    const [activeOffer, setActiveOffer] = useState(searchParams.get('offer') || '');
    const [activeBhk, setActiveBhk] = useState(searchParams.get('bhk') || '');
    const [activeFurnished, setActiveFurnished] = useState(searchParams.get('furnished') || '');
    const [activeStatus, setActiveStatus] = useState(searchParams.get('status') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [sortBy, setSortBy] = useState('newest');
    const [searchInput, setSearchInput] = useState(searchParams.get('location') || searchParams.get('keyword') || '');
    const [keyword, setKeyword] = useState(searchParams.get('location') || searchParams.get('keyword') || '');

    const { data, isLoading } = useQuery({
        queryKey: ['searchProps', keyword, activeType, activeOffer, activeBhk, activeFurnished, activeStatus, minPrice, maxPrice, sortBy],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (keyword) params.set('keyword', keyword);
            if (activeType) params.set('type', activeType);
            if (activeOffer) params.set('offer', activeOffer);
            if (activeBhk) params.set('bhk', activeBhk);
            if (activeFurnished) params.set('furnished', activeFurnished);
            if (activeStatus) params.set('status', activeStatus);
            if (minPrice) params.set('minPrice', minPrice);
            if (maxPrice) params.set('maxPrice', maxPrice);
            if (sortBy) params.set('sort', sortBy);
            params.set('pageSize', '50');
            const { data } = await API.get(`/api/properties?${params.toString()}`);
            return data.properties || [];
        },
    });

    const properties = data || [];

    const toggle = (val, current, setter) => setter(current === val ? '' : val);

    const clearFilters = () => {
        setActiveType(''); setActiveOffer(''); setActiveBhk('');
        setActiveFurnished(''); setActiveStatus('');
        setMinPrice(''); setMaxPrice(''); setKeyword(''); setSearchInput('');
    };

    const activeFiltersCount = [activeType, activeOffer, activeBhk, activeFurnished, activeStatus, minPrice, maxPrice].filter(Boolean).length;

    return (
        <div className="container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
            {/* Breadcrumb */}
            <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '16px' }}>
                <Link to="/" style={{ color: 'var(--primary)' }}>Home</Link> &rsaquo; <span>Search</span>
                {keyword && <> &rsaquo; <span>"{keyword}"</span></>}
            </div>

            {/* Search Bar */}
            <div style={{ background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px' }}>
                <input
                    type="text"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && setKeyword(searchInput)}
                    placeholder="Search by city, locality, project name..."
                    style={{ flex: 1, padding: '10px 14px', border: '1.5px solid var(--gray-200)', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                />
                <button
                    onClick={() => setKeyword(searchInput)}
                    className="btn btn-primary"
                    style={{ padding: '10px 24px', flexShrink: 0 }}
                >
                    <i className="fas fa-search" style={{ marginRight: '6px' }}></i> Search
                </button>
            </div>

            <div className="page-layout">
                {/* ─ FILTER SIDEBAR ─ */}
                <aside className="filter-panel fade-up">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 className="filter-title" style={{ margin: 0 }}>Filters {activeFiltersCount > 0 && <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', marginLeft: '6px' }}>{activeFiltersCount}</span>}</h3>
                        {activeFiltersCount > 0 && (
                            <button onClick={clearFilters} style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Clear All</button>
                        )}
                    </div>

                    <div className="filter-section">
                        <p className="filter-section-label">Listing Type</p>
                        <div className="filter-tags">
                            {OFFERS.map(o => (
                                <span key={o} className={`filter-tag ${activeOffer === o ? 'active' : ''}`} onClick={() => toggle(o, activeOffer, setActiveOffer)}>
                                    {o.charAt(0).toUpperCase() + o.slice(1)}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <p className="filter-section-label">Property Type</p>
                        <div className="filter-tags">
                            {PROPERTY_TYPES.map(t => (
                                <span key={t} className={`filter-tag ${activeType === t ? 'active' : ''}`} onClick={() => toggle(t, activeType, setActiveType)}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <p className="filter-section-label">BHK Type</p>
                        <div className="filter-tags">
                            {BHK_OPTIONS.map(b => (
                                <span key={b} className={`filter-tag ${activeBhk === b ? 'active' : ''}`} onClick={() => toggle(b, activeBhk, setActiveBhk)}>
                                    {b} BHK
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <p className="filter-section-label">Price Range (₹)</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={e => setMinPrice(e.target.value)}
                                style={{ flex: 1, padding: '8px 10px', border: '1.5px solid var(--gray-200)', borderRadius: '6px', fontSize: '12px', outline: 'none', width: '100%' }}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={e => setMaxPrice(e.target.value)}
                                style={{ flex: 1, padding: '8px 10px', border: '1.5px solid var(--gray-200)', borderRadius: '6px', fontSize: '12px', outline: 'none', width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '8px' }}>
                            {[
                                { label: 'Under 30L', min: '', max: '3000000' },
                                { label: '30L–1Cr', min: '3000000', max: '10000000' },
                                { label: '1Cr–3Cr', min: '10000000', max: '30000000' },
                                { label: '3Cr+', min: '30000000', max: '' },
                            ].map(p => (
                                <span
                                    key={p.label}
                                    className={`filter-tag ${minPrice === p.min && maxPrice === p.max ? 'active' : ''}`}
                                    style={{ fontSize: '11px', textAlign: 'center' }}
                                    onClick={() => { setMinPrice(p.min); setMaxPrice(p.max); }}
                                >{p.label}</span>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <p className="filter-section-label">Furnishing</p>
                        <div className="filter-tags">
                            {FURNISHED_OPTIONS.map(f => (
                                <span key={f} className={`filter-tag ${activeFurnished === f ? 'active' : ''}`} onClick={() => toggle(f, activeFurnished, setActiveFurnished)}>
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <p className="filter-section-label">Status</p>
                        <div className="filter-tags">
                            {STATUS_OPTIONS.map(s => (
                                <span key={s} className={`filter-tag ${activeStatus === s ? 'active' : ''}`} onClick={() => toggle(s, activeStatus, setActiveStatus)}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ─ LISTING RESULTS ─ */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: '#fff', padding: '14px 20px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
                        <p style={{ fontSize: '15px', fontWeight: 600 }}>
                            {isLoading ? 'Searching...' : `${properties.length} Properties Found`}
                            {keyword && <span style={{ color: 'var(--gray-500)', fontWeight: 400 }}> in "{keyword}"</span>}
                        </p>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            style={{ padding: '6px 12px', border: '1px solid var(--gray-200)', borderRadius: '6px', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>

                    <div className="listing-grid">
                        {isLoading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="listing-card">
                                    <div className="skeleton" style={{ width: '280px', height: '220px', flexShrink: 0 }}></div>
                                    <div style={{ padding: '20px', flex: 1 }}>
                                        <div className="skeleton" style={{ height: '28px', width: '50%', marginBottom: '12px' }}></div>
                                        <div className="skeleton" style={{ height: '20px', width: '70%', marginBottom: '8px' }}></div>
                                        <div className="skeleton" style={{ height: '16px', width: '40%' }}></div>
                                    </div>
                                </div>
                            ))
                        ) : properties.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No Properties Found</h3>
                                <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>Try adjusting your filters or searching a different location.</p>
                                <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
                            </div>
                        ) : (
                            properties.map(property => (
                                <Link to={`/property/${property._id}`} key={property._id} className="listing-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="listing-card-img" style={{ height: '220px' }}>
                                        <img
                                            src={property.images?.[0] || `https://placehold.co/600x400/e5e7eb/9ca3af?text=Property`}
                                            alt={property.propertyName}
                                        />
                                        <span className={`property-badge ${property.offer}`}>{property.offer}</span>
                                        {property.images?.length > 1 && (
                                            <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                                                <i className="fas fa-camera" style={{ marginRight: '4px' }}></i>{property.images.length} photos
                                            </div>
                                        )}
                                    </div>
                                    <div className="listing-card-body">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div className="listing-price">{formatPrice(property.price)}</div>
                                                {property.carpet && <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>₹{Math.round(property.price / property.carpet)}/sqft • {property.carpet} sqft</span>}
                                            </div>
                                            <div style={{ background: 'var(--gray-100)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>
                                                {property.furnished}
                                            </div>
                                        </div>
                                        <div className="listing-name">{property.propertyName}</div>
                                        <div className="listing-address"><i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)', marginRight: '4px' }}></i>{property.address}</div>
                                        <div className="listing-tags">
                                            {property.bhk > 0 && <span className="listing-tag"><i className="fas fa-home" style={{ marginRight: '4px' }}></i>{property.bhk} BHK</span>}
                                            {property.bedroom > 0 && <span className="listing-tag"><i className="fas fa-bed" style={{ marginRight: '4px' }}></i>{property.bedroom} Bed</span>}
                                            {property.bathroom > 0 && <span className="listing-tag"><i className="fas fa-bath" style={{ marginRight: '4px' }}></i>{property.bathroom} Bath</span>}
                                            <span className="listing-tag" style={{ textTransform: 'capitalize' }}>{property.type}</span>
                                            <span className="listing-tag">{property.status}</span>
                                        </div>
                                        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--gray-100)', paddingTop: '12px' }}>
                                            <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}><i className="fas fa-user-circle" style={{ marginRight: '4px' }}></i>{property.user?.name || 'Owner'}</span>
                                            <span className="btn btn-outline btn-sm" style={{ pointerEvents: 'none' }}>View Details</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;
