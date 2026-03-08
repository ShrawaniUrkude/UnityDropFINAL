import { useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, ShieldCheck, MapPin, Target, Award, TrendingUp, Globe, Zap, ChevronRight, Star, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '../hooks/useGsap';
import './About.css';

/* ── DATA ─────────────────────────────────────────────── */
const stats = [
    { value: '₹2.8Cr+', label: 'Donations Raised', icon: TrendingUp },
    { value: '98,400+', label: 'Lives Impacted', icon: Heart },
    { value: '500+', label: 'Verified NGOs', icon: ShieldCheck },
    { value: '10,000+', label: 'Active Volunteers', icon: Users },
];

const values = [
    { icon: '🔍', title: 'Radical Transparency', desc: 'Every rupee is tracked end-to-end with blockchain-backed audit trails. Donors see real-time fund allocation.' },
    { icon: '🤝', title: 'Verified Trust', desc: 'Triple-layer verification for all NGOs, volunteers, and beneficiaries. OTP-authenticated, government ID verified.' },
    { icon: '⚡', title: 'Real-Time Delivery', desc: 'Aid reaches beneficiaries within 48-72 hours of campaign closing. GPS-tracked delivery process.' },
    { icon: '🏆', title: 'Community Recognition', desc: 'Every act of kindness — big or small — is celebrated with badges, leaderboards, and impact certificates.' },
    { icon: '🛡️', title: 'Zero Misuse Policy', desc: 'AI-powered fraud detection, regular audits by third parties, and whistleblower protection mechanisms.' },
    { icon: '🌍', title: 'Inclusive Coverage', desc: 'Active across 28 Indian states. Multilingual support in 12+ languages. Accessible design for all abilities.' },
];

const timeline = [
    { year: '2022', quarter: 'Q1', title: 'Founded', desc: 'UnityDrop launched with 3 NGO partners and ₹10L in seed funding. Built V1 of the platform.', milestone: '3 NGOs' },
    { year: '2022', quarter: 'Q4', title: 'First 1000 Donors', desc: 'Reached 1,000 verified donors and onboarded 50 NGOs. Launched OTP authentication.', milestone: '50 NGOs' },
    { year: '2023', quarter: 'Q2', title: '₹1 Crore Milestone', desc: 'Crossed ₹1 Crore in total donations within 15 months. Partnered with UNICEF India.', milestone: '₹1Cr' },
    { year: '2023', quarter: 'Q4', title: 'Volunteer Network', desc: 'Built a volunteer network of 5,000+ across 15 states. Launched GPS-tracked delivery.', milestone: '5K Volunteers' },
    { year: '2024', quarter: 'Q2', title: 'National Scale', desc: 'Expanded to 28 states, 10,000+ volunteers, and 500+ campaigns run successfully.', milestone: '28 States' },
    { year: '2025', quarter: 'Q1', title: '₹2.8 Crore+', desc: 'Crossed ₹2.8 Crore in verified donations. 98,400+ lives impacted. Featured in Forbes India.', milestone: '₹2.8Cr' },
];

const team = [
    { name: 'Aryan Verma', role: 'Founder & CEO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan', bio: 'Ex-IIT Bombay. Former UNICEF Social Innovation fellow. Passionate about systemic poverty solutions.', linkedin: '#' },
    { name: 'Zara Sheikh', role: 'CTO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zara', bio: 'Full-stack veteran. Built fintech platforms for 5M+ users. Believes tech can democratize giving.', linkedin: '#' },
    { name: 'Kavya Reddy', role: 'Head of NGO Relations', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya', bio: '12 years in social sector. Partnered with 200+ NGOs. Drives our verification & ethics pipeline.', linkedin: '#' },
    { name: 'Mihail Joshi', role: 'Lead Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mihail', bio: 'Human-centered design advocate. Created accessible UI experiences used by 2M+ people.', linkedin: '#' },
    { name: 'Priya Nair', role: 'Head of Operations', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', bio: 'Former McKinsey consultant. Manages logistics across 28 states with 99.4% delivery accuracy.', linkedin: '#' },
    { name: 'Rohit Sharma', role: 'Data & AI Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit', bio: 'PhD in ML from IISc. Built fraud detection and impact prediction systems for the platform.', linkedin: '#' },
];

const partners = [
    { name: 'UNICEF India', type: 'Global Partner' },
    { name: 'NITI Aayog', type: 'Government' },
    { name: 'Give India', type: 'Platform Partner' },
    { name: 'CRY Foundation', type: 'NGO Partner' },
    { name: 'Azim Premji Foundation', type: 'Philanthropy' },
    { name: 'Tata Trusts', type: 'Philanthropy' },
];

const press = [
    { name: 'Forbes India', quote: '"UnityDrop is redefining transparent philanthropy in India."' },
    { name: 'Economic Times', quote: '"A platform built for trust in a sector plagued by opacity."' },
    { name: 'NDTV', quote: '"98,000+ lives changed through verified, trackable donations."' },
    { name: 'Inc42', quote: '"The startup making charity accountable with real-time tracking."' },
    { name: 'YourStory', quote: '"From 3 NGOs to 500+ — the UnityDrop growth story."' },
    { name: 'The Hindu', quote: '"Bridging the trust gap between donors and beneficiaries."' },
];

const faqs = [
    { q: 'How does UnityDrop verify NGOs?', a: 'We use a triple-layer verification process: government registration checks (12A, 80G certificates), on-ground field visits by our operations team, and continuous AI-powered monitoring of fund utilization patterns.' },
    { q: 'Where does my donation go?', a: 'Every rupee is tracked through our transparent pipeline. You receive real-time updates from donation → fund allocation → procurement → delivery → beneficiary confirmation with photo proof.' },
    { q: 'Is my donation tax-deductible?', a: 'Yes! All donations through UnityDrop are eligible for 80G tax exemption. You receive an auto-generated tax receipt immediately after donating.' },
    { q: 'How can I volunteer?', a: 'Sign up on our Volunteers page, verify your identity via OTP, choose causes near you, and start making an impact. We provide training, GPS tracking for safety, and impact certificates.' },
    { q: 'What makes UnityDrop different from other platforms?', a: 'End-to-end transparency with real-time tracking, verified-only ecosystem (NGOs + donors + volunteers), AI fraud detection, 48-72 hour delivery guarantee, and multilingual support across India.' },
];

/* ── ANIMATED COUNTER HOOK ────────────────────────────────── */
function useAnimatedCounter(target, triggerRef, suffix = '') {
    const numRef = useRef(null);
    useEffect(() => {
        if (!numRef.current || !triggerRef.current) return;
        const numericVal = parseInt(target.replace(/[^0-9]/g, ''));
        if (!numericVal) { numRef.current.textContent = target; return; }
        const obj = { val: 0 };
        gsap.to(obj, {
            val: numericVal,
            duration: 2.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: triggerRef.current, start: 'top 80%' },
            onUpdate: () => {
                if (!numRef.current) return;
                const prefix = target.startsWith('₹') ? '₹' : '';
                const suf = target.includes('Cr') ? 'Cr+' : target.includes('+') ? '+' : '';
                const formatted = obj.val >= 1000 ? (obj.val / 1000).toFixed(obj.val >= 10000 ? 1 : 1).replace(/\.0$/, '') + 'K' : Math.round(obj.val).toLocaleString();
                numRef.current.textContent = `${prefix}${target.includes('Cr') ? (obj.val / 10).toFixed(1) : formatted}${suf}`;
            },
            onComplete: () => { if (numRef.current) numRef.current.textContent = target; }
        });
    }, [target, triggerRef]);
    return numRef;
}

export default function About() {
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const missionRef = useRef(null);
    const valuesRef = useRef(null);
    const timelineRef = useRef(null);
    const teamRef = useRef(null);
    const partnersRef = useRef(null);
    const pressRef = useRef(null);
    const faqRef = useRef(null);
    const ctaRef = useRef(null);

    const counterRefs = stats.map(() => useAnimatedCounter('0', statsRef));

    /* GSAP Animations */
    useEffect(() => {
        const ctx = gsap.context(() => {
            /* Hero */
            const heroEl = heroRef.current;
            if (heroEl) {
                const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
                tl.fromTo(heroEl.querySelector('.section-label'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.2 })
                  .fromTo(heroEl.querySelector('.about-hero__title'), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
                  .fromTo(heroEl.querySelector('.about-hero__subtitle'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.35')
                  .fromTo(heroEl.querySelectorAll('.about-hero__actions .btn'), { y: 30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 }, '-=0.3');
            }

            /* Stats counter entrance */
            const statsEl = statsRef.current;
            if (statsEl) {
                gsap.fromTo(statsEl.querySelectorAll('.about-stat'),
                    { y: 50, opacity: 0, scale: 0.9 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.4)',
                      scrollTrigger: { trigger: statsEl, start: 'top 85%' } }
                );
            }

            /* Mission */
            const missionEl = missionRef.current;
            if (missionEl) {
                gsap.fromTo(missionEl.querySelector('.about-mission__content'),
                    { x: -60, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
                      scrollTrigger: { trigger: missionEl, start: 'top 80%' } }
                );
                gsap.fromTo(missionEl.querySelector('.about-mission__visual'),
                    { x: 60, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
                      scrollTrigger: { trigger: missionEl, start: 'top 80%' } }
                );
            }

            /* Values */
            const valuesEl = valuesRef.current;
            if (valuesEl) {
                gsap.fromTo(valuesEl.querySelectorAll('.about-value'),
                    { y: 40, opacity: 0, scale: 0.95 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.4)',
                      scrollTrigger: { trigger: valuesEl, start: 'top 85%' } }
                );
            }

            /* Timeline */
            const timelineEl = timelineRef.current;
            if (timelineEl) {
                gsap.fromTo(timelineEl.querySelectorAll('.about-timeline__item'),
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
                      scrollTrigger: { trigger: timelineEl, start: 'top 80%' } }
                );
                gsap.fromTo(timelineEl.querySelectorAll('.about-timeline__dot'),
                    { scale: 0 },
                    { scale: 1, duration: 0.4, stagger: 0.15, ease: 'back.out(2)',
                      scrollTrigger: { trigger: timelineEl, start: 'top 80%' } }
                );
            }

            /* Team */
            const teamEl = teamRef.current;
            if (teamEl) {
                gsap.fromTo(teamEl.querySelectorAll('.about-team-card'),
                    { y: 60, opacity: 0, rotationY: 12 },
                    { y: 0, opacity: 1, rotationY: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
                      scrollTrigger: { trigger: teamEl, start: 'top 82%' } }
                );
            }

            /* Partners */
            const partnersEl = partnersRef.current;
            if (partnersEl) {
                gsap.fromTo(partnersEl.querySelectorAll('.about-partner'),
                    { y: 30, opacity: 0, scale: 0.85 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)',
                      scrollTrigger: { trigger: partnersEl, start: 'top 85%' } }
                );
            }

            /* Press */
            const pressEl = pressRef.current;
            if (pressEl) {
                gsap.fromTo(pressEl.querySelectorAll('.about-press-card'),
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
                      scrollTrigger: { trigger: pressEl, start: 'top 85%' } }
                );
            }

            /* FAQs */
            const faqEl = faqRef.current;
            if (faqEl) {
                gsap.fromTo(faqEl.querySelectorAll('.about-faq'),
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out',
                      scrollTrigger: { trigger: faqEl, start: 'top 85%' } }
                );
            }

            /* CTA */
            const ctaEl = ctaRef.current;
            if (ctaEl) {
                gsap.fromTo(ctaEl.querySelector('.about-cta__content'),
                    { y: 50, opacity: 0, scale: 0.95 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out',
                      scrollTrigger: { trigger: ctaEl, start: 'top 85%' } }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    /* FAQ toggle */
    const toggleFaq = useCallback((e) => {
        const faq = e.currentTarget.closest('.about-faq');
        const isOpen = faq.classList.contains('open');
        document.querySelectorAll('.about-faq.open').forEach(f => f.classList.remove('open'));
        if (!isOpen) faq.classList.add('open');
    }, []);

    /* Team card tilt */
    const onCardMove = useCallback((e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
        gsap.to(el, { rotationY: x, rotationX: y, duration: 0.3, ease: 'power2.out', transformPerspective: 700 });
    }, []);

    const onCardLeave = useCallback((e) => {
        gsap.to(e.currentTarget, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    }, []);

    return (
        <main className="about-page">

            {/* ═══ HERO ═══ */}
            <section className="about-hero" ref={heroRef}>
                <div className="about-hero__bg-pattern" />
                <div className="about-hero__blobs">
                    <div className="about-hero__blob about-hero__blob--1" />
                    <div className="about-hero__blob about-hero__blob--2" />
                </div>
                <div className="container about-hero__inner">
                    <span className="section-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Our Story</span>
                    <h1 className="about-hero__title">
                        We're Building a World Where<br />
                        <span className="about-hero__accent">Every Donation Counts</span>
                    </h1>
                    <p className="about-hero__subtitle">
                        Born from frustration with broken donation systems, UnityDrop was created to bring radical transparency, verified trust, and real-time impact tracking to charitable giving across India.
                    </p>
                    <div className="about-hero__actions">
                        <Link to="/donate" className="btn btn-primary btn-lg">Join Our Mission</Link>
                        <a href="#our-story" className="btn btn-ghost btn-lg">Learn More <ChevronRight size={18} /></a>
                    </div>
                </div>
                <div className="about-hero__wave">
                    <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                        <path fill="var(--off-white)" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
                    </svg>
                </div>
            </section>

            {/* ═══ STATS BAR ═══ */}
            <section className="about-stats" ref={statsRef}>
                <div className="container">
                    <div className="about-stats__grid">
                        {stats.map((s, i) => (
                            <div key={i} className="about-stat">
                                <div className="about-stat__icon"><s.icon size={24} /></div>
                                <div className="about-stat__value">{s.value}</div>
                                <div className="about-stat__label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ MISSION ═══ */}
            <section className="section about-mission" id="our-story" ref={missionRef}>
                <div className="container about-mission__inner">
                    <div className="about-mission__content">
                        <span className="section-label">Our Mission</span>
                        <h2 className="section-title">Bridging the Gap Between Generosity and Impact</h2>
                        <p className="section-subtitle">
                            Every year, billions in donations fail to reach their intended recipients. The causes are systemic — poor coordination, zero transparency, unverified NGOs, and disconnected volunteers.
                        </p>
                        <p className="about-mission__detail">
                            UnityDrop was founded with a simple belief: <strong>Generosity should never go to waste.</strong> We built a platform that connects every stakeholder — donors, NGOs, local businesses, college clubs, volunteers, and beneficiaries — into one trusted, transparent ecosystem powered by real-time tracking and AI-driven verification.
                        </p>
                        <div className="about-mission__highlights">
                            <div className="about-mission__highlight">
                                <CheckCircle size={18} />
                                <span>End-to-end fund tracking</span>
                            </div>
                            <div className="about-mission__highlight">
                                <CheckCircle size={18} />
                                <span>AI-powered fraud detection</span>
                            </div>
                            <div className="about-mission__highlight">
                                <CheckCircle size={18} />
                                <span>48-72 hour delivery guarantee</span>
                            </div>
                            <div className="about-mission__highlight">
                                <CheckCircle size={18} />
                                <span>80G tax-exempt donations</span>
                            </div>
                        </div>
                    </div>
                    <div className="about-mission__visual">
                        <div className="about-mission__image-wrapper">
                            <img src="/hero-images/1.png" alt="UnityDrop Mission" />
                            <div className="about-mission__float-card">
                                <Star size={20} />
                                <div>
                                    <strong>4.9/5 Rating</strong>
                                    <span>from 12,000+ donors</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ VALUES ═══ */}
            <section className="section about-values-section" style={{ background: 'var(--gray-50)' }}>
                <div className="container">
                    <div className="text-center">
                        <span className="section-label">Our Values</span>
                        <h2 className="section-title">What We Stand For</h2>
                        <p className="section-subtitle">These core principles guide every decision we make and every feature we build.</p>
                    </div>
                    <div className="about-values-grid" ref={valuesRef}>
                        {values.map((v, i) => (
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
            </section>

            {/* ═══ TIMELINE ═══ */}
            <section className="section about-timeline-section">
                <div className="container">
                    <div className="text-center">
                        <span className="section-label">Journey</span>
                        <h2 className="section-title">Our Growth Story</h2>
                        <p className="section-subtitle">From a small idea to a nationwide movement — here's how we got here.</p>
                    </div>
                    <div className="about-timeline" ref={timelineRef}>
                        {timeline.map((t, i) => (
                            <div key={i} className="about-timeline__item">
                                <div className="about-timeline__year">
                                    {t.year}
                                    <span className="about-timeline__quarter">{t.quarter}</span>
                                </div>
                                <div className="about-timeline__dot">
                                    <div className="about-timeline__dot-ring" />
                                </div>
                                <div className="about-timeline__content card">
                                    <div className="about-timeline__milestone">{t.milestone}</div>
                                    <strong>{t.title}</strong>
                                    <p>{t.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ TEAM ═══ */}
            <section className="section about-team-section" style={{ background: 'var(--gray-50)' }}>
                <div className="container">
                    <div className="text-center">
                        <span className="section-label">People</span>
                        <h2 className="section-title">The Team Behind UnityDrop</h2>
                        <p className="section-subtitle">Driven by purpose. Powered by technology. United by compassion.</p>
                    </div>
                    <div className="about-team" ref={teamRef}>
                        {team.map((member, i) => (
                            <div key={i} className="about-team-card card" onMouseMove={onCardMove} onMouseLeave={onCardLeave}>
                                <div className="about-team-card__top">
                                    <img src={member.avatar} alt={member.name} className="about-team-card__avatar" />
                                    <div className="about-team-card__badge"><Award size={14} /></div>
                                </div>
                                <h3>{member.name}</h3>
                                <p className="about-team-card__role">{member.role}</p>
                                <p className="about-team-card__bio">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ PARTNERS ═══ */}
            <section className="section about-partners-section">
                <div className="container">
                    <div className="text-center">
                        <span className="section-label">Trusted By</span>
                        <h2 className="section-title">Our Partners & Collaborators</h2>
                        <p className="section-subtitle">Working alongside India's most respected organizations to maximize impact.</p>
                    </div>
                    <div className="about-partners" ref={partnersRef}>
                        {partners.map((p, i) => (
                            <div key={i} className="about-partner glass">
                                <Globe size={20} />
                                <strong>{p.name}</strong>
                                <span className="about-partner__type">{p.type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ PRESS ═══ */}
            <section className="section about-press-section" style={{ background: 'var(--secondary)' }}>
                <div className="container">
                    <div className="text-center">
                        <span className="section-label" style={{ color: 'var(--accent-light)' }}>In the News</span>
                        <h2 className="section-title" style={{ color: 'var(--white)' }}>As Featured In</h2>
                    </div>
                    <div className="about-press-grid" ref={pressRef}>
                        {press.map((p, i) => (
                            <div key={i} className="about-press-card glass">
                                <div className="about-press-card__name">{p.name}</div>
                                <p className="about-press-card__quote">{p.quote}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FAQs ═══ */}
            <section className="section about-faq-section">
                <div className="container">
                    <div className="text-center">
                        <span className="section-label">FAQs</span>
                        <h2 className="section-title">Frequently Asked Questions</h2>
                        <p className="section-subtitle">Everything you need to know about donating, volunteering, and partnering with us.</p>
                    </div>
                    <div className="about-faqs" ref={faqRef}>
                        {faqs.map((faq, i) => (
                            <div key={i} className="about-faq">
                                <button className="about-faq__question" onClick={toggleFaq}>
                                    <span>{faq.q}</span>
                                    <ChevronRight size={18} className="about-faq__chevron" />
                                </button>
                                <div className="about-faq__answer">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className="about-cta" ref={ctaRef}>
                <div className="about-cta__particles">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="about-cta__particle" style={{ animationDelay: `${i * 0.7}s` }} />
                    ))}
                </div>
                <div className="container">
                    <div className="about-cta__content">
                        <h2>Ready to Make a Difference?</h2>
                        <p>Join 10,000+ changemakers who trust UnityDrop to turn their generosity into verified, trackable impact.</p>
                        <div className="about-cta__actions">
                            <Link to="/donate" className="btn btn-primary btn-lg">Start Donating <ArrowRight size={18} /></Link>
                            <Link to="/volunteers" className="btn btn-ghost btn-lg">Become a Volunteer</Link>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
