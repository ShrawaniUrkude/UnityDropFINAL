import { useState, useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../hooks/useGsap';
import './Donate.css';

const donationAmounts = [500, 1000, 2000, 5000, 10000, 25000];

export default function Donate() {
    const [amount, setAmount] = useState(1000);
    const [customAmount, setCustom] = useState('');
    const [payType, setPayType] = useState('one-time');
    const [category, setCategory] = useState('where-needed');
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);

    const finalAmount = customAmount ? parseInt(customAmount) : amount;

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const heroRef = useRef(null);
    const formRef = useRef(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero entrance
            const heroEl = heroRef.current;
            if (heroEl) {
                gsap.fromTo(heroEl.querySelectorAll('.section-label, .page-header__title, .page-header__subtitle'),
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
                );
            }

            // Form card slide in from left
            const formEl = formRef.current;
            if (formEl) {
                gsap.fromTo(formEl,
                    { x: -50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                      scrollTrigger: { trigger: formEl, start: 'top 85%' } }
                );
            }

            // Sidebar slide in from right
            const sidebarEl = sidebarRef.current;
            if (sidebarEl) {
                gsap.fromTo(sidebarEl.children,
                    { x: 50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
                      scrollTrigger: { trigger: sidebarEl, start: 'top 85%' } }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    if (submitted) {
        return (
            <main className="donate-page">
                <div className="container donate-success animate-bounce-in">
                    <div className="donate-success__icon">🎉</div>
                    <h1>Thank You!</h1>
                    <p>Your donation of <strong>₹{finalAmount.toLocaleString()}</strong> has been received.</p>
                    <p>We'll send you a confirmation and real-time updates on your impact.</p>
                    <div className="donate-success__meta">
                        <div><span>Receipt ID</span> <strong>#SB{Date.now().toString().slice(-6)}</strong></div>
                        <div><span>Amount</span> <strong>₹{finalAmount.toLocaleString()}</strong></div>
                        <div><span>Category</span> <strong>{category}</strong></div>
                        <div><span>Type</span> <strong>{payType}</strong></div>
                    </div>
                    <div className="donate-success__badges">
                        <span>✅ 80G Tax Exemption eligible</span>
                        <span>🔒 Secure & Verified</span>
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={() => { setSubmitted(false); setStep(1); }}>
                        Donate Again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="donate-page">
            <section className="page-header" ref={heroRef}>
                <div className="page-header__bg-pattern" />
                <div className="container">
                    <span className="section-label">Give</span>
                    <h1 className="page-header__title">Make a Donation</h1>
                    <p className="page-header__subtitle">
                        100% transparent. Every rupee is tracked and you'll receive real-time updates.
                    </p>
                </div>
            </section>

            <div className="container donate-body">
                <div className="donate-layout">
                    {/* Form */}
                    <div className="donate-form-wrap card" ref={formRef}>
                        {/* Steps */}
                        <div className="donate-steps">
                            {[1, 2, 3].map(s => (
                                <div key={s} className={`donate-step ${step >= s ? 'active' : ''} ${step > s ? 'done' : ''}`}>
                                    <div className="donate-step__num">{step > s ? '✓' : s}</div>
                                    <span>{s === 1 ? 'Amount' : s === 2 ? 'Category' : 'Details'}</span>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="donate-form">
                            {step === 1 && (
                                <div className="donate-form-section animate-fadeIn">
                                    <h3>Choose Donation Amount</h3>

                                    {/* Pay type toggle */}
                                    <div className="donate-pay-toggle">
                                        <button type="button" className={payType === 'one-time' ? 'active' : ''} onClick={() => setPayType('one-time')}>One-Time</button>
                                        <button type="button" className={payType === 'monthly' ? 'active' : ''} onClick={() => setPayType('monthly')}>Monthly</button>
                                    </div>

                                    <div className="donate-amounts">
                                        {donationAmounts.map(a => (
                                            <button
                                                key={a}
                                                type="button"
                                                className={`donate-amount-btn ${amount === a && !customAmount ? 'active' : ''}`}
                                                onClick={() => { setAmount(a); setCustom(''); }}
                                            >
                                                ₹{a.toLocaleString()}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Custom Amount (₹)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter any amount"
                                            value={customAmount}
                                            onChange={e => setCustom(e.target.value)}
                                            min={1}
                                        />
                                    </div>

                                    <div className="donate-impact-preview">
                                        <h4>What ₹{finalAmount.toLocaleString()} can do:</h4>
                                        <ul>
                                            {finalAmount >= 500 && <li>🍚 Feed a family for a week</li>}
                                            {finalAmount >= 1000 && <li>📚 Buy school supplies for 3 children</li>}
                                            {finalAmount >= 5000 && <li>🧥 Provide winter clothing for 20 people</li>}
                                            {finalAmount >= 10000 && <li>💧 Install a water filter in a village</li>}
                                        </ul>
                                    </div>

                                    <button type="button" className="btn btn-primary" onClick={() => setStep(2)} style={{ width: '100%', justifyContent: 'center' }}>
                                        Continue →
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="donate-form-section animate-fadeIn">
                                    <h3>Where Should It Go?</h3>
                                    <div className="donate-categories">
                                        {[
                                            { val: 'where-needed', label: 'Wherever Needed Most', icon: '🌟' },
                                            { val: 'food', label: 'Food & Nutrition', icon: '🍚' },
                                            { val: 'clothes', label: 'Clothing & Shelter', icon: '🧥' },
                                            { val: 'education', label: 'Education', icon: '📚' },
                                            { val: 'water', label: 'Clean Water', icon: '💧' },
                                            { val: 'healthcare', label: 'Healthcare', icon: '🏥' },
                                        ].map(cat => (
                                            <button
                                                key={cat.val}
                                                type="button"
                                                className={`donate-category-btn ${category === cat.val ? 'active' : ''}`}
                                                onClick={() => setCategory(cat.val)}
                                            >
                                                <span>{cat.icon}</span>
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="donate-form-nav">
                                        <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                                        <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Continue →</button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="donate-form-section animate-fadeIn">
                                    <h3>Your Details</h3>
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input type="text" className="form-control" placeholder="Your full name" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input type="email" className="form-control" placeholder="your@email.com" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone (Optional)</label>
                                        <input type="tel" className="form-control" placeholder="+91 98765 43210" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">PAN Card (For 80G Tax Exemption)</label>
                                        <input type="text" className="form-control" placeholder="ABCDE1234F" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Message (Optional)</label>
                                        <textarea className="form-control" rows={3} placeholder="Words of encouragement for the team..." />
                                    </div>

                                    <div className="donate-summary">
                                        <div><span>Amount</span><strong>₹{finalAmount.toLocaleString()}</strong></div>
                                        <div><span>Type</span><strong>{payType}</strong></div>
                                        <div><span>Category</span><strong>{category}</strong></div>
                                    </div>

                                    <div className="donate-form-nav">
                                        <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                                        <button type="submit" className="btn btn-primary">
                                            🔒 Confirm & Pay ₹{finalAmount.toLocaleString()}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Sidebar */}
                    <div className="donate-sidebar" ref={sidebarRef}>
                        <div className="donate-trust card">
                            <h4>Why Donate Here?</h4>
                            <div className="donate-trust__items">
                                {[
                                    { icon: '🔒', text: '100% Secure SSL Payment' },
                                    { icon: '📊', text: 'Real-Time Donation Tracker' },
                                    { icon: '✅', text: 'Verified NGO Partners' },
                                    { icon: '🧾', text: '80G Tax Exemption Certificate' },
                                    { icon: '📱', text: 'SMS & Email Updates on Impact' },
                                ].map((t, i) => (
                                    <div key={i} className="donate-trust__item">
                                        <span>{t.icon}</span>
                                        <p>{t.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="donate-recent card">
                            <h4>Recent Donors</h4>
                            {[
                                { name: 'Ramesh K.', amount: 5000, time: '2m ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ram' },
                                { name: 'TechCorp', amount: 50000, time: '15m ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TC' },
                                { name: 'Anjali S.', amount: 2500, time: '1h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anj' },
                            ].map((d, i) => (
                                <div key={i} className="donate-recent__item">
                                    <img src={d.avatar} alt={d.name} className="avatar" style={{ width: 36, height: 36 }} />
                                    <div>
                                        <strong>{d.name}</strong>
                                        <span>₹{d.amount.toLocaleString()} · {d.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
