import { useState } from 'react';
import './FoodDonation.css';

// Mock volunteers data
const mockVolunteers = [
    { id: 'VOL001', name: 'Rahul Sharma', phone: '9876543210', area: 'Andheri West', rating: 4.8, deliveries: 127, available: true },
    { id: 'VOL002', name: 'Priya Patel', phone: '9876543211', area: 'Bandra East', rating: 4.9, deliveries: 89, available: true },
    { id: 'VOL003', name: 'Amit Kumar', phone: '9876543212', area: 'Juhu', rating: 4.7, deliveries: 156, available: true },
    { id: 'VOL004', name: 'Sneha Desai', phone: '9876543213', area: 'Malad West', rating: 4.6, deliveries: 72, available: true },
    { id: 'VOL005', name: 'Vikram Singh', phone: '9876543214', area: 'Goregaon', rating: 4.8, deliveries: 201, available: true },
];

// Food donation categories
const foodCategories = [
    { id: 'cooked-food', name: 'Cooked Food', icon: '🍲', description: 'Home-cooked meals, packed food' },
    { id: 'vegetables', name: 'Fresh Vegetables', icon: '🥬', description: 'Fresh veggies, leafy greens' },
    { id: 'fruits', name: 'Fresh Fruits', icon: '🍎', description: 'Seasonal fruits, fruit baskets' },
    { id: 'grains', name: 'Grains & Pulses', icon: '🌾', description: 'Rice, wheat, dal, cereals' },
    { id: 'dairy', name: 'Dairy Products', icon: '🥛', description: 'Milk, curd, paneer' },
    { id: 'packaged', name: 'Packaged Food', icon: '📦', description: 'Biscuits, snacks, dry items' },
];

export default function FoodDonation() {
    // Food donation states
    const [foodDonations, setFoodDonations] = useState([]);
    const [showFoodForm, setShowFoodForm] = useState(false);
    const [foodFormData, setFoodFormData] = useState({
        donorName: '',
        donorPhone: '',
        donorAddress: '',
        pickupAddress: '',
        selectedItems: [],
        quantity: '',
        description: '',
        preferredTime: '',
    });
    const [formErrors, setFormErrors] = useState({});

    // Food donation form handlers
    const handleFoodFormChange = (e) => {
        const { name, value } = e.target;
        setFoodFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const toggleFoodItem = (itemId) => {
        setFoodFormData(prev => ({
            ...prev,
            selectedItems: prev.selectedItems.includes(itemId)
                ? prev.selectedItems.filter(id => id !== itemId)
                : [...prev.selectedItems, itemId]
        }));
    };

    const validateFoodForm = () => {
        const errors = {};
        if (!foodFormData.donorName.trim()) errors.donorName = 'Name is required';
        if (!foodFormData.donorPhone.trim()) errors.donorPhone = 'Phone number is required';
        else if (!/^\d{10}$/.test(foodFormData.donorPhone)) errors.donorPhone = 'Enter valid 10-digit phone';
        if (!foodFormData.donorAddress.trim()) errors.donorAddress = 'Address is required';
        if (!foodFormData.pickupAddress.trim()) errors.pickupAddress = 'Pickup address is required';
        if (foodFormData.selectedItems.length === 0) errors.selectedItems = 'Select at least one item';
        if (!foodFormData.quantity.trim()) errors.quantity = 'Quantity is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const allocateNearbyVolunteer = () => {
        // Simulate finding a nearby available volunteer
        const availableVolunteers = mockVolunteers.filter(v => v.available);
        if (availableVolunteers.length === 0) return null;
        // Pick a random available volunteer
        return availableVolunteers[Math.floor(Math.random() * availableVolunteers.length)];
    };

    const handleFoodDonationSubmit = (e) => {
        e.preventDefault();
        if (!validateFoodForm()) return;

        const volunteer = allocateNearbyVolunteer();
        if (!volunteer) {
            alert('No volunteers available at the moment. Please try again later.');
            return;
        }

        const newDonation = {
            id: `FD${Date.now()}`,
            ...foodFormData,
            volunteer: volunteer,
            volunteerStatus: 'pending', // pending, accepted, declined
            deliveryStatus: 'waiting', // waiting, picked_up, in_transit, delivered
            createdAt: new Date().toISOString(),
            statusHistory: [
                { status: 'created', timestamp: new Date().toISOString(), message: 'Donation request created' }
            ]
        };

        setFoodDonations(prev => [newDonation, ...prev]);
        setFoodFormData({
            donorName: '',
            donorPhone: '',
            donorAddress: '',
            pickupAddress: '',
            selectedItems: [],
            quantity: '',
            description: '',
            preferredTime: '',
        });
        setShowFoodForm(false);
    };

    const handleVolunteerResponse = (donationId, response) => {
        setFoodDonations(prev => prev.map(donation => {
            if (donation.id !== donationId) return donation;
            
            if (response === 'accept') {
                return {
                    ...donation,
                    volunteerStatus: 'accepted',
                    deliveryStatus: 'picked_up',
                    statusHistory: [
                        ...donation.statusHistory,
                        { status: 'volunteer_accepted', timestamp: new Date().toISOString(), message: `${donation.volunteer.name} accepted the pickup request` },
                        { status: 'picked_up', timestamp: new Date().toISOString(), message: 'Volunteer is on the way to pickup' }
                    ]
                };
            } else {
                // If declined, try to allocate another volunteer
                const newVolunteer = allocateNearbyVolunteer();
                return {
                    ...donation,
                    volunteerStatus: newVolunteer ? 'pending' : 'no_volunteer',
                    volunteer: newVolunteer || donation.volunteer,
                    statusHistory: [
                        ...donation.statusHistory,
                        { status: 'volunteer_declined', timestamp: new Date().toISOString(), message: `${donation.volunteer.name} declined the request` },
                        ...(newVolunteer ? [{ status: 'reassigned', timestamp: new Date().toISOString(), message: `Request reassigned to ${newVolunteer.name}` }] : [])
                    ]
                };
            }
        }));
    };

    const updateDeliveryStatus = (donationId, newStatus) => {
        const statusMessages = {
            'in_transit': 'Volunteer is on the way to deliver',
            'delivered': 'Donation has been successfully delivered!'
        };
        
        setFoodDonations(prev => prev.map(donation => {
            if (donation.id !== donationId) return donation;
            return {
                ...donation,
                deliveryStatus: newStatus,
                statusHistory: [
                    ...donation.statusHistory,
                    { status: newStatus, timestamp: new Date().toISOString(), message: statusMessages[newStatus] }
                ]
            };
        }));
    };

    const getDeliveryStatusInfo = (status) => {
        const statusMap = {
            'waiting': { icon: '⏳', label: 'Waiting for Volunteer', color: '#f59e0b' },
            'picked_up': { icon: '📦', label: 'Pickup Confirmed', color: '#3b82f6' },
            'in_transit': { icon: '🚗', label: 'In Transit', color: '#8b5cf6' },
            'delivered': { icon: '✅', label: 'Delivered', color: '#10b981' },
        };
        return statusMap[status] || statusMap['waiting'];
    };

    const deliveredCount = foodDonations.filter(d => d.deliveryStatus === 'delivered').length;

    return (
        <>
            {/* Header */}
            <section className="page-header food-page-header">
                <div className="page-header__bg-pattern" />
                <div className="container">
                    <span className="section-label">🍲 Food Donation</span>
                    <h1 className="page-header__title">Donate Food & Essentials</h1>
                    <p className="page-header__subtitle">
                        Share your surplus food with needy patients in hospitals. Every meal counts!
                    </p>
                </div>
            </section>

            {/* ──── FOOD DONATION SECTION ──── */}
            <section className="food-donation-section">
                <div className="container">
                    <div className="food-donation-header">
                        <div>
                            <h2 className="food-donation-title">🍲 Food & Essentials Donation</h2>
                            <p className="food-donation-subtitle">Donate food, vegetables, and fruits to needy patients in hospitals</p>
                        </div>
                        <button className="food-donation-add-btn" onClick={() => setShowFoodForm(!showFoodForm)}>
                            {showFoodForm ? '✕ Cancel' : '+ Donate Food'}
                        </button>
                    </div>

                    {/* Food Donation Form */}
                    {showFoodForm && (
                        <div className="food-donation-form-card">
                            <h3 className="food-form-title">📝 New Food Donation</h3>
                            <form className="food-donation-form" onSubmit={handleFoodDonationSubmit}>
                                {/* Donor Details */}
                                <div className="food-form-section">
                                    <h4>👤 Your Details</h4>
                                    <div className="food-form-grid">
                                        <div className="food-form-field">
                                            <label>Full Name *</label>
                                            <input
                                                type="text"
                                                name="donorName"
                                                value={foodFormData.donorName}
                                                onChange={handleFoodFormChange}
                                                placeholder="Enter your full name"
                                                className={formErrors.donorName ? 'error' : ''}
                                            />
                                            {formErrors.donorName && <span className="food-form-error">{formErrors.donorName}</span>}
                                        </div>
                                        <div className="food-form-field">
                                            <label>Phone Number *</label>
                                            <input
                                                type="tel"
                                                name="donorPhone"
                                                value={foodFormData.donorPhone}
                                                onChange={handleFoodFormChange}
                                                placeholder="10-digit phone number"
                                                maxLength={10}
                                                className={formErrors.donorPhone ? 'error' : ''}
                                            />
                                            {formErrors.donorPhone && <span className="food-form-error">{formErrors.donorPhone}</span>}
                                        </div>
                                    </div>
                                    <div className="food-form-field food-form-field--full">
                                        <label>Your Address *</label>
                                        <textarea
                                            name="donorAddress"
                                            value={foodFormData.donorAddress}
                                            onChange={handleFoodFormChange}
                                            placeholder="Enter your complete address"
                                            rows={2}
                                            className={formErrors.donorAddress ? 'error' : ''}
                                        />
                                        {formErrors.donorAddress && <span className="food-form-error">{formErrors.donorAddress}</span>}
                                    </div>
                                    <div className="food-form-field food-form-field--full">
                                        <label>Pickup Address *</label>
                                        <textarea
                                            name="pickupAddress"
                                            value={foodFormData.pickupAddress}
                                            onChange={handleFoodFormChange}
                                            placeholder="Where should the volunteer pick up the donation?"
                                            rows={2}
                                            className={formErrors.pickupAddress ? 'error' : ''}
                                        />
                                        {formErrors.pickupAddress && <span className="food-form-error">{formErrors.pickupAddress}</span>}
                                    </div>
                                </div>

                                {/* Food Items Selection */}
                                <div className="food-form-section">
                                    <h4>🥗 What are you donating? *</h4>
                                    {formErrors.selectedItems && <span className="food-form-error">{formErrors.selectedItems}</span>}
                                    <div className="food-items-grid">
                                        {foodCategories.map(item => (
                                            <div
                                                key={item.id}
                                                className={`food-item-card ${foodFormData.selectedItems.includes(item.id) ? 'food-item-card--selected' : ''}`}
                                                onClick={() => toggleFoodItem(item.id)}
                                            >
                                                <span className="food-item-icon">{item.icon}</span>
                                                <span className="food-item-name">{item.name}</span>
                                                <span className="food-item-desc">{item.description}</span>
                                                {foodFormData.selectedItems.includes(item.id) && <span className="food-item-check">✓</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Additional Details */}
                                <div className="food-form-section">
                                    <h4>📋 Additional Details</h4>
                                    <div className="food-form-grid">
                                        <div className="food-form-field">
                                            <label>Quantity/Servings *</label>
                                            <input
                                                type="text"
                                                name="quantity"
                                                value={foodFormData.quantity}
                                                onChange={handleFoodFormChange}
                                                placeholder="e.g., 10 servings, 5 kg"
                                                className={formErrors.quantity ? 'error' : ''}
                                            />
                                            {formErrors.quantity && <span className="food-form-error">{formErrors.quantity}</span>}
                                        </div>
                                        <div className="food-form-field">
                                            <label>Preferred Pickup Time</label>
                                            <input
                                                type="time"
                                                name="preferredTime"
                                                value={foodFormData.preferredTime}
                                                onChange={handleFoodFormChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="food-form-field food-form-field--full">
                                        <label>Description (Optional)</label>
                                        <textarea
                                            name="description"
                                            value={foodFormData.description}
                                            onChange={handleFoodFormChange}
                                            placeholder="Any special instructions or details about the donation..."
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="food-form-submit">
                                    🚀 Submit Donation & Allocate Volunteer
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Food Donations List */}
                    {foodDonations.length > 0 && (
                        <div className="food-donations-list">
                            <h3 className="food-donations-list-title">📦 Your Food Donations</h3>
                            {foodDonations.map(donation => {
                                const statusInfo = getDeliveryStatusInfo(donation.deliveryStatus);
                                const selectedCategories = foodCategories.filter(c => donation.selectedItems.includes(c.id));
                                
                                return (
                                    <div key={donation.id} className="food-donation-card">
                                        {/* Donation Header */}
                                        <div className="food-donation-card__header">
                                            <div className="food-donation-card__id">
                                                <span className="food-donation-id">#{donation.id}</span>
                                                <span className="food-donation-date">
                                                    {new Date(donation.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="food-donation-status" style={{ '--status-color': statusInfo.color }}>
                                                <span className="food-donation-status__icon">{statusInfo.icon}</span>
                                                <span>{statusInfo.label}</span>
                                            </div>
                                        </div>

                                        {/* Items Donated */}
                                        <div className="food-donation-items">
                                            {selectedCategories.map(cat => (
                                                <span key={cat.id} className="food-donation-item-tag">
                                                    {cat.icon} {cat.name}
                                                </span>
                                            ))}
                                            <span className="food-donation-quantity">📊 {donation.quantity}</span>
                                        </div>

                                        {/* Pickup Details */}
                                        <div className="food-donation-details">
                                            <div className="food-donation-detail">
                                                <span className="food-donation-detail__icon">📍</span>
                                                <div>
                                                    <span className="food-donation-detail__label">Pickup Address</span>
                                                    <strong>{donation.pickupAddress}</strong>
                                                </div>
                                            </div>
                                            {donation.preferredTime && (
                                                <div className="food-donation-detail">
                                                    <span className="food-donation-detail__icon">🕐</span>
                                                    <div>
                                                        <span className="food-donation-detail__label">Preferred Time</span>
                                                        <strong>{donation.preferredTime}</strong>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Volunteer Section */}
                                        <div className="food-donation-volunteer">
                                            <h4>🚴 Assigned Volunteer</h4>
                                            <div className="volunteer-card">
                                                <div className="volunteer-avatar">{donation.volunteer.name.charAt(0)}</div>
                                                <div className="volunteer-info">
                                                    <strong className="volunteer-name">{donation.volunteer.name}</strong>
                                                    <span className="volunteer-meta">
                                                        📍 {donation.volunteer.area} • ⭐ {donation.volunteer.rating} • 🚗 {donation.volunteer.deliveries} deliveries
                                                    </span>
                                                    <span className="volunteer-phone">📞 {donation.volunteer.phone}</span>
                                                </div>
                                                <div className={`volunteer-status volunteer-status--${donation.volunteerStatus}`}>
                                                    {donation.volunteerStatus === 'pending' && '⏳ Pending Response'}
                                                    {donation.volunteerStatus === 'accepted' && '✅ Accepted'}
                                                    {donation.volunteerStatus === 'declined' && '❌ Declined'}
                                                    {donation.volunteerStatus === 'no_volunteer' && '⚠️ No Volunteer Available'}
                                                </div>
                                            </div>

                                            {/* Volunteer Accept/Decline Buttons (Simulated) */}
                                            {donation.volunteerStatus === 'pending' && (
                                                <div className="volunteer-actions">
                                                    <span className="volunteer-actions__label">Volunteer Response:</span>
                                                    <div className="volunteer-actions__btns">
                                                        <button
                                                            className="volunteer-action-btn volunteer-action-btn--accept"
                                                            onClick={() => handleVolunteerResponse(donation.id, 'accept')}
                                                        >
                                                            ✓ Accept Pickup
                                                        </button>
                                                        <button
                                                            className="volunteer-action-btn volunteer-action-btn--decline"
                                                            onClick={() => handleVolunteerResponse(donation.id, 'decline')}
                                                        >
                                                            ✕ Decline
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Delivery Progress Buttons */}
                                            {donation.volunteerStatus === 'accepted' && donation.deliveryStatus !== 'delivered' && (
                                                <div className="delivery-progress-actions">
                                                    <span className="delivery-progress__label">Update Delivery Status:</span>
                                                    <div className="delivery-progress__btns">
                                                        {donation.deliveryStatus === 'picked_up' && (
                                                            <button
                                                                className="delivery-progress-btn"
                                                                onClick={() => updateDeliveryStatus(donation.id, 'in_transit')}
                                                            >
                                                                🚗 Mark In Transit
                                                            </button>
                                                        )}
                                                        {donation.deliveryStatus === 'in_transit' && (
                                                            <button
                                                                className="delivery-progress-btn delivery-progress-btn--complete"
                                                                onClick={() => updateDeliveryStatus(donation.id, 'delivered')}
                                                            >
                                                                ✅ Mark Delivered
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Delivery Progress Timeline */}
                                        <div className="food-delivery-timeline">
                                            <h4>📜 Delivery Timeline</h4>
                                            <div className="food-timeline-stages">
                                                {donation.statusHistory.map((entry, idx) => (
                                                    <div key={idx} className="food-timeline-entry">
                                                        <div className="food-timeline-dot" />
                                                        <div className="food-timeline-content">
                                                            <span className="food-timeline-message">{entry.message}</span>
                                                            <span className="food-timeline-time">
                                                                {new Date(entry.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Delivered Success Banner */}
                                        {donation.deliveryStatus === 'delivered' && (
                                            <div className="food-donation-success">
                                                <span className="food-donation-success__icon">🎉</span>
                                                <div>
                                                    <strong>Donation Delivered Successfully!</strong>
                                                    <p>Thank you for your generosity. Your donation has reached those in need.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Empty State */}
                    {foodDonations.length === 0 && !showFoodForm && (
                        <div className="food-donation-empty">
                            <div className="food-donation-empty__icon">🍎</div>
                            <h3>No Food Donations Yet</h3>
                            <p>Start making a difference by donating food, vegetables, or fruits to patients in need.</p>
                            <button className="food-donation-empty__btn" onClick={() => setShowFoodForm(true)}>
                                + Create Your First Donation
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ──── ENVIRONMENTAL IMPACT SECTION ──── */}
            {deliveredCount > 0 && (
                <section className="env-impact-section">
                    <div className="container">
                        <div className="env-impact-header">
                            <span className="env-impact-badge">🌍 Your Impact</span>
                            <h2 className="env-impact-title">Environmental Impact of Your Donations</h2>
                            <p className="env-impact-subtitle">See how your food donations are making a positive difference for the planet</p>
                        </div>

                        <div className="env-impact-stats">
                            <div className="env-impact-stat">
                                <div className="env-impact-stat__icon">🍽️</div>
                                <div className="env-impact-stat__value">{deliveredCount}</div>
                                <div className="env-impact-stat__label">Meals Donated</div>
                            </div>
                            <div className="env-impact-stat">
                                <div className="env-impact-stat__icon">🗑️</div>
                                <div className="env-impact-stat__value">{(deliveredCount * 2.5).toFixed(1)} kg</div>
                                <div className="env-impact-stat__label">Food Waste Prevented</div>
                            </div>
                            <div className="env-impact-stat">
                                <div className="env-impact-stat__icon">💨</div>
                                <div className="env-impact-stat__value">{(deliveredCount * 4.2).toFixed(1)} kg</div>
                                <div className="env-impact-stat__label">CO₂ Emissions Saved</div>
                            </div>
                            <div className="env-impact-stat">
                                <div className="env-impact-stat__icon">💧</div>
                                <div className="env-impact-stat__value">{(deliveredCount * 150).toLocaleString()} L</div>
                                <div className="env-impact-stat__label">Water Conserved</div>
                            </div>
                        </div>

                        <div className="env-impact-summary">
                            <div className="env-impact-summary__icon">🌱</div>
                            <div className="env-impact-summary__content">
                                <h3>Your Positive Environmental Impact</h3>
                                <p>
                                    By donating food instead of letting it go to waste, you've made a significant contribution to the environment! 
                                    Food waste in landfills produces methane, a greenhouse gas 25x more potent than CO₂. Your 
                                    <strong> {deliveredCount} donation{deliveredCount > 1 ? 's' : ''}</strong> helped:
                                </p>
                                <ul className="env-impact-benefits">
                                    <li>🌿 <strong>Reduced Landfill Waste:</strong> Prevented {(deliveredCount * 2.5).toFixed(1)} kg of food from decomposing in landfills</li>
                                    <li>🌡️ <strong>Lower Carbon Footprint:</strong> Saved {(deliveredCount * 4.2).toFixed(1)} kg of CO₂ equivalent emissions</li>
                                    <li>💧 <strong>Water Conservation:</strong> Preserved {(deliveredCount * 150).toLocaleString()} liters of water used in food production</li>
                                    <li>⚡ <strong>Energy Savings:</strong> Saved energy equivalent to {(deliveredCount * 3.5).toFixed(1)} kWh of electricity</li>
                                    <li>🤝 <strong>Community Impact:</strong> Fed {deliveredCount} {deliveredCount > 1 ? 'families/patients' : 'family/patient'} in need</li>
                                </ul>
                            </div>
                        </div>

                        <div className="env-impact-quote">
                            <blockquote>
                                "Every meal donated is a step towards a sustainable future. You're not just feeding the hungry — you're healing the planet."
                            </blockquote>
                            <span className="env-impact-quote__author">— UnityDrop Team 💚</span>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
