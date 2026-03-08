import { useState } from 'react';
import { organDonations } from '../data/mockData';
import { useDonors } from '../context/DonorContext';
import './DonarDashboard.css';

export default function DonarDashboard() {
    const { donors } = useDonors();
    const [searchEmail, setSearchEmail] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [foundId, setFoundId] = useState(null);
    const [searched, setSearched] = useState(false);
    const [expandedTracking, setExpandedTracking] = useState(null);

    // Always read fresh data from context so approval updates appear instantly
    const found = foundId ? donors.find(d => d.donorId === foundId) || null : null;

    const approvedDonors = donors.filter(d => d.status === 'approved' && d.approvalDetails);

    const handleSearch = (e) => {
        e.preventDefault();
        const match = donors.find(
            d => (searchEmail && d.email.toLowerCase() === searchEmail.toLowerCase()) ||
                 (searchPhone && d.phone === searchPhone)
        );
        setFoundId(match ? match.donorId : null);
        setSearched(true);
    };

    const getOrganNames = (organIds) =>
        organIds.map(id => organDonations.find(o => o.id === id)).filter(Boolean);

    const formatDateTime = (date, time) => {
        if (!date) return '';
        const d = new Date(date + 'T' + (time || '00:00'));
        return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
            + (time ? ` at ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : '');
    };

    return (
        <>
            {/* Header */}
            <section className="page-header">
                <div className="page-header__bg-pattern" />
                <div className="container">
                    <span className="section-label">📊 Donar Dashboard</span>
                    <h1 className="page-header__title">Your Donor Dashboard</h1>
                    <p className="page-header__subtitle">
                        Track your organ donation registration status, view appointment details, and stay updated on your pledge.
                    </p>
                </div>
            </section>

            {/* ──── Approved Donations (always visible) ──── */}
            <section className="donar-approved-section">
                <div className="container">
                    <h2 className="donar-approved-title">📅 Approved Donations</h2>
                    <p className="donar-approved-subtitle">All approved organ donation appointments with hospital & schedule details.</p>

                    {approvedDonors.length === 0 ? (
                        <div className="donar-approved-empty">
                            <div className="donar-approved-empty__icon">📭</div>
                            <h3>No Approved Donations Yet</h3>
                            <p>Once an NGO approves a donor registration, the appointment details will appear here automatically.</p>
                        </div>
                    ) : (
                        <div className="donar-approved-list">
                            {approvedDonors.map(donor => (
                                <div key={donor.donorId} className="donar-approved-card">
                                    <div className="donar-approved-card__top">
                                        <div className="donar-approved-card__donor">
                                            <div className="donar-approved-card__avatar">{donor.fullName.charAt(0).toUpperCase()}</div>
                                            <div>
                                                <h4>{donor.fullName}</h4>
                                                <span className="donar-approved-card__id">{donor.donorId}</span>
                                            </div>
                                        </div>
                                        <span className="donar-approved-card__badge">✅ Approved</span>
                                    </div>

                                    <div className="donar-approved-card__organs">
                                        {getOrganNames(donor.organs).map(organ => (
                                            <span key={organ.id} className="donar-approved-card__organ-tag">{organ.icon} {organ.organ}</span>
                                        ))}
                                    </div>

                                    <div className="donar-approved-card__details">
                                        <div className="donar-approved-card__detail">
                                            <span className="donar-approved-card__detail-icon">📆</span>
                                            <div>
                                                <span className="donar-approved-card__detail-label">Date & Time</span>
                                                <strong>{formatDateTime(donor.approvalDetails.donationDate, donor.approvalDetails.donationTime)}</strong>
                                            </div>
                                        </div>
                                        <div className="donar-approved-card__detail">
                                            <span className="donar-approved-card__detail-icon">🏥</span>
                                            <div>
                                                <span className="donar-approved-card__detail-label">Hospital</span>
                                                <strong>{donor.approvalDetails.hospitalName}</strong>
                                            </div>
                                        </div>
                                        <div className="donar-approved-card__detail">
                                            <span className="donar-approved-card__detail-icon">📍</span>
                                            <div>
                                                <span className="donar-approved-card__detail-label">Address</span>
                                                <strong>{donor.approvalDetails.hospitalAddress}</strong>
                                            </div>
                                        </div>
                                        {donor.approvalDetails.doctorName && (
                                            <div className="donar-approved-card__detail">
                                                <span className="donar-approved-card__detail-icon">👨‍⚕️</span>
                                                <div>
                                                    <span className="donar-approved-card__detail-label">Doctor</span>
                                                    <strong>{donor.approvalDetails.doctorName}</strong>
                                                </div>
                                            </div>
                                        )}
                                        {donor.approvalDetails.contactNumber && (
                                            <div className="donar-approved-card__detail">
                                                <span className="donar-approved-card__detail-icon">📞</span>
                                                <div>
                                                    <span className="donar-approved-card__detail-label">Contact</span>
                                                    <strong>{donor.approvalDetails.contactNumber}</strong>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {donor.approvalDetails.instructions && (
                                        <div className="donar-approved-card__instructions">
                                            <strong>📝 Instructions:</strong> {donor.approvalDetails.instructions}
                                        </div>
                                    )}

                                    <div className="donar-approved-card__meta">
                                        <span>🩸 {donor.bloodGroup}</span>
                                        <span>📍 {donor.city}, {donor.state}</span>
                                        <span>📧 {donor.email}</span>
                                        {donor.approvedAt && <span>✅ Approved: {new Date(donor.approvedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                                    </div>

                                    <button className="donar-approved-card__btn" onClick={() => { setFoundId(donor.donorId); setSearched(true); document.getElementById('donar-search-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                        📄 View Full Details
                                    </button>

                                    {/* Live Organ Tracking on Approved Card */}
                                    {donor.tracking && (() => {
                                        const completed = donor.tracking.stages.filter(s => s.status === 'completed');
                                        const currentStage = completed[completed.length - 1];
                                        const nextStage = donor.tracking.stages.find(s => s.status === 'pending');
                                        const allDone = donor.tracking.stages.every(s => s.status === 'completed');
                                        const progress = (completed.length / donor.tracking.stages.length) * 100;
                                        const isExpanded = expandedTracking === donor.donorId;

                                        return (
                                            <div className="donar-live-tracking">
                                                {/* Current Location Header */}
                                                <div className="donar-live-tracking__header">
                                                    <div className="donar-live-tracking__pulse-wrap">
                                                        <span className={`donar-live-tracking__pulse ${allDone ? 'donar-live-tracking__pulse--done' : ''}`} />
                                                        <span className="donar-live-tracking__live-label">{allDone ? '✅ Completed' : '🔴 LIVE'}</span>
                                                    </div>
                                                    <h4 className="donar-live-tracking__title">
                                                        {allDone ? '🎉 Transplant Successful!' : '📍 Where is your organ right now?'}
                                                    </h4>
                                                </div>

                                                {/* Current Status Box */}
                                                <div className={`donar-live-tracking__status ${allDone ? 'donar-live-tracking__status--done' : ''}`}>
                                                    <div className="donar-live-tracking__status-icon">{currentStage?.icon}</div>
                                                    <div className="donar-live-tracking__status-info">
                                                        <strong className="donar-live-tracking__stage-name">{currentStage?.name}</strong>
                                                        {currentStage?.location && (
                                                            <span className="donar-live-tracking__location">📍 {currentStage.location}</span>
                                                        )}
                                                        {currentStage?.timestamp && (
                                                            <span className="donar-live-tracking__time">
                                                                🕐 {new Date(currentStage.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        )}
                                                        {currentStage?.note && <span className="donar-live-tracking__note">💬 {currentStage.note}</span>}
                                                    </div>
                                                </div>

                                                {/* Next Step */}
                                                {nextStage && (
                                                    <div className="donar-live-tracking__next">
                                                        <span className="donar-live-tracking__next-label">⏭ Next Step:</span>
                                                        <span className="donar-live-tracking__next-name">{nextStage.icon} {nextStage.name}</span>
                                                    </div>
                                                )}

                                                {/* Progress Bar */}
                                                <div className="donar-live-tracking__progress">
                                                    <div className="donar-live-tracking__progress-bar">
                                                        <div className="donar-live-tracking__progress-fill" style={{ width: `${progress}%` }} />
                                                    </div>
                                                    <span className="donar-live-tracking__progress-text">{completed.length}/{donor.tracking.stages.length} stages</span>
                                                </div>

                                                {/* Expand/Collapse Button */}
                                                <button
                                                    className="donar-live-tracking__expand-btn"
                                                    onClick={() => setExpandedTracking(isExpanded ? null : donor.donorId)}
                                                >
                                                    {isExpanded ? '▲ Hide Full Timeline' : '▼ View Full Tracking Timeline'}
                                                </button>

                                                {/* Expandable Full Timeline */}
                                                {isExpanded && (
                                                    <div className="donar-live-tracking__timeline">
                                                        {donor.tracking.stages.map((stage, idx) => {
                                                            const isCompleted = stage.status === 'completed';
                                                            const isNext = !isCompleted && (idx === 0 || donor.tracking.stages[idx - 1]?.status === 'completed');
                                                            return (
                                                                <div key={idx} className={`donar-live-stage ${isCompleted ? 'donar-live-stage--done' : ''} ${isNext ? 'donar-live-stage--active' : ''}`}>
                                                                    <div className="donar-live-stage__line">
                                                                        <div className={`donar-live-stage__dot ${isCompleted ? 'donar-live-stage__dot--done' : isNext ? 'donar-live-stage__dot--active' : ''}`}>
                                                                            {isCompleted ? '✓' : (idx + 1)}
                                                                        </div>
                                                                        {idx < donor.tracking.stages.length - 1 && (
                                                                            <div className={`donar-live-stage__connector ${isCompleted ? 'donar-live-stage__connector--done' : ''}`} />
                                                                        )}
                                                                    </div>
                                                                    <div className="donar-live-stage__content">
                                                                        <div className="donar-live-stage__header">
                                                                            <span className="donar-live-stage__icon">{stage.icon}</span>
                                                                            <strong>{stage.name}</strong>
                                                                            {isCompleted && <span className="donar-live-stage__badge">✅</span>}
                                                                            {isNext && <span className="donar-live-stage__badge donar-live-stage__badge--active">⏳ In Progress</span>}
                                                                        </div>
                                                                        {stage.location && <span className="donar-live-stage__location">📍 {stage.location}</span>}
                                                                        {isCompleted && stage.timestamp && (
                                                                            <span className="donar-live-stage__time">
                                                                                {new Date(stage.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                            </span>
                                                                        )}
                                                                        {stage.note && <p className="donar-live-stage__note">{stage.note}</p>}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Search Section */}
            <section className="donar-search-section" id="donar-search-section">
                <div className="container">
                    <div className="donar-search-card">
                        <h2>🔍 Find Your Registration</h2>
                        <p>Enter your registered email or phone number to view your donation status.</p>
                        <form className="donar-search-form" onSubmit={handleSearch}>
                            <div className="donar-search-fields">
                                <div className="donar-search-field">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        value={searchEmail}
                                        onChange={e => setSearchEmail(e.target.value)}
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div className="donar-search-divider">OR</div>
                                <div className="donar-search-field">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={searchPhone}
                                        onChange={e => setSearchPhone(e.target.value)}
                                        placeholder="10-digit phone"
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="donar-search-btn">Search My Registration</button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Results */}
            {searched && (
                <section className="donar-result-section">
                    <div className="container">
                        {!found ? (
                            <div className="donar-not-found">
                                <div className="donar-not-found__icon">😕</div>
                                <h3>No Registration Found</h3>
                                <p>We couldn't find a donor registration matching your details. Please check your email or phone number, or register as a donor first.</p>
                                <a href="/register-donor" className="donar-not-found__btn">Register as Donor</a>
                            </div>
                        ) : (
                            <div className="donar-dashboard">
                                {/* Status Banner */}
                                <div className={`donar-status-banner donar-status-banner--${found.status}`}>
                                    <div className="donar-status-banner__icon">
                                        {found.status === 'pending' ? '⏳' : found.status === 'approved' ? '✅' : '❌'}
                                    </div>
                                    <div className="donar-status-banner__text">
                                        <h3>
                                            {found.status === 'pending' && 'Your Registration is Under Review'}
                                            {found.status === 'approved' && 'Congratulations! Your Donation is Approved'}
                                            {found.status === 'rejected' && 'Registration Not Approved'}
                                        </h3>
                                        <p>
                                            {found.status === 'pending' && 'Our partner NGO is reviewing your application. You will receive appointment details once approved.'}
                                            {found.status === 'approved' && 'Your organ donation has been approved. Please find your appointment details below.'}
                                            {found.status === 'rejected' && 'Unfortunately your registration was not approved at this time. Please contact us for more information.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Donor Info Card */}
                                <div className="donar-info-card">
                                    <div className="donar-info-card__header">
                                        <div className="donar-info-card__avatar">{found.fullName.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <h3>{found.fullName}</h3>
                                            <span className="donar-info-card__id">Donor ID: {found.donorId}</span>
                                        </div>
                                    </div>
                                    <div className="donar-info-card__grid">
                                        <div><span>Email</span><strong>{found.email}</strong></div>
                                        <div><span>Phone</span><strong>{found.phone}</strong></div>
                                        <div><span>Blood Group</span><strong>{found.bloodGroup}</strong></div>
                                        <div><span>Gender</span><strong style={{ textTransform: 'capitalize' }}>{found.gender}</strong></div>
                                        <div><span>Location</span><strong>{found.city}, {found.state}</strong></div>
                                        <div><span>Donation Type</span><strong style={{ textTransform: 'capitalize' }}>{found.donationType}</strong></div>
                                    </div>
                                </div>

                                {/* Organs Pledged */}
                                <div className="donar-organs-card">
                                    <h3>🫀 Organs Pledged</h3>
                                    <div className="donar-organs-grid">
                                        {getOrganNames(found.organs).map(organ => (
                                            <div key={organ.id} className="donar-organ-chip">
                                                <img src={organ.image} alt={organ.organ} className="donar-organ-chip__img" loading="lazy" />
                                                <div className="donar-organ-chip__info">
                                                    <span className="donar-organ-chip__icon">{organ.icon}</span>
                                                    <span className="donar-organ-chip__name">{organ.organ}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Appointment Details (only if approved) */}
                                {found.status === 'approved' && found.approvalDetails && (
                                    <div className="donar-appointment-card">
                                        <div className="donar-appointment-card__header">
                                            <h3>📅 Your Donation Appointment</h3>
                                            <span className="donar-appointment-badge">Confirmed</span>
                                        </div>

                                        <div className="donar-appointment-details">
                                            <div className="donar-appointment-item donar-appointment-item--highlight">
                                                <div className="donar-appointment-item__icon">📆</div>
                                                <div>
                                                    <span className="donar-appointment-item__label">Date & Time</span>
                                                    <strong className="donar-appointment-item__value">
                                                        {formatDateTime(found.approvalDetails.donationDate, found.approvalDetails.donationTime)}
                                                    </strong>
                                                </div>
                                            </div>

                                            <div className="donar-appointment-item donar-appointment-item--highlight">
                                                <div className="donar-appointment-item__icon">🏥</div>
                                                <div>
                                                    <span className="donar-appointment-item__label">Hospital / Center</span>
                                                    <strong className="donar-appointment-item__value">{found.approvalDetails.hospitalName}</strong>
                                                </div>
                                            </div>

                                            <div className="donar-appointment-item">
                                                <div className="donar-appointment-item__icon">📍</div>
                                                <div>
                                                    <span className="donar-appointment-item__label">Address</span>
                                                    <strong className="donar-appointment-item__value">{found.approvalDetails.hospitalAddress}</strong>
                                                </div>
                                            </div>

                                            {found.approvalDetails.doctorName && (
                                                <div className="donar-appointment-item">
                                                    <div className="donar-appointment-item__icon">👨‍⚕️</div>
                                                    <div>
                                                        <span className="donar-appointment-item__label">Doctor / Coordinator</span>
                                                        <strong className="donar-appointment-item__value">{found.approvalDetails.doctorName}</strong>
                                                    </div>
                                                </div>
                                            )}

                                            {found.approvalDetails.contactNumber && (
                                                <div className="donar-appointment-item">
                                                    <div className="donar-appointment-item__icon">📞</div>
                                                    <div>
                                                        <span className="donar-appointment-item__label">Contact Number</span>
                                                        <strong className="donar-appointment-item__value">{found.approvalDetails.contactNumber}</strong>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {found.approvalDetails.instructions && (
                                            <div className="donar-appointment-instructions">
                                                <h4>📝 Special Instructions</h4>
                                                <p>{found.approvalDetails.instructions}</p>
                                            </div>
                                        )}

                                        <div className="donar-appointment-checklist">
                                            <h4>✅ Before Your Appointment</h4>
                                            <ul>
                                                <li>Carry a valid government ID (Aadhaar / PAN / Passport)</li>
                                                <li>Bring your donor registration confirmation</li>
                                                <li>Carry all recent medical reports if any</li>
                                                <li>Follow fasting or preparation instructions if provided</li>
                                                <li>Arrive at least 30 minutes before your scheduled time</li>
                                                <li>Have your emergency contact informed about the appointment</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* ──── ORGAN TRACKING SYSTEM ──── */}
                                {found.status === 'approved' && found.tracking && (
                                    <div className="donar-tracking-card">
                                        <div className="donar-tracking-card__header">
                                            <h3>🚚 Organ Tracking System</h3>
                                            <div className="donar-tracking-card__progress-info">
                                                <span className="donar-tracking-card__progress-text">
                                                    {found.tracking.stages.filter(s => s.status === 'completed').length}/{found.tracking.stages.length} Stages
                                                </span>
                                                <div className="donar-tracking-card__progress-bar">
                                                    <div className="donar-tracking-card__progress-fill" style={{ width: `${(found.tracking.stages.filter(s => s.status === 'completed').length / found.tracking.stages.length) * 100}%` }} />
                                                </div>
                                            </div>
                                        </div>

                                        {found.tracking.stages.every(s => s.status === 'completed') && (
                                            <div className="donar-tracking-success">
                                                <span className="donar-tracking-success__icon">🎉</span>
                                                <div>
                                                    <strong>Transplant Successful!</strong>
                                                    <p>Your organ donation has been successfully transplanted. Thank you for saving a life!</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="donar-tracking-stages">
                                            {found.tracking.stages.map((stage, idx) => {
                                                const isCompleted = stage.status === 'completed';
                                                const isNext = !isCompleted && (idx === 0 || found.tracking.stages[idx - 1]?.status === 'completed');
                                                return (
                                                    <div key={idx} className={`donar-tracking-stage ${isCompleted ? 'donar-tracking-stage--done' : ''} ${isNext ? 'donar-tracking-stage--active' : ''}`}>
                                                        <div className="donar-tracking-stage__line">
                                                            <div className={`donar-tracking-stage__dot ${isCompleted ? 'donar-tracking-stage__dot--done' : isNext ? 'donar-tracking-stage__dot--active' : ''}`}>
                                                                {isCompleted ? '✓' : (idx + 1)}
                                                            </div>
                                                            {idx < found.tracking.stages.length - 1 && (
                                                                <div className={`donar-tracking-stage__connector ${isCompleted ? 'donar-tracking-stage__connector--done' : ''}`} />
                                                            )}
                                                        </div>
                                                        <div className="donar-tracking-stage__content">
                                                            <div className="donar-tracking-stage__header">
                                                                <span className="donar-tracking-stage__icon">{stage.icon}</span>
                                                                <strong className="donar-tracking-stage__name">{stage.name}</strong>
                                                                {isCompleted && <span className="donar-tracking-stage__badge">Completed</span>}
                                                                {isNext && <span className="donar-tracking-stage__badge donar-tracking-stage__badge--active">In Progress</span>}
                                                            </div>
                                                            {isCompleted && stage.timestamp && (
                                                                <span className="donar-tracking-stage__time">
                                                                    {new Date(stage.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            )}
                                                            {stage.location && <span className="donar-tracking-stage__location">📍 {stage.location}</span>}
                                                            {stage.note && <p className="donar-tracking-stage__note">{stage.note}</p>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Timeline */}
                                <div className="donar-timeline-card">
                                    <h3>📋 Registration Timeline</h3>
                                    <div className="donar-timeline">
                                        <div className="donar-timeline__step donar-timeline__step--done">
                                            <div className="donar-timeline__dot">✓</div>
                                            <div>
                                                <strong>Registered</strong>
                                                <span>{new Date(found.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                        <div className={`donar-timeline__step ${found.status === 'approved' || found.status === 'rejected' ? 'donar-timeline__step--done' : 'donar-timeline__step--active'}`}>
                                            <div className="donar-timeline__dot">{found.status === 'pending' ? '●' : '✓'}</div>
                                            <div>
                                                <strong>Under Review</strong>
                                                <span>{found.status === 'pending' ? 'NGO is reviewing your application' : 'Review completed'}</span>
                                            </div>
                                        </div>
                                        <div className={`donar-timeline__step ${found.status === 'approved' ? 'donar-timeline__step--done' : found.status === 'rejected' ? 'donar-timeline__step--rejected' : ''}`}>
                                            <div className="donar-timeline__dot">{found.status === 'approved' ? '✓' : found.status === 'rejected' ? '✗' : '○'}</div>
                                            <div>
                                                <strong>{found.status === 'rejected' ? 'Rejected' : 'Approved'}</strong>
                                                <span>
                                                    {found.status === 'approved' && found.approvedAt
                                                        ? new Date(found.approvedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                        : found.status === 'rejected' ? 'Application not approved' : 'Awaiting approval'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`donar-timeline__step ${found.status === 'approved' && found.approvalDetails ? 'donar-timeline__step--done' : ''}`}>
                                            <div className="donar-timeline__dot">{found.status === 'approved' && found.approvalDetails ? '✓' : '○'}</div>
                                            <div>
                                                <strong>Appointment Scheduled</strong>
                                                <span>{found.status === 'approved' && found.approvalDetails ? `${found.approvalDetails.hospitalName}` : 'Pending approval'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </>
    );
}
