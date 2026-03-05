import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Package, Users, Activity } from 'lucide-react';
import './Home.css';

const images = [
    '/hero-images/1.png',
    '/hero-images/2.png',
    '/hero-images/3.jpg',
];

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <main className="home-page animate-fadeIn">
            {/* Hero Section with Slider */}
            <section className="hero">
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

                <div className="container hero__inner">
                    <div className="hero__content">
                        <div className="hero__pill animate-fadeInUp">
                            <span className="hero__pill-dot"></span>
                            <span>Join the Movement</span>
                        </div>
                        <h1 className="hero__title animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            Small Actions,<br />
                            <span className="hero__title-accent">Massive Impact.</span>
                        </h1>
                        <p className="hero__subtitle animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            UnityDrop connects you directly with verified causes. Experience real-time transparency and see exactly how your donation changes lives.
                        </p>

                        <div className="hero__actions animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            <Link to="/donate" className="btn btn-primary btn-lg">
                                Start Donating
                            </Link>
                            <Link to="/campaigns" className="btn btn-ghost btn-lg">
                                Explore Campaigns
                            </Link>
                        </div>

                        <div className="hero__slider-indicators animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
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

            {/* PROBLEM -> SOLUTION: Why Social Mentor / UnityDrop? */}
            <section className="section home-problem">
                <div className="container">
                    <div className="text-center">
                        <span className="section-label">Problem to Solution</span>
                        <h2 className="section-title">Why UnityDrop?</h2>
                        <p className="section-subtitle">
                            People want to help, but lack of verification, transparency, and coordination often leads to mistrust and inefficiency.
                        </p>
                    </div>

                    <div className="problem-solution-boxes animate-fadeInUp">
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
            <section className="section home-how bg-white">
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
            <section className="section home-features">
                <div className="container">
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

            {/* ACTIVE CAUSES */}
            <section className="section home-causes bg-white">
                <div className="container">
                    <div className="causes-header">
                        <div>
                            <span className="section-label">Active Causes</span>
                            <h2 className="section-title">Needing Immediate Support</h2>
                            <p>Help those in urgent need today.</p>
                        </div>
                        <Link to="/campaigns" className="btn btn-outline">View All Causes</Link>
                    </div>

                    <div className="causes-grid grid-3">
                        <div className="cause-card card">
                            <div className="cause-body">
                                <h3>Food Drive for Underprivileged Families</h3>
                                <p>Providing meals to families facing severe hunger in urban slums.</p>
                                <Link to="/donate" className="btn btn-primary btn-sm mt-3">Help Now</Link>
                            </div>
                        </div>

                        <div className="cause-card card urgent">
                            <div className="urgent-badge">Urgent</div>
                            <div className="cause-body">
                                <h3>Emergency Medical Aid</h3>
                                <p>Critical support required for intensive medical emergency cases.</p>
                                <Link to="/donate" className="btn btn-primary btn-sm mt-3">Help Now</Link>
                            </div>
                        </div>

                        <div className="cause-card card">
                            <div className="cause-body">
                                <h3>Education Support for Children</h3>
                                <p>Supplying books, uniforms, and learning essentials for the new year.</p>
                                <Link to="/donate" className="btn btn-primary btn-sm mt-3">Help Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST & TRANSPARENCY */}
            <section className="section home-trust">
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
                                <strong>500+</strong>
                                <span>Lives Impacted</span>
                            </div>
                            <div className="t-stat divider"></div>
                            <div className="t-stat">
                                <strong>100+</strong>
                                <span>Volunteers Engaged</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="section home-cta-banner">
                <div className="container cta-inner">
                    <div className="cta-text">
                        <h2>Be the Reason Someone Smiles Today</h2>
                        <p>Your verified action can create real, visible change.</p>
                    </div>
                    <div className="cta-actions">
                        <Link to="/donate" className="btn btn-primary btn-lg bg-white text-primary">Donate Now</Link>
                        <Link to="/volunteers" className="btn btn-outline btn-lg border-white text-white">Join as Volunteer</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
