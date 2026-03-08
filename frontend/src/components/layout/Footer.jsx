import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../../hooks/useGsap';
import './Footer.css';

export default function Footer() {
    const footerRef = useRef(null);
    const brandRef = useRef(null);
    const colsRef = useRef(null);
    const socialRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!footerRef.current) return;

        /* Brand slide in */
        gsap.fromTo(brandRef.current,
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
                scrollTrigger: { trigger: footerRef.current, start: 'top 90%' },
            }
        );

        /* Columns stagger reveal */
        const cols = footerRef.current.querySelectorAll('.footer__col');
        gsap.fromTo(cols,
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: footerRef.current, start: 'top 85%' },
            }
        );

        /* Social links bounce in */
        if (socialRef.current) {
            gsap.fromTo(socialRef.current.children,
                { scale: 0, rotation: -90 },
                {
                    scale: 1, rotation: 0, duration: 0.4, stagger: 0.08, ease: 'back.out(1.7)',
                    scrollTrigger: { trigger: socialRef.current, start: 'top 90%' },
                }
            );
        }

        /* Bottom bar slide */
        if (bottomRef.current) {
            gsap.fromTo(bottomRef.current,
                { y: 20, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.5, ease: 'power3.out',
                    scrollTrigger: { trigger: bottomRef.current, start: 'top 95%' },
                }
            );
        }
    }, []);

    return (
        <footer className="footer" ref={footerRef}>
            <div className="footer__gradient-divider" />
            <div className="footer__top">
                <div className="container footer__top-inner">
                    {/* Brand */}
                    <div className="footer__brand" ref={brandRef}>
                        <div className="footer__logo">
                            <span className="footer__logo-icon">💧</span>
                            Unity<span>Drop</span>
                        </div>
                        <p>Connecting compassion with action. A trusted platform where donors, NGOs, volunteers, and beneficiaries come together to create real change.</p>
                        <div className="footer__social" ref={socialRef}>
                            {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map(s => (
                                <a key={s} href="#" className="footer__social-link" title={s}>{s[0]}</a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {[
                        { heading: 'Platform', links: ['Campaigns', 'NGO Registry', 'Volunteers', 'Dashboard', 'Donation Tracker'] },
                        { heading: 'Company', links: ['About Us', 'Our Mission', 'Blog', 'Press', 'Careers'] },
                        { heading: 'Support', links: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms', 'Report Issue'] },
                    ].map(col => (
                        <div key={col.heading} className="footer__col">
                            <h4 className="footer__col-title">{col.heading}</h4>
                            <ul>
                                {col.links.map(l => (
                                    <li key={l}><a href="#">{l}</a></li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter */}
                    <div className="footer__col footer__newsletter">
                        <h4 className="footer__col-title">Stay Updated</h4>
                        <p>Get weekly impact reports delivered to your inbox.</p>
                        <form className="footer__newsletter-form" onSubmit={e => e.preventDefault()}>
                            <input type="email" placeholder="your@email.com" className="form-control" />
                            <button type="submit" className="btn btn-primary btn-sm">Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="footer__bottom" ref={bottomRef}>
                <div className="container footer__bottom-inner">
                    <p>&copy; 2025 UnityDrop. All rights reserved. Built with ❤️ for a better world.</p>
                    <div className="footer__badges">
                        <span>🔒 SSL Secured</span>
                        <span>✅ NGO Verified Platform</span>
                        <span>🇮🇳 Made in India</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
