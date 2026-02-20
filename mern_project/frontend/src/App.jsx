import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostProperty from './pages/PostProperty';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import PropertyDetails from './pages/PropertyDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' } }} />
            <Header />
            <main style={{ minHeight: '80vh', background: 'var(--bg)' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/property/:id" element={<PropertyDetails />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Admin Routes */}
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminDashboard />} />

                    {/* Protected Routes — require login */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/post-property" element={<PostProperty />} />
                    </Route>
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
