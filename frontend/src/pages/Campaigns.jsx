import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { organDonations } from '../data/mockData';
import './Campaigns.css';

export default function Campaigns() {
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    const filtered = filter === 'all'
        ? organDonations
        : filter === 'living'
            ? organDonations.filter(o => o.livingDonor)
            : organDonations.filter(o => !o.livingDonor);

    return (
        <>
            {/* Hero Header */}
            <section className="page-header">
                <div className="page-header__bg-pattern" />
                <div className="container">
                    <span className="section-label">🩺 Organ Donation</span>
                    <h1 className="page-header__title">Donate Organs, Save Lives</h1>
                    <p className="page-header__subtitle">
                        One organ donor can save up to 8 lives. Learn about different organs you can donate and become a hero for someone waiting.
                    </p>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="organ-stats-bar">
                <div className="container">
                    <div className="organ-stats-row">
                        <div className="organ-stat-item">
                            <span className="organ-stat-value">8</span>
                            <span className="organ-stat-label">Lives Saved per Donor</span>
                        </div>
                        <div className="organ-stat-item">
                            <span className="organ-stat-value">50+</span>
                            <span className="organ-stat-label">Tissues Transplantable</span>
                        </div>
                        <div className="organ-stat-item">
                            <span className="organ-stat-value">1L+</span>
                            <span className="organ-stat-label">Patients Waiting in India</span>
                        </div>
                        <div className="organ-stat-item">
                            <span className="organ-stat-value">90%+</span>
                            <span className="organ-stat-label">Average Success Rate</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters & Grid */}
            <section className="campaigns-body">
                <div className="container">
                    <div className="organ-filters">
                        {['all', 'living', 'posthumous'].map(f => (
                            <button
                                key={f}
                                className={`organ-filter-btn ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f === 'all' ? '🌟 All Organs' : f === 'living' ? '💚 Living Donor' : '🕊️ Posthumous'}
                            </button>
                        ))}
                    </div>

                    <div className="organ-grid">
                        {filtered.map((organ, i) => (
                            <div key={organ.id} className="organ-card animate-fadeInUp" style={{ animationDelay: `${i * 80}ms` }}>
                                <div className="organ-card__img-wrap">
                                    <img src={organ.image} alt={organ.organ} className="organ-card__img" loading="lazy" />
                                    <div className="organ-card__img-overlay" />
                                    <span className="organ-card__icon">{organ.icon}</span>
                                    {organ.livingDonor && (
                                        <span className="organ-card__living-badge">💚 Living Donor</span>
                                    )}
                                </div>

                                <div className="organ-card__body">
                                    <h3 className="organ-card__title">{organ.organ}</h3>
                                    <p className="organ-card__desc">{organ.description}</p>

                                    <div className="organ-card__meta">
                                        <div className="organ-card__meta-item">
                                            <span className="organ-card__meta-label">Waiting Patients</span>
                                            <span className="organ-card__meta-value">{organ.waitingPatients.toLocaleString()}+</span>
                                        </div>
                                        <div className="organ-card__meta-item">
                                            <span className="organ-card__meta-label">Success Rate</span>
                                            <span className="organ-card__meta-value organ-card__meta-value--success">{organ.successRate}</span>
                                        </div>
                                        <div className="organ-card__meta-item">
                                            <span className="organ-card__meta-label">Recovery Time</span>
                                            <span className="organ-card__meta-value">{organ.recoveryTime}</span>
                                        </div>
                                    </div>

                                    <button className="organ-card__btn" onClick={() => navigate(`/campaigns/${organ.id}`)}>
                                        Learn More & Pledge
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="campaigns-empty">
                            <div className="campaigns-empty__icon">🔍</div>
                            <h3>No organs found for this filter</h3>
                            <p>Try selecting a different category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="organ-cta">
                <div className="container">
                    <div className="organ-cta__content">
                        <h2>Ready to Become a Donor?</h2>
                        <p>Register as an organ donor today. It only takes a minute and could save up to 8 lives.</p>
                        <Link to="/register-donor" className="organ-cta__btn">Register as Donor</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
