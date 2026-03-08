import { useState } from 'react';
import { ngos, organDonations } from '../data/mockData';
import { useDonors } from '../context/DonorContext';
import './NGOs.css';

export default function NGOs() {
    const { donors, updateDonorStatus, updateTracking } = useDonors();
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedDonor, setExpandedDonor] = useState(null);
    const [approvingDonor, setApprovingDonor] = useState(null);
    const [trackingNote, setTrackingNote] = useState('');
    const [approvalForm, setApprovalForm] = useState({
        donationDate: '',
        donationTime: '',
        hospitalName: '',
        hospitalAddress: '',
        doctorName: '',
        contactNumber: '',
        instructions: '',
    });

    const filteredDonors = statusFilter === 'all'
        ? donors
        : donors.filter(d => d.status === statusFilter);

    const statusCounts = {
        all: donors.length,
        pending: donors.filter(d => d.status === 'pending').length,
        approved: donors.filter(d => d.status === 'approved').length,
        rejected: donors.filter(d => d.status === 'rejected').length,
    };

    const getOrganNames = (organIds) =>
        organIds.map(id => organDonations.find(o => o.id === id)?.organ).filter(Boolean).join(', ');

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const handleApprovalChange = (e) => {
        const { name, value } = e.target;
        setApprovalForm(prev => ({ ...prev, [name]: value }));
    };

    const openApprovalForm = (donorId) => {
        setApprovingDonor(donorId);
        setApprovalForm({
            donationDate: '',
            donationTime: '',
            hospitalName: '',
            hospitalAddress: '',
            doctorName: '',
            contactNumber: '',
            instructions: '',
        });
    };

    const submitApproval = (donorId) => {
        if (!approvalForm.donationDate || !approvalForm.donationTime || !approvalForm.hospitalName || !approvalForm.hospitalAddress) {
            return;
        }
        updateDonorStatus(donorId, 'approved', { ...approvalForm });
        setApprovingDonor(null);
    };

    return (
        <>
            {/* Header */}
            <section className="page-header">
                <div className="page-header__bg-pattern" />
                <div className="container">
                    <span className="section-label">🏢 NGO Dashboard</span>
                    <h1 className="page-header__title">NGOs & Donor Management</h1>
                    <p className="page-header__subtitle">
                        Manage registered donors, review organ pledges, and coordinate with hospitals for life-saving transplants.
                    </p>
                </div>
            </section>

            {/* NGO Cards */}
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

            {/* Donor Registrations Dashboard */}
            <section className="ngo-donors-section">
                <div className="container">
                    <h2 className="ngo-section-title">📋 Registered Donors</h2>

                    {/* Summary Cards */}
                    <div className="ngo-donor-summary">
                        <div className="ngo-donor-summary__card ngo-donor-summary__card--total">
                            <span className="ngo-donor-summary__value">{statusCounts.all}</span>
                            <span className="ngo-donor-summary__label">Total Donors</span>
                        </div>
                        <div className="ngo-donor-summary__card ngo-donor-summary__card--pending">
                            <span className="ngo-donor-summary__value">{statusCounts.pending}</span>
                            <span className="ngo-donor-summary__label">Pending Review</span>
                        </div>
                        <div className="ngo-donor-summary__card ngo-donor-summary__card--approved">
                            <span className="ngo-donor-summary__value">{statusCounts.approved}</span>
                            <span className="ngo-donor-summary__label">Approved</span>
                        </div>
                        <div className="ngo-donor-summary__card ngo-donor-summary__card--rejected">
                            <span className="ngo-donor-summary__value">{statusCounts.rejected}</span>
                            <span className="ngo-donor-summary__label">Rejected</span>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="ngo-donor-filters">
                        {['all', 'pending', 'approved', 'rejected'].map(f => (
                            <button
                                key={f}
                                className={`ngo-donor-filter-btn ${statusFilter === f ? 'active' : ''}`}
                                onClick={() => setStatusFilter(f)}
                            >
                                {f === 'all' ? '📋 All' : f === 'pending' ? '⏳ Pending' : f === 'approved' ? '✅ Approved' : '❌ Rejected'}
                                <span className="ngo-donor-filter-count">{statusCounts[f]}</span>
                            </button>
                        ))}
                    </div>

                    {/* Donor List */}
                    {filteredDonors.length === 0 ? (
                        <div className="ngo-donor-empty">
                            <div className="ngo-donor-empty__icon">📭</div>
                            <h3>{donors.length === 0 ? 'No Donors Registered Yet' : 'No Donors Match This Filter'}</h3>
                            <p>{donors.length === 0 ? 'Donor registrations from the Donar section will appear here.' : 'Try selecting a different status filter.'}</p>
                        </div>
                    ) : (
                        <div className="ngo-donor-list">
                            {filteredDonors.map(donor => (
                                <div key={donor.donorId} className={`ngo-donor-row ${expandedDonor === donor.donorId ? 'expanded' : ''}`}>
                                    <div className="ngo-donor-row__main" onClick={() => setExpandedDonor(expandedDonor === donor.donorId ? null : donor.donorId)}>
                                        <div className="ngo-donor-row__avatar">
                                            {donor.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="ngo-donor-row__info">
                                            <span className="ngo-donor-row__name">{donor.fullName}</span>
                                            <span className="ngo-donor-row__meta">
                                                {donor.bloodGroup} · {donor.city}, {donor.state} · {formatDate(donor.registeredAt)}
                                            </span>
                                        </div>
                                        <div className="ngo-donor-row__organs">
                                            {donor.organs.slice(0, 3).map(id => {
                                                const org = organDonations.find(o => o.id === id);
                                                return org ? <span key={id} className="ngo-donor-row__organ-tag">{org.icon} {org.organ}</span> : null;
                                            })}
                                            {donor.organs.length > 3 && <span className="ngo-donor-row__organ-more">+{donor.organs.length - 3}</span>}
                                        </div>
                                        <span className={`ngo-donor-row__status ngo-donor-row__status--${donor.status}`}>
                                            {donor.status === 'pending' ? '⏳ Pending' : donor.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                                        </span>
                                        <span className="ngo-donor-row__expand">{expandedDonor === donor.donorId ? '▲' : '▼'}</span>
                                    </div>

                                    {expandedDonor === donor.donorId && (
                                        <div className="ngo-donor-row__details">
                                            <div className="ngo-donor-details-grid">
                                                <div className="ngo-donor-detail">
                                                    <span className="ngo-donor-detail__label">Donor ID</span>
                                                    <span className="ngo-donor-detail__value">{donor.donorId}</span>
                                                </div>
                                                <div className="ngo-donor-detail">
                                                    <span className="ngo-donor-detail__label">Email</span>
                                                    <span className="ngo-donor-detail__value">{donor.email}</span>
                                                </div>
                                                <div className="ngo-donor-detail">
                                                    <span className="ngo-donor-detail__label">Phone</span>
                                                    <span className="ngo-donor-detail__value">{donor.phone}</span>
                                                </div>
                                                <div className="ngo-donor-detail">
                                                    <span className="ngo-donor-detail__label">Date of Birth</span>
                                                    <span className="ngo-donor-detail__value">{donor.dob}</span>
                                                </div>
                                                <div className="ngo-donor-detail">
                                                    <span className="ngo-donor-detail__label">Gender</span>
                                                    <span className="ngo-donor-detail__value" style={{ textTransform: 'capitalize' }}>{donor.gender}</span>
                                                </div>
                                                <div className="ngo-donor-detail">
                                                    <span className="ngo-donor-detail__label">Blood Group</span>
                                                    <span className="ngo-donor-detail__value">{donor.bloodGroup}</span>
                                                </div>
                                                <div className="ngo-donor-detail">
                                                    <span className="ngo-donor-detail__label">Donation Type</span>
                                                    <span className="ngo-donor-detail__value" style={{ textTransform: 'capitalize' }}>{donor.donationType}</span>
                                                </div>
                                                <div className="ngo-donor-detail">
                                                    <span className="ngo-donor-detail__label">Address</span>
                                                    <span className="ngo-donor-detail__value">{donor.address}, {donor.city}, {donor.state} - {donor.pincode}</span>
                                                </div>
                                                <div className="ngo-donor-detail">
                                                    <span className="ngo-donor-detail__label">Organs Pledged</span>
                                                    <span className="ngo-donor-detail__value">{getOrganNames(donor.organs)}</span>
                                                </div>
                                                <div className="ngo-donor-detail">
                                                    <span className="ngo-donor-detail__label">Emergency Contact</span>
                                                    <span className="ngo-donor-detail__value">{donor.emergencyName} — {donor.emergencyPhone}</span>
                                                </div>
                                                {donor.medicalConditions && (
                                                    <div className="ngo-donor-detail" style={{ gridColumn: '1 / -1' }}>
                                                        <span className="ngo-donor-detail__label">Medical Conditions</span>
                                                        <span className="ngo-donor-detail__value">{donor.medicalConditions}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="ngo-donor-actions">
                                                {donor.status !== 'approved' && approvingDonor !== donor.donorId && (
                                                    <button className="ngo-donor-action-btn ngo-donor-action-btn--approve" onClick={() => openApprovalForm(donor.donorId)}>
                                                        ✅ Approve
                                                    </button>
                                                )}
                                                {donor.status !== 'rejected' && (
                                                    <button className="ngo-donor-action-btn ngo-donor-action-btn--reject" onClick={() => updateDonorStatus(donor.donorId, 'rejected')}>
                                                        ❌ Reject
                                                    </button>
                                                )}
                                                {donor.status !== 'pending' && (
                                                    <button className="ngo-donor-action-btn ngo-donor-action-btn--pending" onClick={() => updateDonorStatus(donor.donorId, 'pending')}>
                                                        ⏳ Set Pending
                                                    </button>
                                                )}
                                            </div>

                                            {/* Approval Form */}
                                            {approvingDonor === donor.donorId && (
                                                <div className="ngo-approval-form">
                                                    <h4 className="ngo-approval-form__title">📋 Donation Appointment Details</h4>
                                                    <p className="ngo-approval-form__desc">Fill in the donation schedule and hospital details. This information will be sent to the donor's dashboard.</p>
                                                    <div className="ngo-approval-form__grid">
                                                        <div className="ngo-approval-form__field">
                                                            <label>Donation Date *</label>
                                                            <input type="date" name="donationDate" value={approvalForm.donationDate} onChange={handleApprovalChange} />
                                                        </div>
                                                        <div className="ngo-approval-form__field">
                                                            <label>Donation Time *</label>
                                                            <input type="time" name="donationTime" value={approvalForm.donationTime} onChange={handleApprovalChange} />
                                                        </div>
                                                        <div className="ngo-approval-form__field">
                                                            <label>Hospital / Center Name *</label>
                                                            <input type="text" name="hospitalName" value={approvalForm.hospitalName} onChange={handleApprovalChange} placeholder="e.g. AIIMS New Delhi" />
                                                        </div>
                                                        <div className="ngo-approval-form__field">
                                                            <label>Hospital Address *</label>
                                                            <input type="text" name="hospitalAddress" value={approvalForm.hospitalAddress} onChange={handleApprovalChange} placeholder="Full hospital address" />
                                                        </div>
                                                        <div className="ngo-approval-form__field">
                                                            <label>Doctor / Coordinator Name</label>
                                                            <input type="text" name="doctorName" value={approvalForm.doctorName} onChange={handleApprovalChange} placeholder="Dr. Name" />
                                                        </div>
                                                        <div className="ngo-approval-form__field">
                                                            <label>Contact Number</label>
                                                            <input type="tel" name="contactNumber" value={approvalForm.contactNumber} onChange={handleApprovalChange} placeholder="Hospital contact" />
                                                        </div>
                                                        <div className="ngo-approval-form__field ngo-approval-form__field--full">
                                                            <label>Special Instructions</label>
                                                            <textarea name="instructions" value={approvalForm.instructions} onChange={handleApprovalChange} placeholder="Any preparation steps, fasting requirements, documents to bring..." rows={3} />
                                                        </div>
                                                    </div>
                                                    <div className="ngo-approval-form__actions">
                                                        <button className="ngo-donor-action-btn ngo-donor-action-btn--approve" onClick={() => submitApproval(donor.donorId)}>
                                                            ✅ Confirm & Approve
                                                        </button>
                                                        <button className="ngo-donor-action-btn ngo-donor-action-btn--pending" onClick={() => setApprovingDonor(null)}>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Organ Tracking Panel */}
                                            {donor.status === 'approved' && donor.tracking && (
                                                <div className="ngo-tracking-panel">
                                                    <h4 className="ngo-tracking-panel__title">🚚 Organ Tracking</h4>
                                                    <div className="ngo-tracking-stages">
                                                        {donor.tracking.stages.map((stage, idx) => {
                                                            const nextPending = donor.tracking.stages.findIndex(s => s.status === 'pending');
                                                            const isNext = idx === nextPending;
                                                            return (
                                                                <div key={idx} className={`ngo-tracking-stage ${stage.status === 'completed' ? 'ngo-tracking-stage--done' : ''} ${isNext ? 'ngo-tracking-stage--next' : ''}`}>
                                                                    <div className="ngo-tracking-stage__icon">{stage.icon}</div>
                                                                    <div className="ngo-tracking-stage__info">
                                                                        <strong>{stage.name}</strong>
                                                                        {stage.status === 'completed' && stage.timestamp && (
                                                                            <span className="ngo-tracking-stage__time">{new Date(stage.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                                                        )}
                                                                        {stage.note && <span className="ngo-tracking-stage__note">{stage.note}</span>}
                                                                    </div>
                                                                    <div className="ngo-tracking-stage__status">
                                                                        {stage.status === 'completed' ? '✅' : isNext ? '🔵' : '⚪'}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    {donor.tracking.stages.some(s => s.status === 'pending') && (
                                                        <div className="ngo-tracking-update">
                                                            <strong>Update Next Stage: {donor.tracking.stages[donor.tracking.stages.findIndex(s => s.status === 'pending')]?.icon} {donor.tracking.stages[donor.tracking.stages.findIndex(s => s.status === 'pending')]?.name}</strong>
                                                            <div className="ngo-tracking-update__row">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Add a note (optional)..."
                                                                    value={trackingNote}
                                                                    onChange={e => setTrackingNote(e.target.value)}
                                                                    className="ngo-tracking-update__input"
                                                                />
                                                                <button
                                                                    className="ngo-tracking-update__btn"
                                                                    onClick={() => {
                                                                        const nextIdx = donor.tracking.stages.findIndex(s => s.status === 'pending');
                                                                        updateTracking(donor.donorId, nextIdx, trackingNote);
                                                                        setTrackingNote('');
                                                                    }}
                                                                >
                                                                    ✅ Mark Complete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {donor.tracking.stages.every(s => s.status === 'completed') && (
                                                        <div className="ngo-tracking-complete">
                                                            🎉 All stages completed — Transplant Successful!
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Show existing approval details if approved */}
                                            {donor.status === 'approved' && donor.approvalDetails && (
                                                <div className="ngo-approval-info">
                                                    <h4 className="ngo-approval-info__title">📅 Approved Donation Details</h4>
                                                    <div className="ngo-approval-info__grid">
                                                        <div><span>Date</span><strong>{donor.approvalDetails.donationDate}</strong></div>
                                                        <div><span>Time</span><strong>{donor.approvalDetails.donationTime}</strong></div>
                                                        <div><span>Hospital</span><strong>{donor.approvalDetails.hospitalName}</strong></div>
                                                        <div><span>Address</span><strong>{donor.approvalDetails.hospitalAddress}</strong></div>
                                                        {donor.approvalDetails.doctorName && <div><span>Doctor</span><strong>{donor.approvalDetails.doctorName}</strong></div>}
                                                        {donor.approvalDetails.contactNumber && <div><span>Contact</span><strong>{donor.approvalDetails.contactNumber}</strong></div>}
                                                    </div>
                                                    {donor.approvalDetails.instructions && (
                                                        <div className="ngo-approval-info__instructions">
                                                            <span>Instructions:</span> {donor.approvalDetails.instructions}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
