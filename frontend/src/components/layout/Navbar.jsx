import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { gsap } from '../../hooks/useGsap';
import './Navbar.css';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/campaigns', label: 'Donar' },
    { to: '/ngos', label: 'NGOs' },
    { to: '/hospital', label: 'Hospital' },
    { to: '/dashboard', label: 'Treatment' },
    { to: '/donar-dashboard', label: 'My Dashboard' },
    { to: '/food-donation', label: 'Food Donation' },
    { to: '/about', label: 'About' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    const headerRef = useRef(null);
    const logoRef = useRef(null);
    const navRef = useRef(null);
    const actionsRef = useRef(null);
    const notifPanelRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const donateRef = useRef(null);

    /* Entrance animation */
    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo(logoRef.current, { x: -30, opacity: 0, scale: 0.8 }, { x: 0, opacity: 1, scale: 1, duration: 0.6 })
          .fromTo(navRef.current?.children || [], { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.06 }, '-=0.3')
          .fromTo(actionsRef.current, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, '-=0.3');
    }, []);

    /* Donate button pulse */
    useEffect(() => {
        if (!donateRef.current) return;
        gsap.to(donateRef.current, {
            boxShadow: '0 0 20px rgba(76, 175, 135, 0.5), 0 0 40px rgba(76, 175, 135, 0.2)',
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* close mobile menu on route change */
    useEffect(() => {
        setMenuOpen(false);
        setNotifOpen(false);
    }, [location]);

    /* Animate notification panel */
    useEffect(() => {
        if (!notifPanelRef.current) return;
        if (notifOpen) {
            gsap.fromTo(notifPanelRef.current,
                { y: -15, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.7)' }
            );
            gsap.fromTo(notifPanelRef.current.querySelectorAll('.navbar__notif-item'),
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.3, stagger: 0.08, delay: 0.15, ease: 'power2.out' }
            );
        }
    }, [notifOpen]);

    /* Animate mobile menu */
    useEffect(() => {
        if (!mobileMenuRef.current) return;
        if (menuOpen) {
            gsap.fromTo(mobileMenuRef.current.children,
                { x: 40, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: 'power3.out' }
            );
        }
    }, [menuOpen]);

    /* Magnetic hover for nav links */
    const onLinkMove = useCallback((e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
        gsap.to(el, { x, y, duration: 0.25, ease: 'power2.out' });
    }, []);

    const onLinkLeave = useCallback((e) => {
        gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    }, []);

    const transparent = isHome && !scrolled;

    return (
        <header ref={headerRef} className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${transparent ? 'navbar--transparent' : ''}`}>
            <div className="navbar__gradient-line" />
            <div className="navbar__inner">

                {/* Logo */}
                <Link to="/" className="navbar__logo" ref={logoRef}>
                    <span className="navbar__logo-icon">💧</span>
                    <span className="navbar__logo-text">
                        Unity<span className="navbar__logo-accent">Drop</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="navbar__nav" ref={navRef}>
                    {navLinks.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                            }
                            onMouseMove={onLinkMove}
                            onMouseLeave={onLinkLeave}
                        >
                            {label}
                            <span className="navbar__link-bar" />
                        </NavLink>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="navbar__actions" ref={actionsRef}>
                    {/* Notification Bell */}
                    <button
                        className="navbar__icon-btn"
                        onClick={() => setNotifOpen(!notifOpen)}
                        title="Notifications"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <span className="navbar__notif-dot" />
                    </button>

                    {notifOpen && (
                        <div className="navbar__notif-panel" ref={notifPanelRef}>
                            <p className="navbar__notif-title">Notifications</p>
                            <div className="navbar__notif-empty">
                                <span>🔔</span>
                                <p>No new notifications</p>
                            </div>
                        </div>
                    )}

                    <Link to="/donar-dashboard" className="btn btn-primary btn-sm navbar__donate-btn" ref={donateRef}>
                        <span className="navbar__donate-sparkle">✦</span>
                        Donate Now
                    </Link>

                    {/* Hamburger */}
                    <button
                        className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div ref={mobileMenuRef} className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
                {navLinks.map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) =>
                            `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                        }
                    >
                        {label}
                    </NavLink>
                ))}
                <Link to="/donar-dashboard" className="btn btn-primary" style={{ margin: '8px 0 0' }}>
                    Donate Now
                </Link>
            </div>
        </header>
    );
}
