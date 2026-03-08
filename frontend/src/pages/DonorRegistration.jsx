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
