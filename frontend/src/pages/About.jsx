import './About.css';

const team = [
    { name: 'Aryan Verma', role: 'Founder & CEO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan', bio: 'Ex-IIT Bombay. Former UNICEF Social Innovation fellow. Passionate about systemic poverty solutions.' },
    { name: 'Zara Sheikh', role: 'CTO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zara', bio: 'Full-stack veteran. Built fintech platforms for 5M+ users. Believes tech can democratize giving.' },
    { name: 'Kavya Reddy', role: 'Head of NGO Relations', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya', bio: '12 years in social sector. Partnered with 200+ NGOs. Drives our verification & ethics pipeline.' },
    { name: 'Mihail Joshi', role: 'Lead Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mihail', bio: 'Human-centered design advocate. Created accessible UI experiences used by 2M+ people.' },
];

export default function About() {
    return (
        <main className="about-page">
            {/* Hero */}
            <section className="page-header">
                <div className="page-header__bg-pattern" />
                <div className="container">
                    <span className="section-label">Our Story</span>
                    <h1 className="page-header__title">About UnityDrop</h1>
                    <p className="page-header__subtitle">
                        Born from frustration with broken donation systems, built with purpose to create real transparency.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="section about-mission">
                <div className="container about-mission__inner">
                    <div className="about-mission__content">
                        <span className="section-label">Our Mission</span>
                        <h2 className="section-title">Bridging the Gap Between Giving and Receiving</h2>
                        <p className="section-subtitle">
                            Every year, billions in donations fail to reach their intended recipients. The causes are systemic: poor coordination, zero transparency, unverified NGOs, and disconnected volunteers.
                        </p>
                        <p style={{ marginTop: 16, color: 'var(--gray-600)', lineHeight: 1.8 }}>
                            UnityDrop was founded with a simple belief: <strong>Generosity should never go to waste.</strong> We built a platform that connects every stakeholder — donors, NGOs, local businesses, college clubs, volunteers, and beneficiaries — into one trusted, transparent ecosystem.
                        </p>
                        <div className="about-mission__values">
                            {[
                                { icon: '🔍', title: 'Radical Transparency', desc: 'Every rupee is tracked end-to-end with blockchain-backed audit trails.' },
                                { icon: '🤝', title: 'Verified Trust', desc: 'Triple-layer verification for NGOs, volunteers, and beneficiaries.' },
                                { icon: '⚡', title: 'Real-Time Delivery', desc: 'Aid reaches beneficiaries within 48-72 hours of campaign closing.' },
                                { icon: '🏆', title: 'Community Recognition', desc: 'Every act of kindness — big or small — is celebrated and rewarded.' },
                            ].map((v, i) => (
                                <div key={i} className="about-value card">
                                    <div className="about-value__icon">{v.icon}</div>
                                    <div>
                                        <strong>{v.title}</strong>
                                        <p>{v.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="about-mission__visual">
                        <img src="/hero.png" alt="Mission" />
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="section" style={{ background: 'var(--gray-50)' }}>
                <div className="container">
                    <div className="text-center">
                        <span className="section-label">Journey</span>
                        <h2 className="section-title">Our Growth Story</h2>
                    </div>
                    <div className="about-timeline">
                        {[
                            { year: '2022', title: 'Founded', desc: 'UnityDrop launched with 3 NGO partners and ₹10L in seed funding.' },
                            { year: '2023', title: '100 NGOs', desc: 'Reached 100 verified NGOs and ₹1 Crore in donations within 12 months.' },
                            { year: '2024', title: 'National Scale', desc: 'Expanded to 28 states, 10,000+ volunteers, and 500+ campaigns run successfully.' },
                            { year: '2025', title: '₹2.8Cr+', desc: 'Crossed ₹2.8 Crore in verified donations with 98,400+ lives impacted.' },
                        ].map((t, i) => (
                            <div key={i} className="about-timeline__item">
                                <div className="about-timeline__year">{t.year}</div>
                                <div className="about-timeline__dot" />
                                <div className="about-timeline__content card">
                                    <strong>{t.title}</strong>
                                    <p>{t.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="section">
                <div className="container">
                    <div className="text-center">
                        <span className="section-label">People</span>
                        <h2 className="section-title">The Team Behind UnityDrop</h2>
                        <p className="section-subtitle">Driven by purpose. Powered by technology. United by compassion.</p>
                    </div>
                    <div className="about-team">
                        {team.map((member, i) => (
                            <div key={i} className="about-team-card card animate-fadeInUp" style={{ animationDelay: `${i * 100}ms` }}>
                                <img src={member.avatar} alt={member.name} className="about-team-card__avatar" />
                                <h3>{member.name}</h3>
                                <p className="about-team-card__role">{member.role}</p>
                                <p className="about-team-card__bio">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Press */}
            <section className="section about-press" style={{ background: 'var(--secondary)' }}>
                <div className="container">
                    <div className="text-center">
                        <h2 className="section-title" style={{ color: 'var(--white)' }}>As Featured In</h2>
                    </div>
                    <div className="about-press__logos">
                        {['The Hindu', 'Economic Times', 'NDTV', 'Forbes India', 'Inc42', 'YourStory'].map(pub => (
                            <div key={pub} className="about-press__logo glass">{pub}</div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
