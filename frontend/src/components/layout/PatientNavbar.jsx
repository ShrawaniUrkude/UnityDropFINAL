import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './PatientNavbar.css';

const patientLinks = [
    { to: '/', label: 'Patient Home' },
    { to: '/hospital', label: 'Hospital Help' },
    { to: '/dashboard', label: 'Treatment Guide' },
    { to: '/food-donation', label: 'Food Support' },
    { to: '/about', label: 'About' },
];

export default function PatientNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="patient-navbar">
            <div className="patient-navbar__inner">
                <Link to="/" className="patient-navbar__brand" onClick={() => setMenuOpen(false)}>
                    <span className="patient-navbar__badge">Patient</span>
                    <span className="patient-navbar__title">UnityDrop Care</span>
                </Link>

                <nav className="patient-navbar__links">
                    {patientLinks.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `patient-navbar__link ${isActive ? 'patient-navbar__link--active' : ''}`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <Link to="/donate" className="patient-navbar__cta">
                    Emergency Donate
                </Link>

                <button
                    className={`patient-navbar__menu-btn ${menuOpen ? 'open' : ''}`}
                    aria-label="Toggle patient menu"
                    onClick={() => setMenuOpen(prev => !prev)}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>

            <div className={`patient-navbar__mobile ${menuOpen ? 'patient-navbar__mobile--open' : ''}`}>
                {patientLinks.map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) =>
                            `patient-navbar__mobile-link ${isActive ? 'patient-navbar__mobile-link--active' : ''}`
                        }
                        onClick={() => setMenuOpen(false)}
                    >
                        {label}
                    </NavLink>
                ))}
                <Link to="/donate" className="patient-navbar__mobile-cta" onClick={() => setMenuOpen(false)}>
                    Emergency Donate
                </Link>
            </div>
        </header>
    );
}
