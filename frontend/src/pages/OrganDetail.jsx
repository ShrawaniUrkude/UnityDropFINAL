import { useParams, Link, useNavigate } from 'react-router-dom';
import { organDonations } from '../data/mockData';
import './OrganDetail.css';

export default function OrganDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const organ = organDonations.find(o => o.id === Number(id));

    if (!organ) {
        return (
            <div className="organ-detail-notfound">
                <h2>Organ not found</h2>
                <p>The organ you are looking for does not exist.</p>
                <Link to="/campaigns" className="btn btn--primary">Back to Donar</Link>
            </div>
        );
    }

    const { details } = organ;

    return (
        <>
            {/* Hero */}
            <section className="organ-detail-hero">
                <div className="organ-detail-hero__bg">
                    <img src={organ.image} alt={organ.organ} className="organ-detail-hero__img" />
                    <div className="organ-detail-hero__overlay" />
                </div>
                <div className="container organ-detail-hero__content">
                    <button className="organ-detail-back" onClick={() => navigate('/campaigns')}>
                        ← Back to Donar
                    </button>
                    <span className="organ-detail-hero__icon">{organ.icon}</span>
                    <h1 className="organ-detail-hero__title">{organ.organ} Donation</h1>
                    <p className="organ-detail-hero__desc">{organ.description}</p>
                    <div className="organ-detail-hero__badges">
                        {organ.livingDonor && <span className="organ-detail-badge organ-detail-badge--living">💚 Living Donor Possible</span>}
                        {!organ.livingDonor && <span className="organ-detail-badge organ-detail-badge--posthumous">🕊️ Posthumous Donation</span>}
                        <span className="organ-detail-badge organ-detail-badge--success">✅ {organ.successRate} Success Rate</span>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="organ-detail-stats">
                <div className="container">
                    <div className="organ-detail-stats__row">
                        <div className="organ-detail-stats__item">
                            <span className="organ-detail-stats__value">{organ.waitingPatients.toLocaleString()}+</span>
                            <span className="organ-detail-stats__label">Patients Waiting</span>
                        </div>
                        <div className="organ-detail-stats__item">
                            <span className="organ-detail-stats__value">{organ.successRate}</span>
                            <span className="organ-detail-stats__label">Success Rate</span>
                        </div>
                        <div className="organ-detail-stats__item">
                            <span className="organ-detail-stats__value">{organ.recoveryTime}</span>
                            <span className="organ-detail-stats__label">Recovery Time</span>
                        </div>
                        <div className="organ-detail-stats__item">
                            <span className="organ-detail-stats__value">{organ.livingDonor ? 'Yes' : 'No'}</span>
                            <span className="organ-detail-stats__label">Living Donor</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detail Sections */}
            <section className="organ-detail-body">
                <div className="container">
                    <div className="organ-detail-grid">
                        {/* Function */}
                        <div className="organ-detail-section">
                            <div className="organ-detail-section__icon">🔬</div>
                            <h3>What Does the {organ.organ} Do?</h3>
                            <p>{details.function}</p>
                        </div>

                        {/* Eligibility */}
                        <div className="organ-detail-section">
                            <div className="organ-detail-section__icon">✅</div>
                            <h3>Who Can Donate?</h3>
                            <p>{details.eligibility}</p>
                        </div>

                        {/* Procedure */}
                        <div className="organ-detail-section">
                            <div className="organ-detail-section__icon">🏥</div>
                            <h3>The Procedure</h3>
                            <p>{details.procedure}</p>
                        </div>

                        {/* Risks */}
                        <div className="organ-detail-section">
                            <div className="organ-detail-section__icon">⚠️</div>
                            <h3>Risks & Considerations</h3>
                            <p>{details.risks}</p>
                        </div>

                        {/* Aftercare */}
                        <div className="organ-detail-section">
                            <div className="organ-detail-section__icon">💊</div>
                            <h3>Aftercare & Recovery</h3>
                            <p>{details.aftercare}</p>
                        </div>

                        {/* Facts */}
                        <div className="organ-detail-section organ-detail-section--facts">
                            <div className="organ-detail-section__icon">💡</div>
                            <h3>Did You Know?</h3>
                            <ul className="organ-detail-facts">
                                {details.facts.map((fact, i) => (
                                    <li key={i}>{fact}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="organ-detail-cta">
                        <h2>Ready to Pledge for {organ.organ} Donation?</h2>
                        <p>Your decision can save lives. Register as a donor today.</p>
                        <Link to="/register-donor" className="organ-detail-cta__btn">
                            Register as Donor
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
