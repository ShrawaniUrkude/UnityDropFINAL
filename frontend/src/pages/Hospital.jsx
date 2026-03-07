import { useState, useRef } from 'react';
import { 
    Search, RotateCcw, ArrowUp, Circle, Hand, MapPin, Compass, 
    User, Users, Box, Map as MapIcon, ChevronDown, Filter,
    Bed, Heart, Baby, Stethoscope, FlaskConical, Utensils, 
    Pill, Package, Activity, Scan, Phone, Clock, CheckCircle,
    AlertTriangle, Wrench, Eye, Navigation, Building2, Layers
} from 'lucide-react';
import './Hospital.css';

// ═══════════════════════════════════════════════════════════════
// HOSPITAL DATA STRUCTURE
// ═══════════════════════════════════════════════════════════════

const floors = [
    { id: 'basement', name: 'Basement', level: -1, color: '#64748b' },
    { id: 'ground', name: 'Ground Floor', level: 0, color: '#22c55e' },
    { id: 'first', name: '1st Floor', level: 1, color: '#3b82f6' },
    { id: 'second', name: '2nd Floor', level: 2, color: '#8b5cf6' },
    { id: 'third', name: '3rd Floor', level: 3, color: '#f59e0b' },
];

// Complete hospital rooms by floor
const hospitalRooms = {
    basement: [
        { id: 'morgue', name: 'Morgue', type: 'morgue', col: 1, row: 1, icon: '🏥' },
        { id: 'storage-b', name: 'Central Storage', type: 'storage', col: 2, row: 1, icon: '📦' },
        { id: 'laundry', name: 'Laundry', type: 'service', col: 3, row: 1, icon: '🧺' },
        { id: 'maintenance', name: 'Maintenance', type: 'service', col: 4, row: 1, icon: '🔧' },
        { id: 'power', name: 'Power Room', type: 'utility', col: 1, row: 2, icon: '⚡' },
        { id: 'hvac', name: 'HVAC Control', type: 'utility', col: 2, row: 2, icon: '❄️' },
        { id: 'parking-b', name: 'Staff Parking', type: 'parking', col: 3, row: 2, span: 2, icon: '🚗' },
    ],
    ground: [
        { id: 'emergency', name: 'Emergency', subtitle: 'ER', type: 'emergency', col: 1, row: 1, icon: '🚨', beds: 12 },
        { id: 'reception', name: 'Reception', subtitle: 'Main Lobby', type: 'reception', col: 2, row: 1, icon: '🏛️' },
        { id: 'pharmacy', name: 'Pharmacy', subtitle: '24/7', type: 'pharmacy', col: 3, row: 1, icon: '💊' },
        { id: 'radiology', name: 'Radiology', subtitle: 'X-Ray & CT', type: 'radiology', col: 4, row: 1, icon: '📡' },
        { id: 'laboratory', name: 'Laboratory', subtitle: 'Diagnostics', type: 'laboratory', col: 1, row: 2, icon: '🔬' },
        { id: 'blood-bank', name: 'Blood Bank', type: 'laboratory', col: 2, row: 2, icon: '🩸' },
        { id: 'outpatient', name: 'OPD', subtitle: 'Outpatient', type: 'opd', col: 3, row: 2, icon: '👨‍⚕️' },
        { id: 'billing', name: 'Billing', subtitle: 'Insurance', type: 'admin', col: 4, row: 2, icon: '💳' },
    ],
    first: [
        { id: 'surgery-1', name: 'Surgery Suite 1', subtitle: 'General', type: 'surgery', col: 1, row: 1, icon: '🔪' },
        { id: 'surgery-2', name: 'Surgery Suite 2', subtitle: 'Cardiac', type: 'surgery', col: 2, row: 1, icon: '❤️' },
        { id: 'icu', name: 'ICU', subtitle: 'Intensive Care', type: 'icu', col: 3, row: 1, icon: '💓', beds: 8 },
        { id: 'recovery', name: 'Recovery', subtitle: 'Post-Op', type: 'recovery', col: 4, row: 1, icon: '🛏️', beds: 10 },
        { id: 'anesthesia', name: 'Anesthesia', type: 'surgery', col: 1, row: 2, icon: '💉' },
        { id: 'sterilization', name: 'Sterilization', type: 'service', col: 2, row: 2, icon: '🧪' },
        { id: 'blood-storage', name: 'Blood Storage', type: 'storage', col: 3, row: 2, icon: '🩸' },
        { id: 'staff-room-1', name: 'Staff Room', type: 'staff', col: 4, row: 2, icon: '☕' },
    ],
    second: [
        { id: 'maternity', name: 'Maternity', subtitle: 'Labor & Delivery', type: 'maternity', col: 1, row: 1, icon: '👶', beds: 15 },
        { id: 'nicu', name: 'NICU', subtitle: 'Neonatal ICU', type: 'icu', col: 2, row: 1, icon: '🍼', beds: 10 },
        { id: 'pediatrics', name: 'Pediatrics', subtitle: "Children's Ward", type: 'pediatrics', col: 3, row: 1, icon: '🧸', beds: 20 },
        { id: 'gynecology', name: 'Gynecology', type: 'ward', col: 4, row: 1, icon: '🩺', beds: 12 },
        { id: 'nursery', name: 'Nursery', type: 'nursery', col: 1, row: 2, icon: '👼' },
        { id: 'lactation', name: 'Lactation Room', type: 'service', col: 2, row: 2, icon: '🤱' },
        { id: 'play-area', name: 'Play Area', type: 'amenity', col: 3, row: 2, icon: '🎨' },
        { id: 'family-wait', name: 'Family Waiting', type: 'amenity', col: 4, row: 2, icon: '🪑' },
    ],
    third: [
        { id: 'general-ward-a', name: 'General Ward A', subtitle: 'Male', type: 'ward', col: 1, row: 1, icon: '🛏️', beds: 30 },
        { id: 'general-ward-b', name: 'General Ward B', subtitle: 'Female', type: 'ward', col: 2, row: 1, icon: '🛏️', beds: 30 },
        { id: 'private-rooms', name: 'Private Rooms', subtitle: 'Premium', type: 'private', col: 3, row: 1, icon: '🏠', beds: 12 },
        { id: 'vip-suite', name: 'VIP Suite', type: 'private', col: 4, row: 1, icon: '⭐', beds: 4 },
        { id: 'cafeteria', name: 'Cafeteria', type: 'amenity', col: 1, row: 2, icon: '🍽️' },
        { id: 'chapel', name: 'Chapel', type: 'amenity', col: 2, row: 2, icon: '⛪' },
        { id: 'admin', name: 'Administration', type: 'admin', col: 3, row: 2, icon: '🏢' },
        { id: 'conference', name: 'Conference', type: 'admin', col: 4, row: 2, icon: '📊' },
    ],
};

// Room type styling
const roomTypeStyles = {
    emergency: { bg: '#fef2f2', border: '#ef4444', color: '#dc2626' },
    reception: { bg: '#eff6ff', border: '#3b82f6', color: '#2563eb' },
    pharmacy: { bg: '#f5f3ff', border: '#8b5cf6', color: '#7c3aed' },
    radiology: { bg: '#ecfdf5', border: '#10b981', color: '#059669' },
    laboratory: { bg: '#fefce8', border: '#eab308', color: '#ca8a04' },
    surgery: { bg: '#fdf2f8', border: '#ec4899', color: '#db2777' },
    icu: { bg: '#fef2f2', border: '#ef4444', color: '#dc2626' },
    recovery: { bg: '#f0fdf4', border: '#22c55e', color: '#16a34a' },
    maternity: { bg: '#fce7f3', border: '#f472b6', color: '#db2777' },
    pediatrics: { bg: '#cffafe', border: '#06b6d4', color: '#0891b2' },
    ward: { bg: '#fef3c7', border: '#f59e0b', color: '#d97706' },
    private: { bg: '#faf5ff', border: '#a855f7', color: '#9333ea' },
    admin: { bg: '#f1f5f9', border: '#64748b', color: '#475569' },
    service: { bg: '#f8fafc', border: '#94a3b8', color: '#64748b' },
    storage: { bg: '#f1f5f9', border: '#94a3b8', color: '#64748b' },
    utility: { bg: '#fef9c3', border: '#facc15', color: '#ca8a04' },
    amenity: { bg: '#fff7ed', border: '#fb923c', color: '#ea580c' },
    opd: { bg: '#dbeafe', border: '#3b82f6', color: '#2563eb' },
    parking: { bg: '#e2e8f0', border: '#64748b', color: '#475569' },
    morgue: { bg: '#e2e8f0', border: '#475569', color: '#334155' },
    nursery: { bg: '#fce7f3', border: '#f9a8d4', color: '#ec4899' },
};

// Equipment categories
const equipmentCategories = [
    { id: 'all', name: 'All Equipment', icon: Package },
    { id: 'wheelchair', name: 'Wheelchairs', icon: '♿' },
    { id: 'stretcher', name: 'Stretchers', icon: Bed },
    { id: 'ventilator', name: 'Ventilators', icon: Activity },
    { id: 'monitor', name: 'Monitors', icon: Heart },
    { id: 'oxygen', name: 'O2 Cylinders', icon: '🫁' },
    { id: 'defibrillator', name: 'Defibrillators', icon: '⚡' },
    { id: 'infusion', name: 'IV Pumps', icon: '💉' },
    { id: 'surgical', name: 'Surgical Tools', icon: Stethoscope },
    { id: 'imaging', name: 'Imaging', icon: Scan },
];

// Complete equipment inventory
const equipmentInventory = [
    // Ground Floor
    { id: 'wc-001', name: 'Wheelchair #001', category: 'wheelchair', floor: 'ground', room: 'emergency', status: 'available', x: 15, y: 35 },
    { id: 'wc-002', name: 'Wheelchair #002', category: 'wheelchair', floor: 'ground', room: 'emergency', status: 'in-use', x: 25, y: 35 },
    { id: 'wc-003', name: 'Wheelchair #003', category: 'wheelchair', floor: 'ground', room: 'reception', status: 'available', x: 35, y: 35 },
    { id: 'str-001', name: 'Stretcher #001', category: 'stretcher', floor: 'ground', room: 'emergency', status: 'available', x: 15, y: 55 },
    { id: 'str-002', name: 'Stretcher #002', category: 'stretcher', floor: 'ground', room: 'emergency', status: 'in-use', x: 25, y: 55 },
    { id: 'str-003', name: 'Stretcher #003', category: 'stretcher', floor: 'ground', room: 'radiology', status: 'available', x: 85, y: 35 },
    { id: 'mon-001', name: 'Monitor #001', category: 'monitor', floor: 'ground', room: 'emergency', status: 'available', x: 18, y: 45 },
    { id: 'mon-002', name: 'Monitor #002', category: 'monitor', floor: 'ground', room: 'emergency', status: 'in-use', x: 28, y: 45 },
    { id: 'o2-001', name: 'O2 Cylinder #001', category: 'oxygen', floor: 'ground', room: 'emergency', status: 'available', x: 20, y: 65 },
    { id: 'o2-002', name: 'O2 Cylinder #002', category: 'oxygen', floor: 'ground', room: 'emergency', status: 'low', x: 30, y: 65 },
    { id: 'def-001', name: 'Defibrillator #001', category: 'defibrillator', floor: 'ground', room: 'emergency', status: 'available', x: 22, y: 40 },
    { id: 'xray-001', name: 'X-Ray Machine', category: 'imaging', floor: 'ground', room: 'radiology', status: 'available', x: 80, y: 45 },
    { id: 'ct-001', name: 'CT Scanner', category: 'imaging', floor: 'ground', room: 'radiology', status: 'in-use', x: 90, y: 45 },
    
    // First Floor - Surgery & ICU
    { id: 'vent-001', name: 'Ventilator #001', category: 'ventilator', floor: 'first', room: 'icu', status: 'in-use', x: 60, y: 35 },
    { id: 'vent-002', name: 'Ventilator #002', category: 'ventilator', floor: 'first', room: 'icu', status: 'available', x: 65, y: 35 },
    { id: 'vent-003', name: 'Ventilator #003', category: 'ventilator', floor: 'first', room: 'icu', status: 'in-use', x: 70, y: 35 },
    { id: 'vent-004', name: 'Ventilator #004', category: 'ventilator', floor: 'first', room: 'icu', status: 'maintenance', x: 75, y: 35 },
    { id: 'mon-003', name: 'Monitor #003', category: 'monitor', floor: 'first', room: 'icu', status: 'in-use', x: 62, y: 45 },
    { id: 'mon-004', name: 'Monitor #004', category: 'monitor', floor: 'first', room: 'icu', status: 'in-use', x: 68, y: 45 },
    { id: 'mon-005', name: 'Monitor #005', category: 'monitor', floor: 'first', room: 'icu', status: 'available', x: 74, y: 45 },
    { id: 'def-002', name: 'Defibrillator #002', category: 'defibrillator', floor: 'first', room: 'icu', status: 'available', x: 65, y: 55 },
    { id: 'def-003', name: 'Defibrillator #003', category: 'defibrillator', floor: 'first', room: 'surgery-1', status: 'available', x: 15, y: 45 },
    { id: 'surg-001', name: 'Surgical Light', category: 'surgical', floor: 'first', room: 'surgery-1', status: 'available', x: 18, y: 40 },
    { id: 'surg-002', name: 'Surgical Table', category: 'surgical', floor: 'first', room: 'surgery-1', status: 'available', x: 20, y: 50 },
    { id: 'surg-003', name: 'Anesthesia Machine', category: 'surgical', floor: 'first', room: 'surgery-1', status: 'available', x: 25, y: 45 },
    { id: 'inf-001', name: 'IV Pump #001', category: 'infusion', floor: 'first', room: 'recovery', status: 'in-use', x: 85, y: 40 },
    { id: 'inf-002', name: 'IV Pump #002', category: 'infusion', floor: 'first', room: 'recovery', status: 'available', x: 90, y: 40 },
    
    // Second Floor - Maternity & Pediatrics
    { id: 'mon-006', name: 'Fetal Monitor #001', category: 'monitor', floor: 'second', room: 'maternity', status: 'in-use', x: 15, y: 40 },
    { id: 'mon-007', name: 'Fetal Monitor #002', category: 'monitor', floor: 'second', room: 'maternity', status: 'available', x: 20, y: 40 },
    { id: 'inf-003', name: 'IV Pump #003', category: 'infusion', floor: 'second', room: 'maternity', status: 'in-use', x: 18, y: 50 },
    { id: 'wc-004', name: 'Wheelchair #004', category: 'wheelchair', floor: 'second', room: 'maternity', status: 'available', x: 25, y: 55 },
    { id: 'inc-001', name: 'Incubator #001', category: 'monitor', floor: 'second', room: 'nicu', status: 'in-use', x: 38, y: 40 },
    { id: 'inc-002', name: 'Incubator #002', category: 'monitor', floor: 'second', room: 'nicu', status: 'in-use', x: 42, y: 40 },
    { id: 'inc-003', name: 'Incubator #003', category: 'monitor', floor: 'second', room: 'nicu', status: 'available', x: 46, y: 40 },
    { id: 'vent-005', name: 'Neonatal Vent #001', category: 'ventilator', floor: 'second', room: 'nicu', status: 'in-use', x: 40, y: 50 },
    { id: 'o2-003', name: 'O2 Cylinder #003', category: 'oxygen', floor: 'second', room: 'pediatrics', status: 'available', x: 65, y: 45 },
    { id: 'mon-008', name: 'Pediatric Monitor', category: 'monitor', floor: 'second', room: 'pediatrics', status: 'available', x: 68, y: 50 },
    
    // Third Floor - Wards
    { id: 'str-004', name: 'Stretcher #004', category: 'stretcher', floor: 'third', room: 'general-ward-a', status: 'available', x: 15, y: 45 },
    { id: 'str-005', name: 'Stretcher #005', category: 'stretcher', floor: 'third', room: 'general-ward-b', status: 'in-use', x: 38, y: 45 },
    { id: 'wc-005', name: 'Wheelchair #005', category: 'wheelchair', floor: 'third', room: 'general-ward-a', status: 'available', x: 20, y: 50 },
    { id: 'wc-006', name: 'Wheelchair #006', category: 'wheelchair', floor: 'third', room: 'general-ward-b', status: 'available', x: 42, y: 50 },
    { id: 'inf-004', name: 'IV Pump #004', category: 'infusion', floor: 'third', room: 'private-rooms', status: 'available', x: 65, y: 40 },
    { id: 'mon-009', name: 'Monitor #009', category: 'monitor', floor: 'third', room: 'private-rooms', status: 'in-use', x: 70, y: 45 },
    { id: 'o2-004', name: 'O2 Cylinder #004', category: 'oxygen', floor: 'third', room: 'vip-suite', status: 'available', x: 88, y: 45 },
    
    // Basement
    { id: 'str-006', name: 'Stretcher #006', category: 'stretcher', floor: 'basement', room: 'storage-b', status: 'available', x: 35, y: 40 },
    { id: 'wc-007', name: 'Wheelchair #007', category: 'wheelchair', floor: 'basement', room: 'storage-b', status: 'maintenance', x: 40, y: 45 },
    { id: 'wc-008', name: 'Wheelchair #008', category: 'wheelchair', floor: 'basement', room: 'storage-b', status: 'available', x: 45, y: 40 },
];

// Status colors
const statusColors = {
    'available': { bg: '#22c55e', label: 'Available' },
    'in-use': { bg: '#3b82f6', label: 'In Use' },
    'maintenance': { bg: '#f59e0b', label: 'Maintenance' },
    'low': { bg: '#ef4444', label: 'Low/Critical' },
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Room Card Component
const RoomCard = ({ room, style: typeStyle, isSelected, onClick, showEquipment, equipment }) => {
    const roomEquip = equipment.filter(e => e.room === room.id);
    
    return (
        <div 
            className={`room-card ${isSelected ? 'room-card--selected' : ''} ${room.span ? `room-card--span-${room.span}` : ''}`}
            style={{ 
                backgroundColor: typeStyle?.bg || '#f8fafc',
                borderColor: isSelected ? '#2563eb' : (typeStyle?.border || '#e2e8f0'),
            }}
            onClick={() => onClick(room)}
        >
            <div className="room-card__icon">{room.icon}</div>
            <div className="room-card__info">
                <h4>{room.name}</h4>
                {room.subtitle && <span className="room-card__subtitle">{room.subtitle}</span>}
            </div>
            {room.beds && <span className="room-card__beds">{room.beds} Beds</span>}
            
            {/* Equipment markers */}
            {showEquipment && roomEquip.length > 0 && (
                <div className="room-card__equipment-count">
                    <Package size={12} />
                    <span>{roomEquip.length}</span>
                </div>
            )}
            
            {/* Equipment dots */}
            {showEquipment && roomEquip.slice(0, 4).map((eq, idx) => (
                <div 
                    key={eq.id}
                    className="room-eq-dot"
                    style={{ 
                        backgroundColor: statusColors[eq.status]?.bg,
                        right: `${10 + idx * 12}px`
                    }}
                    title={`${eq.name} - ${eq.status}`}
                />
            ))}
        </div>
    );
};

// 3D Building Block Component
const Building3D = ({ room, style: typeStyle, floor, isHighlighted, height }) => {
    const colors = {
        front: typeStyle?.border || '#94a3b8',
        top: typeStyle?.bg || '#f8fafc',
    };
    
    return (
        <div 
            className={`building-3d ${isHighlighted ? 'building-3d--highlight' : ''}`}
            style={{
                '--building-color': colors.front,
                '--building-top': colors.top,
                '--building-height': `${height}px`,
            }}
        >
            <div className="building-face building-face--front">
                <span className="building-label">{room.icon}</span>
            </div>
            <div className="building-face building-face--back"></div>
            <div className="building-face building-face--left"></div>
            <div className="building-face building-face--right"></div>
            <div className="building-face building-face--top">
                <span className="building-name">{room.name}</span>
            </div>
            <div className="building-face building-face--bottom"></div>
        </div>
    );
};

// Equipment Item Component  
const EquipmentItem = ({ equipment, isSelected, onClick }) => (
    <div 
        className={`equipment-item ${isSelected ? 'equipment-item--selected' : ''}`}
        onClick={() => onClick(equipment)}
    >
        <div 
            className="equipment-item__status"
            style={{ backgroundColor: statusColors[equipment.status]?.bg }}
        />
        <div className="equipment-item__info">
            <span className="equipment-item__name">{equipment.name}</span>
            <span className="equipment-item__location">
                {floors.find(f => f.id === equipment.floor)?.name} • {equipment.room}
            </span>
        </div>
        <span className={`equipment-item__badge equipment-item__badge--${equipment.status}`}>
            {statusColors[equipment.status]?.label}
        </span>
    </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function Hospital() {
    // State
    const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
    const [userMode, setUserMode] = useState('patient'); // 'patient' or 'worker'
    const [activeFloor, setActiveFloor] = useState('ground');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showAllFloors, setShowAllFloors] = useState(false);
    
    // 3D view controls
    const [viewAngle, setViewAngle] = useState({ rotateX: 60, rotateZ: -45 });
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const mapRef = useRef(null);

    // View presets
    const setView = (preset) => {
        const presets = {
            reset: { rotateX: 60, rotateZ: -45 },
            top: { rotateX: 90, rotateZ: 0 },
            front: { rotateX: 30, rotateZ: 0 },
            side: { rotateX: 30, rotateZ: -90 },
        };
        setViewAngle(presets[preset]);
    };

    // Mouse handlers for 3D rotation
    const handleMouseDown = (e) => {
        if (viewMode !== '3d') return;
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || viewMode !== '3d') return;
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        setViewAngle(prev => ({
            rotateX: Math.max(10, Math.min(90, prev.rotateX - deltaY * 0.3)),
            rotateZ: prev.rotateZ - deltaX * 0.3
        }));
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleWheel = (e) => {
        if (viewMode !== '3d') return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
    };

    // Filter equipment
    const filteredEquipment = equipmentInventory.filter(eq => {
        const matchesSearch = eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             eq.room.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || eq.category === categoryFilter;
        const matchesFloor = showAllFloors || eq.floor === activeFloor;
        return matchesSearch && matchesCategory && matchesFloor;
    });

    // Get current floor rooms
    const currentRooms = hospitalRooms[activeFloor] || [];
    const currentFloorData = floors.find(f => f.id === activeFloor);

    // Equipment stats
    const equipmentStats = {
        total: filteredEquipment.length,
        available: filteredEquipment.filter(e => e.status === 'available').length,
        inUse: filteredEquipment.filter(e => e.status === 'in-use').length,
        maintenance: filteredEquipment.filter(e => e.status === 'maintenance').length,
    };

    return (
        <div className="hospital-page">
            {/* ═══════════════════════════════════════════════════════════════
                TOP CONTROL BAR
            ═══════════════════════════════════════════════════════════════ */}
            <div className="hospital-topbar">
                <div className="topbar-left">
                    {/* View Mode Toggle */}
                    <div className="view-toggle">
                        <button 
                            className={`toggle-btn ${viewMode === '2d' ? 'active' : ''}`}
                            onClick={() => setViewMode('2d')}
                        >
                            <MapIcon size={16} /> 2D Map
                        </button>
                        <button 
                            className={`toggle-btn ${viewMode === '3d' ? 'active' : ''}`}
                            onClick={() => setViewMode('3d')}
                        >
                            <Box size={16} /> 3D View
                        </button>
                    </div>

                    {/* User Mode Toggle */}
                    <div className="mode-toggle">
                        <button 
                            className={`mode-btn ${userMode === 'patient' ? 'active' : ''}`}
                            onClick={() => setUserMode('patient')}
                        >
                            <Users size={16} /> Patient View
                        </button>
                        <button 
                            className={`mode-btn ${userMode === 'worker' ? 'active' : ''}`}
                            onClick={() => setUserMode('worker')}
                        >
                            <User size={16} /> Staff View
                        </button>
                    </div>
                </div>

                <div className="topbar-center">
                    <Building2 size={20} />
                    <h1>Hospital Navigator</h1>
                </div>

                <div className="topbar-right">
                    <div className="emergency-btn">
                        <Phone size={16} />
                        <span>Emergency: 108</span>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                MAIN CONTENT AREA
            ═══════════════════════════════════════════════════════════════ */}
            <div className="hospital-main">
                {/* LEFT SIDEBAR - Equipment/Search (Worker Mode) or Department Info (Patient Mode) */}
                <div className="hospital-sidebar hospital-sidebar--left">
                    {userMode === 'worker' ? (
                        <>
                            {/* Search & Filter */}
                            <div className="sidebar-section">
                                <h3><Search size={16} /> Find Equipment</h3>
                                <div className="search-box">
                                    <Search size={16} />
                                    <input 
                                        type="text"
                                        placeholder="Search equipment..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                
                                <div className="filter-row">
                                    <select 
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        {equipmentCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    
                                    <label className="checkbox-label">
                                        <input 
                                            type="checkbox"
                                            checked={showAllFloors}
                                            onChange={(e) => setShowAllFloors(e.target.checked)}
                                        />
                                        All Floors
                                    </label>
                                </div>
                            </div>

                            {/* Equipment Stats */}
                            <div className="sidebar-section">
                                <h3><Activity size={16} /> Equipment Status</h3>
                                <div className="stats-grid">
                                    <div className="stat-box">
                                        <span className="stat-value">{equipmentStats.available}</span>
                                        <span className="stat-label">Available</span>
                                        <div className="stat-bar" style={{ backgroundColor: '#22c55e' }}></div>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-value">{equipmentStats.inUse}</span>
                                        <span className="stat-label">In Use</span>
                                        <div className="stat-bar" style={{ backgroundColor: '#3b82f6' }}></div>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-value">{equipmentStats.maintenance}</span>
                                        <span className="stat-label">Maintenance</span>
                                        <div className="stat-bar" style={{ backgroundColor: '#f59e0b' }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Equipment List */}
                            <div className="sidebar-section sidebar-section--scroll">
                                <h3><Package size={16} /> Equipment ({filteredEquipment.length})</h3>
                                <div className="equipment-list">
                                    {filteredEquipment.map(eq => (
                                        <EquipmentItem 
                                            key={eq.id}
                                            equipment={eq}
                                            isSelected={selectedEquipment?.id === eq.id}
                                            onClick={(eq) => {
                                                setSelectedEquipment(eq);
                                                setActiveFloor(eq.floor);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Patient Mode - Department Directory */}
                            <div className="sidebar-section">
                                <h3><Building2 size={16} /> Department Directory</h3>
                                <div className="department-list">
                                    {Object.entries(hospitalRooms).map(([floorId, rooms]) => (
                                        <div key={floorId} className="department-floor">
                                            <h4>{floors.find(f => f.id === floorId)?.name}</h4>
                                            {rooms.filter(r => r.type !== 'service' && r.type !== 'utility' && r.type !== 'storage').map(room => (
                                                <div 
                                                    key={room.id}
                                                    className={`department-item ${selectedRoom?.id === room.id ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setActiveFloor(floorId);
                                                        setSelectedRoom(room);
                                                    }}
                                                >
                                                    <span className="dept-icon">{room.icon}</span>
                                                    <span className="dept-name">{room.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* CENTER - MAP AREA */}
                <div className="hospital-map-area">
                    {/* Floor Selector */}
                    <div className="floor-selector">
                        {floors.map(floor => (
                            <button 
                                key={floor.id}
                                className={`floor-btn ${activeFloor === floor.id ? 'active' : ''}`}
                                style={{ 
                                    '--floor-color': floor.color,
                                    backgroundColor: activeFloor === floor.id ? floor.color : 'transparent'
                                }}
                                onClick={() => setActiveFloor(floor.id)}
                            >
                                <span className="floor-level">{floor.level >= 0 ? floor.level : 'B'}</span>
                                <span className="floor-name">{floor.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* 3D Controls (only show in 3D mode) */}
                    {viewMode === '3d' && (
                        <div className="controls-3d">
                            <div className="controls-3d__header">
                                <Layers size={16} />
                                <span>3D Controls</span>
                            </div>
                            <div className="controls-3d__buttons">
                                <button onClick={() => setView('reset')} title="Reset"><RotateCcw size={16} /></button>
                                <button onClick={() => setView('top')} title="Top"><ArrowUp size={16} /></button>
                                <button onClick={() => setView('front')} title="Front"><Circle size={16} /></button>
                                <button onClick={() => setView('side')} title="Side"><Hand size={16} /></button>
                            </div>
                            <div className="controls-3d__zoom">
                                <span>Zoom</span>
                                <input 
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                />
                            </div>
                            <p className="controls-3d__hint">Drag to rotate • Scroll to zoom</p>
                        </div>
                    )}

                    {/* Map Canvas */}
                    <div 
                        className={`map-canvas ${viewMode === '3d' ? 'map-canvas--3d' : ''}`}
                        ref={mapRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                    >
                        {viewMode === '2d' ? (
                            /* ═══════════════════════════════════════════════════════════════
                               2D FLOOR PLAN
                            ═══════════════════════════════════════════════════════════════ */
                            <div className="floor-plan-2d">
                                <div className="floor-header">
                                    <h2 style={{ color: currentFloorData?.color }}>
                                        {currentFloorData?.name}
                                    </h2>
                                </div>
                                
                                <div className="room-grid">
                                    {currentRooms.map(room => (
                                        <RoomCard 
                                            key={room.id}
                                            room={room}
                                            style={roomTypeStyles[room.type]}
                                            isSelected={selectedRoom?.id === room.id}
                                            onClick={setSelectedRoom}
                                            showEquipment={userMode === 'worker'}
                                            equipment={equipmentInventory.filter(e => e.floor === activeFloor)}
                                        />
                                    ))}
                                </div>

                                {/* Equipment Markers (Worker Mode) */}
                                {userMode === 'worker' && (
                                    <div className="equipment-overlay">
                                        {equipmentInventory
                                            .filter(eq => eq.floor === activeFloor)
                                            .map(eq => (
                                                <div 
                                                    key={eq.id}
                                                    className={`eq-marker ${selectedEquipment?.id === eq.id ? 'eq-marker--selected' : ''}`}
                                                    style={{ 
                                                        left: `${eq.x}%`, 
                                                        top: `${eq.y}%`,
                                                        backgroundColor: statusColors[eq.status]?.bg
                                                    }}
                                                    onClick={() => setSelectedEquipment(eq)}
                                                    title={`${eq.name} - ${eq.status}`}
                                                />
                                            ))
                                        }
                                    </div>
                                )}

                                {/* Main Corridor */}
                                <div className="corridor-2d">
                                    <span>Main Corridor</span>
                                </div>
                            </div>
                        ) : (
                            /* ═══════════════════════════════════════════════════════════════
                               3D ISOMETRIC VIEW
                            ═══════════════════════════════════════════════════════════════ */
                            <div 
                                className="scene-3d"
                                style={{
                                    transform: `
                                        perspective(1500px)
                                        rotateX(${viewAngle.rotateX}deg)
                                        rotateZ(${viewAngle.rotateZ}deg)
                                        scale(${zoom})
                                    `
                                }}
                            >
                                {/* Floor Base */}
                                <div className="floor-base-3d" style={{ '--floor-color': currentFloorData?.color }}>
                                    <span className="floor-base-label">{currentFloorData?.name}</span>
                                </div>

                                {/* Building Blocks */}
                                <div className="buildings-container">
                                    {currentRooms.map((room, idx) => {
                                        const style = roomTypeStyles[room.type];
                                        const height = room.beds ? 50 + room.beds * 2 : 45 + Math.random() * 30;
                                        const isHighlighted = selectedRoom?.id === room.id || 
                                            (selectedEquipment && selectedEquipment.room === room.id);
                                        
                                        return (
                                            <div 
                                                key={room.id}
                                                className="building-wrapper"
                                                style={{
                                                    gridColumn: room.span ? `span ${room.span}` : 'span 1',
                                                }}
                                                onClick={() => setSelectedRoom(room)}
                                            >
                                                <Building3D 
                                                    room={room}
                                                    style={style}
                                                    floor={activeFloor}
                                                    isHighlighted={isHighlighted}
                                                    height={height}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Equipment Markers in 3D */}
                                {userMode === 'worker' && equipmentInventory
                                    .filter(eq => eq.floor === activeFloor)
                                    .map(eq => (
                                        <div 
                                            key={eq.id}
                                            className={`marker-3d ${selectedEquipment?.id === eq.id ? 'marker-3d--selected' : ''}`}
                                            style={{ 
                                                left: `${eq.x * 2}px`, 
                                                top: `${eq.y * 2}px`,
                                                '--marker-color': statusColors[eq.status]?.bg
                                            }}
                                            onClick={() => setSelectedEquipment(eq)}
                                            title={eq.name}
                                        >
                                            <div className="marker-pin"></div>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="map-legend">
                        {userMode === 'worker' ? (
                            <>
                                <h4>Equipment Status</h4>
                                <div className="legend-items">
                                    {Object.entries(statusColors).map(([key, value]) => (
                                        <div key={key} className="legend-item">
                                            <span className="legend-dot" style={{ backgroundColor: value.bg }}></span>
                                            <span>{value.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <h4>Department Types</h4>
                                <div className="legend-items">
                                    <div className="legend-item">
                                        <span className="legend-dot" style={{ backgroundColor: '#ef4444' }}></span>
                                        <span>Emergency/ICU</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-dot" style={{ backgroundColor: '#ec4899' }}></span>
                                        <span>Surgery</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-dot" style={{ backgroundColor: '#f59e0b' }}></span>
                                        <span>Wards</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-dot" style={{ backgroundColor: '#3b82f6' }}></span>
                                        <span>Diagnostics</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-dot" style={{ backgroundColor: '#22c55e' }}></span>
                                        <span>Services</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDEBAR - Room Details / Navigation */}
                <div className="hospital-sidebar hospital-sidebar--right">
                    {/* Room/Equipment Details */}
                    <div className="sidebar-section">
                        <h3><Eye size={16} /> Details</h3>
                        
                        {selectedRoom ? (
                            <div className="detail-card">
                                <div className="detail-header">
                                    <span className="detail-icon">{selectedRoom.icon}</span>
                                    <div>
                                        <h4>{selectedRoom.name}</h4>
                                        {selectedRoom.subtitle && <span>{selectedRoom.subtitle}</span>}
                                    </div>
                                </div>
                                
                                <div className="detail-info">
                                    <div className="info-row">
                                        <span>Floor:</span>
                                        <strong>{currentFloorData?.name}</strong>
                                    </div>
                                    <div className="info-row">
                                        <span>Type:</span>
                                        <strong style={{ color: roomTypeStyles[selectedRoom.type]?.color }}>
                                            {selectedRoom.type.charAt(0).toUpperCase() + selectedRoom.type.slice(1)}
                                        </strong>
                                    </div>
                                    {selectedRoom.beds && (
                                        <div className="info-row">
                                            <span>Beds:</span>
                                            <strong>{selectedRoom.beds}</strong>
                                        </div>
                                    )}
                                </div>

                                {userMode === 'worker' && (
                                    <div className="room-equipment-list">
                                        <h5>Equipment in this room:</h5>
                                        {equipmentInventory
                                            .filter(eq => eq.floor === activeFloor && eq.room === selectedRoom.id)
                                            .map(eq => (
                                                <div key={eq.id} className="mini-equipment">
                                                    <span 
                                                        className="mini-status"
                                                        style={{ backgroundColor: statusColors[eq.status]?.bg }}
                                                    />
                                                    <span>{eq.name}</span>
                                                </div>
                                            ))
                                        }
                                        {equipmentInventory.filter(eq => eq.floor === activeFloor && eq.room === selectedRoom.id).length === 0 && (
                                            <p className="no-equipment">No equipment in this room</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : selectedEquipment ? (
                            <div className="detail-card">
                                <div className="detail-header">
                                    <span 
                                        className="detail-status"
                                        style={{ backgroundColor: statusColors[selectedEquipment.status]?.bg }}
                                    />
                                    <div>
                                        <h4>{selectedEquipment.name}</h4>
                                        <span>{statusColors[selectedEquipment.status]?.label}</span>
                                    </div>
                                </div>
                                
                                <div className="detail-info">
                                    <div className="info-row">
                                        <span>Category:</span>
                                        <strong>{equipmentCategories.find(c => c.id === selectedEquipment.category)?.name}</strong>
                                    </div>
                                    <div className="info-row">
                                        <span>Floor:</span>
                                        <strong>{floors.find(f => f.id === selectedEquipment.floor)?.name}</strong>
                                    </div>
                                    <div className="info-row">
                                        <span>Room:</span>
                                        <strong>{selectedEquipment.room}</strong>
                                    </div>
                                </div>

                                <button className="action-btn action-btn--primary">
                                    <Navigation size={16} />
                                    Navigate to Equipment
                                </button>
                                
                                {selectedEquipment.status === 'available' && (
                                    <button className="action-btn action-btn--secondary">
                                        <CheckCircle size={16} />
                                        Mark as In Use
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="detail-empty">
                                <Compass size={40} />
                                <p>Select a room or equipment to view details</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Navigation */}
                    <div className="sidebar-section">
                        <h3><Navigation size={16} /> Quick Access</h3>
                        <div className="quick-nav">
                            <button onClick={() => { setActiveFloor('ground'); setSelectedRoom(hospitalRooms.ground[0]); }}>
                                <AlertTriangle size={16} />
                                <span>Emergency</span>
                            </button>
                            <button onClick={() => { setActiveFloor('ground'); setSelectedRoom(hospitalRooms.ground.find(r => r.id === 'pharmacy')); }}>
                                <Pill size={16} />
                                <span>Pharmacy</span>
                            </button>
                            <button onClick={() => { setActiveFloor('first'); setSelectedRoom(hospitalRooms.first.find(r => r.id === 'icu')); }}>
                                <Heart size={16} />
                                <span>ICU</span>
                            </button>
                            <button onClick={() => { setActiveFloor('ground'); setSelectedRoom(hospitalRooms.ground.find(r => r.id === 'reception')); }}>
                                <Users size={16} />
                                <span>Reception</span>
                            </button>
                        </div>
                    </div>

                    {/* Hospital Info */}
                    <div className="sidebar-section hospital-info">
                        <div className="info-item">
                            <Clock size={16} />
                            <span>Open 24/7</span>
                        </div>
                        <div className="info-item">
                            <Phone size={16} />
                            <span>+1 234 567 8900</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
