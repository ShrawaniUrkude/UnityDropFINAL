import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from './hooks/useGsap';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Campaigns from './pages/Campaigns';
import NGOs from './pages/NGOs';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Donate from './pages/Donate';
import Hospital from './pages/Hospital';
import OrganDetail from './pages/OrganDetail';
import DonorRegistration from './pages/DonorRegistration';
import DonarDashboard from './pages/DonarDashboard';
import { DonorProvider } from './context/DonorContext';

/* Scroll to top + page transition on navigation */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* Scroll progress bar */
function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!barRef.current) return;
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? Math.min(scrolled / height, 1) : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div ref={barRef} className="scroll-progress" />;
}

/* Custom cursor dot */
function CursorGlow() {
  const dotRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    // Hide on mobile
    const mq = window.matchMedia('(pointer: fine)');
    if (!mq.matches) { dot.style.display = 'none'; return; }

    const onMove = (e) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.25, ease: 'power2.out' });
    };

    const onEnterLink = () => gsap.to(dot, { scale: 2.5, opacity: 0.6, duration: 0.25 });
    const onLeaveLink = () => gsap.to(dot, { scale: 1, opacity: 0.3, duration: 0.25 });

    window.addEventListener('mousemove', onMove);
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', onEnterLink);
      el.addEventListener('mouseleave', onLeaveLink);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink);
        el.removeEventListener('mouseleave', onLeaveLink);
      });
    };
  }, []);

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        top: -10,
        left: -10,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.5), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: 0.3,
        mixBlendMode: 'screen',
      }}
    />
  );
}

function PageTransition({ children }) {
  const containerRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(el,
      { opacity: 0, y: 30, scale: 0.98, filter: 'blur(6px)' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.6 }
    );
  }, [pathname]);

  return <div ref={containerRef}>{children}</div>;
}

function AppInner() {
  return (
    <>
      <ScrollToTop />
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<OrganDetail />} />
          <Route path="/register-donor" element={<DonorRegistration />} />
          <Route path="/donar-dashboard" element={<DonarDashboard />} />
          <Route path="/ngos" element={<NGOs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/hospital" element={<Hospital />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
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
      <DonorProvider>
        <AppInner />
      </DonorProvider>
    </BrowserRouter>
  );
}
