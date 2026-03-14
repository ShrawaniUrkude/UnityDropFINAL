import { ngos } from '../data/mockData';
import './NGOs.css';

export default function NGOs() {
    return (
        <>
            <section className="page-header">
                <div className="page-header__bg-pattern" />
                <div className="container">
                    <span className="section-label">🏢 NGO Network</span>
                    <h1 className="page-header__title">Verified NGO Partners</h1>
                    <p className="page-header__subtitle">
                        Discover trusted NGO partners across the country and connect with organizations making a measurable social impact.
                    </p>
                </div>
            </section>

            <section className="campaigns-body">
                <div className="container">
                    <h2 className="ngo-section-title">Partnered NGOs</h2>
                    <div className="ngos-grid">
                        {ngos.map(ngo => (
                            <div key={ngo.id} className="ngo-card card animate-fadeInUp">
                                <div className="ngo-card__logo-wrap">
                                    <span className="ngo-card__logo">{ngo.logo}</span>
                                    {ngo.verified
                                        ? <span className="ngo-card__verified-badge">✅ Verified</span>
                                        : <span className="ngo-card__pending-badge">⏳ Pending</span>
                                    }
                                </div>
                                <div className="ngo-card__body">
                                    <h3 className="ngo-card__name">{ngo.name}</h3>
                                    <p className="ngo-card__focus">{ngo.focus}</p>
                                    <p className="ngo-card__focus">📍 {ngo.location}</p>
                                    <div className="ngo-card__rating">
                                        ⭐ {ngo.rating} <span>Rating</span>
                                    </div>
                                    <div className="ngo-card__stats">
                                        <div>
                                            <strong>{ngo.campaigns}</strong>
                                            <span>Campaigns</span>
                                        </div>
                                        <div>
                                            <strong>{ngo.beneficiaries.toLocaleString()}</strong>
                                            <span>Beneficiaries</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                </div>
            </section>
        </>
    );
}
