import { useState, useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../hooks/useGsap';
import { 
    MapPin, Activity, Clock, Battery, Signal, RefreshCw, 
    Navigation, AlertTriangle, CheckCircle, Box, Zap,
    ChevronRight, Search, Filter, Package
} from 'lucide-react';
import { equipmentAPI, historyAPI } from '../services/api';
import './BleAssetTracking.css';

// Location coordinates for the floor map
const locationCoords = {
    'Emergency Room': { x: 15, y: 35, color: '#ef4444' },
    'ICU': { x: 65, y: 25, color: '#dc2626' },
    'Ward A': { x: 15, y: 65, color: '#22c55e' },
    'Ward B': { x: 85, y: 65, color: '#3b82f6' },
    'Corridor': { x: 50, y: 50, color: '#64748b' },
    'Radiology': { x: 85, y: 25, color: '#8b5cf6' }
};

// Equipment type icons
const equipmentIcons = {
    'Wheelchair': '♿',
    'Stretcher': '🛏️',
    'Oxygen Cylinder': '🫁',
    'IV Stand': '💉',
    'Defibrillator': '⚡',
    'Monitor': '📟'
};

// Status colors
const statusColors = {
    'Available': { bg: '#22c55e', label: 'Available' },
    'In Use': { bg: '#3b82f6', label: 'In Use' },
    'Maintenance': { bg: '#f59e0b', label: 'Maintenance' },
    'Low Battery': { bg: '#ef4444', label: 'Low Battery' }
};

export default function BleAssetTracking() {
    // State
    const [equipment, setEquipment] = useState([]);
    const [stats, setStats] = useState({ total: 0, available: 0, inUse: 0, lowBattery: 0, activeDevices: 0 });
    const [zoneStats, setZoneStats] = useState({});
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [filterLocation, setFilterLocation] = useState('');
    const [filterType, setFilterType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isAutoRefresh, setIsAutoRefresh] = useState(true);
    
    const sectionRef = useRef(null);
    const refreshIntervalRef = useRef(null);

    // Fetch equipment data
    const fetchEquipment = async () => {
        try {
            const params = {};
            if (filterLocation) params.location = filterLocation;
            if (filterType) params.type = filterType;
            
            const [equipmentRes, historyRes] = await Promise.all([
                equipmentAPI.getAll(params),
                historyAPI.getAll({ limit: 10 })
            ]);
            
            if (equipmentRes.success) {
                setEquipment(equipmentRes.data);
                setStats(equipmentRes.stats);
                setZoneStats(equipmentRes.zoneStats);
            }
            
            if (historyRes.success) {
                setHistory(historyRes.data);
            }
            
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            console.error('Error fetching equipment:', err);
            setError('Failed to fetch equipment data. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    // Seed initial data
    const seedData = async () => {
        try {
            setLoading(true);
            await equipmentAPI.seed();
            await fetchEquipment();
        } catch (err) {
            setError('Failed to seed data');
        }
    };

    // Initial fetch and auto-refresh
    useEffect(() => {
        fetchEquipment();
        
        if (isAutoRefresh) {
            refreshIntervalRef.current = setInterval(fetchEquipment, 5000); // Refresh every 5 seconds
        }
        
        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [isAutoRefresh, filterLocation, filterType]);

    // GSAP animations
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        
        const ctx = gsap.context(() => {
            gsap.fromTo(el, 
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.6, 
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }, el);
        
        return () => ctx.revert();
    }, []);

    // Filter equipment based on search
    const filteredEquipment = equipment.filter(e => 
        e.device_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.equipment_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Format time ago
    const formatTimeAgo = (date) => {
        if (!date) return 'N/A';
        const now = new Date();
        const diff = Math.floor((now - new Date(date)) / 1000);
        
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    // Get battery status class
    const getBatteryClass = (level) => {
        if (level >= 60) return 'battery-good';
        if (level >= 20) return 'battery-medium';
        return 'battery-low';
    };

    if (loading && equipment.length === 0) {
        return (
            <div className="ble-section" ref={sectionRef}>
                <div className="ble-loading">
                    <RefreshCw className="ble-loading-icon" size={32} />
                    <p>Loading asset tracking data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ble-section" ref={sectionRef}>
            <div className="ble-header">
                <div className="ble-header-left">
                    <h3><Signal size={20} /> BLE Asset Tracking System</h3>
                    <p className="ble-subtitle">Real-time hospital equipment tracking with simulated BLE beacons</p>
                </div>
                <div className="ble-header-right">
                    <span className="ble-last-updated">
                        <Clock size={14} />
                        {lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
                    </span>
                    <button 
                        className={`ble-auto-refresh-btn ${isAutoRefresh ? 'active' : ''}`}
                        onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                        title={isAutoRefresh ? 'Auto-refresh ON (5s)' : 'Auto-refresh OFF'}
                    >
                        <RefreshCw size={16} className={isAutoRefresh ? 'spinning' : ''} />
                        {isAutoRefresh ? 'Auto' : 'Manual'}
                    </button>
                    <button className="ble-refresh-btn" onClick={fetchEquipment} disabled={loading}>
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="ble-stats-grid">
                <div className="ble-stat-card">
                    <div className="ble-stat-icon total"><Package size={20} /></div>
                    <div className="ble-stat-info">
                        <span className="ble-stat-value">{stats.total}</span>
                        <span className="ble-stat-label">Total Devices</span>
                    </div>
                </div>
                <div className="ble-stat-card">
                    <div className="ble-stat-icon available"><CheckCircle size={20} /></div>
                    <div className="ble-stat-info">
                        <span className="ble-stat-value">{stats.available}</span>
                        <span className="ble-stat-label">Available</span>
                    </div>
                </div>
                <div className="ble-stat-card">
                    <div className="ble-stat-icon in-use"><Activity size={20} /></div>
                    <div className="ble-stat-info">
                        <span className="ble-stat-value">{stats.inUse}</span>
                        <span className="ble-stat-label">In Use</span>
                    </div>
                </div>
                <div className="ble-stat-card">
                    <div className="ble-stat-icon low-battery"><Battery size={20} /></div>
                    <div className="ble-stat-info">
                        <span className="ble-stat-value">{stats.lowBattery}</span>
                        <span className="ble-stat-label">Low Battery</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="ble-error">
                    <AlertTriangle size={20} />
                    <span>{error}</span>
                    <button onClick={seedData}>Seed Initial Data</button>
                </div>
            )}

            {equipment.length === 0 && !error && (
                <div className="ble-empty">
                    <Box size={48} />
                    <h4>No Equipment Found</h4>
                    <p>Click the button below to seed initial equipment data</p>
                    <button className="ble-seed-btn" onClick={seedData}>
                        <Zap size={16} /> Seed Equipment Data
                    </button>
                </div>
            )}

            {equipment.length > 0 && (
                <div className="ble-body">
                    {/* Floor Map */}
                    <div className="ble-map-panel">
                        <h4><MapPin size={16} /> Floor Layout</h4>
                        <div className="ble-floor-map">
                            {/* Hospital zones */}
                            {Object.entries(locationCoords).map(([location, coords]) => (
                                <div
                                    key={location}
                                    className="ble-zone"
                                    style={{
                                        left: `${coords.x}%`,
                                        top: `${coords.y}%`,
                                        borderColor: coords.color
                                    }}
                                >
                                    <span className="ble-zone-name">{location}</span>
                                    <span className="ble-zone-count">
                                        {equipment.filter(e => e.location === location).length}
                                    </span>
                                </div>
                            ))}
                            
                            {/* Equipment markers */}
                            {filteredEquipment.map((eq, idx) => {
                                const zoneCoords = locationCoords[eq.location] || { x: 50, y: 50 };
                                // Offset markers slightly within zone
                                const offset = idx * 3;
                                return (
                                    <div
                                        key={eq.device_id}
                                        className={`ble-equipment-marker ${selectedEquipment?.device_id === eq.device_id ? 'selected' : ''}`}
                                        style={{
                                            left: `${zoneCoords.x + (offset % 10) - 5}%`,
                                            top: `${zoneCoords.y + Math.floor(offset / 10) * 5}%`,
                                            backgroundColor: statusColors[eq.status]?.bg || '#64748b'
                                        }}
                                        onClick={() => setSelectedEquipment(eq)}
                                        title={`${eq.device_id} - ${eq.equipment_type}`}
                                    >
                                        <span>{equipmentIcons[eq.equipment_type] || '📦'}</span>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Zone Overview */}
                        <div className="ble-zone-overview">
                            <h5>Zone Overview</h5>
                            <div className="ble-zone-list">
                                {Object.entries(locationCoords).map(([location, coords]) => {
                                    const count = zoneStats[location] || 0;
                                    return (
                                        <div 
                                            key={location} 
                                            className="ble-zone-item"
                                            onClick={() => setFilterLocation(filterLocation === location ? '' : location)}
                                            style={{ borderLeftColor: coords.color }}
                                        >
                                            <span className="ble-zone-dot" style={{ backgroundColor: coords.color }}></span>
                                            <span className="ble-zone-name">{location}</span>
                                            <span className="ble-zone-badge">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Equipment Table */}
                    <div className="ble-table-panel">
                        <div className="ble-table-header">
                            <h4><Box size={16} /> Equipment List ({filteredEquipment.length})</h4>
                            <div className="ble-filters">
                                <div className="ble-search">
                                    <Search size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search devices..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <select 
                                    value={filterType} 
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="ble-filter-select"
                                >
                                    <option value="">All Types</option>
                                    <option value="Wheelchair">Wheelchair</option>
                                    <option value="Stretcher">Stretcher</option>
                                    <option value="Oxygen Cylinder">Oxygen Cylinder</option>
                                    <option value="IV Stand">IV Stand</option>
                                    <option value="Defibrillator">Defibrillator</option>
                                    <option value="Monitor">Monitor</option>
                                </select>
                                {(filterLocation || filterType) && (
                                    <button 
                                        className="ble-clear-filter"
                                        onClick={() => { setFilterLocation(''); setFilterType(''); }}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="ble-table-container">
                            <table className="ble-table">
                                <thead>
                                    <tr>
                                        <th>Device</th>
                                        <th>Type</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Battery</th>
                                        <th>Signal</th>
                                        <th>Updated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEquipment.map(eq => (
                                        <tr 
                                            key={eq.device_id}
                                            className={selectedEquipment?.device_id === eq.device_id ? 'selected' : ''}
                                            onClick={() => setSelectedEquipment(eq)}
                                        >
                                            <td className="ble-device-cell">
                                                <span className="ble-device-icon">{equipmentIcons[eq.equipment_type] || '📦'}</span>
                                                <span className="ble-device-id">{eq.device_id}</span>
                                            </td>
                                            <td>{eq.equipment_type}</td>
                                            <td>
                                                <span className="ble-location-tag">
                                                    <MapPin size={12} />
                                                    {eq.location}
                                                </span>
                                            </td>
                                            <td>
                                                <span 
                                                    className="ble-status-badge"
                                                    style={{ backgroundColor: statusColors[eq.status]?.bg || '#64748b' }}
                                                >
                                                    {eq.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={`ble-battery ${getBatteryClass(eq.battery_level)}`}>
                                                    <Battery size={14} />
                                                    <span>{eq.battery_level}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="ble-signal">
                                                    <Signal size={12} />
                                                    {eq.signal_strength} dBm
                                                </span>
                                            </td>
                                            <td className="ble-time-cell">
                                                {formatTimeAgo(eq.last_updated)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Movement History */}
                    <div className="ble-history-panel">
                        <h4><Navigation size={16} /> Recent Movement History</h4>
                        {history.length === 0 ? (
                            <div className="ble-history-empty">
                                <p>No movement events recorded yet.</p>
                                <span>Equipment movements will appear here in real-time.</span>
                            </div>
                        ) : (
                            <div className="ble-history-list">
                                {history.map((event, idx) => (
                                    <div key={idx} className="ble-history-item">
                                        <div className="ble-history-icon">
                                            <span>{equipmentIcons[event.equipment_type] || '📦'}</span>
                                        </div>
                                        <div className="ble-history-info">
                                            <span className="ble-history-device">{event.device_id}</span>
                                            <div className="ble-history-movement">
                                                <span className="ble-history-from">{event.previous_location}</span>
                                                <ChevronRight size={14} />
                                                <span className="ble-history-to">{event.new_location}</span>
                                            </div>
                                        </div>
                                        <span className="ble-history-time">
                                            {formatTimeAgo(event.timestamp)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Selected Equipment Detail */}
            {selectedEquipment && (
                <div className="ble-detail-modal">
                    <div className="ble-detail-card">
                        <button className="ble-detail-close" onClick={() => setSelectedEquipment(null)}>×</button>
                        <div className="ble-detail-header">
                            <span className="ble-detail-icon">{equipmentIcons[selectedEquipment.equipment_type] || '📦'}</span>
                            <div>
                                <h4>{selectedEquipment.device_id}</h4>
                                <span>{selectedEquipment.equipment_type}</span>
                            </div>
                            <span 
                                className="ble-status-badge large"
                                style={{ backgroundColor: statusColors[selectedEquipment.status]?.bg || '#64748b' }}
                            >
                                {selectedEquipment.status}
                            </span>
                        </div>
                        <div className="ble-detail-body">
                            <div className="ble-detail-row">
                                <MapPin size={16} />
                                <span>Location:</span>
                                <strong>{selectedEquipment.location}</strong>
                            </div>
                            <div className="ble-detail-row">
                                <Battery size={16} />
                                <span>Battery:</span>
                                <strong className={getBatteryClass(selectedEquipment.battery_level)}>
                                    {selectedEquipment.battery_level}%
                                </strong>
                            </div>
                            <div className="ble-detail-row">
                                <Signal size={16} />
                                <span>Signal:</span>
                                <strong>{selectedEquipment.signal_strength} dBm</strong>
                            </div>
                            <div className="ble-detail-row">
                                <Clock size={16} />
                                <span>Last Updated:</span>
                                <strong>{new Date(selectedEquipment.last_updated).toLocaleString()}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
