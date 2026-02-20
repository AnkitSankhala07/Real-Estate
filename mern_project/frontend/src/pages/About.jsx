import { Link } from 'react-router-dom';

const About = () => (
    <div>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '80px 0', textAlign: 'center' }}>
            <div className="container">
                <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>About <span style={{ color: '#f39c12' }}>Akxton</span></h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                    India's fastest growing real estate portal — connecting buyers, sellers, and renters seamlessly.
                </p>
            </div>
        </section>

        {/* Stats */}
        <section style={{ background: '#fff', padding: '48px 0', borderBottom: '1px solid var(--gray-100)' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }}>
                {[['50L+', 'Properties Listed'], ['40K+', 'Verified Dealers'], ['20L+', 'Happy Customers'], ['15+', 'Years of Trust']].map(([num, label]) => (
                    <div key={label}>
                        <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--primary)' }}>{num}</div>
                        <div style={{ fontSize: '14px', color: 'var(--gray-500)', marginTop: '4px' }}>{label}</div>
                    </div>
                ))}
            </div>
        </section>

        {/* Mission */}
        <section style={{ padding: '80px 0' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                <div>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px' }}>Our Mission</span>
                    <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '12px 0 20px', lineHeight: 1.3 }}>Making Real Estate Accessible to Everyone</h2>
                    <p style={{ color: 'var(--gray-500)', lineHeight: 1.8, fontSize: '15px', marginBottom: '16px' }}>
                        Founded in 2010, Akxton was built with a simple vision: make property search in India transparent, trustworthy, and hassle-free. We connect millions of property seekers with verified sellers, builders, and agents across the country.
                    </p>
                    <p style={{ color: 'var(--gray-500)', lineHeight: 1.8, fontSize: '15px' }}>
                        Our platform uses advanced technology and human expertise to verify listings, ensuring you only see genuine properties with accurate information.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[
                        { icon: '🏠', title: 'For Buyers', desc: 'Thousands of verified properties at your fingertips.' },
                        { icon: '🔑', title: 'For Renters', desc: 'Find your ideal rental home in any city.' },
                        { icon: '📢', title: 'For Sellers', desc: 'List for FREE and reach millions of buyers.' },
                        { icon: '🏗️', title: 'For Builders', desc: 'Showcase new projects to serious buyers.' },
                    ].map((item, i) => (
                        <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
                            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{item.icon}</div>
                            <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>{item.title}</h4>
                            <p style={{ fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.6 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'linear-gradient(135deg, var(--primary), #c0392b)', padding: '60px 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Ready to Find Your Dream Home?</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>Start your property journey with Akxton today.</p>
                </div>
                <Link to="/search" className="btn btn-white btn-lg"><i className="fas fa-search"></i> Search Properties</Link>
            </div>
        </section>
    </div>
);

export default About;
