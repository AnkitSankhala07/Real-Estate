import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import toast from 'react-hot-toast';

const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} Lac`;
    return `₹${price?.toLocaleString('en-IN')}`;
};

const AdminDashboard = () => {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('overview');

    // Redirect if not admin
    if (!isAdmin) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '60px' }}>🔒</div>
                <h2 style={{ color: '#dc2626' }}>Access Denied</h2>
                <p style={{ color: '#6b7280' }}>You must be logged in as admin to view this page.</p>
                <Link to="/admin-login" className="btn btn-primary">Go to Admin Login</Link>
            </div>
        );
    }

    // Stats
    const { data: stats } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const { data } = await API.get('/api/admin/stats');
            return data;
        },
    });

    // Users
    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: async () => {
            const { data } = await API.get('/api/admin/users');
            return data;
        },
        enabled: activeTab === 'users',
    });

    // Properties
    const { data: properties = [], isLoading: propsLoading } = useQuery({
        queryKey: ['adminProperties'],
        queryFn: async () => {
            const { data } = await API.get('/api/admin/properties');
            return data;
        },
        enabled: activeTab === 'properties',
    });

    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Delete user "${name}" and all their data?`)) return;
        try {
            await API.delete(`/api/admin/users/${id}`);
            toast.success(`User "${name}" deleted`);
            queryClient.invalidateQueries(['adminUsers']);
            queryClient.invalidateQueries(['adminStats']);
        } catch {
            toast.error('Failed to delete user');
        }
    };

    const handleDeleteProperty = async (id, name) => {
        if (!window.confirm(`Delete property "${name}"?`)) return;
        try {
            await API.delete(`/api/admin/properties/${id}`);
            toast.success('Property deleted');
            queryClient.invalidateQueries(['adminProperties']);
            queryClient.invalidateQueries(['adminStats']);
        } catch {
            toast.error('Failed to delete property');
        }
    };

    const handleLogout = () => { logout(); navigate('/'); };

    const sidebarStyle = {
        width: '240px',
        flexShrink: 0,
        background: 'linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%)',
        borderRadius: '16px',
        padding: '24px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignSelf: 'flex-start',
        position: 'sticky',
        top: '20px',
    };

    const tabBtnStyle = (tab) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '11px 14px',
        borderRadius: '8px',
        border: 'none',
        background: activeTab === tab ? 'rgba(255,255,255,0.18)' : 'transparent',
        color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.65)',
        fontWeight: activeTab === tab ? 700 : 500,
        fontSize: '14px',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'all 0.2s',
    });

    const statCardStyle = (color) => ({
        background: '#fff',
        borderRadius: '14px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        borderLeft: `4px solid ${color}`,
        flex: 1,
        minWidth: '140px',
    });

    return (
        <div style={{ background: '#f4f6fb', minHeight: '100vh', padding: '24px 0 60px' }}>
            <div className="container">
                {/* Header Banner */}
                <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', borderRadius: '16px', padding: '24px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🛡️</div>
                        <div>
                            <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, margin: 0 }}>Admin Dashboard</h1>
                            <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '13px' }}>Akxton Real Estate — Control Panel</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>👤 {user?.name}</span>
                        <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                            <i className="fas fa-sign-out-alt" style={{ marginRight: '5px' }}></i>Logout
                        </button>
                        <Link to="/" style={{ padding: '8px 16px', background: '#fff', borderRadius: '8px', color: '#0f3460', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                            <i className="fas fa-home" style={{ marginRight: '5px' }}></i>Site
                        </Link>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    {/* Sidebar */}
                    <aside style={sidebarStyle}>
                        <div style={{ textAlign: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '8px' }}>
                            <div style={{ width: '52px', height: '52px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto 8px' }}>A</div>
                            <div style={{ fontWeight: 700, fontSize: '15px' }}>admin</div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>Super Administrator</div>
                        </div>
                        <button style={tabBtnStyle('overview')} onClick={() => setActiveTab('overview')}><i className="fas fa-tachometer-alt"></i> Overview</button>
                        <button style={tabBtnStyle('users')} onClick={() => setActiveTab('users')}><i className="fas fa-users"></i> Users</button>
                        <button style={tabBtnStyle('properties')} onClick={() => setActiveTab('properties')}><i className="fas fa-building"></i> Properties</button>
                    </aside>

                    {/* Main Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>

                        {/* ── OVERVIEW TAB ── */}
                        {activeTab === 'overview' && (
                            <div>
                                {/* Stat Cards */}
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
                                    <div style={statCardStyle('#e74c3c')}>
                                        <div style={{ fontSize: '36px', fontWeight: 800, color: '#e74c3c' }}>{stats?.users ?? '—'}</div>
                                        <div style={{ fontWeight: 600, color: '#374151', marginTop: '4px' }}>Total Users</div>
                                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Registered accounts</div>
                                    </div>
                                    <div style={statCardStyle('#3498db')}>
                                        <div style={{ fontSize: '36px', fontWeight: 800, color: '#3498db' }}>{stats?.properties ?? '—'}</div>
                                        <div style={{ fontWeight: 600, color: '#374151', marginTop: '4px' }}>Properties</div>
                                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Active listings</div>
                                    </div>
                                    <div style={statCardStyle('#27ae60')}>
                                        <div style={{ fontSize: '36px', fontWeight: 800, color: '#27ae60' }}>{stats?.messages ?? '—'}</div>
                                        <div style={{ fontWeight: 600, color: '#374151', marginTop: '4px' }}>Messages</div>
                                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Contact inquiries</div>
                                    </div>
                                    <div style={statCardStyle('#f39c12')}>
                                        <div style={{ fontSize: '36px', fontWeight: 800, color: '#f39c12' }}>{stats?.enquiries ?? '—'}</div>
                                        <div style={{ fontWeight: 600, color: '#374151', marginTop: '4px' }}>Enquiries</div>
                                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Property requests</div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '24px', marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#1a1a2e' }}>Quick Actions</h3>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        <button onClick={() => setActiveTab('users')} style={{ padding: '12px 20px', background: '#f0f4ff', border: '1px solid #d6e4ff', borderRadius: '10px', color: '#1a1a2e', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <i className="fas fa-users" style={{ color: '#0f3460' }}></i> Manage Users
                                        </button>
                                        <button onClick={() => setActiveTab('properties')} style={{ padding: '12px 20px', background: '#f0fff4', border: '1px solid #bbf7d0', borderRadius: '10px', color: '#1a1a2e', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <i className="fas fa-building" style={{ color: '#16a34a' }}></i> Manage Properties
                                        </button>
                                        <Link to="/search" style={{ padding: '12px 20px', background: '#fefce8', border: '1px solid #fde68a', borderRadius: '10px', color: '#1a1a2e', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                                            <i className="fas fa-search" style={{ color: '#d97706' }}></i> Browse Site
                                        </Link>
                                    </div>
                                </div>

                                <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '24px' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#1a1a2e' }}>System Info</h3>
                                    <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
                                        <i className="fas fa-circle" style={{ color: '#22c55e', marginRight: '6px', fontSize: '10px' }}></i>
                                        Backend API is running on <strong>http://localhost:5000</strong>
                                    </p>
                                    <p style={{ color: '#6b7280', fontSize: '13px', margin: '6px 0 0' }}>
                                        <i className="fas fa-circle" style={{ color: '#22c55e', marginRight: '6px', fontSize: '10px' }}></i>
                                        MongoDB connected — database: <strong>akxton_real_estate</strong>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ── USERS TAB ── */}
                        {activeTab === 'users' && (
                            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '24px' }}>
                                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '20px', color: '#1a1a2e' }}>
                                    <i className="fas fa-users" style={{ marginRight: '8px', color: '#0f3460' }}></i>
                                    All Users ({users.length})
                                </h3>
                                {usersLoading ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '28px' }}></i>
                                    </div>
                                ) : users.length === 0 ? (
                                    <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px 0' }}>No users found.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {users.map(u => (
                                            <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '40px', height: '40px', background: '#1a1a2e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '15px', flexShrink: 0 }}>
                                                        {u.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a2e' }}>{u.name}</div>
                                                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                            <i className="fas fa-envelope" style={{ marginRight: '4px' }}></i>{u.email}
                                                            &nbsp;·&nbsp;
                                                            <i className="fas fa-phone" style={{ marginRight: '4px' }}></i>{u.number}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '11px', color: '#6b7280', background: '#e2e8f0', padding: '3px 8px', borderRadius: '4px' }}>
                                                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDeleteUser(u._id, u.name)}
                                                        style={{ padding: '6px 12px', background: '#fee2e2', border: 'none', borderRadius: '6px', color: '#dc2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                                    >
                                                        <i className="fas fa-trash" style={{ marginRight: '4px' }}></i>Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── PROPERTIES TAB ── */}
                        {activeTab === 'properties' && (
                            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '24px' }}>
                                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '20px', color: '#1a1a2e' }}>
                                    <i className="fas fa-building" style={{ marginRight: '8px', color: '#0f3460' }}></i>
                                    All Properties ({properties.length})
                                </h3>
                                {propsLoading ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '28px' }}></i>
                                    </div>
                                ) : properties.length === 0 ? (
                                    <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px 0' }}>No properties found.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {properties.map(p => (
                                            <div key={p._id} style={{ display: 'flex', gap: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden', alignItems: 'center' }}>
                                                <img
                                                    src={p.images?.[0] || 'https://placehold.co/100x80/e2e8f0/9ca3af?text=Prop'}
                                                    alt={p.propertyName}
                                                    style={{ width: '100px', height: '75px', objectFit: 'cover', flexShrink: 0 }}
                                                />
                                                <div style={{ flex: 1, padding: '8px 0', minWidth: 0 }}>
                                                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.propertyName}</div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                                        <i className="fas fa-map-marker-alt" style={{ marginRight: '4px', color: '#e74c3c' }}></i>{p.address}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                                                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#e74c3c' }}>{formatPrice(p.price)}</span>
                                                        <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0284c7', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>{p.type}</span>
                                                        <span style={{ fontSize: '11px', background: '#fef9c3', color: '#ca8a04', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>{p.offer}</span>
                                                    </div>
                                                    {p.user && (
                                                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                                                            <i className="fas fa-user" style={{ marginRight: '4px' }}></i>
                                                            {p.user.name} · {p.user.email}
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px', padding: '0 14px', flexShrink: 0 }}>
                                                    <Link to={`/property/${p._id}`} style={{ padding: '7px 12px', background: '#e0f2fe', border: 'none', borderRadius: '6px', color: '#0284c7', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                                                        <i className="fas fa-eye"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteProperty(p._id, p.propertyName)}
                                                        style={{ padding: '7px 12px', background: '#fee2e2', border: 'none', borderRadius: '6px', color: '#dc2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
