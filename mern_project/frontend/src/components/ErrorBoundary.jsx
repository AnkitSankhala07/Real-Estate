import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMsg: '' };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorMsg: error.message };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <section style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '2rem',
                    background: 'var(--bg)',
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚧</div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '12px' }}>
                        Oops! Something went wrong.
                    </h1>
                    <p style={{ fontSize: '15px', color: 'var(--gray-500)', marginBottom: '32px', maxWidth: '480px' }}>
                        We encountered an unexpected error. Please try refreshing the page.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => window.location.href = '/'}
                    >
                        <i className="fas fa-home"></i> Return to Homepage
                    </button>
                </section>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
