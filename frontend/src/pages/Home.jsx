import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Package, Users, Activity } from 'lucide-react';
import { gsap, ScrollTrigger } from '../hooks/useGsap';
import './Home.css';

const images = [
    '/hero-images/1.png',
    '/hero-images/2.png',
    '/hero-images/3.jpg',
];

/* Animated counter hook */
function useAnimatedCounter(target, triggerRef) {
    const numRef = useRef(null);
    useEffect(() => {
        if (!numRef.current || !triggerRef.current) return;
        const obj = { val: 0 };
        gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: { trigger: triggerRef.current, start: 'top 80%' },
            onUpdate: () => {
                if (numRef.current) numRef.current.textContent = Math.round(obj.val) + '+';
            },
        });
    }, [target, triggerRef]);
    return numRef;
}

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Refs for GSAP
    const heroRef = useRef(null);
    const heroContentRef = useRef(null);
    const problemRef = useRef(null);
    const howRef = useRef(null);
    const featuresRef = useRef(null);
    const causesRef = useRef(null);
    const trustRef = useRef(null);
    const ctaRef = useRef(null);
    const particlesRef = useRef(null);

    const stat1Ref = useAnimatedCounter(500, trustRef);
    const stat2Ref = useAnimatedCounter(100, trustRef);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    /* Hero entrance timeline */
    useEffect(() => {
        if (!heroContentRef.current) return;
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        const els = heroContentRef.current;

        tl.fromTo(els.querySelector('.hero__pill'), { y: 30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, delay: 0.2 })
          .fromTo(els.querySelector('.hero__title'), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
          .fromTo(els.querySelector('.hero__subtitle'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.35')
          .fromTo(els.querySelectorAll('.hero__actions .btn'), { y: 30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 }, '-=0.3')
          .fromTo(els.querySelector('.hero__slider-indicators'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.2');
    }, []);

    /* Hero parallax on scroll */
    useEffect(() => {
        if (!heroRef.current) return;
        gsap.to(heroRef.current.querySelector('.hero__slider'), {
            y: 100,
            ease: 'none',
            scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });
    }, []);

    /* Floating particles */
    useEffect(() => {
        if (!particlesRef.current) return;
        const particles = particlesRef.current.children;
        Array.from(particles).forEach((p, i) => {
            gsap.set(p, { x: Math.random() * 100 + '%', y: Math.random() * 100 + '%', opacity: 0 });
            gsap.to(p, {
                y: `-=${60 + Math.random() * 80}`,
                x: `+=${(Math.random() - 0.5) * 60}`,
                opacity: 0.6,
                duration: 3 + Math.random() * 4,
                repeat: -1,
                yoyo: true,
                delay: i * 0.5,
                ease: 'sine.inOut',
            });
        });
    }, []);

    /* Problem section scroll reveal */
    useEffect(() => {
        if (!problemRef.current) return;
        const header = problemRef.current.querySelector('.text-center');
        const boxes = problemRef.current.querySelectorAll('.ps-box');
        const icons = problemRef.current.querySelectorAll('.ps-icon');

        gsap.fromTo(header, { y: 40, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: header, start: 'top 85%' },
        });
        gsap.fromTo(boxes, { y: 60, opacity: 0, scale: 0.95 }, {
            y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: boxes[0], start: 'top 85%' },
        });
        gsap.fromTo(icons, { rotation: -90, scale: 0 }, {
            rotation: 0, scale: 1, duration: 0.5, stagger: 0.15, ease: 'back.out(1.7)',
            scrollTrigger: { trigger: boxes[0], start: 'top 85%' },
        });
    }, []);

    /* How it works scroll reveal */
    useEffect(() => {
        if (!howRef.current) return;
        const header = howRef.current.querySelector('.text-center');
        const steps = howRef.current.querySelectorAll('.how-step');
        const nums = howRef.current.querySelectorAll('.step-num');

        gsap.fromTo(header, { y: 40, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: header, start: 'top 85%' },
        });
        gsap.fromTo(steps, { y: 50, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: 'power3.out',
            scrollTrigger: { trigger: steps[0], start: 'top 85%' },
        });
        gsap.fromTo(nums, { scale: 0, rotation: -180 }, {
            scale: 1, rotation: 0, duration: 0.7, stagger: 0.2, ease: 'back.out(1.7)',
            scrollTrigger: { trigger: steps[0], start: 'top 85%' },
        });
    }, []);

    /* Features scroll reveal — alternate sides */
    useEffect(() => {
        if (!featuresRef.current) return;
        const header = featuresRef.current.querySelector('.text-center');
        const cards = featuresRef.current.querySelectorAll('.feature-card');
        const icons = featuresRef.current.querySelectorAll('.feat-icon');

        gsap.fromTo(header, { y: 40, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: header, start: 'top 85%' },
        });
        cards.forEach((card, i) => {
            const fromX = i % 2 === 0 ? -60 : 60;
            gsap.fromTo(card, { x: fromX, opacity: 0 }, {
                x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 88%' },
            });
        });
        gsap.fromTo(icons, { scale: 0 }, {
            scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(2)',
            scrollTrigger: { trigger: cards[0], start: 'top 85%' },
        });
    }, []);

    /* Causes scroll reveal with tilt */
    useEffect(() => {
        if (!causesRef.current) return;
        const header = causesRef.current.querySelector('.causes-header');
        const cards = causesRef.current.querySelectorAll('.cause-card');

        gsap.fromTo(header, { y: 40, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: header, start: 'top 85%' },
        });
        gsap.fromTo(cards, { y: 70, opacity: 0, rotationX: 15 }, {
            y: 0, opacity: 1, rotationX: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: cards[0], start: 'top 88%' },
        });
    }, []);

    /* Cause card 3D tilt on hover */
    const onCardMove = useCallback((e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
        gsap.to(el, { rotationY: x, rotationX: y, duration: 0.3, ease: 'power2.out', transformPerspective: 600 });
    }, []);

    const onCardLeave = useCallback((e) => {
        gsap.to(e.currentTarget, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    }, []);

    /* Trust section */
    useEffect(() => {
        if (!trustRef.current) return;
        const items = trustRef.current.querySelectorAll('.trust-list li');
        const content = trustRef.current.querySelector('.trust-content');

        gsap.fromTo(content, { y: 50, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: content, start: 'top 85%' },
        });
        gsap.fromTo(items, { x: -40, opacity: 0 }, {
            x: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: items[0], start: 'top 88%' },
        });
    }, []);

    /* CTA section */
    useEffect(() => {
        if (!ctaRef.current) return;
        const text = ctaRef.current.querySelector('.cta-text');
        const actions = ctaRef.current.querySelector('.cta-actions');

        gsap.fromTo(text, { x: -60, opacity: 0 }, {
            x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: text, start: 'top 85%' },
        });
        gsap.fromTo(actions, { x: 60, opacity: 0 }, {
            x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: actions, start: 'top 85%' },
        });
    }, []);

    return (
        <main className="home-page">
            {/* Hero Section with Slider */}
            <section className="hero" ref={heroRef}>
                <div className="hero__slider">
                    {images.map((src, idx) => (
                        <div
                            key={src}
                            className={`hero__slide ${idx === currentSlide ? 'active' : ''}`}
                            style={{ backgroundImage: `url('${src}')` }}
                        >
                            <div className="hero__slide-overlay"></div>
                        </div>
                    ))}
                </div>

                {/* Floating particles */}
                <div className="hero__particles" ref={particlesRef}>
                    {[...Array(14)].map((_, i) => (
                        <div key={i} className="hero__particle" />
                    ))}
                </div>

                {/* Morphing background blobs */}
                <div className="hero__blobs">
                    <div className="bg-blob hero-blob-1" />
                    <div className="bg-blob hero-blob-2" />
                </div>

                <div className="container hero__inner" ref={heroContentRef}>
                    <div className="hero__content">
                        <div className="hero__pill">
                            <span className="hero__pill-dot"></span>
                            <span>Join the Movement</span>
                        </div>
                        <h1 className="hero__title">
                            Small Actions,<br />
                            <span className="hero__title-accent animate-text-shimmer">Massive Impact.</span>
                        </h1>
                        <p className="hero__subtitle">
                            UnityDrop connects you directly with verified causes. Experience real-time transparency and see exactly how your donation changes lives.
                        </p>

                        <div className="hero__actions">
                            <Link to="/donate" className="btn btn-primary btn-lg">
                                Start Donating
                            </Link>
                            <Link to="/hospital" className="btn btn-ghost btn-lg">
                                Explore Hospitals
                            </Link>
                        </div>

                        <div className="hero__slider-indicators">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`hero__indicator ${idx === currentSlide ? 'active' : ''}`}
                                    onClick={() => setCurrentSlide(idx)}
                                    aria-label={`Go to slide ${idx + 1}`}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Wave Decor */}
                <div className="hero__wave">
                    <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                        <path
                            fill="#f7f9fc"
                            d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                        ></path>
                    </svg>
                </div>
            </section>

            {/* PROBLEM -> SOLUTION */}
            <section className="section home-problem" ref={problemRef}>
                <div className="container">
                    {/* Decorative floating element */}
                    <div className="section-decor">
                        <div className="bg-blob decor-blob-1" />
                    </div>
                    <div className="text-center">
                        <span className="section-label">Problem to Solution</span>
                        <h2 className="section-title">Why UnityDrop?</h2>
                        <p className="section-subtitle">
                            People want to help, but lack of verification, transparency, and coordination often leads to mistrust and inefficiency.
                        </p>
                    </div>

                    <div className="problem-solution-boxes">
                        <div className="ps-box">
                            <div className="ps-icon"><ShieldCheck /></div>
                            <h3>Verified Users</h3>
                            <p>Ensuring authenticity by verifying users through OTP-based authentication.</p>
                        </div>
                        <div className="ps-box">
                            <div className="ps-icon"><Users /></div>
                            <h3>Secure Connections</h3>
                            <p>Connecting donors, NGOs, and volunteers securely in one ecosystem.</p>
                        </div>
                        <div className="ps-box">
                            <div className="ps-icon"><Activity /></div>
                            <h3>Accountability</h3>
                            <p>Tracking donations and volunteer activity for end-to-end accountability.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="section home-how bg-white" ref={howRef}>
                <div className="container">
                    <div className="text-center">
                        <span className="section-label">How it Works</span>
                        <h2 className="section-title">Three Simple Steps</h2>
                    </div>

                    <div className="how-steps grid-3">
                        <div className="how-step">
                            <div className="step-num">01</div>
                            <h3>Verify Securely</h3>
                            <p>Verify your identity securely using OTP to join our transparent network.</p>
                        </div>
                        <div className="how-step">
                            <div className="step-num">02</div>
                            <h3>Choose a Cause</h3>
                            <p>Select a verified cause nearby that resonates with your values.</p>
                        </div>
                        <div className="how-step">
                            <div className="step-num">03</div>
                            <h3>Donate or Volunteer</h3>
                            <p>Contribute funds or time, and track your direct impact in real-time.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* KEY FEATURES */}
            <section className="section home-features" ref={featuresRef}>
                <div className="container">
                    <div className="section-decor">
                        <div className="bg-blob decor-blob-2" />
                    </div>
                    <div className="text-center">
                        <span className="section-label">Key Features</span>
                        <h2 className="section-title">What Makes Us Trustworthy</h2>
                    </div>

                    <div className="features-grid grid-2">
                        <div className="feature-card">
                            <div className="feat-icon"><ShieldCheck /></div>
                            <div className="feat-text">
                                <h3>OTP-Based Verification</h3>
                                <p>Ensures only genuine donors, volunteers, and NGOs participate.</p>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className="feat-icon"><MapPin /></div>
                            <div className="feat-text">
                                <h3>Live Location Tracking</h3>
                                <p>Enables transparent coordination and confirms on-ground delivery of help.</p>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className="feat-icon"><Package /></div>
                            <div className="feat-text">
                                <h3>Donation Tracking</h3>
                                <p>Track your contribution journey from the moment of donation to final delivery.</p>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className="feat-icon"><ShieldCheck /></div>
                            <div className="feat-text">
                                <h3>Verified NGOs & Causes</h3>
                                <p>All requests are carefully reviewed to prevent misuse and ensure authenticity.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST & TRANSPARENCY */}
            <section className="section home-trust" ref={trustRef}>
                <div className="container trust-inner">
                    <div className="trust-content">
                        <span className="section-label">Trust & Transparency</span>
                        <h2 className="section-title">Transparency You Can Trust</h2>

                        <ul className="trust-list">
                            <li><ShieldCheck className="check-icon" /> OTP-verified users</li>
                            <li><ShieldCheck className="check-icon" /> Location-tracked volunteer activities</li>
                            <li><ShieldCheck className="check-icon" /> Clear impact reports for every donation</li>
                        </ul>

                        <div className="trust-stats">
                            <div className="t-stat">
                                <strong ref={stat1Ref}>0+</strong>
                                <span>Lives Impacted</span>
                            </div>
                            <div className="t-stat divider"></div>
                            <div className="t-stat">
                                <strong ref={stat2Ref}>0+</strong>
                                <span>Volunteers Engaged</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="section home-cta-banner" ref={ctaRef}>
                {/* Animated CTA particles */}
                <div className="cta-particles">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="cta-particle" style={{ animationDelay: `${i * 0.8}s` }} />
                    ))}
                </div>
                <div className="container cta-inner">
                    <div className="cta-text">
                        <h2>Be the Reason Someone Smiles Today</h2>
                        <p>Your verified action can create real, visible change.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
