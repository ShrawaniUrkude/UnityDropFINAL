import { useState, useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../hooks/useGsap';
import { 
    Search, RotateCcw, ArrowUp, Circle, Hand, MapPin, Compass, 
    User, Users, Box, Map as MapIcon, ChevronDown, Filter,
    Bed, Heart, Baby, Stethoscope, FlaskConical, Utensils, 
    Pill, Package, Activity, Scan, Phone, Clock, CheckCircle,
    AlertTriangle, Wrench, Eye, Navigation, Building2, Layers,
    UserCircle, Calendar, FileText, Route, Target, X, ChevronRight,
    Timer, Hourglass, Zap, ShieldAlert, ListOrdered, ArrowRightLeft,
    HeartHandshake, MapPinned, ClipboardList, Send,
    Car, Siren, AlertCircle, ShieldCheck, PhoneCall, MapPinCheck,
    Ambulance, Bell, BellRing, Mail, MessageSquare, Smartphone, Radio, Signal, ThumbsUp, BadgeCheck, Share2, RefreshCw, Truck,
    Award, GraduationCap, Star, Briefcase, MessageCircle
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
    { id: 'P001', name: 'Rajesh Sharma', age: 45, gender: 'Male', floor: 'ground', room: 'emergency', bed: 'E-01', condition: 'critical', admissionDate: '2024-01-15', doctor: 'Dr. Sunita Verma', diagnosis: 'Cardiac Emergency', contact: '+91-98765-00101', x: 18, y: 38 },
    { id: 'P002', name: 'Deepika Nair', age: 32, gender: 'Female', floor: 'ground', room: 'emergency', bed: 'E-03', condition: 'moderate', admissionDate: '2024-01-16', doctor: 'Dr. Arvind Mehta', diagnosis: 'Severe Allergic Reaction', contact: '+91-98765-00102', x: 22, y: 42 },
    { id: 'P003', name: 'Suresh Yadav', age: 58, gender: 'Male', floor: 'ground', room: 'emergency', bed: 'E-05', condition: 'stable', admissionDate: '2024-01-16', doctor: 'Dr. Sunita Verma', diagnosis: 'Fracture - Left Arm', contact: '+91-98765-00103', x: 26, y: 38 },
    
    // First Floor - ICU
    { id: 'P004', name: 'Kamala Devi', age: 67, gender: 'Female', floor: 'first', room: 'icu', bed: 'ICU-01', condition: 'critical', admissionDate: '2024-01-14', doctor: 'Dr. Manish Kapoor', diagnosis: 'Post Cardiac Surgery', contact: '+91-98765-00104', x: 62, y: 38 },
    { id: 'P005', name: 'Arun Patel', age: 52, gender: 'Male', floor: 'first', room: 'icu', bed: 'ICU-02', condition: 'critical', admissionDate: '2024-01-15', doctor: 'Dr. Manish Kapoor', diagnosis: 'Respiratory Failure', contact: '+91-98765-00105', x: 66, y: 42 },
    { id: 'P006', name: 'Meena Iyer', age: 41, gender: 'Female', floor: 'first', room: 'icu', bed: 'ICU-04', condition: 'moderate', admissionDate: '2024-01-16', doctor: 'Dr. Lakshmi Rao', diagnosis: 'Sepsis', contact: '+91-98765-00106', x: 70, y: 38 },
    
    // First Floor - Recovery
    { id: 'P007', name: 'Vikram Singh', age: 55, gender: 'Male', floor: 'first', room: 'recovery', bed: 'R-02', condition: 'recovering', admissionDate: '2024-01-13', doctor: 'Dr. Rohit Jain', diagnosis: 'Post Appendectomy', contact: '+91-98765-00107', x: 86, y: 42 },
    { id: 'P008', name: 'Priyanka Gupta', age: 38, gender: 'Female', floor: 'first', room: 'recovery', bed: 'R-05', condition: 'stable', admissionDate: '2024-01-14', doctor: 'Dr. Rohit Jain', diagnosis: 'Post Knee Surgery', contact: '+91-98765-00108', x: 90, y: 38 },
    
    // Second Floor - Maternity
    { id: 'P009', name: 'Ananya Deshmukh', age: 28, gender: 'Female', floor: 'second', room: 'maternity', bed: 'M-03', condition: 'stable', admissionDate: '2024-01-16', doctor: 'Dr. Pooja Bhatt', diagnosis: 'Labor & Delivery', contact: '+91-98765-00109', x: 18, y: 42 },
    { id: 'P010', name: 'Neha Kulkarni', age: 31, gender: 'Female', floor: 'second', room: 'maternity', bed: 'M-07', condition: 'stable', admissionDate: '2024-01-15', doctor: 'Dr. Pooja Bhatt', diagnosis: 'Post Cesarean', contact: '+91-98765-00110', x: 22, y: 38 },
    
    // Second Floor - NICU
    { id: 'P011', name: 'Baby Deshmukh', age: 0, gender: 'Male', floor: 'second', room: 'nicu', bed: 'NICU-02', condition: 'moderate', admissionDate: '2024-01-16', doctor: 'Dr. Sneha Pillai', diagnosis: 'Premature - 34 weeks', contact: '+91-98765-00109', x: 40, y: 42 },
    
    // Second Floor - Pediatrics
    { id: 'P012', name: 'Aarav Mishra', age: 8, gender: 'Male', floor: 'second', room: 'pediatrics', bed: 'PED-04', condition: 'stable', admissionDate: '2024-01-15', doctor: 'Dr. Sneha Pillai', diagnosis: 'Appendicitis - Post Op', contact: '+91-98765-00112', x: 66, y: 38 },
    { id: 'P013', name: 'Ishani Reddy', age: 5, gender: 'Female', floor: 'second', room: 'pediatrics', bed: 'PED-08', condition: 'recovering', admissionDate: '2024-01-14', doctor: 'Dr. Sneha Pillai', diagnosis: 'Pneumonia', contact: '+91-98765-00113', x: 70, y: 42 },
    
    // Third Floor - General Ward A (Male)
    { id: 'P014', name: 'Ramesh Tiwari', age: 62, gender: 'Male', floor: 'third', room: 'general-ward-a', bed: 'A-05', condition: 'stable', admissionDate: '2024-01-14', doctor: 'Dr. Arvind Mehta', diagnosis: 'Diabetes Management', contact: '+91-98765-00114', x: 16, y: 38 },
    { id: 'P015', name: 'Dinesh Chauhan', age: 48, gender: 'Male', floor: 'third', room: 'general-ward-a', bed: 'A-12', condition: 'recovering', admissionDate: '2024-01-13', doctor: 'Dr. Arvind Mehta', diagnosis: 'Hernia Surgery Recovery', contact: '+91-98765-00115', x: 20, y: 42 },
    { id: 'P016', name: 'Gopal Saxena', age: 71, gender: 'Male', floor: 'third', room: 'general-ward-a', bed: 'A-18', condition: 'stable', admissionDate: '2024-01-15', doctor: 'Dr. Sunita Verma', diagnosis: 'Hip Replacement Recovery', contact: '+91-98765-00116', x: 24, y: 38 },
    
    // Third Floor - General Ward B (Female)
    { id: 'P017', name: 'Savita Joshi', age: 56, gender: 'Female', floor: 'third', room: 'general-ward-b', bed: 'B-03', condition: 'stable', admissionDate: '2024-01-15', doctor: 'Dr. Lakshmi Rao', diagnosis: 'Gallbladder Surgery Recovery', contact: '+91-98765-00117', x: 38, y: 42 },
    { id: 'P018', name: 'Pushpa Agarwal', age: 64, gender: 'Female', floor: 'third', room: 'general-ward-b', bed: 'B-09', condition: 'moderate', admissionDate: '2024-01-14', doctor: 'Dr. Lakshmi Rao', diagnosis: 'Kidney Infection', contact: '+91-98765-00118', x: 42, y: 38 },
    
    // Third Floor - Private Rooms
    { id: 'P019', name: 'Harish Malhotra', age: 54, gender: 'Male', floor: 'third', room: 'private-rooms', bed: 'PR-02', condition: 'recovering', admissionDate: '2024-01-13', doctor: 'Dr. Manish Kapoor', diagnosis: 'Bypass Surgery Recovery', contact: '+91-98765-00119', x: 66, y: 42 },
    { id: 'P020', name: 'Sunita Bhatia', age: 45, gender: 'Female', floor: 'third', room: 'private-rooms', bed: 'PR-06', condition: 'stable', admissionDate: '2024-01-16', doctor: 'Dr. Pooja Bhatt', diagnosis: 'Observation', contact: '+91-98765-00120', x: 70, y: 38 },
    
    // Third Floor - VIP Suite
    { id: 'P021', name: 'Rattan Oberoi', age: 68, gender: 'Male', floor: 'third', room: 'vip-suite', bed: 'VIP-01', condition: 'stable', admissionDate: '2024-01-15', doctor: 'Dr. Manish Kapoor', diagnosis: 'Executive Health Check', contact: '+91-98765-00121', x: 88, y: 40 },
];

// ═══════════════════════════════════════════════════════════════
// VOLUNTEER POOL FOR PATIENT ASSISTANCE
// ═══════════════════════════════════════════════════════════════
const volunteerPool = [
    { id: 'V001', name: 'Amit Pandey', age: 27, phone: '+91-99876-10001', area: 'Andheri West', specialization: 'Elder Care', avatar: '👨‍⚕️', available: true, hospital: 'City General Hospital' },
    { id: 'V002', name: 'Sneha Kulkarni', age: 24, phone: '+91-99876-10002', area: 'Bandra East', specialization: 'Emergency Response', avatar: '👩‍⚕️', available: true, hospital: 'City General Hospital' },
    { id: 'V003', name: 'Rohit Bhagat', age: 30, phone: '+91-99876-10003', area: 'Dadar', specialization: 'Physiotherapy Support', avatar: '👨‍⚕️', available: true, hospital: 'City General Hospital' },
    { id: 'V004', name: 'Kavita Desai', age: 26, phone: '+91-99876-10004', area: 'Borivali', specialization: 'Pediatric Support', avatar: '👩‍⚕️', available: true, hospital: 'City General Hospital' },
    { id: 'V005', name: 'Manoj Thakur', age: 33, phone: '+91-99876-10005', area: 'Thane West', specialization: 'Mental Health', avatar: '👨‍⚕️', available: true, hospital: 'City General Hospital' },
    { id: 'V006', name: 'Pooja Nair', age: 28, phone: '+91-99876-10006', area: 'Powai', specialization: 'General Assistance', avatar: '👩‍⚕️', available: true, hospital: 'City General Hospital' },
    { id: 'V007', name: 'Sanjay Rane', age: 35, phone: '+91-99876-10007', area: 'Goregaon', specialization: 'Logistics & Transport', avatar: '👨‍⚕️', available: true, hospital: 'City General Hospital' },
    { id: 'V008', name: 'Divya Pillai', age: 22, phone: '+91-99876-10008', area: 'Malad', specialization: 'Nursing Aid', avatar: '👩‍⚕️', available: true, hospital: 'City General Hospital' },
    { id: 'V009', name: 'Karan Mehra', age: 29, phone: '+91-99876-10009', area: 'Juhu', specialization: 'Communication Support', avatar: '👨‍⚕️', available: true, hospital: 'City General Hospital' },
    { id: 'V010', name: 'Nisha Sharma', age: 31, phone: '+91-99876-10010', area: 'Vikhroli', specialization: 'Documentation', avatar: '👩‍⚕️', available: true, hospital: 'City General Hospital' },
    { id: 'V011', name: 'Tushar Patil', age: 25, phone: '+91-99876-10011', area: 'Kurla', specialization: 'Emergency Response', avatar: '👨‍⚕️', available: true, hospital: 'City General Hospital' },
    { id: 'V012', name: 'Ritu Verma', age: 27, phone: '+91-99876-10012', area: 'Chembur', specialization: 'Elder Care', avatar: '👩‍⚕️', available: true, hospital: 'City General Hospital' },
    { id: 'V013', name: 'Deepak Joshi', age: 34, phone: '+91-99876-10013', area: 'Mulund', specialization: 'General Assistance', avatar: '👨‍⚕️', available: true, hospital: 'City General Hospital' },
    { id: 'V014', name: 'Megha Kapoor', age: 23, phone: '+91-99876-10014', area: 'Andheri East', specialization: 'Pediatric Support', avatar: '👩‍⚕️', available: true, hospital: 'City General Hospital' },
    { id: 'V015', name: 'Prashant Singh', age: 32, phone: '+91-99876-10015', area: 'Kandivali', specialization: 'Physiotherapy Support', avatar: '👨‍⚕️', available: true, hospital: 'City General Hospital' },
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
// TREATMENT CONDITIONS & SPECIALIST DOCTORS
// ═══════════════════════════════════════════════════════════════

const treatmentConditions = [
    'Cardiac Emergency', 'Heart Attack', 'Chest Pain',
    'Fracture', 'Bone Injury', 'Orthopedic',
    'Brain Injury', 'Stroke', 'Neurological',
    'Cancer', 'Tumor', 'Oncology',
    'Kidney Failure', 'Dialysis', 'Nephrology',
    'Respiratory Failure', 'Asthma', 'Lung Infection',
    'Burn Injury', 'Plastic Surgery',
    'Pregnancy Complications', 'Maternity', 'Gynecology',
    'Pediatric Emergency', 'Child Illness',
    'Eye Injury', 'Vision Loss', 'Ophthalmology',
    'General Surgery', 'Appendicitis', 'Hernia',
    'Diabetes', 'Endocrine',
];

const specialistDoctors = {
    cardiac: [
        { id: 'DOC-C1', name: 'Dr. Manish Kapoor', specialization: 'Interventional Cardiology', experience: '22 years', education: 'MBBS, MD (Cardiology) - AIIMS Delhi, DM (Cardiology) - PGIMER Chandigarh', avatar: '👨‍⚕️', rating: 4.9, totalReviews: 312, availability: 'Available', reviews: [
            { name: 'Rajesh S.', rating: 5, comment: 'Dr. Kapoor saved my life during a massive heart attack. His quick decision-making and expertise are unmatched.' },
            { name: 'Meena P.', rating: 5, comment: 'After my bypass surgery, I recovered faster than expected. The doctor personally checked on me every day.' },
            { name: 'Vikram T.', rating: 4, comment: 'Very knowledgeable and patient. Explained every detail of my angioplasty procedure thoroughly.' },
        ]},
        { id: 'DOC-C2', name: 'Dr. Sunita Verma', specialization: 'Cardiac Electrophysiology', experience: '18 years', education: 'MBBS - Grant Medical College, MD (Medicine) - KEM Hospital, DM (Cardiology) - Sion Hospital', avatar: '👩‍⚕️', rating: 4.8, totalReviews: 248, availability: 'Available', reviews: [
            { name: 'Arun K.', rating: 5, comment: 'Dr. Verma is incredibly thorough. She identified my arrhythmia when other doctors missed it.' },
            { name: 'Priya D.', rating: 5, comment: 'Compassionate and skilled. My mother had a pacemaker implanted and is doing wonderful.' },
            { name: 'Deepak M.', rating: 4, comment: 'Good doctor, takes time to answer all questions. Wait time can be long though.' },
        ]},
        { id: 'DOC-C3', name: 'Dr. Arvind Shah', specialization: 'Pediatric Cardiology', experience: '15 years', education: 'MBBS, DCH - BJ Medical College, MD (Pediatrics), DM (Cardiology) - AIIMS', avatar: '👨‍⚕️', rating: 4.7, totalReviews: 186, availability: 'Available', reviews: [
            { name: 'Sneha L.', rating: 5, comment: 'My child was born with a heart defect. Dr. Shah performed the surgery flawlessly. Forever grateful.' },
            { name: 'Rahul B.', rating: 5, comment: 'He has a wonderful way with children. My son was not scared at all during checkups.' },
            { name: 'Kavita N.', rating: 4, comment: 'Very experienced in congenital heart conditions. Highly recommend for pediatric cases.' },
        ]},
        { id: 'DOC-C4', name: 'Dr. Lakshmi Rao', specialization: 'Heart Failure & Transplant', experience: '20 years', education: 'MBBS - Osmania Medical College, MD (Internal Medicine), DM (Cardiology) - NIMHANS', avatar: '👩‍⚕️', rating: 4.9, totalReviews: 274, availability: 'On Call', reviews: [
            { name: 'Gopal R.', rating: 5, comment: 'Dr. Rao managed my father\'s advanced heart failure brilliantly. Her treatment plan gave him years of quality life.' },
            { name: 'Suman D.', rating: 5, comment: 'The best cardiologist I have ever consulted. Very empathetic and explains everything clearly.' },
            { name: 'Harish M.', rating: 5, comment: 'World-class expertise right here. She coordinated my heart transplant evaluation seamlessly.' },
        ]},
    ],
    orthopedic: [
        { id: 'DOC-O1', name: 'Dr. Rohit Jain', specialization: 'Joint Replacement Surgery', experience: '19 years', education: 'MBBS - Maulana Azad Medical College, MS (Ortho) - Safdarjung Hospital, Fellowship - Royal College UK', avatar: '👨‍⚕️', rating: 4.8, totalReviews: 295, availability: 'Available', reviews: [
            { name: 'Ramesh T.', rating: 5, comment: 'Had a total knee replacement. I am walking pain-free after years of suffering. Thank you Dr. Jain!' },
            { name: 'Pushpa A.', rating: 5, comment: 'Both my hips were replaced by Dr. Jain. Excellent surgical skills and aftercare.' },
            { name: 'Dinesh C.', rating: 4, comment: 'Professional and experienced. The physiotherapy plan was very well designed.' },
        ]},
        { id: 'DOC-O2', name: 'Dr. Priya Menon', specialization: 'Spine Surgery', experience: '16 years', education: 'MBBS, MS (Ortho) - CMC Vellore, Fellowship in Spine Surgery - Munich Germany', avatar: '👩‍⚕️', rating: 4.7, totalReviews: 203, availability: 'Available', reviews: [
            { name: 'Suresh Y.', rating: 5, comment: 'My herniated disc surgery was a success. Back to normal life within weeks.' },
            { name: 'Anita G.', rating: 5, comment: 'Dr. Menon is extremely skilled in minimally invasive spine surgery. Minimal scarring and fast recovery.' },
            { name: 'Prakash S.', rating: 4, comment: 'Good surgeon. Explained the risks clearly and managed my expectations well.' },
        ]},
        { id: 'DOC-O3', name: 'Dr. Sanjay Kulkarni', specialization: 'Sports Medicine & Trauma', experience: '14 years', education: 'MBBS - Grant Medical, MS (Ortho), DNB Orthopaedics, Arthroscopy Fellowship - Singapore', avatar: '👨‍⚕️', rating: 4.6, totalReviews: 178, availability: 'Available', reviews: [
            { name: 'Karan M.', rating: 5, comment: 'Fixed my ACL tear perfectly. I was back on the football field in 6 months!' },
            { name: 'Neha K.', rating: 4, comment: 'Very good with sports injuries. He understands athlete concerns well.' },
            { name: 'Vijay P.', rating: 5, comment: 'Dr. Kulkarni treated my compound fracture after an accident. Excellent trauma surgeon.' },
        ]},
        { id: 'DOC-O4', name: 'Dr. Nandini Desai', specialization: 'Pediatric Orthopedics', experience: '12 years', education: 'MBBS, MS (Ortho) - Seth GS Medical College, Fellowship in Pediatric Ortho - Toronto', avatar: '👩‍⚕️', rating: 4.8, totalReviews: 156, availability: 'Available', reviews: [
            { name: 'Sneha R.', rating: 5, comment: 'My daughter had clubfoot. Dr. Desai corrected it beautifully. She walks normally now!' },
            { name: 'Amit P.', rating: 5, comment: 'Great with kids. My son had a broken arm and Dr. Desai made him feel comfortable throughout.' },
            { name: 'Rekha S.', rating: 4, comment: 'Very patient and caring. Explains treatment options clearly to parents.' },
        ]},
    ],
    neurological: [
        { id: 'DOC-N1', name: 'Dr. Ashwin Bhat', specialization: 'Neurosurgery', experience: '24 years', education: 'MBBS - JIPMER, MS (General Surgery), MCh (Neurosurgery) - NIMHANS Bangalore', avatar: '👨‍⚕️', rating: 4.9, totalReviews: 340, availability: 'Available', reviews: [
            { name: 'Kamala D.', rating: 5, comment: 'Dr. Bhat operated on my brain tumor. He is truly a genius surgeon. I owe him my life.' },
            { name: 'Rajan V.', rating: 5, comment: 'After my stroke, Dr. Bhat\'s quick intervention prevented permanent damage.' },
            { name: 'Sunita B.', rating: 5, comment: '24 years of experience shows. Confident, precise, and compassionate.' },
        ]},
        { id: 'DOC-N2', name: 'Dr. Kavitha Nair', specialization: 'Stroke & Cerebrovascular', experience: '17 years', education: 'MBBS, MD (Medicine), DM (Neurology) - AIIMS Delhi, Fellowship - Johns Hopkins USA', avatar: '👩‍⚕️', rating: 4.8, totalReviews: 221, availability: 'Available', reviews: [
            { name: 'Deepika N.', rating: 5, comment: 'Dr. Nair diagnosed my TIA instantly and started treatment within minutes. Prevented a major stroke.' },
            { name: 'Mohan K.', rating: 5, comment: 'Best neurologist in the city. Very thorough in her examination.' },
            { name: 'Priya S.', rating: 4, comment: 'Highly knowledgeable. She took time to explain my MRI results in detail.' },
        ]},
        { id: 'DOC-N3', name: 'Dr. Rajiv Thakur', specialization: 'Epilepsy & Movement Disorders', experience: '13 years', education: 'MBBS - KMC Manipal, MD (Medicine), DM (Neurology) - PGIMER, EEG Fellowship - London', avatar: '👨‍⚕️', rating: 4.7, totalReviews: 167, availability: 'Available', reviews: [
            { name: 'Ananya M.', rating: 5, comment: 'My epilepsy is finally under control after years of struggle. Dr. Thakur found the right medication.' },
            { name: 'Sunil G.', rating: 4, comment: 'Patient and understanding. Never rushes through appointments.' },
            { name: 'Leela R.', rating: 5, comment: 'Dr. Thakur treated my Parkinson\'s tremors effectively. Significant improvement in daily life.' },
        ]},
        { id: 'DOC-N4', name: 'Dr. Meera Iyer', specialization: 'Neuro-Oncology', experience: '15 years', education: 'MBBS, MD (Pathology), DM (Neuro-Oncology) - Tata Memorial, Fellowship - MD Anderson USA', avatar: '👩‍⚕️', rating: 4.8, totalReviews: 198, availability: 'On Call', reviews: [
            { name: 'Harish L.', rating: 5, comment: 'Dr. Iyer managed my glioma treatment with exceptional care. She coordinated surgery, chemo and radiation seamlessly.' },
            { name: 'Geeta P.', rating: 5, comment: 'Very empathetic doctor. Held my hand through the entire cancer journey.' },
            { name: 'Vikram J.', rating: 4, comment: 'Excellent expertise in brain tumors. Clear communication about prognosis and treatment options.' },
        ]},
    ],
    oncology: [
        { id: 'DOC-ON1', name: 'Dr. Raghav Sinha', specialization: 'Surgical Oncology', experience: '21 years', education: 'MBBS - AIIMS, MS (General Surgery), MCh (Surgical Oncology) - Tata Memorial Hospital', avatar: '👨‍⚕️', rating: 4.9, totalReviews: 356, availability: 'Available', reviews: [
            { name: 'Suresh M.', rating: 5, comment: 'Dr. Sinha removed my colon tumor with precision. Clean margins and no recurrence in 3 years.' },
            { name: 'Rekha B.', rating: 5, comment: 'A true expert in cancer surgery. He made a terrifying diagnosis feel manageable.' },
            { name: 'Anil K.', rating: 5, comment: 'My breast cancer surgery was successful. His post-operative care was excellent.' },
        ]},
        { id: 'DOC-ON2', name: 'Dr. Anita Sharma', specialization: 'Medical Oncology', experience: '16 years', education: 'MBBS, MD (Medicine), DM (Medical Oncology) - AIIMS, Research Fellow - Mayo Clinic USA', avatar: '👩‍⚕️', rating: 4.8, totalReviews: 289, availability: 'Available', reviews: [
            { name: 'Pooja T.', rating: 5, comment: 'Dr. Sharma designed a chemotherapy regimen that was effective with manageable side effects.' },
            { name: 'Ramesh G.', rating: 5, comment: 'She reviews every detail of blood work and scans. Nothing escapes her attention.' },
            { name: 'Kavita D.', rating: 4, comment: 'Very supportive through the entire treatment course. Always available for questions.' },
        ]},
        { id: 'DOC-ON3', name: 'Dr. Vijay Patwardhan', specialization: 'Radiation Oncology', experience: '18 years', education: 'MBBS - BJ Medical College, MD (Radiotherapy) - Tata Memorial, Fellowship - Royal Marsden UK', avatar: '👨‍⚕️', rating: 4.7, totalReviews: 234, availability: 'Available', reviews: [
            { name: 'Deepak S.', rating: 5, comment: 'The radiation therapy was precisely targeted. Minimal side effects and good tumor response.' },
            { name: 'Nandini R.', rating: 4, comment: 'Dr. Patwardhan explains the radiation process very clearly. No surprises during treatment.' },
            { name: 'Sunil V.', rating: 5, comment: 'My lung cancer responded well to his radiation plan. Grateful for his expertise.' },
        ]},
        { id: 'DOC-ON4', name: 'Dr. Swati Kulkarni', specialization: 'Hematology-Oncology', experience: '14 years', education: 'MBBS, MD (Pathology), DM (Hematology) - CMC Vellore, Bone Marrow Transplant Fellowship', avatar: '👩‍⚕️', rating: 4.8, totalReviews: 178, availability: 'Available', reviews: [
            { name: 'Manish P.', rating: 5, comment: 'Dr. Kulkarni successfully treated my lymphoma. Her knowledge of blood cancers is exceptional.' },
            { name: 'Anita J.', rating: 5, comment: 'She managed my son\'s leukemia treatment with utmost care. We are cancer-free now!' },
            { name: 'Rajiv M.', rating: 4, comment: 'Thorough and systematic approach. Keeps up with latest research and treatments.' },
        ]},
    ],
    respiratory: [
        { id: 'DOC-R1', name: 'Dr. Vikash Mehta', specialization: 'Pulmonology & Critical Care', experience: '20 years', education: 'MBBS - MAMC Delhi, MD (Pulmonary Medicine), Fellowship in Critical Care - Cleveland Clinic', avatar: '👨‍⚕️', rating: 4.9, totalReviews: 287, availability: 'Available', reviews: [
            { name: 'Arun P.', rating: 5, comment: 'Dr. Mehta saved me from respiratory failure. His ventilator management expertise is unparalleled.' },
            { name: 'Savita J.', rating: 5, comment: 'Treated my severe pneumonia. I was in ICU for a week and he visited me twice daily.' },
            { name: 'Gopal S.', rating: 4, comment: 'Very experienced in lung diseases. My COPD is well controlled under his care.' },
        ]},
        { id: 'DOC-R2', name: 'Dr. Neelam Tiwari', specialization: 'Interventional Pulmonology', experience: '15 years', education: 'MBBS, MD (TB & Chest), Fellowship in Interventional Pulmonology - Mount Sinai USA', avatar: '👩‍⚕️', rating: 4.7, totalReviews: 198, availability: 'Available', reviews: [
            { name: 'Ramesh Y.', rating: 5, comment: 'Dr. Tiwari performed a bronchoscopy that diagnosed my lung condition accurately.' },
            { name: 'Prerna K.', rating: 4, comment: 'Expert in complex lung procedures. She made the biopsy process smooth and painless.' },
            { name: 'Sanjay D.', rating: 5, comment: 'Excellent interventional skills. Stent placement went perfectly.' },
        ]},
        { id: 'DOC-R3', name: 'Dr. Amit Deshmukh', specialization: 'Allergy & Asthma', experience: '12 years', education: 'MBBS - Pune Medical College, MD (Pulmonary Medicine), Allergy Fellowship - National Jewish Health', avatar: '👨‍⚕️', rating: 4.6, totalReviews: 234, availability: 'Available', reviews: [
            { name: 'Neha R.', rating: 5, comment: 'My severe asthma is finally under control. Dr. Deshmukh found the right combination of medicines.' },
            { name: 'Vivek M.', rating: 4, comment: 'Good allergist. Identified my triggers through comprehensive testing.' },
            { name: 'Swapna B.', rating: 5, comment: 'My daughter\'s wheezing episodes reduced dramatically after his treatment.' },
        ]},
        { id: 'DOC-R4', name: 'Dr. Roshni Pillai', specialization: 'Sleep Medicine', experience: '10 years', education: 'MBBS, MD (Medicine), Fellowship in Sleep Medicine - Stanford University', avatar: '👩‍⚕️', rating: 4.7, totalReviews: 145, availability: 'Available', reviews: [
            { name: 'Harish K.', rating: 5, comment: 'Diagnosed my sleep apnea and the CPAP therapy changed my life. No more daytime drowsiness.' },
            { name: 'Meena S.', rating: 5, comment: 'Dr. Pillai is thorough with sleep studies. She found the root cause of my insomnia.' },
            { name: 'Ajay T.', rating: 4, comment: 'Very patient and caring. Good follow-up after starting therapy.' },
        ]},
    ],
    general: [
        { id: 'DOC-G1', name: 'Dr. Arvind Mehta', specialization: 'General & Laparoscopic Surgery', experience: '23 years', education: 'MBBS - GMC Mumbai, MS (General Surgery) - KEM Hospital, FAIS, Fellowship in MIS', avatar: '👨‍⚕️', rating: 4.8, totalReviews: 412, availability: 'Available', reviews: [
            { name: 'Dinesh C.', rating: 5, comment: 'My appendectomy was done laparoscopically. Tiny scars and I was home in 2 days!' },
            { name: 'Savita J.', rating: 5, comment: 'Dr. Mehta did my gallbladder surgery. Very experienced and confident surgeon.' },
            { name: 'Gopal S.', rating: 4, comment: 'Skilled surgeon with a calm demeanor. Explained everything before and after surgery.' },
        ]},
        { id: 'DOC-G2', name: 'Dr. Pooja Bhatt', specialization: 'Obstetrics & Gynecology', experience: '17 years', education: 'MBBS, MS (OB-GYN) - LTMMC Mumbai, Fellowship in High-Risk Pregnancy', avatar: '👩‍⚕️', rating: 4.9, totalReviews: 378, availability: 'Available', reviews: [
            { name: 'Ananya D.', rating: 5, comment: 'Dr. Bhatt delivered my baby through a complicated pregnancy. She was calm and reassuring throughout.' },
            { name: 'Neha K.', rating: 5, comment: 'Best gynecologist! My C-section recovery was smooth thanks to her surgical precision.' },
            { name: 'Ritu V.', rating: 5, comment: 'Very caring and attentive. She managed my high-risk pregnancy expertly.' },
        ]},
        { id: 'DOC-G3', name: 'Dr. Sneha Pillai', specialization: 'Pediatrics & Neonatology', experience: '14 years', education: 'MBBS, MD (Pediatrics) - AIIMS, DM (Neonatology) - PGIMER, Fellowship - Great Ormond Street UK', avatar: '👩‍⚕️', rating: 4.8, totalReviews: 267, availability: 'Available', reviews: [
            { name: 'Kavita M.', rating: 5, comment: 'Dr. Pillai saved my premature baby in NICU. Her dedication is beyond words.' },
            { name: 'Rahul B.', rating: 5, comment: 'My son had pneumonia and she treated it effectively. Very gentle with children.' },
            { name: 'Priya G.', rating: 4, comment: 'Excellent pediatrician. Always available for emergencies, even at odd hours.' },
        ]},
        { id: 'DOC-G4', name: 'Dr. Rajesh Kumar', specialization: 'Internal Medicine & Diabetology', experience: '19 years', education: 'MBBS - KGMU Lucknow, MD (Medicine) - PGI Chandigarh, Fellowship in Diabetology', avatar: '👨‍⚕️', rating: 4.7, totalReviews: 345, availability: 'Available', reviews: [
            { name: 'Ramesh T.', rating: 5, comment: 'Dr. Kumar manages my diabetes expertly. HbA1c went from 11 to 6.5 in 6 months!' },
            { name: 'Pushpa A.', rating: 4, comment: 'Very thorough in his approach. Does complete metabolic workup.' },
            { name: 'Sunita B.', rating: 5, comment: 'He takes holistic approach to medicine. Addressed my diabetes, BP and thyroid together.' },
        ]},
    ],
};

// Map conditions to doctor categories
const conditionToSpecialty = {
    'Cardiac Emergency': 'cardiac', 'Heart Attack': 'cardiac', 'Chest Pain': 'cardiac',
    'Fracture': 'orthopedic', 'Bone Injury': 'orthopedic', 'Orthopedic': 'orthopedic',
    'Brain Injury': 'neurological', 'Stroke': 'neurological', 'Neurological': 'neurological',
    'Cancer': 'oncology', 'Tumor': 'oncology', 'Oncology': 'oncology',
    'Kidney Failure': 'general', 'Dialysis': 'general', 'Nephrology': 'general',
    'Respiratory Failure': 'respiratory', 'Asthma': 'respiratory', 'Lung Infection': 'respiratory',
    'Burn Injury': 'general', 'Plastic Surgery': 'general',
    'Pregnancy Complications': 'general', 'Maternity': 'general', 'Gynecology': 'general',
    'Pediatric Emergency': 'general', 'Child Illness': 'general',
    'Eye Injury': 'general', 'Vision Loss': 'general', 'Ophthalmology': 'general',
    'General Surgery': 'general', 'Appendicitis': 'general', 'Hernia': 'general',
    'Diabetes': 'general', 'Endocrine': 'general',
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Furniture SVG renderers for realistic room interiors
const FurnitureSVG = {
    bed: (x, y, w = 22, h = 12) => (
        <g key={`bed-${x}-${y}`} transform={`translate(${x},${y})`}>
            <rect x="0" y="0" width={w} height={h} rx="1.5" fill="#dbeafe" stroke="#93c5fd" strokeWidth="0.7"/>
            <rect x="1" y="1" width={6} height={h - 2} rx="1" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="0.4"/>
            <rect x={w - 4} y={h / 2 - 1.5} width="3" height="3" rx="0.5" fill="#e0e7ff" stroke="#a5b4fc" strokeWidth="0.3"/>
        </g>
    ),
    desk: (x, y) => (
        <g key={`desk-${x}-${y}`} transform={`translate(${x},${y})`}>
            <rect x="0" y="0" width="14" height="8" rx="1" fill="#fef3c7" stroke="#fbbf24" strokeWidth="0.5"/>
            <rect x="2" y="1.5" width="6" height="4" rx="0.5" fill="#fde68a" stroke="#f59e0b" strokeWidth="0.3"/>
        </g>
    ),
    chair: (x, y) => (
        <g key={`chair-${x}-${y}`} transform={`translate(${x},${y})`}>
            <circle cx="3" cy="3" r="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5"/>
        </g>
    ),
    monitor: (x, y) => (
        <g key={`mon-${x}-${y}`} transform={`translate(${x},${y})`}>
            <rect x="0" y="0" width="8" height="6" rx="0.8" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
            <rect x="1" y="0.8" width="6" height="3.5" rx="0.3" fill="#22d3ee"/>
            <rect x="2.5" y="6" width="3" height="1.5" fill="#64748b"/>
        </g>
    ),
    sink: (x, y) => (
        <g key={`sink-${x}-${y}`} transform={`translate(${x},${y})`}>
            <ellipse cx="5" cy="4" rx="5" ry="4" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="0.6"/>
            <circle cx="5" cy="3" r="0.8" fill="#0ea5e9"/>
        </g>
    ),
    cabinet: (x, y) => (
        <g key={`cab-${x}-${y}`} transform={`translate(${x},${y})`}>
            <rect x="0" y="0" width="10" height="5" rx="0.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.6"/>
            <line x1="5" y1="0.5" x2="5" y2="4.5" stroke="#cbd5e1" strokeWidth="0.4"/>
            <circle cx="3.5" cy="2.5" r="0.5" fill="#94a3b8"/>
            <circle cx="6.5" cy="2.5" r="0.5" fill="#94a3b8"/>
        </g>
    ),
    surgicalLight: (x, y) => (
        <g key={`surg-${x}-${y}`} transform={`translate(${x},${y})`}>
            <circle cx="6" cy="6" r="6" fill="none" stroke="#a3e635" strokeWidth="0.5" strokeDasharray="2,1.5"/>
            <circle cx="6" cy="6" r="3" fill="rgba(163, 230, 53, 0.15)" stroke="#84cc16" strokeWidth="0.6"/>
            <circle cx="6" cy="6" r="1" fill="#84cc16"/>
        </g>
    ),
    curtain: (x, y, h = 30) => (
        <g key={`curt-${x}-${y}`} transform={`translate(${x},${y})`}>
            <line x1="0" y1="0" x2="0" y2={h} stroke="#c4b5fd" strokeWidth="0.8" strokeDasharray="3,2"/>
        </g>
    ),
};

// Get furniture layout based on room type
const getRoomFurniture = (type, w, h) => {
    const furniture = [];
    const midX = w / 2;
    const midY = h / 2;
    
    switch(type) {
        case 'emergency':
        case 'icu':
            for (let i = 0; i < 3; i++) {
                furniture.push(FurnitureSVG.bed(8 + i * 30, 10));
                furniture.push(FurnitureSVG.monitor(14 + i * 30, 24));
                furniture.push(FurnitureSVG.curtain(7 + i * 30, 5, 28));
            }
            furniture.push(FurnitureSVG.desk(w - 20, h - 14));
            break;
        case 'surgery':
            furniture.push(FurnitureSVG.bed(midX - 13, midY - 8, 26, 16));
            furniture.push(FurnitureSVG.surgicalLight(midX - 6, midY - 18));
            furniture.push(FurnitureSVG.cabinet(5, 5));
            furniture.push(FurnitureSVG.sink(w - 14, 5));
            furniture.push(FurnitureSVG.monitor(5, h - 12));
            break;
        case 'ward':
        case 'recovery':
        case 'maternity':
        case 'pediatrics':
            for (let i = 0; i < 2; i++) {
                furniture.push(FurnitureSVG.bed(8, 8 + i * 18));
                furniture.push(FurnitureSVG.bed(38, 8 + i * 18));
                furniture.push(FurnitureSVG.curtain(36, 5 + i * 18, 16));
            }
            furniture.push(FurnitureSVG.desk(w - 20, 5));
            break;
        case 'private':
            furniture.push(FurnitureSVG.bed(midX - 12, 10, 24, 14));
            furniture.push(FurnitureSVG.monitor(midX + 14, 12));
            furniture.push(FurnitureSVG.chair(midX - 18, midY + 6));
            furniture.push(FurnitureSVG.cabinet(5, h - 12));
            furniture.push(FurnitureSVG.sink(w - 14, h - 12));
            break;
        case 'reception':
        case 'admin':
            furniture.push(FurnitureSVG.desk(midX - 8, midY - 5));
            furniture.push(FurnitureSVG.chair(midX - 4, midY + 6));
            furniture.push(FurnitureSVG.chair(midX + 8, midY - 4));
            furniture.push(FurnitureSVG.cabinet(5, 5));
            break;
        case 'pharmacy':
        case 'storage':
            for (let i = 0; i < 3; i++) {
                furniture.push(FurnitureSVG.cabinet(6 + i * 14, 6));
            }
            furniture.push(FurnitureSVG.desk(midX - 7, h - 14));
            break;
        case 'radiology':
        case 'laboratory':
            furniture.push(FurnitureSVG.bed(midX - 12, midY - 6, 24, 12));
            furniture.push(FurnitureSVG.monitor(5, 5));
            furniture.push(FurnitureSVG.monitor(w - 14, 5));
            furniture.push(FurnitureSVG.cabinet(5, h - 10));
            break;
        case 'opd':
            furniture.push(FurnitureSVG.desk(12, 8));
            furniture.push(FurnitureSVG.chair(8, 18));
            furniture.push(FurnitureSVG.chair(28, 10));
            furniture.push(FurnitureSVG.bed(midX - 5, h - 18, 20, 10));
            break;
        case 'nursery':
            for (let i = 0; i < 3; i++) {
                furniture.push(FurnitureSVG.bed(8 + i * 22, midY - 4, 16, 10));
            }
            break;
        case 'amenity':
            furniture.push(FurnitureSVG.chair(midX - 10, midY - 5));
            furniture.push(FurnitureSVG.chair(midX, midY - 5));
            furniture.push(FurnitureSVG.chair(midX + 10, midY - 5));
            furniture.push(FurnitureSVG.desk(midX - 7, midY + 4));
            break;
        default:
            furniture.push(FurnitureSVG.desk(midX - 7, midY - 5));
            furniture.push(FurnitureSVG.chair(midX - 3, midY + 6));
            break;
    }
    return furniture;
};

// Room Card Component - Full SVG Architectural Room
const RoomCard = ({ room, style: typeStyle, isSelected, onClick, showEquipment, equipment, patients }) => {
    const roomEquip = equipment.filter(e => e.room === room.id);
    const roomPatients = patients ? patients.filter(p => p.room === room.id) : [];
    const doorSide = room.row === 1 ? 'bottom' : 'top';
    
    const svgW = room.span === 2 ? 200 : 100;
    const svgH = 70;
    const wallThickness = 2.5;
    
    const patternId = `floor-${room.id}`;
    const roomColor = typeStyle?.bg || '#f8fafc';
    const wallColor = '#475569';
    const doorColor = '#a3764c';
    
    return (
        <div 
            className={`room-card-svg ${isSelected ? 'room-card-svg--selected' : ''} ${room.span ? `room-card-svg--span-${room.span}` : ''}`}
            onClick={() => onClick(room)}
        >
            <svg 
                viewBox={`0 0 ${svgW} ${svgH}`} 
                className="room-svg"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <pattern id={patternId} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <rect width="10" height="10" fill={roomColor}/>
                        <rect x="0" y="0" width="5" height="5" fill="rgba(0,0,0,0.02)"/>
                        <rect x="5" y="5" width="5" height="5" fill="rgba(0,0,0,0.02)"/>
                    </pattern>
                    <pattern id={`win-${room.id}`} x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                        <rect width="4" height="4" fill="#bae6fd"/>
                        <line x1="2" y1="0" x2="2" y2="4" stroke="#7dd3fc" strokeWidth="0.3"/>
                        <line x1="0" y1="2" x2="4" y2="2" stroke="#7dd3fc" strokeWidth="0.3"/>
                    </pattern>
                </defs>
                
                {/* Floor */}
                <rect x={wallThickness} y={wallThickness} 
                    width={svgW - wallThickness * 2} height={svgH - wallThickness * 2} 
                    fill={`url(#${patternId})`} rx="0.5"/>
                
                {/* Walls */}
                <rect x="0" y="0" width={svgW} height={wallThickness} fill={wallColor}/>
                <rect x="0" y={svgH - wallThickness} width={svgW} height={wallThickness} fill={wallColor}/>
                <rect x="0" y="0" width={wallThickness} height={svgH} fill={wallColor}/>
                <rect x={svgW - wallThickness} y="0" width={wallThickness} height={svgH} fill={wallColor}/>
                
                {/* Windows on exterior wall */}
                {room.row === 1 && (
                    <>
                        <rect x={svgW * 0.2} y="0.3" width={svgW * 0.15} height={wallThickness - 0.6} rx="0.3" fill={`url(#win-${room.id})`} stroke="#38bdf8" strokeWidth="0.3"/>
                        <rect x={svgW * 0.6} y="0.3" width={svgW * 0.15} height={wallThickness - 0.6} rx="0.3" fill={`url(#win-${room.id})`} stroke="#38bdf8" strokeWidth="0.3"/>
                    </>
                )}
                {room.row === 2 && (
                    <>
                        <rect x={svgW * 0.2} y={svgH - wallThickness + 0.3} width={svgW * 0.15} height={wallThickness - 0.6} rx="0.3" fill={`url(#win-${room.id})`} stroke="#38bdf8" strokeWidth="0.3"/>
                        <rect x={svgW * 0.6} y={svgH - wallThickness + 0.3} width={svgW * 0.15} height={wallThickness - 0.6} rx="0.3" fill={`url(#win-${room.id})`} stroke="#38bdf8" strokeWidth="0.3"/>
                    </>
                )}
                
                {/* Door with arc swing */}
                {doorSide === 'bottom' ? (
                    <g>
                        <rect x={svgW * 0.42} y={svgH - wallThickness} width={svgW * 0.16} height={wallThickness} fill={roomColor}/>
                        <path 
                            d={`M ${svgW * 0.42} ${svgH - wallThickness} A ${svgW * 0.14} ${svgW * 0.14} 0 0 1 ${svgW * 0.42 + svgW * 0.14} ${svgH - wallThickness - svgW * 0.06}`}
                            fill="none" stroke={doorColor} strokeWidth="0.6" strokeDasharray="1.5,1"
                        />
                        <rect x={svgW * 0.42} y={svgH - wallThickness - 0.5} width={svgW * 0.16} height="1.2" rx="0.3" fill={doorColor} opacity="0.7"/>
                    </g>
                ) : (
                    <g>
                        <rect x={svgW * 0.42} y="0" width={svgW * 0.16} height={wallThickness} fill={roomColor}/>
                        <path 
                            d={`M ${svgW * 0.42} ${wallThickness} A ${svgW * 0.14} ${svgW * 0.14} 0 0 0 ${svgW * 0.42 + svgW * 0.14} ${wallThickness + svgW * 0.06}`}
                            fill="none" stroke={doorColor} strokeWidth="0.6" strokeDasharray="1.5,1"
                        />
                        <rect x={svgW * 0.42} y={wallThickness - 0.7} width={svgW * 0.16} height="1.2" rx="0.3" fill={doorColor} opacity="0.7"/>
                    </g>
                )}
                
                {/* Furniture */}
                <g className="room-furniture" opacity="0.6">
                    {getRoomFurniture(room.type, svgW, svgH)}
                </g>
                
                {/* Patient dots */}
                {roomPatients.map((p, idx) => (
                    <circle 
                        key={p.id}
                        cx={12 + idx * 10}
                        cy={svgH - 10}
                        r="3"
                        fill={conditionColors[p.condition]?.bg}
                        stroke="#fff"
                        strokeWidth="0.8"
                        className="patient-room-dot"
                    >
                        <title>{p.name} - {p.condition}</title>
                    </circle>
                ))}
                
                {/* Equipment dots */}
                {showEquipment && roomEquip.slice(0, 5).map((eq, idx) => (
                    <g key={eq.id}>
                        <circle 
                            cx={svgW - 8 - idx * 8}
                            cy={svgH - 8}
                            r="2.5"
                            fill={statusColors[eq.status]?.bg}
                            stroke="#fff"
                            strokeWidth="0.6"
                        >
                            <title>{eq.name} - {eq.status}</title>
                        </circle>
                    </g>
                ))}
                
                {/* Selection highlight */}
                {isSelected && (
                    <rect x="1" y="1" width={svgW - 2} height={svgH - 2} 
                        fill="none" stroke="#3b82f6" strokeWidth="2" rx="1"
                        className="room-select-highlight"/>
                )}
            </svg>
            
            {/* Room label overlay */}
            <div className="room-svg-label">
                <span className="room-svg-label__icon">{room.icon}</span>
                <div className="room-svg-label__text">
                    <strong>{room.name}</strong>
                    {room.subtitle && <small>{room.subtitle}</small>}
                </div>
            </div>
            
            {/* Room ID badge */}
            <div className="room-svg-id" style={{ backgroundColor: typeStyle?.border || '#94a3b8' }}>
                {room.id.split('-')[0].toUpperCase().slice(0, 4)}
            </div>
            
            {/* Bed count badge */}
            {room.beds && (
                <div className="room-svg-beds">
                    <Bed size={9} /> {room.beds}
                </div>
            )}
            
            {/* Equipment count badge */}
            {showEquipment && roomEquip.length > 0 && (
                <div className="room-svg-equip">
                    <Package size={9} /> {roomEquip.length}
                </div>
            )}
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
    const [isTrackingEquipment, setIsTrackingEquipment] = useState(false);
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

    // Volunteer assist state
    const [assistForm, setAssistForm] = useState({ name: '', address: '', phone: '', disease: '' });
    const [assistSubmissions, setAssistSubmissions] = useState([]);
    const [volunteerOptions, setVolunteerOptions] = useState([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [pendingPatient, setPendingPatient] = useState(null);
    const assistSectionRef = useRef(null);

    // Accident victim rescue state
    const [accidentForm, setAccidentForm] = useState({ location: '', victimCondition: '', victimCount: '1', reporterPhone: '', description: '' });
    const [accidentSubmissions, setAccidentSubmissions] = useState([]);
    const [accidentVolunteerOptions, setAccidentVolunteerOptions] = useState([]);
    const [selectedAccidentVolunteer, setSelectedAccidentVolunteer] = useState(null);
    const [pendingAccident, setPendingAccident] = useState(null);
    const accidentSectionRef = useRef(null);

    // Nearby Ambulance Alert System state
    const [hospitalAmbulances] = useState([
        { id: 'AMB-001', name: 'Ambulance Unit 1', driver: 'Rajesh Kumar', phone: '+91-98765-43210', status: 'deployed', location: 'En route - Highway 7' },
        { id: 'AMB-002', name: 'Ambulance Unit 2', driver: 'Suresh Patel', phone: '+91-98765-43211', status: 'deployed', location: 'At accident site - Andheri' },
        { id: 'AMB-003', name: 'Ambulance Unit 3', driver: 'Manoj Singh', phone: '+91-98765-43212', status: 'maintenance', location: 'Hospital Garage' },
    ]);
    const [nearbyAmbulances] = useState([
        { id: 'NB-001', name: 'MediFast Ambulance', org: 'MediFast Healthcare', driver: 'Amit Sharma', phone: '+91-87654-32100', email: 'dispatch@medifast.in', distance: '2.3 km', eta: '5 min', type: 'ALS', status: 'available' },
        { id: 'NB-002', name: 'LifeLine Unit 4', org: 'LifeLine Emergency Services', driver: 'Deepak Verma', phone: '+91-87654-32101', email: 'ops@lifeline.in', distance: '3.8 km', eta: '8 min', type: 'BLS', status: 'available' },
        { id: 'NB-003', name: 'RapidCare Ambulance', org: 'RapidCare Foundation', driver: 'Vikram Joshi', phone: '+91-87654-32102', email: 'alert@rapidcare.org', distance: '4.1 km', eta: '9 min', type: 'ALS', status: 'available' },
        { id: 'NB-004', name: 'GreenCross Unit 2', org: 'GreenCross Medical', driver: 'Prashant Rao', phone: '+91-87654-32103', email: 'emergency@greencross.in', distance: '5.5 km', eta: '12 min', type: 'BLS', status: 'available' },
        { id: 'NB-005', name: 'SaveLife Ambulance', org: 'SaveLife Trust', driver: 'Karan Mehta', phone: '+91-87654-32104', email: 'dispatch@savelife.org', distance: '6.2 km', eta: '14 min', type: 'ALS', status: 'available' },
    ]);
    const [ambAlertSent, setAmbAlertSent] = useState(false);
    const [ambAcceptedId, setAmbAcceptedId] = useState(null);
    const [ambAlertLog, setAmbAlertLog] = useState([]);
    const [ambEmergencyNote, setAmbEmergencyNote] = useState('');
    const ambulanceSectionRef = useRef(null);

    // Treatment & Doctor Recommendation state
    const [treatmentCondition, setTreatmentCondition] = useState('');
    const [treatmentPatientName, setTreatmentPatientName] = useState('');
    const [treatmentPatientAge, setTreatmentPatientAge] = useState('');
    const [treatmentDescription, setTreatmentDescription] = useState('');
    const [recommendedDoctors, setRecommendedDoctors] = useState([]);
    const [canTreat, setCanTreat] = useState(null); // null = not checked, true/false
    const [expandedDoctor, setExpandedDoctor] = useState(null);
    const [treatmentSubmissions, setTreatmentSubmissions] = useState([]);
    const [selectedTreatmentDoctor, setSelectedTreatmentDoctor] = useState(null);
    const treatmentSectionRef = useRef(null);

    // Send alert to all nearby ambulances
    const sendAmbulanceAlert = () => {
        if (!ambEmergencyNote.trim()) return;
        const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const alerts = nearbyAmbulances.map(amb => ({
            id: `ALERT-${Date.now()}-${amb.id}`,
            ambulanceId: amb.id,
            ambulanceName: amb.name,
            org: amb.org,
            driver: amb.driver,
            phone: amb.phone,
            email: amb.email,
            distance: amb.distance,
            eta: amb.eta,
            notifiedAt: now,
            notifyMethod: 'SMS + Email',
            status: 'notified',
        }));
        setAmbAlertLog(alerts);
        setAmbAlertSent(true);
        setAmbAcceptedId(null);
    };

    // Simulate an ambulance accepting the request
    const acceptAmbulanceRequest = (ambulanceId) => {
        setAmbAcceptedId(ambulanceId);
        const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        setAmbAlertLog(prev => prev.map(a => 
            a.ambulanceId === ambulanceId 
                ? { ...a, status: 'accepted', acceptedAt: now }
                : { ...a, status: a.status === 'notified' ? 'stood-down' : a.status, stoodDownAt: a.status === 'notified' ? now : undefined }
        ));
    };

    // Reset ambulance alert system
    const resetAmbulanceAlert = () => {
        setAmbAlertSent(false);
        setAmbAcceptedId(null);
        setAmbAlertLog([]);
        setAmbEmergencyNote('');
    };

    // Check if hospital can treat the condition and recommend doctors
    const checkTreatmentAvailability = () => {
        if (!treatmentCondition || !treatmentPatientName.trim() || !treatmentPatientAge.trim()) return;
        
        const specialty = conditionToSpecialty[treatmentCondition];
        if (specialty && specialistDoctors[specialty]) {
            setCanTreat(true);
            setRecommendedDoctors(specialistDoctors[specialty]);
            setSelectedTreatmentDoctor(null);
            setExpandedDoctor(null);
        } else {
            setCanTreat(false);
            setRecommendedDoctors([]);
        }
    };

    // Confirm doctor selection for treatment
    const confirmTreatmentDoctor = () => {
        if (!selectedTreatmentDoctor) return;

        const submission = {
            id: `TRT-${Date.now()}`,
            patientName: treatmentPatientName.trim(),
            patientAge: treatmentPatientAge.trim(),
            condition: treatmentCondition,
            description: treatmentDescription.trim(),
            doctor: selectedTreatmentDoctor,
            submittedAt: new Date().toLocaleString(),
        };

        setTreatmentSubmissions(prev => [submission, ...prev]);
        setTreatmentCondition('');
        setTreatmentPatientName('');
        setTreatmentPatientAge('');
        setTreatmentDescription('');
        setRecommendedDoctors([]);
        setCanTreat(null);
        setSelectedTreatmentDoctor(null);
        setExpandedDoctor(null);
    };

    // Reset treatment form
    const resetTreatmentForm = () => {
        setTreatmentCondition('');
        setTreatmentPatientName('');
        setTreatmentPatientAge('');
        setTreatmentDescription('');
        setRecommendedDoctors([]);
        setCanTreat(null);
        setSelectedTreatmentDoctor(null);
        setExpandedDoctor(null);
    };

    // 3D view controls
    const [viewAngle, setViewAngle] = useState({ rotateX: 60, rotateZ: -45 });
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const mapRef = useRef(null);
    const rcSectionRef = useRef(null);

    // Show 5 volunteers from this hospital for user to select
    const showVolunteerOptions = () => {
        const { name, address, phone, disease } = assistForm;
        if (!name.trim() || !address.trim() || !phone.trim() || !disease.trim()) return;

        const hospitalVolunteers = volunteerPool.filter(v => v.hospital === 'City General Hospital');
        const shuffled = [...hospitalVolunteers].sort(() => 0.5 - Math.random());
        const options = shuffled.slice(0, 5);

        setPendingPatient({ name: name.trim(), address: address.trim(), phone: phone.trim(), disease: disease.trim() });
        setVolunteerOptions(options);
        setSelectedVolunteer(null);
    };

    // Confirm selected volunteer and create submission
    const confirmVolunteerSelection = () => {
        if (!selectedVolunteer || !pendingPatient) return;

        const submission = {
            id: `AST-${Date.now()}`,
            patientName: pendingPatient.name,
            address: pendingPatient.address,
            phone: pendingPatient.phone,
            disease: pendingPatient.disease,
            volunteer: selectedVolunteer,
            submittedAt: new Date().toLocaleString(),
        };

        setAssistSubmissions(prev => [submission, ...prev]);
        setAssistForm({ name: '', address: '', phone: '', disease: '' });
        setVolunteerOptions([]);
        setSelectedVolunteer(null);
        setPendingPatient(null);
    };

    // Cancel volunteer selection
    const cancelVolunteerSelection = () => {
        setVolunteerOptions([]);
        setSelectedVolunteer(null);
        setPendingPatient(null);
    };

    // Show volunteers for accident victim rescue
    const showAccidentVolunteerOptions = () => {
        const { location, victimCondition, reporterPhone, description } = accidentForm;
        if (!location.trim() || !victimCondition.trim() || !reporterPhone.trim() || !description.trim()) return;

        const hospitalVolunteers = volunteerPool.filter(v => v.hospital === 'City General Hospital');
        const shuffled = [...hospitalVolunteers].sort(() => 0.5 - Math.random());
        const options = shuffled.slice(0, 5);

        setPendingAccident({
            location: location.trim(),
            victimCondition: victimCondition.trim(),
            victimCount: accidentForm.victimCount || '1',
            reporterPhone: reporterPhone.trim(),
            description: description.trim(),
        });
        setAccidentVolunteerOptions(options);
        setSelectedAccidentVolunteer(null);
    };

    // Confirm selected volunteer for accident rescue
    const confirmAccidentVolunteerSelection = () => {
        if (!selectedAccidentVolunteer || !pendingAccident) return;

        const submission = {
            id: `ACC-${Date.now()}`,
            location: pendingAccident.location,
            victimCondition: pendingAccident.victimCondition,
            victimCount: pendingAccident.victimCount,
            reporterPhone: pendingAccident.reporterPhone,
            description: pendingAccident.description,
            volunteer: selectedAccidentVolunteer,
            submittedAt: new Date().toLocaleString(),
        };

        setAccidentSubmissions(prev => [submission, ...prev]);
        setAccidentForm({ location: '', victimCondition: '', victimCount: '1', reporterPhone: '', description: '' });
        setAccidentVolunteerOptions([]);
        setSelectedAccidentVolunteer(null);
        setPendingAccident(null);
    };

    // Cancel accident volunteer selection
    const cancelAccidentVolunteerSelection = () => {
        setAccidentVolunteerOptions([]);
        setSelectedAccidentVolunteer(null);
        setPendingAccident(null);
    };

    // Scroll animation for resource conflicts section
    useEffect(() => {
        const el = rcSectionRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            // Section entrance
            gsap.fromTo(el,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 90%' } }
            );

            // Header + stats
            gsap.fromTo(el.querySelectorAll('.resource-conflicts-section__header h3, .rc-stat'),
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 85%' } }
            );

            // Priority legend items
            gsap.fromTo(el.querySelectorAll('.rc-priority-item'),
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out',
                  scrollTrigger: { trigger: el, start: 'top 82%' } }
            );

            // Three columns stagger
            gsap.fromTo(el.querySelectorAll('.rc-column'),
                { y: 40, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.4)',
                  scrollTrigger: { trigger: el, start: 'top 80%' } }
            );
        });

        return () => ctx.revert();
    }, [resourceRequests]);

    // Scroll animation for volunteer assist section
    useEffect(() => {
        const el = assistSectionRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(el,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 90%' } }
            );
            gsap.fromTo(el.querySelectorAll('.va-header h3, .va-subtitle'),
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 85%' } }
            );
            gsap.fromTo(el.querySelector('.va-form-card'),
                { x: -40, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 82%' } }
            );
            gsap.fromTo(el.querySelector('.va-submissions'),
                { x: 40, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 82%' } }
            );
        });

        return () => ctx.revert();
    }, []);

    // Scroll animation for accident victim rescue section
    useEffect(() => {
        const el = accidentSectionRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(el,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 90%' } }
            );
            gsap.fromTo(el.querySelectorAll('.ar-header h3, .ar-subtitle, .ar-scenario-box'),
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 85%' } }
            );
            gsap.fromTo(el.querySelector('.ar-form-card'),
                { x: -40, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 82%' } }
            );
            gsap.fromTo(el.querySelector('.ar-submissions'),
                { x: 40, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 82%' } }
            );
        });

        return () => ctx.revert();
    }, []);

    // Scroll animation for ambulance alert section
    useEffect(() => {
        const el = ambulanceSectionRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(el,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 90%' } }
            );
            gsap.fromTo(el.querySelectorAll('.amb-header h3, .amb-subtitle, .amb-scenario-box'),
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 85%' } }
            );
            gsap.fromTo(el.querySelectorAll('.amb-hospital-status, .amb-alert-panel'),
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 80%' } }
            );
        });

        return () => ctx.revert();
    }, []);

    // Scroll animation for treatment section
    useEffect(() => {
        const el = treatmentSectionRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(el,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 90%' } }
            );
            gsap.fromTo(el.querySelectorAll('.trt-header h3, .trt-subtitle'),
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 85%' } }
            );
            gsap.fromTo(el.querySelectorAll('.trt-form-card, .trt-results'),
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 80%' } }
            );
        });

        return () => ctx.revert();
    }, [recommendedDoctors]);

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
                                                setIsTrackingEquipment(true);
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
                            <div className="sidebar-section">
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
                               2D FLOOR PLAN - REALISTIC HOSPITAL ARCHITECTURAL VIEW
                            ═══════════════════════════════════════════════════════════════ */
                            <div className="floor-plan-2d">
                                {/* Building outline */}
                                <div className="building-outline">
                                    {/* Floor header badge */}
                                    <div className="floor-header-arch">
                                        <div className="floor-header-badge" style={{ backgroundColor: currentFloorData?.color }}>
                                            <Building2 size={14} />
                                            <span>{currentFloorData?.name}</span>
                                        </div>
                                    </div>

                                    {/* Compass rose */}
                                    <div className="compass-rose">
                                        <div className="compass-n">N</div>
                                        <svg width="28" height="28" viewBox="0 0 28 28">
                                            <circle cx="14" cy="14" r="12" fill="none" stroke="#94a3b8" strokeWidth="0.8"/>
                                            <polygon points="14,3 16,12 14,10 12,12" fill="#ef4444"/>
                                            <polygon points="14,25 12,16 14,18 16,16" fill="#94a3b8"/>
                                            <polygon points="3,14 12,12 10,14 12,16" fill="#94a3b8"/>
                                            <polygon points="25,14 16,16 18,14 16,12" fill="#94a3b8"/>
                                        </svg>
                                    </div>

                                    {/* Scale bar */}
                                    <div className="scale-bar">
                                        <div className="scale-bar__line">
                                            <span></span><span></span><span></span><span></span>
                                        </div>
                                        <div className="scale-bar__text">0 ── 5m ── 10m</div>
                                    </div>

                                    {/* Exterior wall hatching (top) */}
                                    <div className="exterior-wall exterior-wall--top">
                                        <svg width="100%" height="8" preserveAspectRatio="none">
                                            <defs>
                                                <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                                    <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="0.5"/>
                                                </pattern>
                                            </defs>
                                            <rect width="100%" height="8" fill="url(#hatch)"/>
                                        </svg>
                                    </div>

                                    {/* Wing labels */}
                                    <div className="wing-label wing-label--top"><span>WING A — NORTH</span></div>
                                    <div className="wing-label wing-label--bottom"><span>WING B — SOUTH</span></div>

                                    {/* Upper rooms row */}
                                    <div className="room-row room-row--top">
                                        {currentRooms.filter(r => r.row === 1).map(room => (
                                            <RoomCard 
                                                key={room.id}
                                                room={room}
                                                style={roomTypeStyles[room.type]}
                                                isSelected={selectedRoom?.id === room.id}
                                                onClick={setSelectedRoom}
                                                showEquipment={userMode === 'worker'}
                                                equipment={equipmentInventory.filter(e => e.floor === activeFloor)}
                                                patients={patientsOnFloor}
                                            />
                                        ))}
                                    </div>

                                    {/* Central Corridor - SVG based */}
                                    <div className="corridor-2d-real">
                                        <svg className="corridor-svg" viewBox="0 0 800 50" preserveAspectRatio="none">
                                            <defs>
                                                <pattern id="corridor-tile" width="25" height="25" patternUnits="userSpaceOnUse">
                                                    <rect width="25" height="25" fill="#fef9c3"/>
                                                    <rect x="0" y="0" width="12" height="12" fill="#fef3c7"/>
                                                    <rect x="13" y="13" width="12" height="12" fill="#fef3c7"/>
                                                </pattern>
                                            </defs>
                                            {/* Corridor floor tiles */}
                                            <rect width="800" height="50" fill="url(#corridor-tile)"/>
                                            {/* Center line */}
                                            <line x1="0" y1="25" x2="800" y2="25" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="8,6" opacity="0.4"/>
                                            {/* Directional arrows */}
                                            <polygon points="30,25 40,20 40,30" fill="#d97706" opacity="0.3"/>
                                            <polygon points="770,25 760,20 760,30" fill="#d97706" opacity="0.3"/>
                                            {/* Stairwell box */}
                                            <rect x="60" y="10" width="30" height="30" rx="2" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2"/>
                                            <text x="75" y="28" textAnchor="middle" fontSize="6" fill="#64748b" fontWeight="600">STAIRS</text>
                                            <line x1="65" y1="15" x2="85" y2="15" stroke="#94a3b8" strokeWidth="0.5"/>
                                            <line x1="65" y1="20" x2="85" y2="20" stroke="#94a3b8" strokeWidth="0.5"/>
                                            <line x1="65" y1="25" x2="85" y2="25" stroke="#94a3b8" strokeWidth="0.5"/>
                                            {/* Elevator */}
                                            <rect x="120" y="12" width="26" height="26" rx="3" fill="#f1f5f9" stroke="#475569" strokeWidth="1.2"/>
                                            <text x="133" y="28" textAnchor="middle" fontSize="5.5" fill="#475569" fontWeight="700">LIFT</text>
                                            <line x1="133" y1="14" x2="133" y2="36" stroke="#cbd5e1" strokeWidth="0.5"/>
                                            {/* Nurses Station */}
                                            <rect x="340" y="8" width="120" height="34" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.2"/>
                                            <text x="400" y="22" textAnchor="middle" fontSize="6" fill="#1e40af" fontWeight="700">👩‍⚕️ NURSES STATION</text>
                                            <text x="400" y="33" textAnchor="middle" fontSize="4.5" fill="#3b82f6">Monitoring Desk</text>
                                            {/* Fire Exit */}
                                            <rect x="660" y="12" width="28" height="26" rx="2" fill="#fef2f2" stroke="#ef4444" strokeWidth="1"/>
                                            <text x="674" y="23" textAnchor="middle" fontSize="4.5" fill="#ef4444" fontWeight="700">FIRE</text>
                                            <text x="674" y="31" textAnchor="middle" fontSize="4" fill="#ef4444">EXIT</text>
                                            {/* Restroom */}
                                            <rect x="720" y="12" width="26" height="26" rx="2" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8"/>
                                            <text x="733" y="28" textAnchor="middle" fontSize="7" fill="#475569">🚻</text>
                                        </svg>
                                        {/* Corridor walls (borders) */}
                                        <div className="corridor-wall corridor-wall--top"></div>
                                        <div className="corridor-wall corridor-wall--bottom"></div>
                                    </div>

                                    {/* Lower rooms row */}
                                    <div className="room-row room-row--bottom">
                                        {currentRooms.filter(r => r.row === 2).map(room => (
                                            <RoomCard 
                                                key={room.id}
                                                room={room}
                                                style={roomTypeStyles[room.type]}
                                                isSelected={selectedRoom?.id === room.id}
                                                onClick={setSelectedRoom}
                                                showEquipment={userMode === 'worker'}
                                                equipment={equipmentInventory.filter(e => e.floor === activeFloor)}
                                                patients={patientsOnFloor}
                                            />
                                        ))}
                                    </div>

                                    {/* Exterior wall hatching (bottom) */}
                                    <div className="exterior-wall exterior-wall--bottom">
                                        <svg width="100%" height="8" preserveAspectRatio="none">
                                            <rect width="100%" height="8" fill="url(#hatch)"/>
                                        </svg>
                                    </div>

                                    {/* Entrance markers */}
                                    <div className="entrance-marker entrance-marker--main">
                                        <svg width="50" height="24" viewBox="0 0 50 24">
                                            <rect x="0" y="0" width="50" height="24" rx="4" fill="#22c55e"/>
                                            <text x="25" y="10" textAnchor="middle" fontSize="4.5" fill="#fff" fontWeight="700">MAIN</text>
                                            <text x="25" y="18" textAnchor="middle" fontSize="4" fill="#dcfce7">ENTRANCE</text>
                                        </svg>
                                        <div className="entrance-arrow-svg">
                                            <svg width="16" height="12" viewBox="0 0 16 12">
                                                <polygon points="8,12 0,0 16,0" fill="#22c55e"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="entrance-marker entrance-marker--emergency">
                                        <div className="entrance-arrow-svg entrance-arrow-svg--up">
                                            <svg width="16" height="12" viewBox="0 0 16 12">
                                                <polygon points="8,0 16,12 0,12" fill="#ef4444"/>
                                            </svg>
                                        </div>
                                        <svg width="56" height="20" viewBox="0 0 56 20">
                                            <rect x="0" y="0" width="56" height="20" rx="3" fill="#ef4444"/>
                                            <text x="28" y="13" textAnchor="middle" fontSize="5" fill="#fff" fontWeight="700">EMERGENCY</text>
                                        </svg>
                                    </div>
                                </div>

                                {/* Equipment Markers (Worker Mode) */}
                                {userMode === 'worker' && (
                                    <div className="equipment-overlay">
                                        {equipmentInventory
                                            .filter(eq => eq.floor === activeFloor)
                                            .map(eq => (
                                                <div 
                                                    key={eq.id}
                                                    className={`eq-marker ${selectedEquipment?.id === eq.id ? 'eq-marker--selected' : ''} ${isTrackingEquipment && selectedEquipment?.id === eq.id ? 'eq-marker--tracking' : ''}`}
                                                    style={{ 
                                                        left: `${eq.x}%`, 
                                                        top: `${eq.y}%`,
                                                        backgroundColor: statusColors[eq.status]?.bg
                                                    }}
                                                    onClick={() => {
                                                        setSelectedEquipment(eq);
                                                        setIsTrackingEquipment(true);
                                                    }}
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

                                {/* Equipment Tracking Path */}
                                {isTrackingEquipment && selectedEquipment && selectedEquipment.floor === activeFloor && (
                                    <svg className="eq-tracking-path-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <circle cx="50" cy="95" r="2" fill="#3b82f6" className="eq-track-point eq-track-point--start"/>
                                        <path 
                                            d={`M 50 95 L 50 ${(95 + selectedEquipment.y) / 2} L ${selectedEquipment.x} ${(95 + selectedEquipment.y) / 2} L ${selectedEquipment.x} ${selectedEquipment.y}`}
                                            className="eq-track-path" fill="none" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="2,1"
                                        />
                                        <circle cx={selectedEquipment.x} cy={selectedEquipment.y} r="3" className="eq-track-point eq-track-point--end"/>
                                    </svg>
                                )}

                                {/* Equipment Tracking Banner */}
                                {isTrackingEquipment && selectedEquipment && (
                                    <div className="eq-tracking-banner">
                                        <div className="eq-tracking-banner__content">
                                            <Target size={18} className="pulse-icon" />
                                            <div className="eq-tracking-banner__info">
                                                <span className="eq-tracking-banner__title">Tracking: {selectedEquipment.name}</span>
                                                <span className="eq-tracking-banner__subtitle">
                                                    {floors.find(f => f.id === selectedEquipment.floor)?.name} → {selectedEquipment.room} · {statusColors[selectedEquipment.status]?.label}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="eq-tracking-banner__close" onClick={() => setIsTrackingEquipment(false)}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}

                                {/* Navigation Path */}
                                {isNavigating && navigationTarget && navigationTarget.floor === activeFloor && (
                                    <svg className="navigation-path-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <circle cx="50" cy="95" r="2" fill="#22c55e" className="nav-point nav-point--start"/>
                                        <path 
                                            d={`M 50 95 L 50 50 L ${navigationTarget.x} 50 L ${navigationTarget.x} ${navigationTarget.y}`}
                                            className="nav-path" fill="none" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="2,1"
                                        />
                                        <circle cx={navigationTarget.x} cy={navigationTarget.y} r="2.5" fill="#ef4444" className="nav-point nav-point--end"/>
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

                    {/* ═══ SELECTED EQUIPMENT TRACKER (worker mode) ═══ */}
                    {userMode === 'worker' && selectedEquipment && (
                        <div className="eq-tracker">
                            <div className="eq-tracker__header">
                                <div className="eq-tracker__title">
                                    <span className="eq-tracker__status-dot" style={{ backgroundColor: statusColors[selectedEquipment.status]?.bg }} />
                                    <h3>{selectedEquipment.name}</h3>
                                    <span className={`eq-tracker__badge eq-tracker__badge--${selectedEquipment.status}`}>
                                        {statusColors[selectedEquipment.status]?.label}
                                    </span>
                                </div>
                                <button className="eq-tracker__close" onClick={() => { setSelectedEquipment(null); setIsTrackingEquipment(false); }} title="Close">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="eq-tracker__body">
                                <div className="eq-tracker__details">
                                    <div className="eq-tracker__info-grid">
                                        <div className="eq-tracker__info-item">
                                            <span className="eq-tracker__label"><Package size={12} /> Category</span>
                                            <span className="eq-tracker__value">{equipmentCategories.find(c => c.id === selectedEquipment.category)?.name}</span>
                                        </div>
                                        <div className="eq-tracker__info-item">
                                            <span className="eq-tracker__label"><Layers size={12} /> Floor</span>
                                            <span className="eq-tracker__value">{floors.find(f => f.id === selectedEquipment.floor)?.name}</span>
                                        </div>
                                        <div className="eq-tracker__info-item">
                                            <span className="eq-tracker__label"><Building2 size={12} /> Room</span>
                                            <span className="eq-tracker__value">{selectedEquipment.room}</span>
                                        </div>
                                        <div className="eq-tracker__info-item">
                                            <span className="eq-tracker__label"><MapPin size={12} /> Position</span>
                                            <span className="eq-tracker__value">X: {selectedEquipment.x}% · Y: {selectedEquipment.y}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="eq-tracker__actions">
                                    <button
                                        className={`eq-tracker__action-btn eq-tracker__action-btn--track ${isTrackingEquipment ? 'eq-tracker__action-btn--active' : ''}`}
                                        onClick={() => {
                                            setActiveFloor(selectedEquipment.floor);
                                            setIsTrackingEquipment(true);
                                        }}
                                    >
                                        <Target size={14} /> {isTrackingEquipment ? 'Tracking...' : 'Track Location'}
                                    </button>
                                    {selectedEquipment.status === 'available' && (
                                        <button className="eq-tracker__action-btn eq-tracker__action-btn--use">
                                            <CheckCircle size={14} /> Mark as In Use
                                        </button>
                                    )}
                                    {selectedEquipment.status === 'in-use' && (
                                        <button className="eq-tracker__action-btn eq-tracker__action-btn--release">
                                            <RotateCcw size={14} /> Release Equipment
                                        </button>
                                    )}
                                    {selectedEquipment.status === 'maintenance' && (
                                        <button className="eq-tracker__action-btn eq-tracker__action-btn--ready">
                                            <Wrench size={14} /> Mark Available
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ RESOURCE CONFLICTS SECTION (below map) ═══ */}
                    <div className="resource-conflicts-section" ref={rcSectionRef}>
                        <div className="resource-conflicts-section__header">
                            <h3><AlertTriangle size={18} /> Resource Conflicts</h3>
                            <div className="resource-conflicts-section__stats">
                                <span className="rc-stat rc-stat--conflict">
                                    <ShieldAlert size={14} />
                                    {resourceConflicts.length} Conflict{resourceConflicts.length !== 1 ? 's' : ''}
                                </span>
                                <span className="rc-stat rc-stat--waiting">
                                    <Hourglass size={14} />
                                    {waitingQueue.length} Waiting
                                </span>
                                <span className="rc-stat rc-stat--allocated">
                                    <CheckCircle size={14} />
                                    {allocatedResources.length} Allocated
                                </span>
                            </div>
                        </div>

                        {/* Priority Legend Row */}
                        <div className="rc-priority-legend">
                            {Object.entries(priorityLevels).map(([key, value]) => (
                                <div key={key} className="rc-priority-item">
                                    <span className="rc-priority-dot" style={{ backgroundColor: value.color }}></span>
                                    <span className="rc-priority-label">{value.label}</span>
                                    <span className="rc-priority-wait">~{value.waitTime}m</span>
                                </div>
                            ))}
                        </div>

                        <div className="rc-grid">
                            {/* Conflicts Column */}
                            <div className="rc-column rc-column--conflicts">
                                <h4 className="rc-column__title">
                                    <AlertTriangle size={14} />
                                    Active Conflicts ({resourceConflicts.length})
                                </h4>
                                {resourceConflicts.length === 0 ? (
                                    <div className="rc-empty">
                                        <CheckCircle size={20} />
                                        <span>No resource conflicts</span>
                                    </div>
                                ) : (
                                    <div className="rc-list">
                                        {resourceConflicts.map(conflict => (
                                            <div key={conflict.resourceId} className="rc-conflict-card">
                                                <div className="rc-conflict-card__resource">
                                                    <Package size={14} />
                                                    <span>{conflict.resourceName}</span>
                                                    <span className="rc-conflict-badge">{conflict.requests.length} requests</span>
                                                </div>
                                                <div className="rc-conflict-card__patients">
                                                    {conflict.requests.map((req, idx) => {
                                                        const patient = admittedPatients.find(p => p.id === req.patientId);
                                                        return (
                                                            <div key={req.id} className={`rc-conflict-patient ${idx === 0 ? 'rc-conflict-patient--winner' : ''}`}>
                                                                <span className="rc-conflict-patient__dot" style={{ backgroundColor: priorityLevels[req.priority]?.color }} />
                                                                <span className="rc-conflict-patient__name">{patient?.name}</span>
                                                                <span className="rc-conflict-patient__priority">{priorityLevels[req.priority]?.label}</span>
                                                                {idx === 0 && <CheckCircle size={12} className="rc-winner-icon" />}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <button className="rc-resolve-btn" onClick={() => resolveConflict(conflict.resourceId)}>
                                                    <Zap size={13} />
                                                    Auto-Resolve by Priority
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Waiting Queue Column */}
                            <div className="rc-column rc-column--waiting">
                                <h4 className="rc-column__title">
                                    <Hourglass size={14} />
                                    Waiting Queue ({waitingQueue.length})
                                </h4>
                                {waitingQueue.length === 0 ? (
                                    <div className="rc-empty">
                                        <CheckCircle size={20} />
                                        <span>No patients waiting</span>
                                    </div>
                                ) : (
                                    <div className="rc-list">
                                        {waitingQueue.map((request, idx) => {
                                            const patient = admittedPatients.find(p => p.id === request.patientId);
                                            const resource = equipmentInventory.find(e => e.id === request.resourceId);
                                            return (
                                                <div key={request.id} className="rc-waiting-card">
                                                    <div className="rc-waiting-card__pos">#{idx + 1}</div>
                                                    <span className="rc-waiting-card__dot" style={{ backgroundColor: priorityLevels[request.priority]?.color }} />
                                                    <div className="rc-waiting-card__info">
                                                        <span className="rc-waiting-card__patient">{patient?.name}</span>
                                                        <span className="rc-waiting-card__resource">Needs: {resource?.name || request.resourceType}</span>
                                                    </div>
                                                    <div className="rc-waiting-card__time">
                                                        <Timer size={12} />
                                                        ~{request.estimatedWait}m
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Allocated Column */}
                            <div className="rc-column rc-column--allocated">
                                <h4 className="rc-column__title">
                                    <CheckCircle size={14} />
                                    Allocated ({allocatedResources.length})
                                </h4>
                                <div className="rc-list">
                                    {allocatedResources.map(request => {
                                        const patient = admittedPatients.find(p => p.id === request.patientId);
                                        const resource = equipmentInventory.find(e => e.id === request.resourceId);
                                        return (
                                            <div key={request.id} className="rc-allocated-card">
                                                <span className="rc-allocated-card__dot" style={{ backgroundColor: priorityLevels[request.priority]?.color }} />
                                                <div className="rc-allocated-card__info">
                                                    <span className="rc-allocated-card__patient">{patient?.name}</span>
                                                    <span className="rc-allocated-card__resource">{resource?.name}</span>
                                                </div>
                                                <button className="rc-release-btn" onClick={() => releaseResource(request.id)} title="Release resource">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══ VOLUNTEER ASSIST SECTION (below resource conflicts) ═══ */}
                    <div className="volunteer-assist-section" ref={assistSectionRef}>
                        <div className="va-header">
                            <h3><HeartHandshake size={20} /> For Those Who Can't Use the Website</h3>
                            <p className="va-subtitle">Register a patient who needs help navigating the system. Select a volunteer from this hospital to assist them.</p>
                        </div>

                        <div className="va-body">
                            {/* Form */}
                            <div className="va-form-card">
                                <h4><ClipboardList size={16} /> Patient Information</h4>
                                <div className="va-form">
                                    <div className="va-form-group">
                                        <label><User size={14} /> Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter patient's full name"
                                            value={assistForm.name}
                                            onChange={e => setAssistForm(prev => ({ ...prev, name: e.target.value }))}
                                            disabled={volunteerOptions.length > 0}
                                        />
                                    </div>
                                    <div className="va-form-group">
                                        <label><MapPinned size={14} /> Address</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Full address"
                                            value={assistForm.address}
                                            onChange={e => setAssistForm(prev => ({ ...prev, address: e.target.value }))}
                                            disabled={volunteerOptions.length > 0}
                                        />
                                    </div>
                                    <div className="va-form-row">
                                        <div className="va-form-group">
                                            <label><Phone size={14} /> Phone Number</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                placeholder="+91-XXXXX-XXXXX"
                                                value={assistForm.phone}
                                                onChange={e => setAssistForm(prev => ({ ...prev, phone: e.target.value }))}
                                                disabled={volunteerOptions.length > 0}
                                            />
                                        </div>
                                        <div className="va-form-group">
                                            <label><Activity size={14} /> Disease / Condition</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g. Diabetes, Fracture"
                                                value={assistForm.disease}
                                                onChange={e => setAssistForm(prev => ({ ...prev, disease: e.target.value }))}
                                                disabled={volunteerOptions.length > 0}
                                            />
                                        </div>
                                    </div>

                                    {volunteerOptions.length === 0 ? (
                                        <button
                                            className="va-submit-btn"
                                            onClick={showVolunteerOptions}
                                            disabled={!assistForm.name.trim() || !assistForm.phone.trim() || !assistForm.disease.trim() || !assistForm.address.trim()}
                                        >
                                            <Search size={16} />
                                            Find Volunteers
                                        </button>
                                    ) : (
                                        <div className="va-selection-panel">
                                            <div className="va-selection-header">
                                                <h5><Users size={16} /> Select a Volunteer from City General Hospital</h5>
                                                <button className="va-cancel-btn" onClick={cancelVolunteerSelection}><X size={14} /> Cancel</button>
                                            </div>
                                            <div className="va-options-list">
                                                {volunteerOptions.map(vol => (
                                                    <div
                                                        key={vol.id}
                                                        className={`va-option-card ${selectedVolunteer?.id === vol.id ? 'va-option-card--selected' : ''}`}
                                                        onClick={() => setSelectedVolunteer(vol)}
                                                    >
                                                        <div className="va-option-check">
                                                            {selectedVolunteer?.id === vol.id ? <CheckCircle size={18} /> : <Circle size={18} />}
                                                        </div>
                                                        <span className="va-vol-avatar">{vol.avatar}</span>
                                                        <div className="va-vol-info">
                                                            <strong>{vol.name}</strong>
                                                            <span>{vol.specialization}</span>
                                                        </div>
                                                        <div className="va-vol-contact">
                                                            <span><Phone size={11} /> {vol.phone}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                className="va-confirm-btn"
                                                onClick={confirmVolunteerSelection}
                                                disabled={!selectedVolunteer}
                                            >
                                                <CheckCircle size={16} />
                                                Confirm Selection
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submissions */}
                            <div className="va-submissions">
                                <h4><Users size={16} /> Registered Patients & Selected Volunteer ({assistSubmissions.length})</h4>
                                {assistSubmissions.length === 0 ? (
                                    <div className="va-empty">
                                        <HeartHandshake size={36} />
                                        <p>No patients registered yet.</p>
                                        <span>Fill the form and select a volunteer to assist a patient.</span>
                                    </div>
                                ) : (
                                    <div className="va-submissions-list">
                                        {assistSubmissions.map(sub => (
                                            <div key={sub.id} className="va-submission-card">
                                                <div className="va-submission-card__header">
                                                    <div className="va-patient-info">
                                                        <div className="va-patient-avatar"><UserCircle size={28} /></div>
                                                        <div>
                                                            <h5>{sub.patientName}</h5>
                                                            <span className="va-disease-badge">{sub.disease}</span>
                                                        </div>
                                                    </div>
                                                    <span className="va-timestamp"><Clock size={12} /> {sub.submittedAt}</span>
                                                </div>
                                                <div className="va-patient-details">
                                                    <span><MapPinned size={12} /> {sub.address}</span>
                                                    <span><Phone size={12} /> {sub.phone}</span>
                                                    <span><Activity size={12} /> {sub.disease}</span>
                                                </div>
                                                <div className="va-volunteers-grid">
                                                    <span className="va-volunteers-label">Selected Volunteer:</span>
                                                    <div className="va-volunteer-card va-volunteer-card--selected">
                                                        <span className="va-vol-avatar">{sub.volunteer.avatar}</span>
                                                        <div className="va-vol-info">
                                                            <strong>{sub.volunteer.name}</strong>
                                                            <span>{sub.volunteer.specialization}</span>
                                                        </div>
                                                        <div className="va-vol-contact">
                                                            <span><Phone size={11} /> {sub.volunteer.phone}</span>
                                                        </div>
                                                        <span className="va-selected-badge"><CheckCircle size={12} /> Assigned</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ═══ ACCIDENT VICTIM RESCUE SECTION ═══ */}
                    <div className="accident-rescue-section" ref={accidentSectionRef}>
                        <div className="ar-header">
                            <h3><Siren size={20} /> Accident Victim Rescue</h3>
                            <p className="ar-subtitle">Help accident victims reach the hospital safely. A volunteer will be assigned to handle everything — from rescue to hospital admission.</p>
                        </div>

                        {/* Scenario Info Box */}
                        <div className="ar-scenario-box">
                            <div className="ar-scenario-icon"><AlertCircle size={22} /></div>
                            <div className="ar-scenario-content">
                                <h4>Why This Matters</h4>
                                <p>
                                    Every year, countless accident victims are left stranded on roads because bystanders fear getting involved — 
                                    worried about police cases, time-consuming legal procedures, and hospital formalities. Many victims lose critical 
                                    time because no one steps forward to help.
                                </p>
                                <div className="ar-scenario-points">
                                    <div className="ar-point">
                                        <ShieldCheck size={14} />
                                        <span><strong>No Legal Hassle:</strong> Our assigned volunteer handles all police formalities and documentation on behalf of the rescuer.</span>
                                    </div>
                                    <div className="ar-point">
                                        <Car size={14} />
                                        <span><strong>Quick Transport:</strong> The volunteer ensures the victim is brought to the nearest hospital immediately.</span>
                                    </div>
                                    <div className="ar-point">
                                        <PhoneCall size={14} />
                                        <span><strong>Family Contact:</strong> The volunteer contacts the victim's family and shares hospital & accident details.</span>
                                    </div>
                                    <div className="ar-point">
                                        <ClipboardList size={14} />
                                        <span><strong>Complete Process:</strong> From police general info, FIR assistance, to hospital admission — the volunteer manages everything.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ar-body">
                            {/* Form */}
                            <div className="ar-form-card">
                                <h4><ClipboardList size={16} /> Report an Accident</h4>
                                <div className="ar-form">
                                    <div className="ar-form-group">
                                        <label><MapPin size={14} /> Accident Location</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Near Andheri Signal, Western Express Highway"
                                            value={accidentForm.location}
                                            onChange={e => setAccidentForm(prev => ({ ...prev, location: e.target.value }))}
                                            disabled={accidentVolunteerOptions.length > 0}
                                        />
                                    </div>
                                    <div className="ar-form-row">
                                        <div className="ar-form-group">
                                            <label><Activity size={14} /> Victim Condition</label>
                                            <select
                                                className="form-control"
                                                value={accidentForm.victimCondition}
                                                onChange={e => setAccidentForm(prev => ({ ...prev, victimCondition: e.target.value }))}
                                                disabled={accidentVolunteerOptions.length > 0}
                                            >
                                                <option value="">Select condition</option>
                                                <option value="Critical - Unconscious">Critical - Unconscious</option>
                                                <option value="Critical - Heavy Bleeding">Critical - Heavy Bleeding</option>
                                                <option value="Serious - Multiple Injuries">Serious - Multiple Injuries</option>
                                                <option value="Moderate - Fracture/Wounds">Moderate - Fracture/Wounds</option>
                                                <option value="Minor - Bruises/Scratches">Minor - Bruises/Scratches</option>
                                            </select>
                                        </div>
                                        <div className="ar-form-group">
                                            <label><Users size={14} /> Number of Victims</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                min="1"
                                                max="20"
                                                value={accidentForm.victimCount}
                                                onChange={e => setAccidentForm(prev => ({ ...prev, victimCount: e.target.value }))}
                                                disabled={accidentVolunteerOptions.length > 0}
                                            />
                                        </div>
                                    </div>
                                    <div className="ar-form-group">
                                        <label><Phone size={14} /> Your Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            placeholder="+91-XXXXX-XXXXX"
                                            value={accidentForm.reporterPhone}
                                            onChange={e => setAccidentForm(prev => ({ ...prev, reporterPhone: e.target.value }))}
                                            disabled={accidentVolunteerOptions.length > 0}
                                        />
                                    </div>
                                    <div className="ar-form-group">
                                        <label><FileText size={14} /> Accident Description</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Describe what happened — type of accident, vehicle involved, any immediate help needed..."
                                            value={accidentForm.description}
                                            onChange={e => setAccidentForm(prev => ({ ...prev, description: e.target.value }))}
                                            disabled={accidentVolunteerOptions.length > 0}
                                        />
                                    </div>

                                    {accidentVolunteerOptions.length === 0 ? (
                                        <button
                                            className="ar-submit-btn"
                                            onClick={showAccidentVolunteerOptions}
                                            disabled={!accidentForm.location.trim() || !accidentForm.victimCondition || !accidentForm.reporterPhone.trim() || !accidentForm.description.trim()}
                                        >
                                            <Siren size={16} />
                                            Assign Rescue Volunteer
                                        </button>
                                    ) : (
                                        <div className="ar-selection-panel">
                                            <div className="ar-selection-header">
                                                <h5><Users size={16} /> Select a Rescue Volunteer</h5>
                                                <button className="ar-cancel-btn" onClick={cancelAccidentVolunteerSelection}><X size={14} /> Cancel</button>
                                            </div>
                                            <div className="ar-options-list">
                                                {accidentVolunteerOptions.map(vol => (
                                                    <div
                                                        key={vol.id}
                                                        className={`ar-option-card ${selectedAccidentVolunteer?.id === vol.id ? 'ar-option-card--selected' : ''}`}
                                                        onClick={() => setSelectedAccidentVolunteer(vol)}
                                                    >
                                                        <div className="ar-option-check">
                                                            {selectedAccidentVolunteer?.id === vol.id ? <CheckCircle size={18} /> : <Circle size={18} />}
                                                        </div>
                                                        <span className="ar-vol-avatar">{vol.avatar}</span>
                                                        <div className="ar-vol-info">
                                                            <strong>{vol.name}</strong>
                                                            <span>{vol.specialization}</span>
                                                        </div>
                                                        <div className="ar-vol-contact">
                                                            <span><Phone size={11} /> {vol.phone}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                className="ar-confirm-btn"
                                                onClick={confirmAccidentVolunteerSelection}
                                                disabled={!selectedAccidentVolunteer}
                                            >
                                                <CheckCircle size={16} />
                                                Confirm & Dispatch Volunteer
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submissions */}
                            <div className="ar-submissions">
                                <h4><Car size={16} /> Reported Accidents & Assigned Volunteers ({accidentSubmissions.length})</h4>
                                {accidentSubmissions.length === 0 ? (
                                    <div className="ar-empty">
                                        <Siren size={36} />
                                        <p>No accident reports yet.</p>
                                        <span>Report an accident and assign a volunteer to rescue the victim.</span>
                                    </div>
                                ) : (
                                    <div className="ar-submissions-list">
                                        {accidentSubmissions.map(sub => (
                                            <div key={sub.id} className="ar-submission-card">
                                                <div className="ar-submission-card__header">
                                                    <div className="ar-accident-info">
                                                        <div className="ar-accident-icon"><Car size={22} /></div>
                                                        <div>
                                                            <h5>{sub.location}</h5>
                                                            <span className="ar-condition-badge">{sub.victimCondition}</span>
                                                        </div>
                                                    </div>
                                                    <span className="ar-timestamp"><Clock size={12} /> {sub.submittedAt}</span>
                                                </div>
                                                <div className="ar-accident-details">
                                                    <span><Users size={12} /> {sub.victimCount} victim(s)</span>
                                                    <span><Phone size={12} /> Reporter: {sub.reporterPhone}</span>
                                                    <span><MapPin size={12} /> {sub.location}</span>
                                                </div>
                                                <div className="ar-description-box">
                                                    <span><FileText size={12} /> {sub.description}</span>
                                                </div>
                                                <div className="ar-volunteer-assigned">
                                                    <span className="ar-assigned-label">Rescue Volunteer Assigned:</span>
                                                    <div className="ar-volunteer-card ar-volunteer-card--assigned">
                                                        <span className="ar-vol-avatar">{sub.volunteer.avatar}</span>
                                                        <div className="ar-vol-info">
                                                            <strong>{sub.volunteer.name}</strong>
                                                            <span>{sub.volunteer.specialization}</span>
                                                        </div>
                                                        <div className="ar-vol-contact">
                                                            <span><Phone size={11} /> {sub.volunteer.phone}</span>
                                                        </div>
                                                        <span className="ar-dispatched-badge"><Siren size={12} /> Dispatched</span>
                                                    </div>
                                                    <div className="ar-process-steps">
                                                        <span className="ar-process-title">Volunteer will handle:</span>
                                                        <div className="ar-process-step"><CheckCircle size={11} /> Rush to accident spot & rescue victim</div>
                                                        <div className="ar-process-step"><CheckCircle size={11} /> Transport victim to nearest hospital</div>
                                                        <div className="ar-process-step"><CheckCircle size={11} /> Handle police formalities & FIR</div>
                                                        <div className="ar-process-step"><CheckCircle size={11} /> Contact victim's family with updates</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* ═══ NEARBY AMBULANCE ALERT SYSTEM ═══ */}
                    <div className="amb-alert-section" ref={ambulanceSectionRef}>
                        <div className="amb-header">
                            <h3><Ambulance size={20} /> Ambulance Not Available — Nearby Alert System</h3>
                            <p className="amb-subtitle">When our hospital ambulances are unavailable, automatically alert nearby ambulance services via SMS & Email. Once one accepts, all others are notified — saving time, cost, and lives.</p>
                        </div>

                        {/* Scenario Info Box */}
                        <div className="amb-scenario-box">
                            <div className="amb-scenario-icon"><AlertCircle size={22} /></div>
                            <div className="amb-scenario-content">
                                <h4>How This Saves Lives</h4>
                                <p>
                                    In emergencies, every second counts. When all hospital ambulances are deployed or under maintenance,
                                    patients in critical condition cannot afford to wait. This system instantly notifies nearby ambulance 
                                    services to fill the gap — ensuring no patient is left without emergency transport.
                                </p>
                                <div className="amb-scenario-points">
                                    <div className="amb-point">
                                        <BellRing size={14} />
                                        <span><strong>Instant Notification:</strong> All nearby ambulances receive SMS + Email alerts simultaneously — no manual calling needed.</span>
                                    </div>
                                    <div className="amb-point">
                                        <ThumbsUp size={14} />
                                        <span><strong>Accept & Stand Down:</strong> Once one ambulance accepts, all others receive a "Situation Handled" notification automatically.</span>
                                    </div>
                                    <div className="amb-point">
                                        <Signal size={14} />
                                        <span><strong>Cost Efficient:</strong> No duplicate dispatch. Only one ambulance responds, avoiding wasted fuel and resources.</span>
                                    </div>
                                    <div className="amb-point">
                                        <ShieldCheck size={14} />
                                        <span><strong>Life-Saving:</strong> Reduces response time dramatically — the nearest available ambulance handles the emergency immediately.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hospital Ambulance Status */}
                        <div className="amb-hospital-status">
                            <h4><Truck size={16} /> Our Hospital Ambulances</h4>
                            <div className="amb-fleet-grid">
                                {hospitalAmbulances.map(amb => (
                                    <div key={amb.id} className={`amb-fleet-card amb-fleet-card--${amb.status}`}>
                                        <div className="amb-fleet-icon">
                                            <Ambulance size={20} />
                                        </div>
                                        <div className="amb-fleet-info">
                                            <strong>{amb.name}</strong>
                                            <span className="amb-fleet-driver"><User size={12} /> {amb.driver}</span>
                                            <span className="amb-fleet-location"><MapPin size={12} /> {amb.location}</span>
                                        </div>
                                        <span className={`amb-status-badge amb-status-badge--${amb.status}`}>
                                            {amb.status === 'deployed' ? 'Deployed' : amb.status === 'maintenance' ? 'Maintenance' : 'Available'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="amb-unavailable-banner">
                                <AlertTriangle size={18} />
                                <span>All hospital ambulances are currently unavailable. Activate the nearby ambulance alert system below.</span>
                            </div>
                        </div>

                        {/* Alert Panel */}
                        <div className="amb-alert-panel">
                            <div className="amb-alert-left">
                                <h4><Radio size={16} /> Send Emergency Alert to Nearby Ambulances</h4>
                                <div className="amb-alert-form">
                                    <div className="amb-form-group">
                                        <label><FileText size={14} /> Emergency Details</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Describe the emergency — patient condition, urgency level, any special requirements..."
                                            value={ambEmergencyNote}
                                            onChange={e => setAmbEmergencyNote(e.target.value)}
                                            disabled={ambAlertSent}
                                        />
                                    </div>
                                    <div className="amb-notify-methods">
                                        <span className="amb-method"><Smartphone size={14} /> SMS Alert</span>
                                        <span className="amb-method"><Mail size={14} /> Email Alert</span>
                                    </div>
                                    {!ambAlertSent ? (
                                        <button
                                            className="amb-send-btn"
                                            onClick={sendAmbulanceAlert}
                                            disabled={!ambEmergencyNote.trim()}
                                        >
                                            <BellRing size={16} />
                                            Alert All Nearby Ambulances ({nearbyAmbulances.length})
                                        </button>
                                    ) : (
                                        <div className="amb-alert-sent-banner">
                                            <CheckCircle size={16} />
                                            <span>Alerts sent to {nearbyAmbulances.length} nearby ambulances via SMS & Email</span>
                                            {!ambAcceptedId && (
                                                <button className="amb-reset-btn" onClick={resetAmbulanceAlert}>
                                                    <RefreshCw size={14} /> Reset
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="amb-alert-right">
                                <h4><Share2 size={16} /> Nearby Ambulances ({nearbyAmbulances.length})</h4>
                                <div className="amb-nearby-list">
                                    {nearbyAmbulances.map(amb => {
                                        const alertEntry = ambAlertLog.find(a => a.ambulanceId === amb.id);
                                        const isAccepted = ambAcceptedId === amb.id;
                                        const isStoodDown = alertEntry?.status === 'stood-down';
                                        return (
                                            <div key={amb.id} className={`amb-nearby-card ${isAccepted ? 'amb-nearby-card--accepted' : ''} ${isStoodDown ? 'amb-nearby-card--stood-down' : ''}`}>
                                                <div className="amb-nearby-top">
                                                    <div className="amb-nearby-icon">
                                                        <Ambulance size={18} />
                                                    </div>
                                                    <div className="amb-nearby-info">
                                                        <strong>{amb.name}</strong>
                                                        <span className="amb-nearby-org">{amb.org}</span>
                                                    </div>
                                                    <span className="amb-type-badge">{amb.type}</span>
                                                </div>
                                                <div className="amb-nearby-details">
                                                    <span><User size={12} /> {amb.driver}</span>
                                                    <span><Phone size={12} /> {amb.phone}</span>
                                                    <span><Mail size={12} /> {amb.email}</span>
                                                    <span><MapPin size={12} /> {amb.distance} away</span>
                                                    <span><Clock size={12} /> ETA: {amb.eta}</span>
                                                </div>

                                                {/* Alert status */}
                                                {alertEntry && (
                                                    <div className="amb-notify-status">
                                                        {alertEntry.status === 'notified' && (
                                                            <>
                                                                <div className="amb-notified-info">
                                                                    <Bell size={14} />
                                                                    <span>Notified at {alertEntry.notifiedAt} via {alertEntry.notifyMethod}</span>
                                                                </div>
                                                                <button className="amb-accept-btn" onClick={() => acceptAmbulanceRequest(amb.id)}>
                                                                    <ThumbsUp size={14} /> Accept Request
                                                                </button>
                                                            </>
                                                        )}
                                                        {alertEntry.status === 'accepted' && (
                                                            <div className="amb-accepted-info">
                                                                <BadgeCheck size={16} />
                                                                <div>
                                                                    <strong>Request Accepted!</strong>
                                                                    <span>Accepted at {alertEntry.acceptedAt} — Ambulance is en route to hospital</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {alertEntry.status === 'stood-down' && (
                                                            <div className="amb-stood-down-info">
                                                                <MessageSquare size={14} />
                                                                <div>
                                                                    <strong>Situation Handled</strong>
                                                                    <span>Auto-notified at {alertEntry.stoodDownAt} — "Thank you for your cooperation. Another ambulance has accepted. The emergency is being handled."</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Accepted Summary */}
                        {ambAcceptedId && (
                            <div className="amb-summary">
                                <div className="amb-summary-header">
                                    <BadgeCheck size={22} />
                                    <div>
                                        <h4>Emergency Response Confirmed</h4>
                                        <p>{nearbyAmbulances.find(a => a.id === ambAcceptedId)?.name} from {nearbyAmbulances.find(a => a.id === ambAcceptedId)?.org} has accepted the request.</p>
                                    </div>
                                </div>
                                <div className="amb-summary-grid">
                                    <div className="amb-summary-item">
                                        <Ambulance size={16} />
                                        <div>
                                            <strong>Ambulance</strong>
                                            <span>{nearbyAmbulances.find(a => a.id === ambAcceptedId)?.name}</span>
                                        </div>
                                    </div>
                                    <div className="amb-summary-item">
                                        <User size={16} />
                                        <div>
                                            <strong>Driver</strong>
                                            <span>{nearbyAmbulances.find(a => a.id === ambAcceptedId)?.driver}</span>
                                        </div>
                                    </div>
                                    <div className="amb-summary-item">
                                        <Clock size={16} />
                                        <div>
                                            <strong>ETA</strong>
                                            <span>{nearbyAmbulances.find(a => a.id === ambAcceptedId)?.eta}</span>
                                        </div>
                                    </div>
                                    <div className="amb-summary-item">
                                        <MessageSquare size={16} />
                                        <div>
                                            <strong>Others Notified</strong>
                                            <span>{ambAlertLog.filter(a => a.status === 'stood-down').length} ambulances stood down</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="amb-thankyou">
                                    <ThumbsUp size={16} />
                                    <span>Thank you for the cooperation! The emergency is being handled. All other nearby ambulances have been notified that the situation is under control.</span>
                                </div>
                                <button className="amb-new-alert-btn" onClick={resetAmbulanceAlert}>
                                    <RefreshCw size={14} /> Start New Alert
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ═══ TREATMENT & DOCTOR RECOMMENDATION SECTION ═══ */}
                    <div className="treatment-section" ref={treatmentSectionRef}>
                        <div className="trt-header">
                            <h3><Stethoscope size={20} /> Treatment & Doctor Recommendation</h3>
                            <p className="trt-subtitle">Enter the patient's condition to check if our hospital can help. If treatable, we recommend 4 specialist doctors with their qualifications, experience, and patient reviews.</p>
                        </div>

                        <div className="trt-body">
                            {/* Form */}
                            <div className="trt-form-card">
                                <h4><ClipboardList size={16} /> Patient & Condition Details</h4>
                                <div className="trt-form">
                                    <div className="trt-form-group">
                                        <label><User size={14} /> Patient Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter patient's full name"
                                            value={treatmentPatientName}
                                            onChange={e => setTreatmentPatientName(e.target.value)}
                                            disabled={recommendedDoctors.length > 0}
                                        />
                                    </div>
                                    <div className="trt-form-row">
                                        <div className="trt-form-group">
                                            <label><Calendar size={14} /> Age</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Age"
                                                min="0"
                                                max="120"
                                                value={treatmentPatientAge}
                                                onChange={e => setTreatmentPatientAge(e.target.value)}
                                                disabled={recommendedDoctors.length > 0}
                                            />
                                        </div>
                                        <div className="trt-form-group">
                                            <label><Activity size={14} /> Condition / Disease</label>
                                            <select
                                                className="form-control"
                                                value={treatmentCondition}
                                                onChange={e => setTreatmentCondition(e.target.value)}
                                                disabled={recommendedDoctors.length > 0}
                                            >
                                                <option value="">Select condition</option>
                                                {treatmentConditions.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="trt-form-group">
                                        <label><FileText size={14} /> Additional Description (Optional)</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Describe symptoms, history, or any additional details..."
                                            value={treatmentDescription}
                                            onChange={e => setTreatmentDescription(e.target.value)}
                                            disabled={recommendedDoctors.length > 0}
                                        />
                                    </div>

                                    {recommendedDoctors.length === 0 && canTreat === null ? (
                                        <button
                                            className="trt-check-btn"
                                            onClick={checkTreatmentAvailability}
                                            disabled={!treatmentCondition || !treatmentPatientName.trim() || !treatmentPatientAge.trim()}
                                        >
                                            <Search size={16} />
                                            Check Treatment Availability
                                        </button>
                                    ) : canTreat === false ? (
                                        <div className="trt-unavailable">
                                            <AlertTriangle size={18} />
                                            <div>
                                                <strong>Treatment Not Available</strong>
                                                <p>Unfortunately, our hospital does not have specialists for this condition. We recommend transferring to a specialized facility.</p>
                                            </div>
                                            <button className="trt-reset-btn" onClick={resetTreatmentForm}>
                                                <RefreshCw size={14} /> Try Another Condition
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {/* Doctor Recommendations */}
                            <div className="trt-results">
                                <h4><Award size={16} /> Recommended Specialist Doctors ({recommendedDoctors.length})</h4>
                                {recommendedDoctors.length === 0 ? (
                                    <div className="trt-empty">
                                        <Stethoscope size={36} />
                                        <p>No recommendations yet.</p>
                                        <span>Enter a patient condition to find specialist doctors available at our hospital.</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="trt-can-treat-banner">
                                            <CheckCircle size={18} />
                                            <div>
                                                <strong>Yes, Our Hospital Can Treat This!</strong>
                                                <span>We have {recommendedDoctors.length} specialist doctors available for <strong>{treatmentCondition}</strong>. Select a doctor below.</span>
                                            </div>
                                        </div>
                                        <div className="trt-doctors-list">
                                            {recommendedDoctors.map(doc => (
                                                <div
                                                    key={doc.id}
                                                    className={`trt-doctor-card ${selectedTreatmentDoctor?.id === doc.id ? 'trt-doctor-card--selected' : ''} ${expandedDoctor === doc.id ? 'trt-doctor-card--expanded' : ''}`}
                                                >
                                                    <div className="trt-doctor-main" onClick={() => setSelectedTreatmentDoctor(doc)}>
                                                        <div className="trt-doc-select">
                                                            {selectedTreatmentDoctor?.id === doc.id ? <CheckCircle size={20} /> : <Circle size={20} />}
                                                        </div>
                                                        <span className="trt-doc-avatar">{doc.avatar}</span>
                                                        <div className="trt-doc-info">
                                                            <strong>{doc.name}</strong>
                                                            <span className="trt-doc-spec">{doc.specialization}</span>
                                                            <div className="trt-doc-meta">
                                                                <span className="trt-doc-exp"><Briefcase size={12} /> {doc.experience}</span>
                                                                <span className="trt-doc-rating">
                                                                    <Star size={12} /> {doc.rating} ({doc.totalReviews} reviews)
                                                                </span>
                                                                <span className={`trt-doc-avail trt-doc-avail--${doc.availability.toLowerCase().replace(' ', '-')}`}>
                                                                    {doc.availability}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="trt-doc-education">
                                                        <GraduationCap size={13} />
                                                        <span>{doc.education}</span>
                                                    </div>

                                                    <button
                                                        className="trt-expand-btn"
                                                        onClick={(e) => { e.stopPropagation(); setExpandedDoctor(expandedDoctor === doc.id ? null : doc.id); }}
                                                    >
                                                        <MessageCircle size={14} />
                                                        {expandedDoctor === doc.id ? 'Hide Reviews' : `View Patient Reviews (${doc.reviews.length})`}
                                                        <ChevronDown size={14} className={expandedDoctor === doc.id ? 'trt-chevron-up' : ''} />
                                                    </button>

                                                    {expandedDoctor === doc.id && (
                                                        <div className="trt-reviews">
                                                            {doc.reviews.map((review, idx) => (
                                                                <div key={idx} className="trt-review-item">
                                                                    <div className="trt-review-header">
                                                                        <span className="trt-reviewer-name"><UserCircle size={14} /> {review.name}</span>
                                                                        <div className="trt-review-stars">
                                                                            {Array.from({ length: review.rating }, (_, i) => (
                                                                                <Star key={i} size={11} className="trt-star-filled" />
                                                                            ))}
                                                                            {Array.from({ length: 5 - review.rating }, (_, i) => (
                                                                                <Star key={`e-${i}`} size={11} className="trt-star-empty" />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <p className="trt-review-comment">"{review.comment}"</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="trt-action-bar">
                                            <button
                                                className="trt-confirm-btn"
                                                onClick={confirmTreatmentDoctor}
                                                disabled={!selectedTreatmentDoctor}
                                            >
                                                <CheckCircle size={16} />
                                                Confirm Doctor & Start Treatment
                                            </button>
                                            <button className="trt-cancel-btn" onClick={resetTreatmentForm}>
                                                <X size={14} /> Cancel
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* Treatment History */}
                                {treatmentSubmissions.length > 0 && (
                                    <div className="trt-history">
                                        <h5><ClipboardList size={14} /> Treatment Assignments ({treatmentSubmissions.length})</h5>
                                        <div className="trt-history-list">
                                            {treatmentSubmissions.map(sub => (
                                                <div key={sub.id} className="trt-history-card">
                                                    <div className="trt-history-top">
                                                        <div className="trt-history-patient">
                                                            <User size={14} />
                                                            <div>
                                                                <strong>{sub.patientName}</strong>
                                                                <span>Age: {sub.patientAge} &bull; {sub.condition}</span>
                                                            </div>
                                                        </div>
                                                        <span className="trt-history-time"><Clock size={12} /> {sub.submittedAt}</span>
                                                    </div>
                                                    <div className="trt-history-doctor">
                                                        <span className="trt-history-label">Assigned Doctor:</span>
                                                        <div className="trt-history-doc-info">
                                                            <span className="trt-doc-avatar">{sub.doctor.avatar}</span>
                                                            <div>
                                                                <strong>{sub.doctor.name}</strong>
                                                                <span>{sub.doctor.specialization}</span>
                                                            </div>
                                                            <span className="trt-history-badge"><CheckCircle size={12} /> Assigned</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
