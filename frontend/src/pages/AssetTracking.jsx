import { useState, useEffect, useRef } from 'react';
import { 
    LayoutDashboard, Settings, History, Package, CheckCircle, 
    Activity, Battery, MapPin, RefreshCw, Wifi, Clock,
    ChevronRight, AlertTriangle, Radio, Loader2
} from 'lucide-react';
import { equipmentAPI, historyAPI } from '../services/api';
import './AssetTracking.css';

// Equipment type icons
const equipmentIcons = {
    'Wheelchair': '♿',
    'Stretcher': '🛏️',
    'Oxygen Cylinder': '🫁',
    'IV Stand': '💉',
    'Defibrillator': '⚡',
    'Monitor': '📟'
};

// Zone colors
const zoneColors = {
    'Emergency Room': { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', dot: '#ef4444' },
    'ICU': { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', dot: '#f59e0b' },
    'Ward A': { bg: 'rgba(34, 197, 94, 0.15)', border: '#22c55e', dot: '#22c55e' },
    'Ward B': { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', dot: '#3b82f6' },
    'Corridor': { bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7', dot: '#a855f7' },
    'Radiology': { bg: 'rgba(236, 72, 153, 0.15)', border: '#ec4899', dot: '#ec4899' }
};

export default function AssetTracking() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [equipment, setEquipment] = useState([]);
    const [stats, setStats] = useState({ total: 0, available: 0, inUse: 0, lowBattery: 0 });
    const [zoneStats, setZoneStats] = useState({});
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAutoRefresh, setIsAutoRefresh] = useState(true);
    const refreshIntervalRef = useRef(null);

    // Fetch data
    const fetchData = async () => {
        try {
            const [equipmentRes, historyRes] = await Promise.all([
                equipmentAPI.getAll(),
                historyAPI.getAll({ limit: 20 })
            ]);
            
            if (equipmentRes.success) {
                setEquipment(equipmentRes.data);
                setStats(equipmentRes.stats);
                setZoneStats(equipmentRes.zoneStats || {});
            }
            
            if (historyRes.success) {
                setHistory(historyRes.data);
            }
            
            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    // Seed data
    const seedData = async () => {
        try {
            setLoading(true);
            await equipmentAPI.seed();
            await fetchData();
        } catch (err) {
            setError('Failed to seed data');
        }
    };

    // Auto-refresh
    useEffect(() => {
        fetchData();
        
        if (isAutoRefresh) {
            refreshIntervalRef.current = setInterval(fetchData, 5000);
        }
        
        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [isAutoRefresh]);

    // Group equipment by zone
    const equipmentByZone = equipment.reduce((acc, eq) => {
        if (!acc[eq.location]) acc[eq.location] = [];
        acc[eq.location].push(eq);
        return acc;
    }, {});

    // Format time ago
    const formatTimeAgo = (date) => {
        if (!date) return 'N/A';
        const now = new Date();
        const diff = Math.floor((now - new Date(date)) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        return `${Math.floor(diff / 3600)}h ago`;
    };

    const zones = ['Emergency Room', 'ICU', 'Corridor', 'Ward A', 'Ward B', 'Radiology'];

    return (
        <div className="asset-tracking-page">
            {/* Sidebar */}
            <aside className="at-sidebar">
                <div className="at-sidebar-header">
                    <Radio size={24} className="at-logo-icon" />
                    <div className="at-logo-text">
                        <span className="at-logo-title">BLE Tracker</span>
                        <span className="at-logo-subtitle">Hospital Assets</span>
                    </div>
                </div>
                <nav className="at-nav">
                    <button 
                        className={`at-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </button>
                    <button 
                        className={`at-nav-item ${activeTab === 'equipment' ? 'active' : ''}`}
                        onClick={() => setActiveTab('equipment')}
                    >
                        <Settings size={18} />
                        <span>Equipment</span>
                    </button>
                    <button 
                        className={`at-nav-item ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <History size={18} />
                        <span>Movement History</span>
                    </button>
                </nav>
                <div className="at-sidebar-footer">
                    <div className="at-auto-refresh">
                        <span>Auto Refresh</span>
                        <label className="at-toggle">
                            <input 
                                type="checkbox" 
                                checked={isAutoRefresh}
                                onChange={() => setIsAutoRefresh(!isAutoRefresh)}
                            />
                            <span className="at-toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="at-main">
                {/* Page Header */}
                <div className="at-page-header">
                    <div className="at-header-left">
                        <h1>Indoor Asset Tracking</h1>
                        <p>Real-time BLE beacon simulation for hospital equipment</p>
                    </div>
                    <div className="at-header-right">
                        {loading && (
                            <div className="at-loading-indicator">
                                <Loader2 size={16} className="at-spinner" />
                                <span>Syncing...</span>
                            </div>
                        )}
                        <div className="at-live-badge">
                            <span className="at-pulse"></span>
                            LIVE
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="at-stats-grid">
                    <div className="at-stat-card">
                        <div className="at-stat-icon blue">
                            <Package size={24} />
                        </div>
                        <div className="at-stat-content">
                            <span className="at-stat-value">{stats.total}</span>
                            <span className="at-stat-label">Total Equipment</span>
                        </div>
                    </div>
                    <div className="at-stat-card">
                        <div className="at-stat-icon green">
                            <CheckCircle size={24} />
                        </div>
                        <div className="at-stat-content">
                            <span className="at-stat-value">{stats.available}</span>
                            <span className="at-stat-label">Available</span>
                        </div>
                    </div>
                    <div className="at-stat-card">
                        <div className="at-stat-icon orange">
                            <Activity size={24} />
                        </div>
                        <div className="at-stat-content">
                            <span className="at-stat-value">{stats.inUse}</span>
                            <span className="at-stat-label">In Use</span>
                        </div>
                    </div>
                    <div className="at-stat-card">
                        <div className="at-stat-icon teal">
                            <Battery size={24} />
                        </div>
                        <div className="at-stat-content">
                            <span className="at-stat-value">{stats.lowBattery}</span>
                            <span className="at-stat-label">Low Battery</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="at-error">
                        <AlertTriangle size={18} />
                        <span>{error}</span>
                        <button onClick={seedData}>Seed Data</button>
                    </div>
                )}

                {activeTab === 'dashboard' && (
                    <div className="at-dashboard-content">
                        {/* Floor Plan */}
                        <div className="at-floor-plan-section">
                            <div className="at-section-header">
                                <h3><MapPin size={18} /> Hospital Floor Plan — Live Equipment</h3>
                            </div>
                            <div className="at-floor-grid">
                                {zones.map(zone => {
                                    const zoneEquipment = equipmentByZone[zone] || [];
                                    const colors = zoneColors[zone];
                                    return (
                                        <div 
                                            key={zone} 
                                            className="at-zone-card"
                                            style={{ 
                                                background: colors.bg,
                                                borderColor: colors.border
                                            }}
                                        >
                                            <div className="at-zone-header">
                                                <span className="at-zone-dot" style={{ background: colors.dot }}></span>
                                                <span className="at-zone-name">{zone}</span>
                                                <span className="at-zone-count">{zoneEquipment.length} device{zoneEquipment.length !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="at-zone-equipment">
                                                {zoneEquipment.map(eq => (
                                                    <div 
                                                        key={eq.device_id} 
                                                        className={`at-equipment-chip ${eq.status === 'In Use' ? 'in-use' : ''}`}
                                                        title={`${eq.device_id} - ${eq.equipment_type} (${eq.status})`}
                                                    >
                                                        <span className="at-eq-icon">{equipmentIcons[eq.equipment_type] || '📦'}</span>
                                                        <span className="at-eq-id">{eq.device_id}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="at-floor-footer">
                                <Wifi size={12} />
                                <span>Live BLE tracking simulation — updates every 5-8 seconds</span>
                            </div>
                        </div>

                        {/* Zone Overview */}
                        <div className="at-zone-overview">
                            <div className="at-section-header">
                                <h3><LayoutDashboard size={18} /> Zone Overview</h3>
                            </div>
                            <div className="at-zone-stats-grid">
                                {zones.map(zone => {
                                    const count = (equipmentByZone[zone] || []).length;
                                    const colors = zoneColors[zone];
                                    const maxDevices = Math.max(...Object.values(equipmentByZone).map(arr => arr.length), 1);
                                    const percentage = (count / maxDevices) * 100;
                                    
                                    return (
                                        <div key={zone} className="at-zone-stat-item">
                                            <div className="at-zone-stat-header">
                                                <span className="at-zone-stat-dot" style={{ background: colors.dot }}></span>
                                                <span className="at-zone-stat-name">{zone}</span>
                                            </div>
                                            <div className="at-zone-stat-value">{count}</div>
                                            <div className="at-zone-stat-label">device{count !== 1 ? 's' : ''}</div>
                                            <div className="at-zone-stat-bar">
                                                <div 
                                                    className="at-zone-stat-fill"
                                                    style={{ 
                                                        width: `${percentage}%`,
                                                        background: colors.dot
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'equipment' && (
                    <div className="at-equipment-content">
                        <div className="at-section-header">
                            <h3><Package size={18} /> Equipment List</h3>
                            <button className="at-refresh-btn" onClick={fetchData}>
                                <RefreshCw size={14} /> Refresh
                            </button>
                        </div>
                        <div className="at-equipment-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Device ID</th>
                                        <th>Type</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Battery</th>
                                        <th>Signal</th>
                                        <th>Last Updated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipment.map(eq => (
                                        <tr key={eq.device_id}>
                                            <td>
                                                <span className="at-device-cell">
                                                    <span className="at-device-icon">{equipmentIcons[eq.equipment_type] || '📦'}</span>
                                                    {eq.device_id}
                                                </span>
                                            </td>
                                            <td>{eq.equipment_type}</td>
                                            <td>
                                                <span className="at-location-badge" style={{ borderColor: zoneColors[eq.location]?.border }}>
                                                    <span className="at-loc-dot" style={{ background: zoneColors[eq.location]?.dot }}></span>
                                                    {eq.location}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`at-status-badge ${eq.status === 'Available' ? 'available' : 'in-use'}`}>
                                                    {eq.status}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`at-battery ${eq.battery_level >= 60 ? 'good' : eq.battery_level >= 20 ? 'medium' : 'low'}`}>
                                                    {Math.round(eq.battery_level)}%
                                                </span>
                                            </td>
                                            <td className="at-signal">{eq.signal_strength} dBm</td>
                                            <td className="at-time">{formatTimeAgo(eq.last_updated)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="at-history-content">
                        <div className="at-section-header">
                            <h3><History size={18} /> Movement History</h3>
                        </div>
                        <div className="at-history-list">
                            {history.length === 0 ? (
                                <div className="at-history-empty">
                                    <History size={32} />
                                    <p>No movement events recorded yet</p>
                                </div>
                            ) : (
                                history.map((event, idx) => (
                                    <div key={idx} className="at-history-item">
                                        <div className="at-history-icon">
                                            {equipmentIcons[event.equipment_type] || '📦'}
                                        </div>
                                        <div className="at-history-info">
                                            <span className="at-history-device">{event.device_id}</span>
                                            <span className="at-history-type">{event.equipment_type}</span>
                                        </div>
                                        <div className="at-history-movement">
                                            <span className="at-history-from">{event.previous_location}</span>
                                            <ChevronRight size={14} />
                                            <span className="at-history-to">{event.new_location}</span>
                                        </div>
                                        <span className="at-history-time">
                                            <Clock size={12} />
                                            {formatTimeAgo(event.timestamp)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
