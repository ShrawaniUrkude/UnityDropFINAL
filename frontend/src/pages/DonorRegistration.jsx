import { useState } from 'react';
import { organDonations } from '../data/mockData';
import { useDonors } from '../context/DonorContext';
import './DonorRegistration.css';

const initialForm = {
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaar: '',
    organs: [],
    donationType: '',
    medicalConditions: '',
    smoking: '',
    alcohol: '',
    chronicDisease: '',
    previousSurgery: '',
    emergencyName: '',
    emergencyPhone: '',
    consent: false,
};

export default function DonorRegistration() {
    const { registerDonor } = useDonors();
    const [form, setForm] = useState(initialForm);
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const totalSteps = 4;

    // ──── Cost Estimation Algorithm ────
    const getAge = () => {
        if (!form.dob) return 0;
        const today = new Date();
        const birth = new Date(form.dob);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    const organBaseCosts = {
        1: { name: 'Kidney', base: 250000, screening: 15000 },
        2: { name: 'Liver', base: 500000, screening: 25000 },
        3: { name: 'Heart', base: 800000, screening: 35000 },
        4: { name: 'Lungs', base: 600000, screening: 30000 },
        5: { name: 'Cornea (Eyes)', base: 50000, screening: 8000 },
        6: { name: 'Bone Marrow', base: 350000, screening: 20000 },
        7: { name: 'Pancreas', base: 450000, screening: 22000 },
        8: { name: 'Skin', base: 80000, screening: 10000 },
    };

    const calculateCostEstimate = () => {
        if (form.organs.length === 0) return null;

        const age = getAge();
        let ageFactor = 1.0;
        if (age < 18) ageFactor = 1.15;
        else if (age <= 35) ageFactor = 0.9;
        else if (age <= 50) ageFactor = 1.0;
        else if (age <= 65) ageFactor = 1.2;
        else ageFactor = 1.4;

        let habitFactor = 1.0;
        if (form.smoking === 'regular') habitFactor += 0.2;
        else if (form.smoking === 'occasional') habitFactor += 0.1;
        else if (form.smoking === 'quit') habitFactor += 0.05;
        if (form.alcohol === 'heavy') habitFactor += 0.2;
        else if (form.alcohol === 'moderate') habitFactor += 0.1;
        else if (form.alcohol === 'social') habitFactor += 0.03;

        let medicalFactor = 1.0;
        if (form.chronicDisease === 'heart' || form.chronicDisease === 'liver' || form.chronicDisease === 'kidney') medicalFactor += 0.25;
        else if (form.chronicDisease === 'diabetes' || form.chronicDisease === 'hypertension') medicalFactor += 0.15;
        else if (form.chronicDisease === 'other') medicalFactor += 0.1;
        if (form.previousSurgery === 'organ') medicalFactor += 0.2;
        else if (form.previousSurgery === 'major') medicalFactor += 0.1;
        else if (form.previousSurgery === 'minor') medicalFactor += 0.05;

        const organBreakdown = form.organs.map(id => {
            const info = organBaseCosts[id];
            if (!info) return null;
            const procedureCost = Math.round(info.base * ageFactor * habitFactor * medicalFactor);
            const screeningCost = Math.round(info.screening * medicalFactor);
            const transportCost = Math.round(info.base * 0.05);
            const hospitalStay = Math.round(info.base * 0.15 * ageFactor);
            const total = procedureCost + screeningCost + transportCost + hospitalStay;
            return { ...info, id, procedureCost, screeningCost, transportCost, hospitalStay, total };
        }).filter(Boolean);

        const grandTotal = organBreakdown.reduce((sum, o) => sum + o.total, 0);
        const totalScreening = organBreakdown.reduce((sum, o) => sum + o.screeningCost, 0);
        const totalProcedure = organBreakdown.reduce((sum, o) => sum + o.procedureCost, 0);
        const totalTransport = organBreakdown.reduce((sum, o) => sum + o.transportCost, 0);
        const totalHospital = organBreakdown.reduce((sum, o) => sum + o.hospitalStay, 0);

        let riskLevel = 'Low';
        const combinedFactor = ageFactor * habitFactor * medicalFactor;
        if (combinedFactor > 1.6) riskLevel = 'High';
        else if (combinedFactor > 1.2) riskLevel = 'Moderate';

        return { organBreakdown, grandTotal, totalScreening, totalProcedure, totalTransport, totalHospital, age, ageFactor, habitFactor, medicalFactor, riskLevel };
    };

    const costEstimate = calculateCostEstimate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox' && name === 'consent') {
            setForm(prev => ({ ...prev, consent: checked }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const toggleOrgan = (organId) => {
        setForm(prev => ({
            ...prev,
            organs: prev.organs.includes(organId)
                ? prev.organs.filter(id => id !== organId)
                : [...prev.organs, organId],
        }));
        if (errors.organs) {
            setErrors(prev => ({ ...prev, organs: '' }));
        }
    };

    const validateStep = () => {
        const newErrors = {};

        if (step === 1) {
            if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
            if (!form.email.trim()) newErrors.email = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email';
            if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
            else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = 'Enter a 10-digit phone number';
            if (!form.dob) newErrors.dob = 'Date of birth is required';
            if (!form.gender) newErrors.gender = 'Please select your gender';
            if (!form.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
        }

        if (step === 2) {
            if (!form.address.trim()) newErrors.address = 'Address is required';
            if (!form.city.trim()) newErrors.city = 'City is required';
            if (!form.state.trim()) newErrors.state = 'State is required';
            if (!form.pincode.trim()) newErrors.pincode = 'Pincode is required';
            else if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = 'Enter a 6-digit pincode';
        }

        if (step === 3) {
            if (form.organs.length === 0) newErrors.organs = 'Select at least one organ to pledge';
            if (!form.donationType) newErrors.donationType = 'Please select donation type';
        }

        if (step === 4) {
            if (!form.emergencyName.trim()) newErrors.emergencyName = 'Emergency contact name is required';
            if (!form.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency contact phone is required';
            else if (!/^\d{10}$/.test(form.emergencyPhone)) newErrors.emergencyPhone = 'Enter a 10-digit phone number';
            if (!form.consent) newErrors.consent = 'You must agree to the terms';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep()) {
            registerDonor(form);
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <>
                <section className="page-header">
                    <div className="page-header__bg-pattern" />
                    <div className="container">
                        <span className="section-label">✅ Registration Complete</span>
                        <h1 className="page-header__title">Thank You, {form.fullName}!</h1>
                    </div>
                </section>
                <section className="donor-success">
                    <div className="container">
                        <div className="donor-success__card">
                            <div className="donor-success__icon">🎉</div>
                            <h2>You Are Now a Registered Organ Donor</h2>
                            <p>Your pledge to donate has been recorded successfully. You are a hero to someone waiting for a second chance at life.</p>

                            <div className="donor-success__summary">
                                <h3>Registration Summary</h3>
                                <div className="donor-success__details">
                                    <div className="donor-success__detail">
                                        <span className="donor-success__label">Name</span>
                                        <span className="donor-success__value">{form.fullName}</span>
                                    </div>
                                    <div className="donor-success__detail">
                                        <span className="donor-success__label">Email</span>
                                        <span className="donor-success__value">{form.email}</span>
                                    </div>
                                    <div className="donor-success__detail">
                                        <span className="donor-success__label">Blood Group</span>
                                        <span className="donor-success__value">{form.bloodGroup}</span>
                                    </div>
                                    <div className="donor-success__detail">
                                        <span className="donor-success__label">Donation Type</span>
                                        <span className="donor-success__value">{form.donationType === 'living' ? 'Living Donor' : form.donationType === 'posthumous' ? 'Posthumous' : 'Both'}</span>
                                    </div>
                                    <div className="donor-success__detail">
                                        <span className="donor-success__label">Organs Pledged</span>
                                        <span className="donor-success__value">
                                            {form.organs.map(id => organDonations.find(o => o.id === id)?.organ).join(', ')}
                                        </span>
                                    </div>
                                    <div className="donor-success__detail">
                                        <span className="donor-success__label">Location</span>
                                        <span className="donor-success__value">{form.city}, {form.state}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="donor-success__next-steps">
                                <h3>What Happens Next?</h3>
                                <div className="donor-success__steps">
                                    <div className="donor-success__step">
                                        <span className="donor-success__step-num">1</span>
                                        <div>
                                            <strong>Confirmation Email</strong>
                                            <p>You will receive a confirmation email with your donor ID and card.</p>
                                        </div>
                                    </div>
                                    <div className="donor-success__step">
                                        <span className="donor-success__step-num">2</span>
                                        <div>
                                            <strong>Medical Screening</strong>
                                            <p>A nearby hospital will contact you for a basic health screening.</p>
                                        </div>
                                    </div>
                                    <div className="donor-success__step">
                                        <span className="donor-success__step-num">3</span>
                                        <div>
                                            <strong>Donor Card</strong>
                                            <p>Your official donor card will be mailed to your registered address.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <a href="/campaigns" className="donor-success__btn">Back to Donar</a>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            {/* Header */}
            <section className="page-header">
                <div className="page-header__bg-pattern" />
                <div className="container">
                    <span className="section-label">🩺 Donor Registration</span>
                    <h1 className="page-header__title">Register as an Organ Donor</h1>
                    <p className="page-header__subtitle">
                        Fill in your details to pledge your organs and become a life-saving hero. The process is simple and takes just a few minutes.
                    </p>
                </div>
            </section>

            {/* Progress */}
            <section className="donor-progress-section">
                <div className="container">
                    <div className="donor-progress">
                        {[
                            { num: 1, label: 'Personal Info' },
                            { num: 2, label: 'Address' },
                            { num: 3, label: 'Organ Selection' },
                            { num: 4, label: 'Confirm & Submit' },
                        ].map(s => (
                            <div key={s.num} className={`donor-progress__step ${step >= s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}>
                                <div className="donor-progress__circle">
                                    {step > s.num ? '✓' : s.num}
                                </div>
                                <span className="donor-progress__label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form */}
            <section className="donor-form-section">
                <div className="container">
                    <form className="donor-form" onSubmit={handleSubmit} noValidate>

                        {/* Step 1: Personal Info */}
                        {step === 1 && (
                            <div className="donor-form__step animate-fadeInUp">
                                <h2 className="donor-form__step-title">📋 Personal Information</h2>
                                <div className="donor-form__grid">
                                    <div className="donor-form__field">
                                        <label>Full Name *</label>
                                        <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter your full name" />
                                        {errors.fullName && <span className="donor-form__error">{errors.fullName}</span>}
                                    </div>
                                    <div className="donor-form__field">
                                        <label>Email Address *</label>
                                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                                        {errors.email && <span className="donor-form__error">{errors.email}</span>}
                                    </div>
                                    <div className="donor-form__field">
                                        <label>Phone Number *</label>
                                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit phone number" maxLength={10} />
                                        {errors.phone && <span className="donor-form__error">{errors.phone}</span>}
                                    </div>
                                    <div className="donor-form__field">
                                        <label>Date of Birth *</label>
                                        <input type="date" name="dob" value={form.dob} onChange={handleChange} />
                                        {errors.dob && <span className="donor-form__error">{errors.dob}</span>}
                                    </div>
                                    <div className="donor-form__field">
                                        <label>Gender *</label>
                                        <select name="gender" value={form.gender} onChange={handleChange}>
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {errors.gender && <span className="donor-form__error">{errors.gender}</span>}
                                    </div>
                                    <div className="donor-form__field">
                                        <label>Blood Group *</label>
                                        <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                        {errors.bloodGroup && <span className="donor-form__error">{errors.bloodGroup}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Address */}
                        {step === 2 && (
                            <div className="donor-form__step animate-fadeInUp">
                                <h2 className="donor-form__step-title">🏠 Address Information</h2>
                                <div className="donor-form__grid">
                                    <div className="donor-form__field donor-form__field--full">
                                        <label>Full Address *</label>
                                        <textarea name="address" value={form.address} onChange={handleChange} placeholder="Street address, building, landmark" rows={3} />
                                        {errors.address && <span className="donor-form__error">{errors.address}</span>}
                                    </div>
                                    <div className="donor-form__field">
                                        <label>City *</label>
                                        <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="Your city" />
                                        {errors.city && <span className="donor-form__error">{errors.city}</span>}
                                    </div>
                                    <div className="donor-form__field">
                                        <label>State *</label>
                                        <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="Your state" />
                                        {errors.state && <span className="donor-form__error">{errors.state}</span>}
                                    </div>
                                    <div className="donor-form__field">
                                        <label>Pincode *</label>
                                        <input type="text" name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" maxLength={6} />
                                        {errors.pincode && <span className="donor-form__error">{errors.pincode}</span>}
                                    </div>
                                    <div className="donor-form__field">
                                        <label>Aadhaar Number (Optional)</label>
                                        <input type="text" name="aadhaar" value={form.aadhaar} onChange={handleChange} placeholder="12-digit Aadhaar (optional)" maxLength={12} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Organ Selection */}
                        {step === 3 && (
                            <div className="donor-form__step animate-fadeInUp">
                                <h2 className="donor-form__step-title">🫀 Select Organs to Pledge</h2>
                                <p className="donor-form__step-desc">Choose one or more organs you wish to pledge for donation.</p>

                                <div className="donor-form__field" style={{ marginBottom: 24 }}>
                                    <label>Donation Type *</label>
                                    <div className="donor-form__radio-group">
                                        {[
                                            { value: 'living', label: '💚 Living Donor' },
                                            { value: 'posthumous', label: '🕊️ After Death' },
                                            { value: 'both', label: '🌟 Both' },
                                        ].map(opt => (
                                            <label key={opt.value} className={`donor-form__radio ${form.donationType === opt.value ? 'active' : ''}`}>
                                                <input type="radio" name="donationType" value={opt.value} checked={form.donationType === opt.value} onChange={handleChange} />
                                                {opt.label}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.donationType && <span className="donor-form__error">{errors.donationType}</span>}
                                </div>

                                <div className="donor-organ-selector">
                                    {organDonations.map(organ => (
                                        <div
                                            key={organ.id}
                                            className={`donor-organ-option ${form.organs.includes(organ.id) ? 'selected' : ''}`}
                                            onClick={() => toggleOrgan(organ.id)}
                                        >
                                            <div className="donor-organ-option__img-wrap">
                                                <img src={organ.image} alt={organ.organ} loading="lazy" />
                                            </div>
                                            <div className="donor-organ-option__info">
                                                <span className="donor-organ-option__icon">{organ.icon}</span>
                                                <span className="donor-organ-option__name">{organ.organ}</span>
                                                {organ.livingDonor && <span className="donor-organ-option__tag">Living OK</span>}
                                            </div>
                                            <div className="donor-organ-option__check">
                                                {form.organs.includes(organ.id) ? '✅' : '⬜'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.organs && <span className="donor-form__error">{errors.organs}</span>}

                                <div className="donor-form__field donor-form__field--full" style={{ marginTop: 24 }}>
                                    <label>Any Medical Conditions? (Optional)</label>
                                    <textarea name="medicalConditions" value={form.medicalConditions} onChange={handleChange} placeholder="List any medical conditions, surgeries, or medications..." rows={3} />
                                </div>

                                {/* Screening Questions */}
                                <div className="donor-screening">
                                    <h3 className="donor-screening__title">🩺 Health Screening (for Cost Estimation)</h3>
                                    <p className="donor-screening__desc">These details help us estimate the lowest possible cost for your organ donation procedure.</p>
                                    <div className="donor-form__grid">
                                        <div className="donor-form__field">
                                            <label>Smoking Habit</label>
                                            <select name="smoking" value={form.smoking} onChange={handleChange}>
                                                <option value="">Select</option>
                                                <option value="never">Never Smoked</option>
                                                <option value="quit">Quit (More than 1 year ago)</option>
                                                <option value="occasional">Occasional</option>
                                                <option value="regular">Regular Smoker</option>
                                            </select>
                                        </div>
                                        <div className="donor-form__field">
                                            <label>Alcohol Consumption</label>
                                            <select name="alcohol" value={form.alcohol} onChange={handleChange}>
                                                <option value="">Select</option>
                                                <option value="never">Never</option>
                                                <option value="social">Social / Occasional</option>
                                                <option value="moderate">Moderate (Weekly)</option>
                                                <option value="heavy">Heavy / Daily</option>
                                            </select>
                                        </div>
                                        <div className="donor-form__field">
                                            <label>Chronic Disease History</label>
                                            <select name="chronicDisease" value={form.chronicDisease} onChange={handleChange}>
                                                <option value="">Select</option>
                                                <option value="none">None</option>
                                                <option value="diabetes">Diabetes</option>
                                                <option value="hypertension">Hypertension</option>
                                                <option value="heart">Heart Disease</option>
                                                <option value="liver">Liver Disease</option>
                                                <option value="kidney">Kidney Disease</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="donor-form__field">
                                            <label>Previous Surgery</label>
                                            <select name="previousSurgery" value={form.previousSurgery} onChange={handleChange}>
                                                <option value="">Select</option>
                                                <option value="none">No Previous Surgery</option>
                                                <option value="minor">Minor Surgery</option>
                                                <option value="major">Major Surgery</option>
                                                <option value="organ">Organ-related Surgery</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Confirmation */}
                        {step === 4 && (
                            <div className="donor-form__step animate-fadeInUp">
                                <h2 className="donor-form__step-title">✅ Emergency Contact & Confirmation</h2>

                                <div className="donor-form__grid">
                                    <div className="donor-form__field">
                                        <label>Emergency Contact Name *</label>
                                        <input type="text" name="emergencyName" value={form.emergencyName} onChange={handleChange} placeholder="Name of emergency contact" />
                                        {errors.emergencyName && <span className="donor-form__error">{errors.emergencyName}</span>}
                                    </div>
                                    <div className="donor-form__field">
                                        <label>Emergency Contact Phone *</label>
                                        <input type="tel" name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} placeholder="10-digit phone" maxLength={10} />
                                        {errors.emergencyPhone && <span className="donor-form__error">{errors.emergencyPhone}</span>}
                                    </div>
                                </div>

                                {/* Review Summary */}
                                <div className="donor-review">
                                    <h3>Review Your Details</h3>
                                    <div className="donor-review__grid">
                                        <div className="donor-review__item">
                                            <span className="donor-review__label">Name</span>
                                            <span className="donor-review__value">{form.fullName}</span>
                                        </div>
                                        <div className="donor-review__item">
                                            <span className="donor-review__label">Email</span>
                                            <span className="donor-review__value">{form.email}</span>
                                        </div>
                                        <div className="donor-review__item">
                                            <span className="donor-review__label">Phone</span>
                                            <span className="donor-review__value">{form.phone}</span>
                                        </div>
                                        <div className="donor-review__item">
                                            <span className="donor-review__label">Blood Group</span>
                                            <span className="donor-review__value">{form.bloodGroup}</span>
                                        </div>
                                        <div className="donor-review__item">
                                            <span className="donor-review__label">City</span>
                                            <span className="donor-review__value">{form.city}, {form.state}</span>
                                        </div>
                                        <div className="donor-review__item">
                                            <span className="donor-review__label">Donation Type</span>
                                            <span className="donor-review__value">{form.donationType === 'living' ? 'Living' : form.donationType === 'posthumous' ? 'Posthumous' : 'Both'}</span>
                                        </div>
                                        <div className="donor-review__item donor-review__item--full">
                                            <span className="donor-review__label">Organs Pledged</span>
                                            <span className="donor-review__value">
                                                {form.organs.map(id => organDonations.find(o => o.id === id)?.organ).join(', ') || 'None selected'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* ──── COST DISTRIBUTION ──── */}
                                {costEstimate && (
                                    <div className="donor-cost">
                                        <div className="donor-cost__header">
                                            <h3 className="donor-cost__title">💰 Estimated Cost Distribution (Lowest Estimate)</h3>
                                            <p className="donor-cost__subtitle">Auto-calculated based on your age ({costEstimate.age} yrs), habits, and medical history screening</p>
                                            <div className="donor-cost__risk-wrap">
                                                <span className="donor-cost__risk-label">Screening Risk Level:</span>
                                                <span className={`donor-cost__risk-badge donor-cost__risk-badge--${costEstimate.riskLevel.toLowerCase()}`}>
                                                    {costEstimate.riskLevel === 'Low' ? '🟢' : costEstimate.riskLevel === 'Moderate' ? '🟡' : '🔴'} {costEstimate.riskLevel}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Per-Organ Breakdown */}
                                        <div className="donor-cost__organs">
                                            {costEstimate.organBreakdown.map(organ => (
                                                <div key={organ.id} className="donor-cost__organ-card">
                                                    <div className="donor-cost__organ-header">
                                                        <span className="donor-cost__organ-name">{organDonations.find(o => o.id === organ.id)?.icon} {organ.name}</span>
                                                        <span className="donor-cost__organ-total">₹{organ.total.toLocaleString('en-IN')}</span>
                                                    </div>
                                                    <div className="donor-cost__organ-bars">
                                                        <div className="donor-cost__bar-item">
                                                            <div className="donor-cost__bar-label">
                                                                <span>🩺 Screening</span>
                                                                <span>₹{organ.screeningCost.toLocaleString('en-IN')}</span>
                                                            </div>
                                                            <div className="donor-cost__bar">
                                                                <div className="donor-cost__bar-fill donor-cost__bar-fill--screening" style={{ width: `${(organ.screeningCost / organ.total) * 100}%` }} />
                                                            </div>
                                                        </div>
                                                        <div className="donor-cost__bar-item">
                                                            <div className="donor-cost__bar-label">
                                                                <span>⚕️ Procedure</span>
                                                                <span>₹{organ.procedureCost.toLocaleString('en-IN')}</span>
                                                            </div>
                                                            <div className="donor-cost__bar">
                                                                <div className="donor-cost__bar-fill donor-cost__bar-fill--procedure" style={{ width: `${(organ.procedureCost / organ.total) * 100}%` }} />
                                                            </div>
                                                        </div>
                                                        <div className="donor-cost__bar-item">
                                                            <div className="donor-cost__bar-label">
                                                                <span>🚑 Transport</span>
                                                                <span>₹{organ.transportCost.toLocaleString('en-IN')}</span>
                                                            </div>
                                                            <div className="donor-cost__bar">
                                                                <div className="donor-cost__bar-fill donor-cost__bar-fill--transport" style={{ width: `${(organ.transportCost / organ.total) * 100}%` }} />
                                                            </div>
                                                        </div>
                                                        <div className="donor-cost__bar-item">
                                                            <div className="donor-cost__bar-label">
                                                                <span>🏥 Hospital Stay</span>
                                                                <span>₹{organ.hospitalStay.toLocaleString('en-IN')}</span>
                                                            </div>
                                                            <div className="donor-cost__bar">
                                                                <div className="donor-cost__bar-fill donor-cost__bar-fill--hospital" style={{ width: `${(organ.hospitalStay / organ.total) * 100}%` }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Summary Totals */}
                                        <div className="donor-cost__summary">
                                            <div className="donor-cost__summary-row">
                                                <span>🩺 Total Screening</span>
                                                <span>₹{costEstimate.totalScreening.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="donor-cost__summary-row">
                                                <span>⚕️ Total Procedure</span>
                                                <span>₹{costEstimate.totalProcedure.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="donor-cost__summary-row">
                                                <span>🚑 Total Transport</span>
                                                <span>₹{costEstimate.totalTransport.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="donor-cost__summary-row">
                                                <span>🏥 Total Hospital Stay</span>
                                                <span>₹{costEstimate.totalHospital.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="donor-cost__summary-row donor-cost__summary-row--total">
                                                <span>💰 Grand Total (Lowest Estimate)</span>
                                                <span>₹{costEstimate.grandTotal.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>

                                        {/* Factors Applied */}
                                        <div className="donor-cost__factors">
                                            <h4>📊 Screening Factors Applied</h4>
                                            <div className="donor-cost__factors-grid">
                                                <div className="donor-cost__factor">
                                                    <span className="donor-cost__factor-label">Age Factor</span>
                                                    <span className="donor-cost__factor-value">{costEstimate.ageFactor.toFixed(2)}x</span>
                                                    <span className="donor-cost__factor-note">{costEstimate.age} years old</span>
                                                </div>
                                                <div className="donor-cost__factor">
                                                    <span className="donor-cost__factor-label">Habit Factor</span>
                                                    <span className="donor-cost__factor-value">{costEstimate.habitFactor.toFixed(2)}x</span>
                                                    <span className="donor-cost__factor-note">Smoking & Alcohol</span>
                                                </div>
                                                <div className="donor-cost__factor">
                                                    <span className="donor-cost__factor-label">Medical Factor</span>
                                                    <span className="donor-cost__factor-value">{costEstimate.medicalFactor.toFixed(2)}x</span>
                                                    <span className="donor-cost__factor-note">History & Surgery</span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="donor-cost__disclaimer">⚠️ This is an automated lowest estimate based on your screening data. Actual costs may vary depending on the hospital, city, and specific medical conditions. Many government programs cover organ donation costs.</p>
                                    </div>
                                )}

                                {/* Consent */}
                                <label className={`donor-form__consent ${errors.consent ? 'donor-form__consent--error' : ''}`}>
                                    <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} />
                                    <span>I hereby voluntarily pledge to donate my organs as selected above. I understand this is a registration of intent and actual donation will follow medical and legal protocols. I confirm that all information provided is accurate.</span>
                                </label>
                                {errors.consent && <span className="donor-form__error">{errors.consent}</span>}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="donor-form__actions">
                            {step > 1 && (
                                <button type="button" className="donor-form__btn donor-form__btn--back" onClick={prevStep}>
                                    ← Previous
                                </button>
                            )}
                            <div style={{ flex: 1 }} />
                            {step < totalSteps ? (
                                <button type="button" className="donor-form__btn donor-form__btn--next" onClick={nextStep}>
                                    Next Step →
                                </button>
                            ) : (
                                <button type="submit" className="donor-form__btn donor-form__btn--submit">
                                    🎉 Complete Registration
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}
