import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__top">
                <div className="container footer__top-inner">
                    {/* Brand */}
                    <div className="footer__brand">
                        <div className="footer__logo">🎯 Unity<span>Drop</span></div>
                        <p>Connecting compassion with action. A trusted platform where donors, NGOs, volunteers, and beneficiaries come together to create real change.</p>
                        <div className="footer__social">
                            {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map(s => (
                                <a key={s} href="#" className="footer__social-link">{s[0]}</a>
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

            <div className="footer__bottom">
                <div className="container footer__bottom-inner">
                    <p>© 2025 UnityDrop. All rights reserved. Built with ❤️ for a better world.</p>
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
