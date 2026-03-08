import { Link } from 'react-router-dom';
import { useCallback } from 'react';
import './CampaignCard.css';

const formatCurrency = (n) =>
    n >= 100000
        ? `₹${(n / 100000).toFixed(1)}L`
        : `₹${(n / 1000).toFixed(0)}K`;

export default function CampaignCard({ campaign, delay = 0 }) {
    const {
        id, title, ngo, ngoLogo, tags, description,
        raised, goal, donors, daysLeft, image, verified,
        impact, location,
    } = campaign;

    const pct = Math.min(Math.round((raised / goal) * 100), 100);
    const urgent = daysLeft <= 7;

    const onTiltMove = useCallback((e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
        el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
    }, []);

    const onTiltLeave = useCallback((e) => {
        e.currentTarget.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
    }, []);

    return (
        <div
            className="campaign-card card animate-fadeInUp"
            style={{ animationDelay: `${delay}ms` }}
            onMouseMove={onTiltMove}
            onMouseLeave={onTiltLeave}
        >
            {/* Image */}
            <div className="campaign-card__img-wrap">
                <img src={image} alt={title} className="campaign-card__img" />
                <div className="campaign-card__img-overlay" />

                {urgent && (
                    <span className="campaign-card__urgent-badge">
                        🔥 Urgent
                    </span>
                )}

                <div className="campaign-card__tags">
                    {tags.slice(0, 2).map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="campaign-card__body">
                {/* NGO */}
                <div className="campaign-card__ngo">
                    <span className="campaign-card__ngo-icon">{ngoLogo}</span>
                    <span className="campaign-card__ngo-name">{ngo}</span>
                    {verified && (
                        <span className="campaign-card__verified" title="Verified NGO">
                            ✅
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="campaign-card__title">{title}</h3>
                <p className="campaign-card__desc">{description}</p>

                {/* Progress */}
                <div className="campaign-card__progress">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="campaign-card__progress-labels">
                        <span className="campaign-card__raised">{formatCurrency(raised)}</span>
                        <span className="campaign-card__pct">{pct}%</span>
                        <span className="campaign-card__goal">{formatCurrency(goal)}</span>
                    </div>
                </div>

                {/* Meta */}
                <div className="campaign-card__meta">
                    <div className="campaign-card__meta-item">
                        <span className="campaign-card__meta-icon">👥</span>
                        <span>{donors.toLocaleString()} donors</span>
                    </div>
                    <div className="campaign-card__meta-item">
                        <span className="campaign-card__meta-icon">⏰</span>
                        <span>{daysLeft}d left</span>
                    </div>
                    <div className="campaign-card__meta-item">
                        <span className="campaign-card__meta-icon">📍</span>
                        <span>{location}</span>
                    </div>
                </div>

                {/* Impact */}
                <div className="campaign-card__impact">
                    <span>🎯 Impact: <strong>{impact}</strong></span>
                </div>

                {/* Actions */}
                <div className="campaign-card__actions">
                    <Link to={`/campaigns/${id}`} className="btn btn-primary">
                        Donate Now
                    </Link>
                    <button className="btn btn-outline btn-sm campaign-card__share">
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
}
