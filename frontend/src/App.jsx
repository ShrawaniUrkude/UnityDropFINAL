import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Campaigns from './pages/Campaigns';
import Volunteers from './pages/Volunteers';
import NGOs from './pages/NGOs';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Donate from './pages/Donate';

/* Scroll to top on navigation */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppInner() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/:id" element={<Campaigns />} />
        <Route path="/volunteers" element={<Volunteers />} />
        <Route path="/ngos" element={<NGOs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: '24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '5rem' }}>🔍</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Page Not Found</h1>
      <p style={{ color: 'var(--gray-500)' }}>The page you're looking for doesn't exist.</p>
      <a href="/" className="btn btn-primary">Go Home</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
