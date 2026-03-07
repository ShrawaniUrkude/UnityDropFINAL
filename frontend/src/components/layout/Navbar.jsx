import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/campaigns', label: 'Campaigns' },
    { to: '/volunteers', label: 'Volunteers' },
    { to: '/ngos', label: 'NGOs' },
    { to: '/hospital', label: 'Hospital' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/about', label: 'About' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* close mobile menu on route change */
    useEffect(() => { setMenuOpen(false); }, [location]);

    const transparent = isHome && !scrolled;

    return (
        <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${transparent ? 'navbar--transparent' : ''}`}>
            <div className="container navbar__inner">

                {/* Logo */}
                <Link to="/" className="navbar__logo">
                    <span className="navbar__logo-text">
                        Unity<span className="navbar__logo-accent">Drop</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="navbar__nav">
                    {navLinks.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="navbar__actions">
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
                        <div className="navbar__notif-panel animate-fadeIn">
                            <p className="navbar__notif-title">Notifications</p>
                            {[
                                { icon: '✅', text: 'Your donation to Winter Warmth Drive is confirmed!', time: '2m ago' },
                                { icon: '📦', text: 'Food Bank drive reached 70% of its goal!', time: '1h ago' },
                                { icon: '🏆', text: 'Priya Sharma earned Legend Badge!', time: '3h ago' },
                            ].map((n, i) => (
                                <div key={i} className="navbar__notif-item">
                                    <span>{n.icon}</span>
                                    <div>
                                        <p>{n.text}</p>
                                        <small>{n.time}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Link to="/donate" className="btn btn-primary btn-sm">
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
            <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
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
                <Link to="/donate" className="btn btn-primary" style={{ margin: '8px 0 0' }}>
                    Donate Now
                </Link>
            </div>
        </header>
    );
}
