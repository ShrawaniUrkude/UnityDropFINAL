import { useState } from 'react';
import { campaigns } from '../data/mockData';
import './Dashboard.css';

const totalRaised = campaigns.reduce((s, c) => s + c.raised, 0);
const totalDonors = campaigns.reduce((s, c) => s + c.donors, 0);

const recentDonations = [
    { name: 'Ramesh Kumar', amount: 5000, campaign: 'Winter Warmth Drive', time: '2 min ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh' },
    { name: 'TechCorp CSR', amount: 50000, campaign: 'Food Bank for Flood Victims', time: '15 min ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp' },
    { name: 'Anjali Singh', amount: 2500, campaign: 'Education Kit Drive', time: '1h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali' },
    { name: 'Vikram Patel', amount: 10000, campaign: 'Clean Water Initiative', time: '2h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram' },
    { name: 'Priya Sharma', amount: 1500, campaign: 'Senior Citizens Care', time: '3h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya2' },
];

const weeklyActivity = [
    { day: 'Mon', donations: 42, volunteers: 18 },
    { day: 'Tue', donations: 68, volunteers: 24 },
    { day: 'Wed', donations: 55, volunteers: 31 },
    { day: 'Thu', donations: 89, volunteers: 42 },
    { day: 'Fri', donations: 73, volunteers: 38 },
    { day: 'Sat', donations: 110, volunteers: 56 },
    { day: 'Sun', donations: 95, volunteers: 48 },
];

const maxDonations = Math.max(...weeklyActivity.map(d => d.donations));

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <main className="dashboard-page">
            {/* Header */}
            <section className="page-header">
                <div className="page-header__bg-pattern" />
                <div className="container">
                    <span className="section-label">Live</span>
                    <h1 className="page-header__title">Impact Dashboard</h1>
                    <p className="page-header__subtitle">Real-time transparency — watch donations flow from donors to beneficiaries.</p>
                </div>
            </section>

            <div className="container dashboard-body">
                {/* Tabs */}
                <div className="dashboard-tabs">
                    {['overview', 'campaigns', 'donations', 'volunteers'].map(tab => (
                        <button
                            key={tab}
                            className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* KPI Cards */}
                <div className="dashboard-kpi-grid">
                    {[
                        { icon: '💰', label: 'Total Raised', value: `₹${(totalRaised / 100000).toFixed(1)}L`, change: '+12.4%', up: true },
                        { icon: '👥', label: 'Total Donors', value: totalDonors.toLocaleString(), change: '+8.2%', up: true },
                        { icon: '📦', label: 'Active Campaigns', value: campaigns.length, change: '+2', up: true },
                        { icon: '🤝', label: 'Active Volunteers', value: '12,548', change: '+340', up: true },
                        { icon: '🏥', label: 'Verified NGOs', value: '340+', change: '+15', up: true },
                        { icon: '✅', label: 'Items Delivered', value: '84,200+', change: '+5.8%', up: true },
                        { icon: '🌍', label: 'States Covered', value: '28', change: '0', up: false },
                        { icon: '💯', label: 'Avg. Satisfaction', value: '4.8/5', change: '+0.1', up: true },
                    ].map((kpi, i) => (
                        <div key={i} className="dashboard-kpi card animate-fadeInUp" style={{ animationDelay: `${i * 60}ms` }}>
                            <div className="dashboard-kpi__icon">{kpi.icon}</div>
                            <div className="dashboard-kpi__content">
                                <p className="dashboard-kpi__label">{kpi.label}</p>
                                <strong className="dashboard-kpi__value">{kpi.value}</strong>
                                <span className={`dashboard-kpi__change ${kpi.up ? 'up' : 'neutral'}`}>
                                    {kpi.up ? '▲' : '—'} {kpi.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-main-grid">
                    {/* Activity Chart */}
                    <div className="dashboard-chart card">
                        <div className="dashboard-chart__header">
                            <h3>Weekly Donation Activity</h3>
                            <span className="badge badge-orange">Live</span>
                        </div>
                        <div className="dashboard-chart__bars">
                            {weeklyActivity.map((d, i) => (
                                <div key={i} className="dashboard-bar-col">
                                    <div className="dashboard-bar-wrap">
                                        <div
                                            className="dashboard-bar dashboard-bar--primary"
                                            style={{ height: `${(d.donations / maxDonations) * 140}px` }}
                                            title={`${d.donations} donations`}
                                        />
                                        <div
                                            className="dashboard-bar dashboard-bar--secondary"
                                            style={{ height: `${(d.volunteers / maxDonations) * 140}px` }}
                                            title={`${d.volunteers} volunteers`}
                                        />
                                    </div>
                                    <span className="dashboard-bar-label">{d.day}</span>
                                </div>
                            ))}
                        </div>
                        <div className="dashboard-chart__legend">
                            <span><span className="legend-dot" style={{ background: 'var(--primary)' }} /> Donations</span>
                            <span><span className="legend-dot" style={{ background: 'var(--teal)' }} /> Volunteers</span>
                        </div>
                    </div>

                    {/* Campaign Progress */}
                    <div className="dashboard-campaigns card">
                        <h3 className="dashboard-section-title">Campaign Progress</h3>
                        <div className="dashboard-campaign-list">
                            {campaigns.slice(0, 5).map((c, i) => {
                                const pct = Math.round((c.raised / c.goal) * 100);
                                return (
                                    <div key={i} className="dashboard-campaign-row">
                                        <div className="dashboard-campaign-info">
                                            <span className="dashboard-campaign-ngo">{c.ngoLogo}</span>
                                            <div>
                                                <p className="dashboard-campaign-title">{c.title}</p>
                                                <small>{c.location}</small>
                                            </div>
                                        </div>
                                        <div className="dashboard-campaign-progress">
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${pct}%` }} />
                                            </div>
                                            <div className="dashboard-campaign-pct">
                                                <span>{pct}%</span>
                                                <span>{c.daysLeft}d left</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Recent Donations Feed */}
                <div className="dashboard-feed card">
                    <div className="dashboard-feed__header">
                        <h3>Live Donation Feed</h3>
                        <span className="dashboard-live-dot">● LIVE</span>
                    </div>
                    <div className="dashboard-feed__list">
                        {recentDonations.map((d, i) => (
                            <div key={i} className="dashboard-feed__item animate-fadeInUp" style={{ animationDelay: `${i * 80}ms` }}>
                                <img src={d.avatar} alt={d.name} className="avatar" />
                                <div className="dashboard-feed__info">
                                    <strong>{d.name}</strong>
                                    <span>donated to <em>{d.campaign}</em></span>
                                </div>
                                <div className="dashboard-feed__amount">
                                    +₹{d.amount.toLocaleString()}
                                </div>
                                <div className="dashboard-feed__time">{d.time}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Donation Flow Tracker */}
                <div className="dashboard-tracker card">
                    <h3>Donation Flow Tracker</h3>
                    <p>Track how your contributions move from wallet to beneficiary.</p>
                    <div className="dashboard-tracker__flow">
                        {[
                            { icon: '💳', label: 'Donor', desc: 'Payment received & verified' },
                            { icon: '🏛️', label: 'Platform', desc: 'Allocation & routing' },
                            { icon: '🏥', label: 'NGO', desc: 'Procurement & packaging' },
                            { icon: '🤝', label: 'Volunteer', desc: 'Transport & coordination' },
                            { icon: '👨‍👩‍👧', label: 'Beneficiary', desc: 'Item received & verified' },
                        ].map((step, i, arr) => (
                            <div key={i} className="dashboard-flow-step">
                                <div className="dashboard-flow-icon">{step.icon}</div>
                                <p className="dashboard-flow-label">{step.label}</p>
                                <p className="dashboard-flow-desc">{step.desc}</p>
                                {i < arr.length - 1 && <div className="dashboard-flow-arrow">→</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
