import { useState, useRef, useEffect } from 'react';
import { 
    Search, RotateCcw, ArrowUp, Circle, Hand, MapPin, Compass, 
    User, Users, Box, Map as MapIcon, ChevronDown, Filter,
    Bed, Heart, Baby, Stethoscope, FlaskConical, Utensils, 
    Pill, Package, Activity, Scan, Phone, Clock, CheckCircle,
    AlertTriangle, Wrench, Eye, Navigation, Building2, Layers,
    UserCircle, Calendar, FileText, Route, Target, X, ChevronRight,
    Timer, Hourglass, Zap, ShieldAlert, ListOrdered, ArrowRightLeft
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

// Patient condition colors
const conditionColors = {
    'stable': { bg: '#22c55e', label: 'Stable', icon: '✓' },
    'moderate': { bg: '#f59e0b', label: 'Moderate', icon: '⚠' },
    'critical': { bg: '#ef4444', label: 'Critical', icon: '!' },
    'recovering': { bg: '#3b82f6', label: 'Recovering', icon: '↑' },
};

// Admitted Patients Data
const admittedPatients = [
    // Ground Floor - Emergency
    { id: 'P001', name: 'John Smith', age: 45, gender: 'Male', floor: 'ground', room: 'emergency', bed: 'E-01', condition: 'critical', admissionDate: '2024-01-15', doctor: 'Dr. Sarah Wilson', diagnosis: 'Cardiac Emergency', contact: '+1-555-0101', x: 18, y: 38 },
    { id: 'P002', name: 'Emily Davis', age: 32, gender: 'Female', floor: 'ground', room: 'emergency', bed: 'E-03', condition: 'moderate', admissionDate: '2024-01-16', doctor: 'Dr. James Chen', diagnosis: 'Severe Allergic Reaction', contact: '+1-555-0102', x: 22, y: 42 },
    { id: 'P003', name: 'Robert Johnson', age: 58, gender: 'Male', floor: 'ground', room: 'emergency', bed: 'E-05', condition: 'stable', admissionDate: '2024-01-16', doctor: 'Dr. Sarah Wilson', diagnosis: 'Fracture - Left Arm', contact: '+1-555-0103', x: 26, y: 38 },
    
    // First Floor - ICU
    { id: 'P004', name: 'Maria Garcia', age: 67, gender: 'Female', floor: 'first', room: 'icu', bed: 'ICU-01', condition: 'critical', admissionDate: '2024-01-14', doctor: 'Dr. Michael Brown', diagnosis: 'Post Cardiac Surgery', contact: '+1-555-0104', x: 62, y: 38 },
    { id: 'P005', name: 'David Lee', age: 52, gender: 'Male', floor: 'first', room: 'icu', bed: 'ICU-02', condition: 'critical', admissionDate: '2024-01-15', doctor: 'Dr. Michael Brown', diagnosis: 'Respiratory Failure', contact: '+1-555-0105', x: 66, y: 42 },
    { id: 'P006', name: 'Susan Miller', age: 41, gender: 'Female', floor: 'first', room: 'icu', bed: 'ICU-04', condition: 'moderate', admissionDate: '2024-01-16', doctor: 'Dr. Lisa Park', diagnosis: 'Sepsis', contact: '+1-555-0106', x: 70, y: 38 },
    
    // First Floor - Recovery
    { id: 'P007', name: 'James Wilson', age: 55, gender: 'Male', floor: 'first', room: 'recovery', bed: 'R-02', condition: 'recovering', admissionDate: '2024-01-13', doctor: 'Dr. Robert Kim', diagnosis: 'Post Appendectomy', contact: '+1-555-0107', x: 86, y: 42 },
    { id: 'P008', name: 'Patricia Brown', age: 38, gender: 'Female', floor: 'first', room: 'recovery', bed: 'R-05', condition: 'stable', admissionDate: '2024-01-14', doctor: 'Dr. Robert Kim', diagnosis: 'Post Knee Surgery', contact: '+1-555-0108', x: 90, y: 38 },
    
    // Second Floor - Maternity
    { id: 'P009', name: 'Jennifer Martinez', age: 28, gender: 'Female', floor: 'second', room: 'maternity', bed: 'M-03', condition: 'stable', admissionDate: '2024-01-16', doctor: 'Dr. Amanda White', diagnosis: 'Labor & Delivery', contact: '+1-555-0109', x: 18, y: 42 },
    { id: 'P010', name: 'Ashley Thompson', age: 31, gender: 'Female', floor: 'second', room: 'maternity', bed: 'M-07', condition: 'stable', admissionDate: '2024-01-15', doctor: 'Dr. Amanda White', diagnosis: 'Post Cesarean', contact: '+1-555-0110', x: 22, y: 38 },
    
    // Second Floor - NICU
    { id: 'P011', name: 'Baby Martinez', age: 0, gender: 'Male', floor: 'second', room: 'nicu', bed: 'NICU-02', condition: 'moderate', admissionDate: '2024-01-16', doctor: 'Dr. Emily Ross', diagnosis: 'Premature - 34 weeks', contact: '+1-555-0109', x: 40, y: 42 },
    
    // Second Floor - Pediatrics
    { id: 'P012', name: 'Tommy Anderson', age: 8, gender: 'Male', floor: 'second', room: 'pediatrics', bed: 'PED-04', condition: 'stable', admissionDate: '2024-01-15', doctor: 'Dr. Emily Ross', diagnosis: 'Appendicitis - Post Op', contact: '+1-555-0112', x: 66, y: 38 },
    { id: 'P013', name: 'Sophia Clark', age: 5, gender: 'Female', floor: 'second', room: 'pediatrics', bed: 'PED-08', condition: 'recovering', admissionDate: '2024-01-14', doctor: 'Dr. Emily Ross', diagnosis: 'Pneumonia', contact: '+1-555-0113', x: 70, y: 42 },
    
    // Third Floor - General Ward A (Male)
    { id: 'P014', name: 'Michael Taylor', age: 62, gender: 'Male', floor: 'third', room: 'general-ward-a', bed: 'A-05', condition: 'stable', admissionDate: '2024-01-14', doctor: 'Dr. James Chen', diagnosis: 'Diabetes Management', contact: '+1-555-0114', x: 16, y: 38 },
    { id: 'P015', name: 'William Harris', age: 48, gender: 'Male', floor: 'third', room: 'general-ward-a', bed: 'A-12', condition: 'recovering', admissionDate: '2024-01-13', doctor: 'Dr. James Chen', diagnosis: 'Hernia Surgery Recovery', contact: '+1-555-0115', x: 20, y: 42 },
    { id: 'P016', name: 'Richard Moore', age: 71, gender: 'Male', floor: 'third', room: 'general-ward-a', bed: 'A-18', condition: 'stable', admissionDate: '2024-01-15', doctor: 'Dr. Sarah Wilson', diagnosis: 'Hip Replacement Recovery', contact: '+1-555-0116', x: 24, y: 38 },
    
    // Third Floor - General Ward B (Female)
    { id: 'P017', name: 'Linda Jackson', age: 56, gender: 'Female', floor: 'third', room: 'general-ward-b', bed: 'B-03', condition: 'stable', admissionDate: '2024-01-15', doctor: 'Dr. Lisa Park', diagnosis: 'Gallbladder Surgery Recovery', contact: '+1-555-0117', x: 38, y: 42 },
    { id: 'P018', name: 'Barbara White', age: 64, gender: 'Female', floor: 'third', room: 'general-ward-b', bed: 'B-09', condition: 'moderate', admissionDate: '2024-01-14', doctor: 'Dr. Lisa Park', diagnosis: 'Kidney Infection', contact: '+1-555-0118', x: 42, y: 38 },
    
    // Third Floor - Private Rooms
    { id: 'P019', name: 'Charles Robinson', age: 54, gender: 'Male', floor: 'third', room: 'private-rooms', bed: 'PR-02', condition: 'recovering', admissionDate: '2024-01-13', doctor: 'Dr. Michael Brown', diagnosis: 'Bypass Surgery Recovery', contact: '+1-555-0119', x: 66, y: 42 },
    { id: 'P020', name: 'Elizabeth Thomas', age: 45, gender: 'Female', floor: 'third', room: 'private-rooms', bed: 'PR-06', condition: 'stable', admissionDate: '2024-01-16', doctor: 'Dr. Amanda White', diagnosis: 'Observation', contact: '+1-555-0120', x: 70, y: 38 },
    
    // Third Floor - VIP Suite
    { id: 'P021', name: 'George Thompson', age: 68, gender: 'Male', floor: 'third', room: 'vip-suite', bed: 'VIP-01', condition: 'stable', admissionDate: '2024-01-15', doctor: 'Dr. Michael Brown', diagnosis: 'Executive Health Check', contact: '+1-555-0121', x: 88, y: 40 },
];

// ═══════════════════════════════════════════════════════════════
// PRIORITY LEVELS FOR RESOURCE ALLOCATION
// ═══════════════════════════════════════════════════════════════
const priorityLevels = {
    'critical': { level: 1, label: 'Critical Emergency', color: '#ef4444', waitTime: 0 },
    'moderate': { level: 2, label: 'Moderate/Urgent', color: '#f59e0b', waitTime: 15 },
    'stable': { level: 3, label: 'Stable/Non-Critical', color: '#22c55e', waitTime: 30 },
    'recovering': { level: 4, label: 'Recovering', color: '#3b82f6', waitTime: 45 },
};

// Resource requests - who needs what equipment
const initialResourceRequests = [
    // Critical patients - Immediate priority
    { id: 'RR001', patientId: 'P001', resourceId: 'vent-001', resourceType: 'ventilator', priority: 'critical', requestTime: '2024-01-16T08:00:00', status: 'allocated', estimatedDuration: 120 },
    { id: 'RR002', patientId: 'P004', resourceId: 'vent-003', resourceType: 'ventilator', priority: 'critical', requestTime: '2024-01-16T08:15:00', status: 'allocated', estimatedDuration: 180 },
    { id: 'RR003', patientId: 'P005', resourceId: 'mon-003', resourceType: 'monitor', priority: 'critical', requestTime: '2024-01-16T08:30:00', status: 'allocated', estimatedDuration: 240 },
    
    // Moderate patients - Waiting or allocated
    { id: 'RR004', patientId: 'P002', resourceId: 'mon-001', resourceType: 'monitor', priority: 'moderate', requestTime: '2024-01-16T09:00:00', status: 'allocated', estimatedDuration: 60 },
    { id: 'RR005', patientId: 'P006', resourceId: 'vent-002', resourceType: 'ventilator', priority: 'moderate', requestTime: '2024-01-16T09:30:00', status: 'waiting', waitingSince: '2024-01-16T09:30:00', estimatedWait: 25 },
    { id: 'RR006', patientId: 'P011', resourceId: 'inc-001', resourceType: 'monitor', priority: 'moderate', requestTime: '2024-01-16T09:45:00', status: 'allocated', estimatedDuration: 480 },
    { id: 'RR007', patientId: 'P018', resourceId: 'mon-009', resourceType: 'monitor', priority: 'moderate', requestTime: '2024-01-16T10:00:00', status: 'waiting', waitingSince: '2024-01-16T10:00:00', estimatedWait: 15 },
    
    // Stable/Non-critical patients - Lower priority, may wait
    { id: 'RR008', patientId: 'P003', resourceId: 'wc-001', resourceType: 'wheelchair', priority: 'stable', requestTime: '2024-01-16T10:30:00', status: 'waiting', waitingSince: '2024-01-16T10:30:00', estimatedWait: 35 },
    { id: 'RR009', patientId: 'P008', resourceId: 'str-004', resourceType: 'stretcher', priority: 'stable', requestTime: '2024-01-16T10:45:00', status: 'waiting', waitingSince: '2024-01-16T10:45:00', estimatedWait: 40 },
    { id: 'RR010', patientId: 'P012', resourceId: 'wc-004', resourceType: 'wheelchair', priority: 'stable', requestTime: '2024-01-16T11:00:00', status: 'allocated', estimatedDuration: 30 },
    { id: 'RR011', patientId: 'P014', resourceId: 'inf-004', resourceType: 'infusion', priority: 'stable', requestTime: '2024-01-16T11:15:00', status: 'waiting', waitingSince: '2024-01-16T11:15:00', estimatedWait: 50 },
    
    // Recovering patients - Lowest priority
    { id: 'RR012', patientId: 'P007', resourceId: 'wc-005', resourceType: 'wheelchair', priority: 'recovering', requestTime: '2024-01-16T11:30:00', status: 'waiting', waitingSince: '2024-01-16T11:30:00', estimatedWait: 60 },
    { id: 'RR013', patientId: 'P013', resourceId: 'o2-003', resourceType: 'oxygen', priority: 'recovering', requestTime: '2024-01-16T11:45:00', status: 'allocated', estimatedDuration: 45 },
    { id: 'RR014', patientId: 'P015', resourceId: 'str-005', resourceType: 'stretcher', priority: 'recovering', requestTime: '2024-01-16T12:00:00', status: 'waiting', waitingSince: '2024-01-16T12:00:00', estimatedWait: 70 },
    { id: 'RR015', patientId: 'P019', resourceId: 'mon-009', resourceType: 'monitor', priority: 'recovering', requestTime: '2024-01-16T12:15:00', status: 'queued', queuePosition: 3, estimatedWait: 90 },
];

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

// Patient Item Component
const PatientItem = ({ patient, isSelected, onClick, onNavigate }) => (
    <div 
        className={`patient-item ${isSelected ? 'patient-item--selected' : ''}`}
        onClick={() => onClick(patient)}
    >
        <div 
            className="patient-item__condition"
            style={{ backgroundColor: conditionColors[patient.condition]?.bg }}
        >
            {conditionColors[patient.condition]?.icon}
        </div>
        <div className="patient-item__info">
            <span className="patient-item__name">{patient.name}</span>
            <span className="patient-item__details">
                {patient.bed} • {patient.room} • {patient.age}y
            </span>
        </div>
        <button 
            className="patient-item__nav-btn"
            onClick={(e) => { e.stopPropagation(); onNavigate(patient); }}
            title="Navigate to patient"
        >
            <Route size={14} />
        </button>
        <span className={`patient-item__badge patient-item__badge--${patient.condition}`}>
            {conditionColors[patient.condition]?.label}
        </span>
    </div>
);

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
    
    // Patient tracking state
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientSearch, setPatientSearch] = useState('');
    const [isNavigating, setIsNavigating] = useState(false);
    const [navigationTarget, setNavigationTarget] = useState(null);
    const [showPatientList, setShowPatientList] = useState(true);
    
    // Resource allocation state
    const [resourceRequests, setResourceRequests] = useState(initialResourceRequests);
    const [showResourcePanel, setShowResourcePanel] = useState(false);
    const [conflictAlert, setConflictAlert] = useState(null);
    
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

    // Filter patients
    const filteredPatients = admittedPatients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
                             patient.id.toLowerCase().includes(patientSearch.toLowerCase()) ||
                             patient.bed.toLowerCase().includes(patientSearch.toLowerCase()) ||
                             patient.room.toLowerCase().includes(patientSearch.toLowerCase()) ||
                             patient.diagnosis.toLowerCase().includes(patientSearch.toLowerCase());
        return matchesSearch;
    });

    // Get patients on current floor
    const patientsOnFloor = admittedPatients.filter(p => p.floor === activeFloor);

    // Patient stats
    const patientStats = {
        total: admittedPatients.length,
        critical: admittedPatients.filter(p => p.condition === 'critical').length,
        moderate: admittedPatients.filter(p => p.condition === 'moderate').length,
        stable: admittedPatients.filter(p => p.condition === 'stable' || p.condition === 'recovering').length,
    };

    // Navigate to patient function
    const navigateToPatient = (patient) => {
        setNavigationTarget(patient);
        setIsNavigating(true);
        setActiveFloor(patient.floor);
        setSelectedPatient(patient);
        const room = Object.values(hospitalRooms).flat().find(r => r.id === patient.room);
        if (room) setSelectedRoom(room);
    };

    // Stop navigation
    const stopNavigation = () => {
        setIsNavigating(false);
        setNavigationTarget(null);
    };

    // ═══════════════════════════════════════════════════════════════
    // RESOURCE ALLOCATION FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    // Get priority level number (lower = higher priority)
    const getPriorityLevel = (priority) => priorityLevels[priority]?.level || 99;

    // Get waiting queue sorted by priority
    const getWaitingQueue = () => {
        return resourceRequests
            .filter(r => r.status === 'waiting' || r.status === 'queued')
            .sort((a, b) => {
                // First sort by priority level
                const priorityDiff = getPriorityLevel(a.priority) - getPriorityLevel(b.priority);
                if (priorityDiff !== 0) return priorityDiff;
                // Then by request time
                return new Date(a.requestTime) - new Date(b.requestTime);
            });
    };

    // Get allocated resources
    const getAllocatedResources = () => {
        return resourceRequests.filter(r => r.status === 'allocated');
    };

    // Check for resource conflicts (multiple patients requesting same resource)
    const getResourceConflicts = () => {
        const resourceMap = {};
        resourceRequests.forEach(req => {
            if (!resourceMap[req.resourceId]) {
                resourceMap[req.resourceId] = [];
            }
            resourceMap[req.resourceId].push(req);
        });
        
        return Object.entries(resourceMap)
            .filter(([_, requests]) => requests.length > 1)
            .map(([resourceId, requests]) => ({
                resourceId,
                resourceName: equipmentInventory.find(e => e.id === resourceId)?.name || resourceId,
                requests: requests.sort((a, b) => getPriorityLevel(a.priority) - getPriorityLevel(b.priority))
            }));
    };

    // Resolve conflict by allocating to highest priority patient
    const resolveConflict = (resourceId) => {
        const conflicts = getResourceConflicts().find(c => c.resourceId === resourceId);
        if (!conflicts) return;

        const sortedRequests = conflicts.requests;
        const winner = sortedRequests[0]; // Highest priority gets it
        
        setResourceRequests(prev => prev.map(req => {
            if (req.resourceId === resourceId) {
                if (req.id === winner.id) {
                    return { ...req, status: 'allocated' };
                } else {
                    // Calculate wait time based on priority difference
                    const basewait = priorityLevels[req.priority]?.waitTime || 30;
                    return { 
                        ...req, 
                        status: 'waiting', 
                        estimatedWait: basewait + Math.floor(Math.random() * 20),
                        waitingSince: new Date().toISOString()
                    };
                }
            }
            return req;
        }));

        // Show allocation notification
        const winnerPatient = admittedPatients.find(p => p.id === winner.patientId);
        setConflictAlert({
            type: 'resolved',
            message: `Resource allocated to ${winnerPatient?.name || winner.patientId} (${priorityLevels[winner.priority]?.label})`,
            resourceName: conflicts.resourceName
        });
        setTimeout(() => setConflictAlert(null), 5000);
    };

    // Request resource for a patient
    const requestResource = (patientId, resourceId, resourceType) => {
        const patient = admittedPatients.find(p => p.id === patientId);
        if (!patient) return;

        // Check if resource is already requested/allocated
        const existingRequest = resourceRequests.find(r => r.resourceId === resourceId && r.status === 'allocated');
        
        const newRequest = {
            id: `RR${Date.now()}`,
            patientId,
            resourceId,
            resourceType,
            priority: patient.condition,
            requestTime: new Date().toISOString(),
            status: existingRequest ? 'waiting' : 'allocated',
            estimatedWait: existingRequest ? priorityLevels[patient.condition]?.waitTime || 30 : 0,
            waitingSince: existingRequest ? new Date().toISOString() : null
        };

        setResourceRequests(prev => [...prev, newRequest]);

        // If there's a conflict, check if new request has higher priority
        if (existingRequest && getPriorityLevel(patient.condition) < getPriorityLevel(
            admittedPatients.find(p => p.id === existingRequest.patientId)?.condition
        )) {
            // Critical patient preempts - show conflict alert
            setConflictAlert({
                type: 'conflict',
                message: `Critical patient ${patient.name} needs resource currently in use`,
                resourceName: equipmentInventory.find(e => e.id === resourceId)?.name,
                canPreempt: true,
                newRequestId: newRequest.id,
                existingRequestId: existingRequest.id
            });
        }
    };

    // Preempt resource (give to higher priority patient)
    const preemptResource = (newRequestId, existingRequestId) => {
        setResourceRequests(prev => prev.map(req => {
            if (req.id === newRequestId) {
                return { ...req, status: 'allocated', estimatedWait: 0 };
            }
            if (req.id === existingRequestId) {
                const patient = admittedPatients.find(p => p.id === req.patientId);
                return { 
                    ...req, 
                    status: 'waiting',
                    estimatedWait: priorityLevels[patient?.condition]?.waitTime || 30,
                    waitingSince: new Date().toISOString()
                };
            }
            return req;
        }));
        setConflictAlert(null);
    };

    // Release resource (mark as available)
    const releaseResource = (requestId) => {
        setResourceRequests(prev => {
            const updated = prev.filter(r => r.id !== requestId);
            return updated;
        });
        
        // Check waiting queue and allocate to next patient
        const waitingQueue = getWaitingQueue();
        if (waitingQueue.length > 0) {
            const nextRequest = waitingQueue[0];
            setResourceRequests(prev => prev.map(req => 
                req.id === nextRequest.id 
                    ? { ...req, status: 'allocated', estimatedWait: 0 }
                    : req
            ));
        }
    };

    // Get patient's resource requests
    const getPatientResources = (patientId) => {
        return resourceRequests.filter(r => r.patientId === patientId);
    };

    // Computed values for resource allocation
    const waitingQueue = getWaitingQueue();
    const allocatedResources = getAllocatedResources();
    const resourceConflicts = getResourceConflicts();

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
                    {/* Resource Allocation Toggle */}
                    <button 
                        className={`resource-toggle-btn ${showResourcePanel ? 'active' : ''} ${waitingQueue.length > 0 ? 'has-waiting' : ''}`}
                        onClick={() => setShowResourcePanel(!showResourcePanel)}
                    >
                        <ListOrdered size={16} />
                        <span>Resources</span>
                        {waitingQueue.length > 0 && (
                            <span className="waiting-badge">{waitingQueue.length}</span>
                        )}
                    </button>

                    <div className="emergency-btn">
                        <Phone size={16} />
                        <span>Emergency: 108</span>
                    </div>
                </div>
            </div>

            {/* Conflict Alert Banner */}
            {conflictAlert && (
                <div className={`conflict-alert conflict-alert--${conflictAlert.type}`}>
                    <div className="conflict-alert__content">
                        <ShieldAlert size={20} />
                        <div className="conflict-alert__text">
                            <strong>{conflictAlert.type === 'conflict' ? 'Resource Conflict!' : 'Resolved'}</strong>
                            <span>{conflictAlert.message}</span>
                            {conflictAlert.resourceName && <span className="conflict-resource">Resource: {conflictAlert.resourceName}</span>}
                        </div>
                    </div>
                    {conflictAlert.canPreempt && (
                        <div className="conflict-alert__actions">
                            <button 
                                className="btn-preempt"
                                onClick={() => preemptResource(conflictAlert.newRequestId, conflictAlert.existingRequestId)}
                            >
                                <Zap size={14} />
                                Allocate to Critical
                            </button>
                            <button 
                                className="btn-dismiss"
                                onClick={() => setConflictAlert(null)}
                            >
                                Keep Current
                            </button>
                        </div>
                    )}
                    {!conflictAlert.canPreempt && (
                        <button className="conflict-alert__close" onClick={() => setConflictAlert(null)}>
                            <X size={16} />
                        </button>
                    )}
                </div>
            )}

            {/* Resource Allocation Panel */}
            {showResourcePanel && (
                <div className="resource-panel">
                    <div className="resource-panel__header">
                        <h3><ArrowRightLeft size={18} /> Resource Allocation</h3>
                        <button onClick={() => setShowResourcePanel(false)}><X size={18} /></button>
                    </div>

                    {/* Priority Legend */}
                    <div className="priority-legend">
                        {Object.entries(priorityLevels).map(([key, value]) => (
                            <div key={key} className="priority-item">
                                <span className="priority-dot" style={{ backgroundColor: value.color }}></span>
                                <span>{value.label}</span>
                                <span className="priority-wait">~{value.waitTime} min wait</span>
                            </div>
                        ))}
                    </div>

                    {/* Conflict Warnings */}
                    {resourceConflicts.length > 0 && (
                        <div className="conflicts-section">
                            <h4><AlertTriangle size={14} /> Resource Conflicts ({resourceConflicts.length})</h4>
                            {resourceConflicts.map(conflict => (
                                <div key={conflict.resourceId} className="conflict-item">
                                    <div className="conflict-resource-name">
                                        <Package size={14} />
                                        {conflict.resourceName}
                                    </div>
                                    <div className="conflict-patients">
                                        {conflict.requests.map((req, idx) => {
                                            const patient = admittedPatients.find(p => p.id === req.patientId);
                                            return (
                                                <div 
                                                    key={req.id} 
                                                    className={`conflict-patient ${idx === 0 ? 'winner' : 'waiting'}`}
                                                >
                                                    <span 
                                                        className="priority-indicator"
                                                        style={{ backgroundColor: priorityLevels[req.priority]?.color }}
                                                    />
                                                    <span>{patient?.name}</span>
                                                    <span className="priority-label">{priorityLevels[req.priority]?.label}</span>
                                                    {idx === 0 && <CheckCircle size={12} className="winner-icon" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button 
                                        className="resolve-btn"
                                        onClick={() => resolveConflict(conflict.resourceId)}
                                    >
                                        Auto-Resolve by Priority
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Waiting Queue */}
                    <div className="waiting-section">
                        <h4><Hourglass size={14} /> Waiting Queue ({waitingQueue.length})</h4>
                        {waitingQueue.length === 0 ? (
                            <p className="no-waiting">No patients waiting for resources</p>
                        ) : (
                            <div className="waiting-list">
                                {waitingQueue.map((request, idx) => {
                                    const patient = admittedPatients.find(p => p.id === request.patientId);
                                    const resource = equipmentInventory.find(e => e.id === request.resourceId);
                                    return (
                                        <div key={request.id} className="waiting-item">
                                            <div className="waiting-position">#{idx + 1}</div>
                                            <div 
                                                className="waiting-priority"
                                                style={{ backgroundColor: priorityLevels[request.priority]?.color }}
                                            />
                                            <div className="waiting-info">
                                                <span className="waiting-patient">{patient?.name}</span>
                                                <span className="waiting-resource">
                                                    Needs: {resource?.name || request.resourceType}
                                                </span>
                                            </div>
                                            <div className="waiting-time">
                                                <Timer size={12} />
                                                <span>~{request.estimatedWait} min</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Currently Allocated */}
                    <div className="allocated-section">
                        <h4><CheckCircle size={14} /> Currently Allocated ({allocatedResources.length})</h4>
                        <div className="allocated-list">
                            {allocatedResources.slice(0, 6).map(request => {
                                const patient = admittedPatients.find(p => p.id === request.patientId);
                                const resource = equipmentInventory.find(e => e.id === request.resourceId);
                                return (
                                    <div key={request.id} className="allocated-item">
                                        <div 
                                            className="allocated-priority"
                                            style={{ backgroundColor: priorityLevels[request.priority]?.color }}
                                        />
                                        <div className="allocated-info">
                                            <span>{patient?.name}</span>
                                            <span className="allocated-resource">{resource?.name}</span>
                                        </div>
                                        <button 
                                            className="release-btn"
                                            onClick={() => releaseResource(request.id)}
                                            title="Release resource"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

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
                            {/* Patient Mode - Patient List & Search */}
                            <div className="sidebar-section">
                                <h3><UserCircle size={16} /> Find Patient</h3>
                                <div className="search-box">
                                    <Search size={16} />
                                    <input 
                                        type="text"
                                        placeholder="Search by name, ID, bed, room..."
                                        value={patientSearch}
                                        onChange={(e) => setPatientSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Patient Stats */}
                            <div className="sidebar-section">
                                <h3><Activity size={16} /> Patient Overview</h3>
                                <div className="stats-grid stats-grid--4">
                                    <div className="stat-box">
                                        <span className="stat-value">{patientStats.total}</span>
                                        <span className="stat-label">Total</span>
                                        <div className="stat-bar" style={{ backgroundColor: '#3b82f6' }}></div>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-value">{patientStats.critical}</span>
                                        <span className="stat-label">Critical</span>
                                        <div className="stat-bar" style={{ backgroundColor: '#ef4444' }}></div>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-value">{patientStats.moderate}</span>
                                        <span className="stat-label">Moderate</span>
                                        <div className="stat-bar" style={{ backgroundColor: '#f59e0b' }}></div>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-value">{patientStats.stable}</span>
                                        <span className="stat-label">Stable</span>
                                        <div className="stat-bar" style={{ backgroundColor: '#22c55e' }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Admitted Patients List */}
                            <div className="sidebar-section sidebar-section--scroll">
                                <h3>
                                    <Bed size={16} /> 
                                    Admitted Patients ({filteredPatients.length})
                                </h3>
                                <div className="patient-list">
                                    {filteredPatients.map(patient => (
                                        <PatientItem 
                                            key={patient.id}
                                            patient={patient}
                                            isSelected={selectedPatient?.id === patient.id}
                                            onClick={(p) => {
                                                setSelectedPatient(p);
                                                setActiveFloor(p.floor);
                                                setSelectedRoom(null);
                                                setSelectedEquipment(null);
                                            }}
                                            onNavigate={navigateToPatient}
                                        />
                                    ))}
                                    {filteredPatients.length === 0 && (
                                        <p className="no-results">No patients found matching your search</p>
                                    )}
                                </div>
                            </div>

                            {/* Department Directory */}
                            <div className="sidebar-section sidebar-section--collapsed">
                                <h3 
                                    onClick={() => setShowPatientList(!showPatientList)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Building2 size={16} /> 
                                    Department Directory
                                    <ChevronDown 
                                        size={16} 
                                        style={{ 
                                            marginLeft: 'auto', 
                                            transform: showPatientList ? 'rotate(180deg)' : 'none',
                                            transition: 'transform 0.2s'
                                        }} 
                                    />
                                </h3>
                                {!showPatientList && (
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
                                )}
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

                                {/* Patient Markers (Patient Mode) */}
                                {userMode === 'patient' && (
                                    <div className="patient-overlay">
                                        {patientsOnFloor.map(patient => (
                                            <div 
                                                key={patient.id}
                                                className={`patient-marker ${selectedPatient?.id === patient.id ? 'patient-marker--selected' : ''} ${navigationTarget?.id === patient.id ? 'patient-marker--navigating' : ''}`}
                                                style={{ 
                                                    left: `${patient.x}%`, 
                                                    top: `${patient.y}%`,
                                                    '--condition-color': conditionColors[patient.condition]?.bg
                                                }}
                                                onClick={() => {
                                                    setSelectedPatient(patient);
                                                    setSelectedRoom(null);
                                                    setSelectedEquipment(null);
                                                }}
                                                title={`${patient.name} - ${patient.bed}`}
                                            >
                                                <UserCircle size={16} />
                                                <span className="patient-marker__label">{patient.bed}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Navigation Path Visualization */}
                                {isNavigating && navigationTarget && navigationTarget.floor === activeFloor && (
                                    <svg className="navigation-path-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        {/* Entrance point (reception/main entrance) */}
                                        <circle 
                                            cx="50" 
                                            cy="95" 
                                            r="2" 
                                            fill="#22c55e" 
                                            className="nav-point nav-point--start"
                                        />
                                        {/* Path from entrance through corridor to patient */}
                                        <path 
                                            d={`M 50 95 L 50 50 L ${navigationTarget.x} 50 L ${navigationTarget.x} ${navigationTarget.y}`}
                                            className="nav-path"
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="0.8"
                                            strokeDasharray="2,1"
                                        />
                                        {/* Target point */}
                                        <circle 
                                            cx={navigationTarget.x} 
                                            cy={navigationTarget.y} 
                                            r="2.5" 
                                            fill="#ef4444" 
                                            className="nav-point nav-point--end"
                                        />
                                    </svg>
                                )}

                                {/* Navigation Banner */}
                                {isNavigating && navigationTarget && (
                                    <div className="navigation-banner">
                                        <div className="navigation-banner__content">
                                            <Target size={18} className="pulse-icon" />
                                            <div className="navigation-banner__info">
                                                <span className="navigation-banner__title">Navigating to: {navigationTarget.name}</span>
                                                <span className="navigation-banner__subtitle">
                                                    {floors.find(f => f.id === navigationTarget.floor)?.name} → {navigationTarget.room} → Bed {navigationTarget.bed}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="navigation-banner__close" onClick={stopNavigation}>
                                            <X size={16} />
                                        </button>
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

                                {/* Patient Markers in 3D */}
                                {userMode === 'patient' && patientsOnFloor.map(patient => (
                                    <div 
                                        key={patient.id}
                                        className={`marker-3d marker-3d--patient ${selectedPatient?.id === patient.id ? 'marker-3d--selected' : ''} ${navigationTarget?.id === patient.id ? 'marker-3d--navigating' : ''}`}
                                        style={{ 
                                            left: `${patient.x * 2}px`, 
                                            top: `${patient.y * 2}px`,
                                            '--marker-color': conditionColors[patient.condition]?.bg
                                        }}
                                        onClick={() => {
                                            setSelectedPatient(patient);
                                            setSelectedRoom(null);
                                            setSelectedEquipment(null);
                                        }}
                                        title={`${patient.name} - ${patient.bed}`}
                                    >
                                        <div className="marker-pin"></div>
                                        <span className="marker-label-3d">{patient.bed}</span>
                                    </div>
                                ))}
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
                                <h4>Patient Condition</h4>
                                <div className="legend-items">
                                    {Object.entries(conditionColors).map(([key, value]) => (
                                        <div key={key} className="legend-item">
                                            <span className="legend-dot" style={{ backgroundColor: value.bg }}></span>
                                            <span>{value.label}</span>
                                        </div>
                                    ))}
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
                        ) : selectedPatient ? (
                            <div className="detail-card detail-card--patient">
                                <div className="detail-header">
                                    <div 
                                        className="patient-avatar"
                                        style={{ backgroundColor: conditionColors[selectedPatient.condition]?.bg }}
                                    >
                                        <UserCircle size={24} />
                                    </div>
                                    <div>
                                        <h4>{selectedPatient.name}</h4>
                                        <span className={`condition-badge condition-badge--${selectedPatient.condition}`}>
                                            {conditionColors[selectedPatient.condition]?.icon} {conditionColors[selectedPatient.condition]?.label}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="detail-info">
                                    <div className="info-row">
                                        <span>Patient ID:</span>
                                        <strong>{selectedPatient.id}</strong>
                                    </div>
                                    <div className="info-row">
                                        <span>Age / Gender:</span>
                                        <strong>{selectedPatient.age}y / {selectedPatient.gender}</strong>
                                    </div>
                                    <div className="info-row">
                                        <span>Bed:</span>
                                        <strong>{selectedPatient.bed}</strong>
                                    </div>
                                    <div className="info-row">
                                        <span>Room:</span>
                                        <strong>{selectedPatient.room}</strong>
                                    </div>
                                    <div className="info-row">
                                        <span>Floor:</span>
                                        <strong>{floors.find(f => f.id === selectedPatient.floor)?.name}</strong>
                                    </div>
                                </div>

                                <div className="patient-medical-info">
                                    <div className="medical-row">
                                        <FileText size={14} />
                                        <div>
                                            <span className="medical-label">Diagnosis</span>
                                            <span className="medical-value">{selectedPatient.diagnosis}</span>
                                        </div>
                                    </div>
                                    <div className="medical-row">
                                        <Stethoscope size={14} />
                                        <div>
                                            <span className="medical-label">Attending Doctor</span>
                                            <span className="medical-value">{selectedPatient.doctor}</span>
                                        </div>
                                    </div>
                                    <div className="medical-row">
                                        <Calendar size={14} />
                                        <div>
                                            <span className="medical-label">Admission Date</span>
                                            <span className="medical-value">{selectedPatient.admissionDate}</span>
                                        </div>
                                    </div>
                                    <div className="medical-row">
                                        <Phone size={14} />
                                        <div>
                                            <span className="medical-label">Emergency Contact</span>
                                            <span className="medical-value">{selectedPatient.contact}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Patient Resource Allocation Status */}
                                {getPatientResources(selectedPatient.id).length > 0 && (
                                    <div className="patient-resources">
                                        <h5><Package size={14} /> Allocated Resources</h5>
                                        {getPatientResources(selectedPatient.id).map(req => {
                                            const resource = equipmentInventory.find(e => e.id === req.resourceId);
                                            return (
                                                <div key={req.id} className={`patient-resource-item patient-resource-item--${req.status}`}>
                                                    <span 
                                                        className="resource-status-dot"
                                                        style={{ 
                                                            backgroundColor: req.status === 'allocated' ? '#22c55e' : 
                                                                req.status === 'waiting' ? '#f59e0b' : '#94a3b8'
                                                        }}
                                                    />
                                                    <div className="resource-info">
                                                        <span className="resource-name">{resource?.name || req.resourceType}</span>
                                                        <span className="resource-status-text">
                                                            {req.status === 'allocated' && 'Currently using'}
                                                            {req.status === 'waiting' && `Waiting ~${req.estimatedWait} min`}
                                                            {req.status === 'queued' && `Queue position: ${req.queuePosition}`}
                                                        </span>
                                                    </div>
                                                    {req.status === 'waiting' && (
                                                        <div className="wait-timer">
                                                            <Hourglass size={12} className="spin-slow" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <button 
                                    className="action-btn action-btn--primary"
                                    onClick={() => navigateToPatient(selectedPatient)}
                                >
                                    <Route size={16} />
                                    Navigate to Patient
                                </button>
                                
                                {isNavigating && navigationTarget?.id === selectedPatient.id && (
                                    <button 
                                        className="action-btn action-btn--danger"
                                        onClick={stopNavigation}
                                    >
                                        <X size={16} />
                                        Stop Navigation
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="detail-empty">
                                <Compass size={40} />
                                <p>{userMode === 'patient' ? 'Select a patient to view details' : 'Select a room or equipment to view details'}</p>
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
