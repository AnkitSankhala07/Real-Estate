import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import toast from 'react-hot-toast';

const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} Lac`;
    return `₹${price.toLocaleString('en-IN')}`;
};

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Stats from profile API
    const { data: stats } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            const { data } = await API.get('/api/users/profile');
            return data;
        },
        staleTime: 30000,
    });

    // My listings
    const { data: myListings = [], isLoading: listingsLoading } = useQuery({
        queryKey: ['myListings'],
        queryFn: async () => {
            const { data } = await API.get('/api/properties/my-listings');
            return data;
        },
    });

    // Received enquiries
    const { data: enquiries = [], isLoading: enquiriesLoading } = useQuery({
        queryKey: ['receivedRequests'],
        queryFn: async () => {
            const { data } = await API.get('/api/requests/received');
            return data;
        },
    });

    // Saved properties
    const { data: savedItems = [] } = useQuery({
        queryKey: ['savedProperties'],
        queryFn: async () => {
            const { data } = await API.get('/api/saved');
            return data;
        },
    });

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this listing?')) return;
        try {
            await API.delete(`/api/properties/${id}`);
            toast.success('Listing deleted');
            queryClient.invalidateQueries(['myListings']);
            queryClient.invalidateQueries(['dashboardStats']);
        } catch {
            toast.error('Failed to delete listing');
        }
    };

    const handleUnsave = async (propertyId) => {
        try {
            await API.post('/api/saved/toggle', { propertyId });
            toast.success('Removed from saved');
            queryClient.invalidateQueries(['savedProperties']);
            queryClient.invalidateQueries(['dashboardStats']);
        } catch {
            toast.error('Failed to unsave');
        }
    };

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <div className="container" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
            <div className="dashboard-layout">
                {/* ── Sidebar ── */}
                <aside className="sidebar">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                        <div className="sidebar-name">{user?.name}</div>
                        <div className="sidebar-email">{user?.email}</div>
                    </div>
                    <nav className="sidebar-nav">
                        <Link to="/dashboard" className="active"><i className="fas fa-tachometer-alt"></i> Dashboard</Link>
                        <Link to="/post-property"><i className="fas fa-plus-circle"></i> Post Property</Link>
                        <Link to="/search"><i className="fas fa-search"></i> Search</Link>
                    </nav>
                    <button
                        onClick={handleLogout}
                        style={{ width: '100%', marginTop: '16px', padding: '10px', background: '#fff1f0', border: '1px solid #ffd1ce', borderRadius: '8px', color: 'var(--primary)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </aside>

                {/* ── Main Content ── */}
                <div style={{ minWidth: 0 }}>
                    {/* Welcome Banner */}
                    <div style={{ background: 'linear-gradient(135deg, var(--secondary), #34495e)', borderRadius: '16px', padding: '28px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 700 }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '4px', fontSize: '14px' }}>Manage your listings and property inquiries from here.</p>
                        </div>
                        <Link to="/post-property" className="btn btn-primary btn-lg" style={{ flexShrink: 0 }}>
                            <i className="fas fa-plus-circle"></i> Post Property FREE
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="stat-cards" style={{ marginBottom: '24px' }}>
                        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                            <div className="stat-card-num" style={{ color: 'var(--primary)' }}>{stats?.properties ?? '—'}</div>
                            <div className="stat-card-label">Active Listings</div>
                            <span style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '4px', display: 'block' }}>Properties you've posted</span>
                        </div>
                        <div className="stat-card" style={{ borderLeft: '4px solid #3498db' }}>
                            <div className="stat-card-num" style={{ color: '#3498db' }}>{stats?.saved ?? '—'}</div>
                            <div className="stat-card-label">Saved Properties</div>
                            <span style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '4px', display: 'block' }}>Properties you've bookmarked</span>
                        </div>
                        <div className="stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
                            <div className="stat-card-num" style={{ color: 'var(--success)' }}>{stats?.enquiries ?? '—'}</div>
                            <div className="stat-card-label">Enquiries Received</div>
                            <span style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '4px', display: 'block' }}>From interested buyers</span>
                        </div>
                    </div>

                    {/* My Listings */}
                    <div style={{ background: '#fff', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', padding: '24px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 700 }}>My Listings</h3>
                            <Link to="/post-property" className="btn btn-primary btn-sm"><i className="fas fa-plus"></i> Add New</Link>
                        </div>
                        {listingsLoading ? (
                            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--gray-400)' }}><i className="fas fa-spinner fa-spin" style={{ fontSize: '24px' }}></i></div>
                        ) : myListings.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-400)' }}>
                                <i className="fas fa-home" style={{ fontSize: '40px', marginBottom: '12px', display: 'block' }}></i>
                                <p>No listings yet. Post your first property!</p>
                                <Link to="/post-property" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>Post Property</Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {myListings.map(p => (
                                    <div key={p._id} style={{ display: 'flex', gap: '16px', background: 'var(--gray-50)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--gray-100)', alignItems: 'center' }}>
                                        <img
                                            src={p.images?.[0] || `https://placehold.co/120x90/e5e7eb/9ca3af?text=Property`}
                                            alt={p.propertyName}
                                            style={{ width: '120px', height: '90px', objectFit: 'cover', flexShrink: 0 }}
                                        />
                                        <div style={{ flex: 1, padding: '12px 0', minWidth: 0 }}>
                                            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.propertyName}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginBottom: '6px' }}><i className="fas fa-map-marker-alt" style={{ marginRight: '4px', color: 'var(--primary)' }}></i>{p.address}</div>
                                            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(p.price)}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', padding: '0 16px', flexShrink: 0 }}>
                                            <Link to={`/property/${p._id}`} className="btn btn-outline btn-sm"><i className="fas fa-eye"></i></Link>
                                            <button onClick={() => handleDelete(p._id)} className="btn btn-sm" style={{ background: '#fee2e2', color: '#dc2626', border: 'none' }}><i className="fas fa-trash"></i></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Enquiries Received */}
                    <div style={{ background: '#fff', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', padding: '24px', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '20px' }}>Enquiries Received</h3>
                        {enquiriesLoading ? (
                            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--gray-400)' }}><i className="fas fa-spinner fa-spin" style={{ fontSize: '24px' }}></i></div>
                        ) : enquiries.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--gray-400)' }}>
                                <i className="fas fa-envelope" style={{ fontSize: '36px', marginBottom: '10px', display: 'block' }}></i>
                                <p>No enquiries received yet.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {enquiries.map(enq => (
                                    <div key={enq._id} style={{ background: 'var(--gray-50)', borderRadius: '10px', padding: '16px', border: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '14px' }}>{enq.property?.propertyName || 'Property'}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '2px' }}>{enq.property?.address}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 600, fontSize: '14px' }}>
                                                <i className="fas fa-user-circle" style={{ marginRight: '6px', color: 'var(--primary)' }}></i>
                                                {enq.sender?.name}
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '2px' }}>
                                                <i className="fas fa-phone-alt" style={{ marginRight: '4px' }}></i>{enq.sender?.number}
                                                &nbsp;·&nbsp;
                                                <i className="fas fa-envelope" style={{ marginRight: '4px' }}></i>{enq.sender?.email}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Saved Properties */}
                    <div style={{ background: '#fff', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', padding: '24px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '20px' }}>Saved Properties</h3>
                        {savedItems.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--gray-400)' }}>
                                <i className="far fa-heart" style={{ fontSize: '36px', marginBottom: '10px', display: 'block' }}></i>
                                <p>No saved properties yet. Browse and save properties you like!</p>
                                <Link to="/search" className="btn btn-outline btn-sm" style={{ marginTop: '12px' }}>Browse Properties</Link>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                                {savedItems.map(item => {
                                    const p = item.property;
                                    if (!p) return null;
                                    return (
                                        <div key={item._id} style={{ border: '1px solid var(--gray-100)', borderRadius: '10px', overflow: 'hidden' }}>
                                            <Link to={`/property/${p._id}`}>
                                                <img src={p.images?.[0] || 'https://placehold.co/300x180/e5e7eb/9ca3af?text=Property'} alt="" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                            </Link>
                                            <div style={{ padding: '12px' }}>
                                                <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>{p.propertyName}</div>
                                                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>{formatPrice(p.price)}</div>
                                                <button
                                                    onClick={() => handleUnsave(p._id)}
                                                    style={{ width: '100%', padding: '6px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                                >
                                                    <i className="fas fa-heart-broken" style={{ marginRight: '4px' }}></i> Remove
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
