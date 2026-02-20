import { Link } from 'react-router-dom';

const Footer = () => (
    <footer className="footer">
        <div className="container footer-main">
            <div className="footer-brand">
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                    Ak<span style={{ color: 'var(--accent)' }}>xton</span>
                </div>
                <p>India's fastest growing real estate platform. Find your dream home, plot, office space or rental property — all in one place.</p>
                <div className="social-links">
                    {['fab fa-facebook-f', 'fab fa-twitter', 'fab fa-instagram', 'fab fa-linkedin-in', 'fab fa-youtube'].map((icon, i) => (
                        <a key={i} href="#" className="social-link"><i className={icon}></i></a>
                    ))}
                </div>
            </div>

            <div className="footer-col">
                <h4>Quick Links</h4>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/search?offer=sale">Properties for Sale</Link></li>
                    <li><Link to="/search?offer=rent">Properties for Rent</Link></li>
                    <li><Link to="/post-property">Post Property FREE</Link></li>
                    <li><Link to="/search">New Projects</Link></li>
                </ul>
            </div>

            <div className="footer-col">
                <h4>Property Types</h4>
                <ul>
                    <li><Link to="/search?type=flat">Flats / Apartments</Link></li>
                    <li><Link to="/search?type=house">Houses / Villas</Link></li>
                    <li><Link to="/search?type=shop">Commercial Spaces</Link></li>
                    <li><Link to="/search?type=pg&offer=rent">PG / Co-living</Link></li>
                    <li><Link to="/search?type=plot">Plots / Land</Link></li>
                </ul>
            </div>

            <div className="footer-col">
                <h4>Company</h4>
                <ul>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                </ul>
                <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(255,255,255,0.07)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                        <i className="fas fa-phone-alt" style={{ marginRight: '6px', color: 'var(--accent)' }}></i> 1800-41-99099
                    </p>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>Mon–Sat: 9 AM – 9 PM</p>
                </div>
            </div>
        </div>

        <div className="container footer-bottom">
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>© {new Date().getFullYear()} Akxton India Pvt. Ltd. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '20px' }}>
                <a href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Privacy</a>
                <a href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Terms</a>
                <a href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Sitemap</a>
            </div>
        </div>
    </footer>
);

export default Footer;
