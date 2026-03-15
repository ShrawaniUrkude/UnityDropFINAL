import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    Building2,
    KeyRound,
    LayoutDashboard,
    LogOut,
    ShieldCheck,
    Stethoscope,
    UserRound,
    UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthPortal.css';

const roleOptions = [
    {
        key: 'patient',
        label: 'Patient',
        subtitle: 'Book treatment guidance and manage your care journey.',
        icon: UserRound,
        accent: '#0ea5e9',
        demoEmail: 'patient@unitydrop.demo',
        demoPassword: 'patient123',
    },
    {
        key: 'doctor',
        label: 'Doctor',
        subtitle: 'Review treatment workflows and access care coordination tools.',
        icon: Stethoscope,
        accent: '#10b981',
        demoEmail: 'doctor@unitydrop.demo',
        demoPassword: 'doctor123',
    },
    {
        key: 'hospital',
        label: 'Hospital',
        subtitle: 'Coordinate emergency support and hospital-side operations.',
        icon: Building2,
        accent: '#f59e0b',
        demoEmail: 'hospital@unitydrop.demo',
        demoPassword: 'hospital123',
    },
];

const emptyForm = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
};

export default function AuthPortal() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, loading, login, register, logout, getHomeRoute } = useAuth();

    const [mode, setMode] = useState('login');
    const [activeRole, setActiveRole] = useState('patient');
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState('');

    const activeRoleData = useMemo(
        () => roleOptions.find((option) => option.key === activeRole) || roleOptions[0],
        [activeRole]
    );

    const targetPath = location.state?.from?.pathname || getHomeRoute(activeRole);

    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const loadDemoCredentials = () => {
        setForm((prev) => ({
            ...prev,
            email: activeRoleData.demoEmail,
            password: activeRoleData.demoPassword,
        }));
        setMode('login');
        setError('');
    };

    const resetForm = () => {
        setForm(emptyForm);
        setError('');
    };

    const handleModeChange = (nextMode) => {
        setMode(nextMode);
        resetForm();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            if (mode === 'register') {
                if (form.password !== form.confirmPassword) {
                    setError('Password and confirm password do not match.');
                    return;
                }

                const session = await register({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    password: form.password,
                    role: activeRole,
                });
                navigate(getHomeRoute(session.role), { replace: true });
                return;
            }

            await login({
                email: form.email.trim(),
                password: form.password,
                role: activeRole,
            });
            navigate(targetPath, { replace: true });
        } catch (submitError) {
            setError(submitError.message || 'Authentication failed.');
        }
    };

    if (isAuthenticated && user) {
        const roleLabel = roleOptions.find((option) => option.key === user.role)?.label || user.role;

        return (
            <main className="auth-portal auth-portal--session">
                <section className="auth-portal__card auth-portal__card--session">
                    <div className="auth-portal__eyebrow"><ShieldCheck size={16} /> Active Session</div>
                    <h1 className="auth-portal__title">Signed in as {user.name}</h1>
                    <p className="auth-portal__subtitle">
                        Role: <strong>{roleLabel}</strong> · Email: <strong>{user.email}</strong>
                    </p>
                    <div className="auth-portal__session-actions">
                        <button
                            type="button"
                            className="auth-portal__primary-btn"
                            onClick={() => navigate(getHomeRoute(user.role))}
                        >
                            <LayoutDashboard size={18} /> Open Workspace
                        </button>
                        <button type="button" className="auth-portal__ghost-btn" onClick={logout}>
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="auth-portal">
            <section className="auth-portal__hero">
                <div className="auth-portal__copy">
                    <span className="auth-portal__eyebrow"><ShieldCheck size={16} /> Secure Role Access</span>
                    <h1 className="auth-portal__title">Hospital, patient, and doctor login in one place.</h1>
                    <p className="auth-portal__subtitle">
                        Pick your role, sign in, and go straight to the part of UnityDrop built for your workflow.
                    </p>
                    <div className="auth-portal__demo-box">
                        <p className="auth-portal__demo-title">Quick demo for {activeRoleData.label}</p>
                        <p>{activeRoleData.demoEmail}</p>
                        <p>{activeRoleData.demoPassword}</p>
                        <button type="button" className="auth-portal__demo-btn" onClick={loadDemoCredentials}>
                            Use Demo Credentials
                        </button>
                    </div>
                </div>

                <div className="auth-portal__panel">
                    <div className="auth-portal__role-grid">
                        {roleOptions.map((option) => {
                            const Icon = option.icon;
                            const isActive = option.key === activeRole;
                            return (
                                <button
                                    key={option.key}
                                    type="button"
                                    className={`auth-role-card ${isActive ? 'auth-role-card--active' : ''}`}
                                    onClick={() => {
                                        setActiveRole(option.key);
                                        setError('');
                                    }}
                                    style={{ '--auth-role-accent': option.accent }}
                                >
                                    <span className="auth-role-card__icon"><Icon size={20} /></span>
                                    <span className="auth-role-card__label">{option.label}</span>
                                    <span className="auth-role-card__subtitle">{option.subtitle}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="auth-portal__mode-switch">
                        <button
                            type="button"
                            className={mode === 'login' ? 'is-active' : ''}
                            onClick={() => handleModeChange('login')}
                        >
                            <KeyRound size={16} /> Login
                        </button>
                        <button
                            type="button"
                            className={mode === 'register' ? 'is-active' : ''}
                            onClick={() => handleModeChange('register')}
                        >
                            <UserPlus size={16} /> Register
                        </button>
                    </div>

                    <form className="auth-portal__form" onSubmit={handleSubmit}>
                        {mode === 'register' && (
                            <>
                                <label>
                                    <span>Full name</span>
                                    <input
                                        value={form.name}
                                        onChange={(event) => updateField('name', event.target.value)}
                                        placeholder={`Enter ${activeRoleData.label.toLowerCase()} name`}
                                        required
                                    />
                                </label>
                                <label>
                                    <span>Phone</span>
                                    <input
                                        value={form.phone}
                                        onChange={(event) => updateField('phone', event.target.value)}
                                        placeholder="Enter phone number"
                                        required
                                    />
                                </label>
                            </>
                        )}

                        <label>
                            <span>Email</span>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(event) => updateField('email', event.target.value)}
                                placeholder="name@example.com"
                                required
                            />
                        </label>

                        <label>
                            <span>Password</span>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(event) => updateField('password', event.target.value)}
                                placeholder="Enter password"
                                required
                                minLength={6}
                            />
                        </label>

                        {mode === 'register' && (
                            <label>
                                <span>Confirm password</span>
                                <input
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={(event) => updateField('confirmPassword', event.target.value)}
                                    placeholder="Confirm password"
                                    required
                                    minLength={6}
                                />
                            </label>
                        )}

                        {error && <p className="auth-portal__error">{error}</p>}

                        <button type="submit" className="auth-portal__primary-btn" disabled={loading}>
                            {mode === 'login' ? <KeyRound size={18} /> : <UserPlus size={18} />}
                            {loading ? 'Please wait...' : mode === 'login' ? `Login as ${activeRoleData.label}` : `Register as ${activeRoleData.label}`}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p className="auth-portal__footer-note">
                        Want the public site instead? <Link to="/">Return home</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
