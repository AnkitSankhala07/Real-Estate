import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenu, setMobileMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenu(false);
    };

    const navLinks = [
        { to: '/search?offer=sale', label: 'Buy' },
        { to: '/search?offer=rent', label: 'Rent' },
        { to: '/search?status=new launch', label: 'New Projects' },
        { to: '/search?type=shop', label: 'Commercial' },
        { to: '/search?type=pg', label: 'PG / Co-living' },
    ];

    return (
        <header className="header">
            {/* Top bar */}
            <div className="header-top">
                <div className="container header-top-inner">
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <a href="tel:+1800123456"><i className="fas fa-phone-alt"></i> 1800-41-99099</a>
                        <a href="mailto:info@akxton.com"><i className="fas fa-envelope"></i> info@akxton.com</a>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Link to="/about">About Us</Link>
                        <Link to="/contact">Contact</Link>
                    </div>
                </div>
            </div>

            {/* Main nav */}
            <div className="header-main">
                <div className="container header-main-inner">
                    <Link to="/" className="logo">Ak<span>xton</span></Link>

                    <nav className={`nav ${mobileMenu ? 'nav-mobile-open' : ''}`}>
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileMenu(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="header-actions">
                        {user ? (
                            <>
                                <Link to="/dashboard" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '30px', height: '30px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px' }}>
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    {user.name?.split(' ')[0]}
                                </Link>
                                <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                                <Link to="/register" className="btn btn-sm" style={{ background: 'var(--gray-100)', color: 'var(--gray-700)' }}>Register</Link>
                            </>
                        )}
                        <Link to="/post-property" className="post-property-btn" style={{ borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fas fa-plus-circle"></i> Post Property <span style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 700 }}>FREE</span>
                        </Link>

                        {/* Hamburger */}
                        <button
                            onClick={() => setMobileMenu(!mobileMenu)}
                            style={{ display: 'none', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--gray-700)' }}
                            className="hamburger-btn"
                            aria-label="Toggle menu"
                        >
                            <i className={mobileMenu ? 'fas fa-times' : 'fas fa-bars'}></i>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
