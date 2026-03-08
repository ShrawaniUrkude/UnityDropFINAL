import { useState, useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../hooks/useGsap';
import {
    Search, User, Users, Activity, Phone, Clock, CheckCircle,
    AlertTriangle, Stethoscope, FileText, X, ChevronDown,
    ClipboardList, Calendar, RefreshCw, Circle, UserCircle,
    Award, GraduationCap, Star, Briefcase, MessageCircle,
    Heart, Brain, Bone, Pill, Baby, Eye, Syringe, Shield,
    Globe, MapPin, Video, Send, ArrowLeftRight, Copy,
    ShoppingCart, IndianRupee, TrendingDown, Package, Store, BadgeCheck,
    BarChart3, Wallet, Percent, Info, ArrowDown, Layers, Landmark
} from 'lucide-react';
import './Dashboard.css';

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

// Specialty category info for the specialty grid
const specialtyCategories = [
    { key: 'cardiac', label: 'Cardiology', icon: Heart, color: '#ef4444', desc: 'Heart & cardiovascular' },
    { key: 'orthopedic', label: 'Orthopedics', icon: Bone, color: '#f59e0b', desc: 'Bones, joints & spine' },
    { key: 'neurological', label: 'Neurology', icon: Brain, color: '#8b5cf6', desc: 'Brain & nervous system' },
    { key: 'oncology', label: 'Oncology', icon: Shield, color: '#ec4899', desc: 'Cancer treatment' },
    { key: 'respiratory', label: 'Pulmonology', icon: Activity, color: '#06b6d4', desc: 'Lungs & respiratory' },
    { key: 'general', label: 'General', icon: Stethoscope, color: '#10b981', desc: 'Surgery, OB-GYN, pediatrics' },
];

// ═══════════════════════════════════════════════════════════════
// MEDICINE DATABASE WITH PHARMACY PRICE COMPARISON
// ═══════════════════════════════════════════════════════════════

const nearbyPharmacies = [
    { id: 'PH1', name: 'MedPlus Pharmacy', distance: '0.3 km', rating: 4.5, verified: true },
    { id: 'PH2', name: 'Apollo Pharmacy', distance: '0.8 km', rating: 4.7, verified: true },
    { id: 'PH3', name: 'Netmeds Store', distance: '1.2 km', rating: 4.3, verified: true },
    { id: 'PH4', name: 'Wellness Forever', distance: '1.5 km', rating: 4.4, verified: true },
    { id: 'PH5', name: 'Jan Aushadhi Kendra', distance: '2.0 km', rating: 4.6, verified: true },
];

// ═══════════════════════════════════════════════════════════════
// TREATMENT COST DATABASE - Per Specialty
// ═══════════════════════════════════════════════════════════════

const treatmentCosts = {
    cardiac: {
        label: 'Cardiology',
        consultation: { regular: 800, followUp: 500, emergency: 1500 },
        diagnostics: [
            { name: 'ECG', cost: 300 },
            { name: 'Echocardiogram (2D Echo)', cost: 2500 },
            { name: 'Cardiac Stress Test (TMT)', cost: 1800 },
            { name: 'Coronary Angiography', cost: 25000 },
            { name: 'Blood Tests (Lipid Profile, Cardiac Enzymes)', cost: 1200 },
            { name: 'Chest X-Ray', cost: 500 },
        ],
        procedures: [
            { name: 'Angioplasty (Single Stent)', costRange: [120000, 250000] },
            { name: 'Bypass Surgery (CABG)', costRange: [200000, 450000] },
            { name: 'Pacemaker Implantation', costRange: [150000, 350000] },
            { name: 'Heart Valve Replacement', costRange: [300000, 600000] },
        ],
        hospitalStay: { perDay: 3500, icuPerDay: 8000, avgDays: 5 },
        followUp: { visits: 4, perVisit: 500, tests: 1200 },
    },
    orthopedic: {
        label: 'Orthopedics',
        consultation: { regular: 700, followUp: 400, emergency: 1200 },
        diagnostics: [
            { name: 'X-Ray', cost: 400 },
            { name: 'MRI Scan', cost: 6000 },
            { name: 'CT Scan', cost: 4000 },
            { name: 'Bone Density Test (DEXA)', cost: 1500 },
            { name: 'Blood Tests (CBC, Calcium, Vit D)', cost: 800 },
        ],
        procedures: [
            { name: 'Knee Replacement (Single)', costRange: [180000, 350000] },
            { name: 'Hip Replacement', costRange: [200000, 400000] },
            { name: 'ACL Reconstruction', costRange: [100000, 200000] },
            { name: 'Fracture Fixation (Plate & Screws)', costRange: [40000, 120000] },
            { name: 'Spine Surgery (Discectomy)', costRange: [150000, 300000] },
        ],
        hospitalStay: { perDay: 2500, icuPerDay: 6000, avgDays: 4 },
        followUp: { visits: 6, perVisit: 400, tests: 800 },
    },
    neurological: {
        label: 'Neurology',
        consultation: { regular: 1000, followUp: 600, emergency: 2000 },
        diagnostics: [
            { name: 'MRI Brain', cost: 7000 },
            { name: 'CT Brain', cost: 4500 },
            { name: 'EEG (Electroencephalogram)', cost: 2000 },
            { name: 'EMG / NCV (Nerve Conduction)', cost: 3000 },
            { name: 'Blood Tests (Neuro Panel)', cost: 1500 },
            { name: 'Lumbar Puncture', cost: 3500 },
        ],
        procedures: [
            { name: 'Brain Tumor Surgery', costRange: [300000, 700000] },
            { name: 'Spinal Cord Surgery', costRange: [250000, 500000] },
            { name: 'Deep Brain Stimulation', costRange: [800000, 1500000] },
            { name: 'VP Shunt Surgery', costRange: [80000, 200000] },
        ],
        hospitalStay: { perDay: 4000, icuPerDay: 10000, avgDays: 7 },
        followUp: { visits: 6, perVisit: 600, tests: 2500 },
    },
    oncology: {
        label: 'Oncology',
        consultation: { regular: 1200, followUp: 700, emergency: 2500 },
        diagnostics: [
            { name: 'PET-CT Scan', cost: 18000 },
            { name: 'MRI', cost: 7000 },
            { name: 'Biopsy', cost: 5000 },
            { name: 'Blood Tests (Tumor Markers)', cost: 3000 },
            { name: 'Ultrasound', cost: 1500 },
            { name: 'Bone Scan', cost: 6000 },
        ],
        procedures: [
            { name: 'Chemotherapy (Per Cycle, 6 cycles)', costRange: [30000, 100000] },
            { name: 'Radiation Therapy (Full Course)', costRange: [150000, 400000] },
            { name: 'Tumor Removal Surgery', costRange: [200000, 500000] },
            { name: 'Bone Marrow Transplant', costRange: [1500000, 3000000] },
        ],
        hospitalStay: { perDay: 5000, icuPerDay: 12000, avgDays: 10 },
        followUp: { visits: 12, perVisit: 700, tests: 5000 },
    },
    respiratory: {
        label: 'Pulmonology',
        consultation: { regular: 700, followUp: 400, emergency: 1200 },
        diagnostics: [
            { name: 'Chest X-Ray', cost: 500 },
            { name: 'CT Chest (HRCT)', cost: 4000 },
            { name: 'Pulmonary Function Test (PFT)', cost: 1200 },
            { name: 'Bronchoscopy', cost: 8000 },
            { name: 'Blood Tests (ABG, CBC)', cost: 1000 },
            { name: 'Sputum Culture', cost: 600 },
        ],
        procedures: [
            { name: 'Lung Surgery (Lobectomy)', costRange: [200000, 400000] },
            { name: 'Chest Tube Insertion', costRange: [15000, 40000] },
            { name: 'Bronchial Stent Placement', costRange: [80000, 180000] },
            { name: 'Ventilator Support (Per Day)', costRange: [5000, 15000] },
        ],
        hospitalStay: { perDay: 3000, icuPerDay: 8000, avgDays: 5 },
        followUp: { visits: 4, perVisit: 400, tests: 1200 },
    },
    general: {
        label: 'General',
        consultation: { regular: 500, followUp: 300, emergency: 1000 },
        diagnostics: [
            { name: 'Blood Tests (CBC, Blood Sugar, Thyroid)', cost: 800 },
            { name: 'Ultrasound Abdomen', cost: 1200 },
            { name: 'X-Ray', cost: 400 },
            { name: 'Urine Analysis', cost: 200 },
            { name: 'ECG', cost: 300 },
        ],
        procedures: [
            { name: 'Appendectomy (Laparoscopic)', costRange: [40000, 80000] },
            { name: 'Hernia Repair', costRange: [50000, 100000] },
            { name: 'C-Section Delivery', costRange: [30000, 80000] },
            { name: 'Gallbladder Removal', costRange: [45000, 90000] },
        ],
        hospitalStay: { perDay: 2000, icuPerDay: 5000, avgDays: 3 },
        followUp: { visits: 3, perVisit: 300, tests: 600 },
    },
};

const govtSchemes = [
    {
        name: 'Ayushman Bharat — PMJAY',
        fullName: 'Pradhan Mantri Jan Arogya Yojana',
        icon: '🏥',
        coverage: 500000,
        type: 'Central Government',
        description: 'India\'s largest government health insurance scheme providing free treatment at empanelled hospitals for over 12 crore poor and vulnerable families (approx 55 crore beneficiaries).',
        eligibility: 'BPL families listed in SECC 2011 database, no cap on family size or age',
        benefits: [
            'Cashless & paperless treatment at any empanelled hospital across India',
            'Covers 1,929 medical procedures including surgery, medical & day-care treatments',
            'Pre & post hospitalization expenses covered (3 days pre, 15 days post)',
            'No restriction on family size, age, or gender',
            'Transport allowance of ₹50/KM up to ₹1,000',
            'All pre-existing diseases covered from Day 1',
        ],
        documents: ['Aadhaar Card', 'Ration Card / SECC listed proof', 'Family ID / RSBY Card (if any)', 'Mobile Number'],
        howToApply: [
            'Visit mera.pmjay.gov.in and check eligibility with mobile number or Aadhaar',
            'Visit nearest Common Service Center (CSC) or empanelled hospital Ayushman Mitra',
            'Complete e-KYC with Aadhaar verification',
            'Receive Ayushman card (e-card) instantly — no cost for card creation',
        ],
        helpline: '14555 (Toll-free)',
        website: 'https://pmjay.gov.in',
        statePortal: 'https://mera.pmjay.gov.in',
    },
    {
        name: 'CGHS',
        fullName: 'Central Government Health Scheme',
        icon: '🏛️',
        coverage: 0,
        type: 'Central Government',
        description: 'Comprehensive healthcare for central government employees, pensioners and their dependents. Covers OPD, hospitalization, investigations and medicines.',
        eligibility: 'Central government employees (serving & retired), MPs, ex-MPs, judges, freedom fighters & dependents',
        benefits: [
            'Free OPD consultation at CGHS dispensaries and wellness centers',
            'Cashless hospitalization at empanelled hospitals',
            'Covers all specialties including organ transplants, cancer therapy, ICU',
            'Medicines dispensed free from CGHS pharmacies or reimbursed',
            'Domiciliary treatment (home treatment) for chronic illnesses',
            'Covers Ayurveda, Homeopathy, Unani & Yoga treatments',
        ],
        documents: ['CGHS Card / beneficiary ID', 'Service ID / pension papers', 'Aadhaar Card', 'Referral from CGHS doctor (for specialist/hospital)'],
        howToApply: [
            'Current employees: Apply through parent ministry/department',
            'Pensioners: Apply at nearest CGHS wellness center with PPO & Aadhaar',
            'Download CGHS app for appointment booking and card management',
            'Plastic CGHS card issued within 7-10 working days',
        ],
        helpline: '1800-11-1303 (Toll-free)',
        website: 'https://cghs.gov.in',
    },
    {
        name: 'ESIC',
        fullName: 'Employees\' State Insurance Corporation',
        icon: '👷',
        coverage: 0,
        type: 'Central Government',
        description: 'Social security scheme for workers in the organized sector earning up to ₹21,000/month. Provides comprehensive medical care for insured workers and their families.',
        eligibility: 'Workers earning ≤ ₹21,000/month in factories with 10+ employees (20+ in some states)',
        benefits: [
            'Full medical care for insured person and family — no cost limit',
            'Sickness benefit: 70% of wages for up to 91 days',
            'Maternity benefit: Full wages for 26 weeks',
            'Disablement benefit: 90% of wages (permanent disability)',
            'Dependent benefit: 90% of wages to dependents if worker dies',
            'Super specialty treatment including heart surgery, kidney transplant, cancer therapy',
        ],
        documents: ['ESIC Card / IP Number', 'Aadhaar Card', 'Employment proof', 'Family member Aadhaar (for dependents)'],
        howToApply: [
            'Employer registers on ESIC portal (esic.gov.in)',
            'Employee gets Temporary Identification Certificate (TIC)',
            'Biometric registration at nearest ESIC branch office',
            'Permanent ESIC card (Pehchan card) issued',
        ],
        helpline: '1800-11-2526 (Toll-free)',
        website: 'https://esic.gov.in',
    },
    {
        name: 'Rashtriya Arogya Nidhi',
        fullName: 'Rashtriya Arogya Nidhi (RAN)',
        icon: '🩺',
        coverage: 500000,
        type: 'Central Government',
        description: 'Financial assistance to BPL patients suffering from major life-threatening diseases for treatment at government super-specialty hospitals/institutes.',
        eligibility: 'BPL patients with life-threatening diseases (heart, kidney, liver, cancer) treated at govt hospitals',
        benefits: [
            'One-time financial assistance up to ₹5 Lakh',
            'Covers heart surgery, kidney transplant, cancer treatment, liver diseases',
            'Assistance given directly to the hospital (not patient)',
            'Can be club with other government scheme benefits',
            'Covers treatment at all government super-specialty hospitals like AIIMS, PGI',
        ],
        documents: ['BPL Certificate / Income Certificate (< ₹1 Lakh/year)', 'Medical report from treating government hospital', 'Estimate of treatment cost from hospital', 'Aadhaar Card', 'Bank account details'],
        howToApply: [
            'Request treating hospital (govt) to forward application to Health Ministry',
            'Hospital Medical Superintendent submits case to RAN committee',
            'RAN Standing Committee reviews case and approves funding',
            'Funds released directly to hospital — typical processing: 2-4 weeks',
        ],
        helpline: '011-23062666',
        website: 'https://mohfw.gov.in',
    },
    {
        name: 'HMDG',
        fullName: 'Health Minister\'s Discretionary Grant',
        icon: '🏥',
        coverage: 200000,
        type: 'Central Government',
        description: 'Discretionary grant by Union Health Minister for financial assistance to poor patients for treatment at government hospitals in India.',
        eligibility: 'Poor patients needing treatment at government hospitals, income < ₹1.25 Lakh/year',
        benefits: [
            'Financial assistance up to ₹2 Lakh for treatment',
            'Covers all types of major treatments and surgeries',
            'Can be used at any central government hospital',
            'Faster processing compared to RAN (discretionary approval)',
        ],
        documents: ['Request letter to Health Minister', 'Income proof / BPL certificate', 'Medical report & cost estimate from government hospital', 'Aadhaar & bank details'],
        howToApply: [
            'Write a request letter to Union Health Minister with medical details',
            'Attach income certificate and treatment estimate from govt hospital',
            'Submit at Ministry of Health & Family Welfare, Nirman Bhawan, New Delhi',
            'Can also email to hmdg-mohfw@gov.in with all documents scanned',
        ],
        helpline: '011-23061863',
        website: 'https://mohfw.gov.in',
    },
    {
        name: 'Jan Aushadhi Yojana',
        fullName: 'Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)',
        icon: '💊',
        coverage: 0,
        type: 'Central Government',
        description: 'Government initiative providing quality generic medicines at 50-90% cheaper than branded equivalents through Jan Aushadhi Kendras across India.',
        eligibility: 'All citizens — no income or identity requirement, walk in and purchase',
        benefits: [
            'Over 1,900+ medicines and 290+ surgical items available',
            'Medicines are 50-90% cheaper than branded equivalents',
            'Strict quality testing — same efficacy as branded medicines (WHO-GMP certified)',
            'Available across 10,000+ Jan Aushadhi Kendras in all districts',
            'Jan Aushadhi Suvidha sanitary napkins at ₹1 each',
            'No prescription needed for OTC medicines',
        ],
        documents: ['Doctor\'s prescription (for prescription medicines)', 'No ID required'],
        howToApply: [
            'Find nearest Jan Aushadhi Kendra on janaushadhi.gov.in or Google Maps',
            'Show doctor\'s prescription at the Kendra',
            'Get quality generic medicines at 50-90% less price',
            'Download "Janaushadhi Sugam" app to search medicines and locate stores',
        ],
        helpline: '1800-180-8080 (Toll-free)',
        website: 'https://janaushadhi.gov.in',
    },
    {
        name: 'PM National Relief Fund',
        fullName: 'Prime Minister\'s National Relief Fund',
        icon: '🇮🇳',
        coverage: 0,
        type: 'Central Government',
        description: 'Fund for providing immediate relief to families affected by natural calamities and for medical treatment of patients from economically weaker sections.',
        eligibility: 'Citizens needing financial help for medical treatment (cancer, heart, kidney, acid attack)',
        benefits: [
            'Financial assistance based on case severity — no fixed limit',
            'Covers treatment at recognized hospitals (both govt & private)',
            'Special provisions for cancer, heart disease and kidney ailments',
            'Can cover treatment at renowned private hospitals like Tata Memorial, etc.',
        ],
        documents: ['Request letter to PM Office', 'Medical report from doctor/hospital', 'Income certificate', 'Aadhaar Card', 'Hospital treatment estimate'],
        howToApply: [
            'Write to: PM\'s National Relief Fund, PMO, South Block, New Delhi — 110011',
            'Or apply online at pmnrf.gov.in with all medical documents',
            'Include detailed medical reports and estimated treatment cost',
            'Response typically within 2-6 weeks based on case urgency',
        ],
        helpline: '011-23012312',
        website: 'https://pmnrf.gov.in',
    },
    {
        name: 'Aarogyasri / State Schemes',
        fullName: 'State Government Health Insurance Schemes',
        icon: '🏘️',
        coverage: 200000,
        type: 'State Government',
        description: 'Various state-run health insurance schemes (Aarogyasri in Telangana/AP, MJPJAY in Maharashtra, Jyotibaphule in Maharashtra, CM Comprehensive in TN, etc.)',
        eligibility: 'State residents below income threshold — varies by state (typically ≤ ₹5 Lakh annual income)',
        benefits: [
            'Free/cashless treatment for listed surgeries and therapies at network hospitals',
            'Coverage varies: ₹1.5L to ₹5L depending on state and scheme',
            'Pre-existing diseases usually covered',
            'Includes heart surgeries, joint replacements, cancer treatment, dialysis',
            'Some states cover follow-up medicines for 10 days post-discharge',
            'Transport allowance in some states (₹200-₹1,000)',
        ],
        documents: ['White Ration Card / income certificate', 'Aadhaar Card', 'State-issued health card', 'Residence proof (voter ID / electricity bill)'],
        howToApply: [
            'Visit nearest government hospital / PHC / Aarogyasri center',
            'Or visit Common Service Center (CSC) in your area',
            'Provide Aadhaar + ration card for eligibility check',
            'E-health card issued on the spot if eligible (in most states)',
        ],
        helpline: '104 (health helpline — most states)',
        website: 'Check your state health department website',
    },
    {
        name: 'NGOs & Charitable Trusts',
        fullName: 'Non-governmental Financial Aid',
        icon: '🤝',
        coverage: 0,
        type: 'Private / Non-Profit',
        description: 'Several NGOs and charitable trusts provide free or subsidized treatment, medicines, and financial aid for families who cannot afford healthcare.',
        eligibility: 'Low-income families, case-by-case verification by the organization',
        benefits: [
            'Free treatment at charitable hospitals (Tata Memorial, CMC Vellore, Narayana Health, etc.)',
            'Medicine donation programs by pharma companies',
            'Crowdfunding support through platforms like Ketto, Milaap, ImpactGuru',
            'Dedicated cancer care NGOs (Indian Cancer Society, CanKids)',
            'Free dialysis NGOs (NephroPlus Foundation, Tanker Foundation)',
            'Corporate CSR funds for healthcare — apply through hospital social worker',
        ],
        documents: ['Income proof / BPL certificate', 'Medical records & diagnosis', 'Hospital estimate letter', 'Aadhaar Card & photos'],
        howToApply: [
            'Contact hospital social worker / patient welfare department',
            'Apply directly to NGO with medical and income documents',
            'Start a crowdfunding campaign on Ketto / Milaap / ImpactGuru',
            'Search "free treatment [your disease] NGO India" for disease-specific organizations',
        ],
        helpline: 'Varies by organization',
        website: 'Multiple platforms',
    },
];

const medicineDatabase = {
    cardiac: [
        { id: 'MED-C1', name: 'Atorvastatin 20mg', generic: 'Atorvastatin', type: 'Tablet', dosage: '1 tablet at night', duration: '30 days', quantity: 30, prices: { PH1: 185, PH2: 210, PH3: 165, PH4: 195, PH5: 82 } },
        { id: 'MED-C2', name: 'Ecosprin 75mg', generic: 'Aspirin', type: 'Tablet', dosage: '1 tablet after lunch', duration: '30 days', quantity: 30, prices: { PH1: 35, PH2: 42, PH3: 38, PH4: 40, PH5: 18 } },
        { id: 'MED-C3', name: 'Metoprolol 50mg', generic: 'Metoprolol Succinate', type: 'Tablet', dosage: '1 tablet morning & night', duration: '30 days', quantity: 60, prices: { PH1: 142, PH2: 168, PH3: 135, PH4: 155, PH5: 70 } },
        { id: 'MED-C4', name: 'Ramipril 5mg', generic: 'Ramipril', type: 'Capsule', dosage: '1 capsule morning', duration: '30 days', quantity: 30, prices: { PH1: 120, PH2: 145, PH3: 110, PH4: 130, PH5: 55 } },
    ],
    orthopedic: [
        { id: 'MED-O1', name: 'Aceclofenac 100mg', generic: 'Aceclofenac', type: 'Tablet', dosage: '1 tablet twice daily after food', duration: '10 days', quantity: 20, prices: { PH1: 95, PH2: 115, PH3: 88, PH4: 105, PH5: 42 } },
        { id: 'MED-O2', name: 'Calcium + Vitamin D3', generic: 'Calcium Carbonate + Cholecalciferol', type: 'Tablet', dosage: '1 tablet daily', duration: '60 days', quantity: 60, prices: { PH1: 280, PH2: 320, PH3: 260, PH4: 295, PH5: 140 } },
        { id: 'MED-O3', name: 'Thiocolchicoside 8mg', generic: 'Thiocolchicoside', type: 'Capsule', dosage: '1 capsule twice daily', duration: '7 days', quantity: 14, prices: { PH1: 110, PH2: 135, PH3: 98, PH4: 120, PH5: 52 } },
        { id: 'MED-O4', name: 'Diclofenac Gel', generic: 'Diclofenac Diethylamine', type: 'Gel', dosage: 'Apply on affected area 3 times daily', duration: '15 days', quantity: 1, prices: { PH1: 95, PH2: 110, PH3: 85, PH4: 100, PH5: 48 } },
    ],
    neurological: [
        { id: 'MED-N1', name: 'Pregabalin 75mg', generic: 'Pregabalin', type: 'Capsule', dosage: '1 capsule at night', duration: '30 days', quantity: 30, prices: { PH1: 210, PH2: 250, PH3: 195, PH4: 230, PH5: 98 } },
        { id: 'MED-N2', name: 'Levetiracetam 500mg', generic: 'Levetiracetam', type: 'Tablet', dosage: '1 tablet twice daily', duration: '30 days', quantity: 60, prices: { PH1: 420, PH2: 490, PH3: 385, PH4: 450, PH5: 195 } },
        { id: 'MED-N3', name: 'Methylcobalamin 1500mcg', generic: 'Mecobalamin', type: 'Tablet', dosage: '1 tablet daily', duration: '30 days', quantity: 30, prices: { PH1: 165, PH2: 195, PH3: 150, PH4: 178, PH5: 72 } },
        { id: 'MED-N4', name: 'Amitriptyline 25mg', generic: 'Amitriptyline', type: 'Tablet', dosage: '1 tablet at night', duration: '30 days', quantity: 30, prices: { PH1: 55, PH2: 68, PH3: 48, PH4: 60, PH5: 22 } },
    ],
    oncology: [
        { id: 'MED-ON1', name: 'Tamoxifen 20mg', generic: 'Tamoxifen Citrate', type: 'Tablet', dosage: '1 tablet daily', duration: '30 days', quantity: 30, prices: { PH1: 320, PH2: 380, PH3: 295, PH4: 350, PH5: 145 } },
        { id: 'MED-ON2', name: 'Ondansetron 8mg', generic: 'Ondansetron', type: 'Tablet', dosage: 'As needed for nausea', duration: '10 days', quantity: 10, prices: { PH1: 85, PH2: 105, PH3: 78, PH4: 95, PH5: 38 } },
        { id: 'MED-ON3', name: 'Dexamethasone 4mg', generic: 'Dexamethasone', type: 'Tablet', dosage: '1 tablet twice daily', duration: '5 days', quantity: 10, prices: { PH1: 42, PH2: 55, PH3: 38, PH4: 48, PH5: 18 } },
        { id: 'MED-ON4', name: 'Pantoprazole 40mg', generic: 'Pantoprazole', type: 'Capsule', dosage: '1 capsule before breakfast', duration: '30 days', quantity: 30, prices: { PH1: 130, PH2: 155, PH3: 118, PH4: 140, PH5: 58 } },
    ],
    respiratory: [
        { id: 'MED-R1', name: 'Montelukast 10mg', generic: 'Montelukast Sodium', type: 'Tablet', dosage: '1 tablet at night', duration: '30 days', quantity: 30, prices: { PH1: 175, PH2: 210, PH3: 160, PH4: 190, PH5: 78 } },
        { id: 'MED-R2', name: 'Salbutamol Inhaler', generic: 'Salbutamol', type: 'Inhaler', dosage: '2 puffs as needed', duration: '30 days', quantity: 1, prices: { PH1: 125, PH2: 150, PH3: 115, PH4: 138, PH5: 62 } },
        { id: 'MED-R3', name: 'Azithromycin 500mg', generic: 'Azithromycin', type: 'Tablet', dosage: '1 tablet daily', duration: '5 days', quantity: 5, prices: { PH1: 110, PH2: 135, PH3: 98, PH4: 120, PH5: 48 } },
        { id: 'MED-R4', name: 'Budesonide Inhaler 200mcg', generic: 'Budesonide', type: 'Inhaler', dosage: '2 puffs twice daily', duration: '30 days', quantity: 1, prices: { PH1: 310, PH2: 365, PH3: 285, PH4: 338, PH5: 148 } },
    ],
    general: [
        { id: 'MED-G1', name: 'Metformin 500mg', generic: 'Metformin HCL', type: 'Tablet', dosage: '1 tablet twice daily after food', duration: '30 days', quantity: 60, prices: { PH1: 68, PH2: 85, PH3: 60, PH4: 75, PH5: 28 } },
        { id: 'MED-G2', name: 'Amoxicillin 500mg', generic: 'Amoxicillin', type: 'Capsule', dosage: '1 capsule thrice daily', duration: '7 days', quantity: 21, prices: { PH1: 95, PH2: 118, PH3: 85, PH4: 105, PH5: 40 } },
        { id: 'MED-G3', name: 'Paracetamol 650mg', generic: 'Paracetamol', type: 'Tablet', dosage: '1 tablet as needed (max 3/day)', duration: '5 days', quantity: 15, prices: { PH1: 28, PH2: 35, PH3: 25, PH4: 30, PH5: 12 } },
        { id: 'MED-G4', name: 'Omeprazole 20mg', generic: 'Omeprazole', type: 'Capsule', dosage: '1 capsule before breakfast', duration: '14 days', quantity: 14, prices: { PH1: 72, PH2: 88, PH3: 65, PH4: 80, PH5: 32 } },
    ],
};

const languages = [
    { key: 'english', label: 'English', flag: '🇬🇧' },
    { key: 'hindi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { key: 'telugu', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { key: 'marathi', label: 'मराठी (Marathi)', flag: '🇮🇳' },
];

const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM',
    '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM',
];

const medicalPhrases = [
    {
        category: 'Greetings & Introduction',
        phrases: [
            { english: 'Hello, how are you feeling today?', hindi: 'नमस्ते, आज आप कैसा महसूस कर रहे हैं?', telugu: 'నమస్కారం, మీరు ఈరోజు ఎలా అనుభవిస్తున్నారు?', marathi: 'नमस्कार, आज तुम्हाला कसे वाटत आहे?' },
            { english: 'My name is the doctor assigned to you', hindi: 'मेरा नाम डॉक्टर है जो आपको सौंपा गया है', telugu: 'నా పేరు మీకు కేటాయించిన డాక్టర్', marathi: 'माझे नाव तुम्हाला नियुक्त केलेले डॉक्टर आहे' },
            { english: 'Please sit down and relax', hindi: 'कृपया बैठ जाइए और आराम करिए', telugu: 'దయచేసి కూర్చోండి మరియు విశ్రాంతి తీసుకోండి', marathi: 'कृपया बसा आणि आराम करा' },
        ]
    },
    {
        category: 'Symptoms & Pain',
        phrases: [
            { english: 'Where does it hurt?', hindi: 'दर्द कहाँ हो रहा है?', telugu: 'నొప్పి ఎక్కడ ఉంది?', marathi: 'कुठे दुखत आहे?' },
            { english: 'How long have you had this pain?', hindi: 'यह दर्द कब से है?', telugu: 'ఈ నొప్పి ఎంతకాలంగా ఉంది?', marathi: 'हा त्रास कधीपासून आहे?' },
            { english: 'I have a headache', hindi: 'मेरे सिर में दर्द है', telugu: 'నాకు తలనొప్పి ఉంది', marathi: 'मला डोकेदुखी आहे' },
            { english: 'I have chest pain', hindi: 'मुझे सीने में दर्द है', telugu: 'నాకు ఛాతీ నొప్పి ఉంది', marathi: 'मला छातीत दुखत आहे' },
            { english: 'I feel dizzy', hindi: 'मुझे चक्कर आ रहे हैं', telugu: 'నాకు తల తిరుగుతోంది', marathi: 'मला चक्कर येत आहे' },
            { english: 'I have difficulty breathing', hindi: 'मुझे सांस लेने में तकलीफ है', telugu: 'నాకు శ్వాస తీసుకోవడం కష్టంగా ఉంది', marathi: 'मला श्वास घेण्यास त्रास होत आहे' },
            { english: 'I have a fever', hindi: 'मुझे बुखार है', telugu: 'నాకు జ్వరం ఉంది', marathi: 'मला ताप आहे' },
            { english: 'Rate your pain from 1 to 10', hindi: '1 से 10 के बीच अपने दर्द को बताइए', telugu: '1 నుండి 10 వరకు మీ నొప్పిని చెప్పండి', marathi: '1 ते 10 मध्ये तुमची वेदना सांगा' },
        ]
    },
    {
        category: 'Medical History',
        phrases: [
            { english: 'Are you allergic to any medicine?', hindi: 'क्या आपको किसी दवा से एलर्जी है?', telugu: 'మీకు ఏదైనా మందుకు అలెర్జీ ఉందా?', marathi: 'तुम्हाला कोणत्या औषधाची ऍलर्जी आहे का?' },
            { english: 'Do you have diabetes?', hindi: 'क्या आपको मधुमेह है?', telugu: 'మీకు మధుమేహం ఉందా?', marathi: 'तुम्हाला मधुमेह आहे का?' },
            { english: 'Do you have high blood pressure?', hindi: 'क्या आपको उच्च रक्तचाप है?', telugu: 'మీకు అధిక రక్తపోటు ఉందా?', marathi: 'तुम्हाला उच्च रक्तदाब आहे का?' },
            { english: 'Have you had any surgery before?', hindi: 'क्या आपकी पहले कोई सर्जरी हो चुकी है?', telugu: 'మీకు ముందు ఏదైనా శస్త్రచికిత్స జరిగిందా?', marathi: 'तुमची आधी कोणती शस्त्रक्रिया झाली आहे का?' },
            { english: 'Are you taking any medication currently?', hindi: 'क्या आप वर्तमान में कोई दवा ले रहे हैं?', telugu: 'మీరు ప్రస్తుతం ఏదైనా మందు తీసుకుంటున్నారా?', marathi: 'तुम्ही सध्या कोणते औषध घेत आहात का?' },
        ]
    },
    {
        category: 'Treatment & Instructions',
        phrases: [
            { english: 'You need to take this medicine', hindi: 'आपको यह दवा लेनी होगी', telugu: 'మీరు ఈ మందు తీసుకోవాలి', marathi: 'तुम्हाला हे औषध घ्यावे लागेल' },
            { english: 'Take this medicine twice a day', hindi: 'यह दवा दिन में दो बार लें', telugu: 'ఈ మందు రోజుకు రెండుసార్లు తీసుకోండి', marathi: 'हे औषध दिवसातून दोनदा घ्या' },
            { english: 'Take medicine after food', hindi: 'खाना खाने के बाद दवा लें', telugu: 'భోజనం తర్వాత మందు తీసుకోండి', marathi: 'जेवणानंतर औषध घ्या' },
            { english: 'We need to do some tests', hindi: 'हमें कुछ जांच करनी होगी', telugu: 'మేము కొన్ని పరీక్షలు చేయాలి', marathi: 'आम्हाला काही चाचण्या कराव्या लागतील' },
            { english: 'You need to be admitted to the hospital', hindi: 'आपको अस्पताल में भर्ती होना होगा', telugu: 'మీరు ఆసుపత్రిలో చేరాలి', marathi: 'तुम्हाला रुग्णालयात दाखल व्हावे लागेल' },
            { english: 'The surgery was successful', hindi: 'ऑपरेशन सफल रहा', telugu: 'శస్త్రచికిత్స విజయవంతమైంది', marathi: 'शस्त्रक्रिया यशस्वी झाली' },
        ]
    },
    {
        category: 'Emergency',
        phrases: [
            { english: 'This is an emergency', hindi: 'यह एक आपातकालीन स्थिति है', telugu: 'ఇది అత్యవసర పరిస్థితి', marathi: 'ही आणीबाणीची परिस्थिती आहे' },
            { english: 'Call an ambulance', hindi: 'एम्बुलेंस बुलाओ', telugu: 'అంబులెన్స్ పిలవండి', marathi: 'रुग्णवाहिका बोलवा' },
            { english: 'Do not move the patient', hindi: 'रोगी को हिलाएं नहीं', telugu: 'రోగిని కదిలించకండి', marathi: 'रुग्णाला हलवू नका' },
            { english: 'The patient needs oxygen', hindi: 'मरीज को ऑक्सीजन की जरूरत है', telugu: 'రోగికి ఆక్సిజన్ అవసరం', marathi: 'रुग्णाला ऑक्सिजनची गरज आहे' },
        ]
    },
    {
        category: 'Comfort & Reassurance',
        phrases: [
            { english: 'Do not worry, you will be fine', hindi: 'चिंता मत करो, सब ठीक हो जाएगा', telugu: 'చింతించకండి, మీరు బాగుపడతారు', marathi: 'काळजी करू नका, तुम्ही बरे व्हाल' },
            { english: 'The doctor will see you soon', hindi: 'डॉक्टर जल्दी ही आपको देखेंगे', telugu: 'డాక్టర్ మిమ్మల్ని త్వరలో చూస్తారు', marathi: 'डॉक्टर लवकरच तुम्हाला भेटतील' },
            { english: 'Please rest and drink water', hindi: 'कृपया आराम करें और पानी पिएं', telugu: 'దయచేసి విశ్రాంతి తీసుకోండి మరియు నీళ్ళు తాగండి', marathi: 'कृपया विश्रांती घ्या आणि पाणी प्या' },
            { english: 'You are in safe hands', hindi: 'आप सुरक्षित हाथों में हैं', telugu: 'మీరు సురక్షితమైన చేతుల్లో ఉన్నారు', marathi: 'तुम्ही सुरक्षित हातांमध्ये आहात' },
            { english: 'Your family has been informed', hindi: 'आपके परिवार को सूचित कर दिया गया है', telugu: 'మీ కుటుంబానికి తెలియజేయబడింది', marathi: 'तुमच्या कुटुंबाला कळवले आहे' },
        ]
    },
];

export default function Dashboard() {
    const [treatmentCondition, setTreatmentCondition] = useState('');
    const [treatmentPatientName, setTreatmentPatientName] = useState('');
    const [treatmentPatientAge, setTreatmentPatientAge] = useState('');
    const [treatmentDescription, setTreatmentDescription] = useState('');
    const [recommendedDoctors, setRecommendedDoctors] = useState([]);
    const [canTreat, setCanTreat] = useState(null);
    const [expandedDoctor, setExpandedDoctor] = useState(null);
    const [treatmentSubmissions, setTreatmentSubmissions] = useState([]);
    const [selectedTreatmentDoctor, setSelectedTreatmentDoctor] = useState(null);
    const [activeSpecialty, setActiveSpecialty] = useState(null);

    // Appointment states
    const [appointments, setAppointments] = useState([]);
    const [apptDoctor, setApptDoctor] = useState(null);
    const [apptDate, setApptDate] = useState('');
    const [apptTime, setApptTime] = useState('');
    const [apptType, setApptType] = useState('in-person');
    const [apptNotes, setApptNotes] = useState('');

    // Language Translator states
    const [sourceLang, setSourceLang] = useState('english');
    const [targetLang, setTargetLang] = useState('hindi');
    const [translatorInput, setTranslatorInput] = useState('');
    const [translatedOutput, setTranslatedOutput] = useState('');
    const [activeTranslatorCategory, setActiveTranslatorCategory] = useState(null);

    // Medicine Prescription & Price Comparison states
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedApptForRx, setSelectedApptForRx] = useState(null);
    const [expandedMedicine, setExpandedMedicine] = useState(null);
    const [sortByPrice, setSortByPrice] = useState('lowest');

    // Cost Analysis states
    const [selectedCostSpecialty, setSelectedCostSpecialty] = useState('cardiac');
    const [expandedCostSection, setExpandedCostSection] = useState({});
    const [showGovtSchemes, setShowGovtSchemes] = useState(false);
    const [expandedScheme, setExpandedScheme] = useState(null);

    // Organ Donation Cost Estimator states
    const [organCostAge, setOrganCostAge] = useState('');
    const [organCostSmoking, setOrganCostSmoking] = useState('');
    const [organCostAlcohol, setOrganCostAlcohol] = useState('');
    const [organCostDisease, setOrganCostDisease] = useState('');
    const [organCostSurgery, setOrganCostSurgery] = useState('');
    const [organCostSelectedOrgans, setOrganCostSelectedOrgans] = useState([]);
    const [organCostResult, setOrganCostResult] = useState(null);

    const treatmentSectionRef = useRef(null);
    const heroRef = useRef(null);
    const appointmentRef = useRef(null);
    const translatorRef = useRef(null);
    const medicineRef = useRef(null);
    const costRef = useRef(null);

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

    // Confirm doctor selection
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
        setApptDoctor(submission);
        setTreatmentCondition('');
        setTreatmentPatientName('');
        setTreatmentPatientAge('');
        setTreatmentDescription('');
        setRecommendedDoctors([]);
        setCanTreat(null);
        setSelectedTreatmentDoctor(null);
        setExpandedDoctor(null);
    };

    // Reset form
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

    // Book appointment with assigned doctor
    const bookAppointment = () => {
        if (!apptDoctor || !apptDate || !apptTime) return;
        const newAppt = {
            id: `APPT-${Date.now()}`,
            doctor: apptDoctor.doctor,
            patientName: apptDoctor.patientName,
            condition: apptDoctor.condition,
            date: apptDate,
            time: apptTime,
            type: apptType,
            notes: apptNotes.trim(),
            bookedAt: new Date().toLocaleString(),
        };
        setAppointments(prev => [newAppt, ...prev]);
        setApptDate('');
        setApptTime('');
        setApptType('in-person');
        setApptNotes('');
        setApptDoctor(null);
    };

    // Generate prescription when an appointment is selected
    const generatePrescription = (appt) => {
        if (selectedApptForRx?.id === appt.id) {
            setSelectedApptForRx(null);
            return;
        }
        setSelectedApptForRx(appt);
        setExpandedMedicine(null);

        // Check if prescription already exists
        if (prescriptions.find(p => p.appointmentId === appt.id)) return;

        const specialty = conditionToSpecialty[appt.condition];
        const medicines = medicineDatabase[specialty] || medicineDatabase.general;
        const rx = {
            id: `RX-${Date.now()}`,
            appointmentId: appt.id,
            doctor: appt.doctor,
            patientName: appt.patientName,
            condition: appt.condition,
            medicines: medicines,
            prescribedAt: new Date().toLocaleString(),
        };
        setPrescriptions(prev => [rx, ...prev]);
    };

    // Get best price info for a medicine
    const getBestPrice = (medicine) => {
        const entries = Object.entries(medicine.prices);
        let lowest = entries[0], highest = entries[0];
        for (const entry of entries) {
            if (entry[1] < lowest[1]) lowest = entry;
            if (entry[1] > highest[1]) highest = entry;
        }
        const savings = highest[1] - lowest[1];
        const savingsPercent = Math.round((savings / highest[1]) * 100);
        return { lowestId: lowest[0], lowestPrice: lowest[1], highestPrice: highest[1], savings, savingsPercent };
    };

    // Get sorted pharmacies for a medicine
    const getSortedPharmacies = (medicine) => {
        return nearbyPharmacies
            .map(ph => ({ ...ph, price: medicine.prices[ph.id] }))
            .sort((a, b) => sortByPrice === 'lowest' ? a.price - b.price : b.price - a.price);
    };

    // Translate medical phrase
    const translateText = () => {
        if (!translatorInput.trim()) return;
        const input = translatorInput.trim().toLowerCase();
        for (const cat of medicalPhrases) {
            for (const phrase of cat.phrases) {
                if (phrase[sourceLang] && phrase[sourceLang].toLowerCase() === input) {
                    setTranslatedOutput(phrase[targetLang]);
                    return;
                }
            }
        }
        for (const cat of medicalPhrases) {
            for (const phrase of cat.phrases) {
                const src = (phrase[sourceLang] || '').toLowerCase();
                if (src && (src.includes(input) || input.includes(src))) {
                    setTranslatedOutput(phrase[targetLang]);
                    return;
                }
            }
        }
        setTranslatedOutput('⚠️ Phrase not found in medical dictionary. Please select a phrase from the categories below.');
    };

    // Select phrase from phrasebook
    const selectPhrase = (phrase) => {
        setTranslatorInput(phrase[sourceLang]);
        setTranslatedOutput(phrase[targetLang]);
    };

    // Swap source and target languages
    const swapLanguages = () => {
        const oldSource = sourceLang;
        const oldTarget = targetLang;
        const oldInput = translatorInput;
        const oldOutput = translatedOutput;
        setSourceLang(oldTarget);
        setTargetLang(oldSource);
        setTranslatorInput(oldOutput);
        setTranslatedOutput(oldInput);
    };

    // Browse specialty doctors
    const browseSpecialty = (key) => {
        setActiveSpecialty(activeSpecialty === key ? null : key);
    };

    // GSAP animations
    useEffect(() => {
        const hero = heroRef.current;
        if (!hero) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(hero.querySelectorAll('.trt-hero-title, .trt-hero-subtitle'),
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out' }
            );
            gsap.fromTo(hero.querySelectorAll('.trt-stat-card'),
                { y: 40, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: 'back.out(1.4)' }
            );
        });
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const el = treatmentSectionRef.current;
        if (!el) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(el,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 90%' } }
            );
        });
        return () => ctx.revert();
    }, [recommendedDoctors]);

    useEffect(() => {
        const el = appointmentRef.current;
        if (!el) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(el,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 90%' } }
            );
        });
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const el = translatorRef.current;
        if (!el) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(el,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 90%' } }
            );
        });
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const el = medicineRef.current;
        if (!el) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(el,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 90%' } }
            );
        });
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const el = costRef.current;
        if (!el) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(el,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 90%' } }
            );
        });
        return () => ctx.revert();
    }, []);

    // Cost analysis helpers
    const getCostData = () => {
        const spec = selectedCostSpecialty;
        const data = treatmentCosts[spec];
        if (!data) return null;

        const medicines = medicineDatabase[spec] || medicineDatabase.general;
        const medLowest = medicines.reduce((sum, m) => sum + getBestPrice(m).lowestPrice, 0);
        const medHighest = medicines.reduce((sum, m) => sum + getBestPrice(m).highestPrice, 0);

        const diagnosticTotal = data.diagnostics.reduce((sum, d) => sum + d.cost, 0);

        const procMin = data.procedures.reduce((sum, p) => sum + p.costRange[0], 0) / data.procedures.length;
        const procMax = data.procedures.reduce((sum, p) => sum + p.costRange[1], 0) / data.procedures.length;

        const hospitalMin = data.hospitalStay.perDay * data.hospitalStay.avgDays;
        const hospitalMax = data.hospitalStay.icuPerDay * data.hospitalStay.avgDays;

        const followUpTotal = (data.followUp.visits * data.followUp.perVisit) + data.followUp.tests;

        const totalMin = data.consultation.regular + diagnosticTotal + procMin + hospitalMin + medLowest + followUpTotal;
        const totalMax = data.consultation.emergency + diagnosticTotal + procMax + hospitalMax + medHighest + followUpTotal;

        return {
            spec, data, medicines, medLowest, medHighest, diagnosticTotal,
            procMin, procMax, hospitalMin, hospitalMax, followUpTotal,
            totalMin, totalMax,
        };
    };

    const toggleCostSection = (key) => {
        setExpandedCostSection(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const formatCurrency = (num) => {
        if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
        if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
        return `₹${num}`;
    };

    const totalDoctors = Object.values(specialistDoctors).reduce((sum, arr) => sum + arr.length, 0);
    const totalReviews = Object.values(specialistDoctors).flat().reduce((sum, d) => sum + d.totalReviews, 0);

    // Organ donation cost data & calculator
    const organCostData = [
        { id: 1, name: 'Kidney', icon: '🫘', base: 250000, screening: 15000 },
        { id: 2, name: 'Liver', icon: '🟤', base: 500000, screening: 25000 },
        { id: 3, name: 'Heart', icon: '❤️', base: 800000, screening: 35000 },
        { id: 4, name: 'Lungs', icon: '🫁', base: 600000, screening: 30000 },
        { id: 5, name: 'Cornea', icon: '👁️', base: 50000, screening: 8000 },
        { id: 6, name: 'Bone Marrow', icon: '🦴', base: 350000, screening: 20000 },
        { id: 7, name: 'Pancreas', icon: '🟡', base: 450000, screening: 22000 },
        { id: 8, name: 'Skin', icon: '🩹', base: 80000, screening: 10000 },
    ];

    const toggleOrganCostOrgan = (id) => {
        setOrganCostSelectedOrgans(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const calculateOrganCost = () => {
        if (organCostSelectedOrgans.length === 0 || !organCostAge) return;
        const age = parseInt(organCostAge, 10) || 0;
        let ageFactor = 1.0;
        if (age < 18) ageFactor = 1.15;
        else if (age <= 35) ageFactor = 0.9;
        else if (age <= 50) ageFactor = 1.0;
        else if (age <= 65) ageFactor = 1.2;
        else ageFactor = 1.4;

        let habitFactor = 1.0;
        if (organCostSmoking === 'regular') habitFactor += 0.2;
        else if (organCostSmoking === 'occasional') habitFactor += 0.1;
        else if (organCostSmoking === 'quit') habitFactor += 0.05;
        if (organCostAlcohol === 'heavy') habitFactor += 0.2;
        else if (organCostAlcohol === 'moderate') habitFactor += 0.1;
        else if (organCostAlcohol === 'social') habitFactor += 0.03;

        let medicalFactor = 1.0;
        if (['heart', 'liver', 'kidney'].includes(organCostDisease)) medicalFactor += 0.25;
        else if (['diabetes', 'hypertension'].includes(organCostDisease)) medicalFactor += 0.15;
        else if (organCostDisease === 'other') medicalFactor += 0.1;
        if (organCostSurgery === 'organ') medicalFactor += 0.2;
        else if (organCostSurgery === 'major') medicalFactor += 0.1;
        else if (organCostSurgery === 'minor') medicalFactor += 0.05;

        const breakdown = organCostSelectedOrgans.map(id => {
            const info = organCostData.find(o => o.id === id);
            if (!info) return null;
            const procedureCost = Math.round(info.base * ageFactor * habitFactor * medicalFactor);
            const screeningCost = Math.round(info.screening * medicalFactor);
            const transportCost = Math.round(info.base * 0.05);
            const hospitalStay = Math.round(info.base * 0.15 * ageFactor);
            const total = procedureCost + screeningCost + transportCost + hospitalStay;
            return { ...info, procedureCost, screeningCost, transportCost, hospitalStay, total };
        }).filter(Boolean);

        const grandTotal = breakdown.reduce((s, o) => s + o.total, 0);
        const combinedFactor = ageFactor * habitFactor * medicalFactor;
        let riskLevel = 'Low';
        if (combinedFactor > 1.6) riskLevel = 'High';
        else if (combinedFactor > 1.2) riskLevel = 'Moderate';

        setOrganCostResult({ breakdown, grandTotal, age, ageFactor, habitFactor, medicalFactor, riskLevel,
            totalScreening: breakdown.reduce((s, o) => s + o.screeningCost, 0),
            totalProcedure: breakdown.reduce((s, o) => s + o.procedureCost, 0),
            totalTransport: breakdown.reduce((s, o) => s + o.transportCost, 0),
            totalHospital: breakdown.reduce((s, o) => s + o.hospitalStay, 0),
        });
    };

    return (
        <main className="dashboard-page treatment-page">
            {/* ═══ HERO SECTION ═══ */}
            <section className="trt-hero" ref={heroRef}>
                <div className="trt-hero-bg">
                    <div className="trt-hero-gradient" />
                    <div className="trt-hero-grid-pattern" />
                </div>
                <div className="trt-hero-content">
                    <h1 className="trt-hero-title">
                        <Stethoscope size={36} />
                        Treatment & Doctor Recommendation
                    </h1>
                    <p className="trt-hero-subtitle">
                        Find the right specialist for your condition. Our hospital covers 6 major specialties
                        with {totalDoctors} expert doctors ready to provide world-class treatment.
                    </p>
                    <div className="trt-stats-row">
                        <div className="trt-stat-card">
                            <span className="trt-stat-number">{totalDoctors}</span>
                            <span className="trt-stat-label">Specialist Doctors</span>
                        </div>
                        <div className="trt-stat-card">
                            <span className="trt-stat-number">6</span>
                            <span className="trt-stat-label">Departments</span>
                        </div>
                        <div className="trt-stat-card">
                            <span className="trt-stat-number">{totalReviews.toLocaleString()}</span>
                            <span className="trt-stat-label">Patient Reviews</span>
                        </div>
                        <div className="trt-stat-card">
                            <span className="trt-stat-number">4.8</span>
                            <span className="trt-stat-label">Avg Rating</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ SPECIALTIES BROWSE ═══ */}
            <section className="trt-specialties-section">
                <h2 className="trt-section-title"><Award size={22} /> Our Specialties</h2>
                <div className="trt-specialties-grid">
                    {specialtyCategories.map(cat => {
                        const Icon = cat.icon;
                        const doctors = specialistDoctors[cat.key] || [];
                        return (
                            <div key={cat.key} className={`trt-specialty-tile ${activeSpecialty === cat.key ? 'trt-specialty-tile--active' : ''}`} onClick={() => browseSpecialty(cat.key)}>
                                <div className="trt-specialty-icon" style={{ background: `${cat.color}20`, color: cat.color }}>
                                    <Icon size={24} />
                                </div>
                                <div className="trt-specialty-info">
                                    <strong>{cat.label}</strong>
                                    <span>{cat.desc}</span>
                                </div>
                                <span className="trt-specialty-count">{doctors.length} doctors</span>
                                <ChevronDown size={16} className={`trt-specialty-chevron ${activeSpecialty === cat.key ? 'trt-chevron-up' : ''}`} />
                            </div>
                        );
                    })}
                </div>

                {/* Expanded specialty doctors */}
                {activeSpecialty && specialistDoctors[activeSpecialty] && (
                    <div className="trt-specialty-expanded">
                        <h3>{specialtyCategories.find(c => c.key === activeSpecialty)?.label} Department — Doctors</h3>
                        <div className="trt-browse-doctors">
                            {specialistDoctors[activeSpecialty].map(doc => (
                                <div key={doc.id} className="trt-browse-doc-card">
                                    <span className="trt-doc-avatar">{doc.avatar}</span>
                                    <div className="trt-browse-doc-info">
                                        <strong>{doc.name}</strong>
                                        <span className="trt-doc-spec">{doc.specialization}</span>
                                        <div className="trt-doc-meta">
                                            <span className="trt-doc-exp"><Briefcase size={12} /> {doc.experience}</span>
                                            <span className="trt-doc-rating"><Star size={12} /> {doc.rating} ({doc.totalReviews})</span>
                                            <span className={`trt-doc-avail trt-doc-avail--${doc.availability.toLowerCase().replace(' ', '-')}`}>{doc.availability}</span>
                                        </div>
                                    </div>
                                    <div className="trt-browse-doc-edu">
                                        <GraduationCap size={13} />
                                        <span>{doc.education}</span>
                                    </div>
                                    <div className="trt-browse-doc-reviews">
                                        {doc.reviews.map((r, i) => (
                                            <div key={i} className="trt-browse-review">
                                                <div className="trt-review-header">
                                                    <span className="trt-reviewer-name"><UserCircle size={13} /> {r.name}</span>
                                                    <div className="trt-review-stars">
                                                        {Array.from({ length: r.rating }, (_, k) => <Star key={k} size={10} className="trt-star-filled" />)}
                                                        {Array.from({ length: 5 - r.rating }, (_, k) => <Star key={`e-${k}`} size={10} className="trt-star-empty" />)}
                                                    </div>
                                                </div>
                                                <p>"{r.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* ═══ FIND TREATMENT SECTION ═══ */}
            <section className="trt-find-section" ref={treatmentSectionRef}>
                <h2 className="trt-section-title"><Search size={22} /> Find Treatment for Your Condition</h2>
                <p className="trt-section-desc">Enter the patient's condition to check if our hospital can help. If treatable, we'll recommend 4 specialist doctors with their qualifications, experience, and patient reviews.</p>

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
                                                        <span className="trt-doc-rating"><Star size={12} /> {doc.rating} ({doc.totalReviews} reviews)</span>
                                                        <span className={`trt-doc-avail trt-doc-avail--${doc.availability.toLowerCase().replace(' ', '-')}`}>{doc.availability}</span>
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
                                                                    {Array.from({ length: review.rating }, (_, i) => <Star key={i} size={11} className="trt-star-filled" />)}
                                                                    {Array.from({ length: 5 - review.rating }, (_, i) => <Star key={`e-${i}`} size={11} className="trt-star-empty" />)}
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
                                    <button className="trt-confirm-btn" onClick={confirmTreatmentDoctor} disabled={!selectedTreatmentDoctor}>
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
            </section>

            {/* ═══ APPOINTMENT BOOKING ═══ */}
            <section className="trt-appointment-section" ref={appointmentRef}>
                <h2 className="trt-section-title"><Calendar size={22} /> Book Appointment</h2>
                <p className="trt-section-desc">Schedule an appointment with your assigned specialist doctor. Choose between in-person visit, video call, or phone consultation.</p>

                <div className="appt-content">
                    {/* Appointment Form */}
                    <div className="appt-form-card">
                        <h4><ClipboardList size={16} /> Appointment Details</h4>

                        {treatmentSubmissions.length === 0 && !apptDoctor ? (
                            <div className="appt-empty-notice">
                                <Stethoscope size={28} />
                                <p>No doctor assigned yet.</p>
                                <span>Use the treatment finder above to get a doctor recommendation first.</span>
                            </div>
                        ) : (
                            <div className="appt-form">
                                <div className="trt-form-group">
                                    <label><User size={14} /> Select Assigned Doctor</label>
                                    <select
                                        className="form-control"
                                        value={apptDoctor?.id || ''}
                                        onChange={e => {
                                            const sub = treatmentSubmissions.find(s => s.id === e.target.value);
                                            setApptDoctor(sub || null);
                                        }}
                                    >
                                        <option value="">Choose a doctor</option>
                                        {treatmentSubmissions.map(sub => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.doctor.name} — {sub.condition} (Patient: {sub.patientName})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {apptDoctor && (
                                    <>
                                        <div className="appt-selected-doc">
                                            <span className="trt-doc-avatar">{apptDoctor.doctor.avatar}</span>
                                            <div>
                                                <strong>{apptDoctor.doctor.name}</strong>
                                                <span className="trt-doc-spec">{apptDoctor.doctor.specialization}</span>
                                                <span className="appt-patient-tag"><User size={11} /> Patient: {apptDoctor.patientName} &bull; {apptDoctor.condition}</span>
                                            </div>
                                        </div>

                                        <div className="appt-form-row">
                                            <div className="trt-form-group">
                                                <label><Calendar size={14} /> Appointment Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={apptDate}
                                                    onChange={e => setApptDate(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                            <div className="trt-form-group">
                                                <label><Clock size={14} /> Time Slot</label>
                                                <select className="form-control" value={apptTime} onChange={e => setApptTime(e.target.value)}>
                                                    <option value="">Select time</option>
                                                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="trt-form-group">
                                            <label>Consultation Type</label>
                                            <div className="appt-type-options">
                                                <button className={`appt-type-btn ${apptType === 'in-person' ? 'appt-type-btn--active' : ''}`} onClick={() => setApptType('in-person')}>
                                                    <MapPin size={16} /> In-Person
                                                </button>
                                                <button className={`appt-type-btn ${apptType === 'video' ? 'appt-type-btn--active' : ''}`} onClick={() => setApptType('video')}>
                                                    <Video size={16} /> Video Call
                                                </button>
                                                <button className={`appt-type-btn ${apptType === 'phone' ? 'appt-type-btn--active' : ''}`} onClick={() => setApptType('phone')}>
                                                    <Phone size={16} /> Phone
                                                </button>
                                            </div>
                                        </div>

                                        <div className="trt-form-group">
                                            <label><FileText size={14} /> Notes (Optional)</label>
                                            <textarea
                                                className="form-control"
                                                rows="2"
                                                placeholder="Any special requirements or notes for the appointment..."
                                                value={apptNotes}
                                                onChange={e => setApptNotes(e.target.value)}
                                            />
                                        </div>

                                        <button className="trt-check-btn" onClick={bookAppointment} disabled={!apptDate || !apptTime}>
                                            <Calendar size={16} /> Confirm Appointment
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="appt-list-card">
                        <h4><Clock size={16} /> Upcoming Appointments ({appointments.length})</h4>
                        {appointments.length === 0 ? (
                            <div className="trt-empty">
                                <Calendar size={36} />
                                <p>No appointments scheduled.</p>
                                <span>Book an appointment after getting a doctor recommendation.</span>
                            </div>
                        ) : (
                            <div className="appt-list">
                                {appointments.map(appt => (
                                    <div key={appt.id} className="appt-card">
                                        <div className="appt-card-header">
                                            <div className="appt-card-date">
                                                <Calendar size={14} />
                                                <strong>{new Date(appt.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                                                <span>{appt.time}</span>
                                            </div>
                                            <span className={`appt-type-badge appt-type-badge--${appt.type}`}>
                                                {appt.type === 'in-person' && <><MapPin size={11} /> In-Person</>}
                                                {appt.type === 'video' && <><Video size={11} /> Video</>}
                                                {appt.type === 'phone' && <><Phone size={11} /> Phone</>}
                                            </span>
                                        </div>
                                        <div className="appt-card-body">
                                            <div className="appt-card-doc">
                                                <span>{appt.doctor.avatar}</span>
                                                <div>
                                                    <strong>{appt.doctor.name}</strong>
                                                    <span>{appt.doctor.specialization}</span>
                                                </div>
                                            </div>
                                            <div className="appt-card-patient">
                                                <User size={12} />
                                                <span><strong>{appt.patientName}</strong> — {appt.condition}</span>
                                            </div>
                                        </div>
                                        {appt.notes && <p className="appt-card-notes"><FileText size={12} /> {appt.notes}</p>}
                                        <div className="appt-card-status">
                                            <CheckCircle size={13} />
                                            <span>Confirmed</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ═══ LANGUAGE TRANSLATOR ═══ */}
            <section className="trt-translator-section" ref={translatorRef}>
                <h2 className="trt-section-title"><Globe size={22} /> Medical Language Translator</h2>
                <p className="trt-section-desc">Break the language barrier between doctors and patients. Translate common medical phrases between Telugu, English, Hindi, and Marathi for clear communication.</p>

                <div className="translator-content">
                    {/* Translation Panel */}
                    <div className="translator-panel">
                        <div className="translator-lang-row">
                            <div className="translator-lang-select">
                                <label>From</label>
                                <select className="form-control" value={sourceLang} onChange={e => { setSourceLang(e.target.value); setTranslatedOutput(''); }}>
                                    {languages.map(l => <option key={l.key} value={l.key}>{l.flag} {l.label}</option>)}
                                </select>
                            </div>
                            <button className="translator-swap-btn" onClick={swapLanguages} title="Swap languages">
                                <ArrowLeftRight size={18} />
                            </button>
                            <div className="translator-lang-select">
                                <label>To</label>
                                <select className="form-control" value={targetLang} onChange={e => { setTargetLang(e.target.value); setTranslatedOutput(''); }}>
                                    {languages.map(l => <option key={l.key} value={l.key}>{l.flag} {l.label}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="translator-io">
                            <div className="translator-input-box">
                                <label>{languages.find(l => l.key === sourceLang)?.flag} {languages.find(l => l.key === sourceLang)?.label}</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder={`Type or select a phrase in ${languages.find(l => l.key === sourceLang)?.label}...`}
                                    value={translatorInput}
                                    onChange={e => { setTranslatorInput(e.target.value); setTranslatedOutput(''); }}
                                />
                                <button className="translator-translate-btn" onClick={translateText} disabled={!translatorInput.trim()}>
                                    <Send size={16} /> Translate
                                </button>
                            </div>
                            <div className="translator-output-box">
                                <label>{languages.find(l => l.key === targetLang)?.flag} {languages.find(l => l.key === targetLang)?.label}</label>
                                <div className="translator-output-text">
                                    {translatedOutput ? (
                                        <>
                                            <p>{translatedOutput}</p>
                                            <button className="translator-copy-btn" onClick={() => { navigator.clipboard.writeText(translatedOutput); }} title="Copy translation">
                                                <Copy size={14} /> Copy
                                            </button>
                                        </>
                                    ) : (
                                        <span className="translator-placeholder">Translation will appear here...</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical Phrasebook */}
                    <div className="translator-phrasebook">
                        <h4><MessageCircle size={16} /> Medical Phrasebook — Quick Select</h4>
                        <p className="translator-phrasebook-desc">Click any phrase to auto-fill and translate it instantly between your selected languages.</p>
                        <div className="phrasebook-categories">
                            {medicalPhrases.map((cat, idx) => (
                                <div key={idx} className="phrasebook-category">
                                    <button
                                        className={`phrasebook-cat-btn ${activeTranslatorCategory === idx ? 'phrasebook-cat-btn--active' : ''}`}
                                        onClick={() => setActiveTranslatorCategory(activeTranslatorCategory === idx ? null : idx)}
                                    >
                                        {cat.category}
                                        <ChevronDown size={14} className={activeTranslatorCategory === idx ? 'trt-chevron-up' : ''} />
                                    </button>
                                    {activeTranslatorCategory === idx && (
                                        <div className="phrasebook-phrases">
                                            {cat.phrases.map((phrase, pIdx) => (
                                                <button key={pIdx} className="phrasebook-phrase-btn" onClick={() => selectPhrase(phrase)}>
                                                    <span className="phrasebook-phrase-source">{phrase[sourceLang]}</span>
                                                    <span className="phrasebook-arrow">&rarr;</span>
                                                    <span className="phrasebook-phrase-target">{phrase[targetLang]}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ MEDICINE PRESCRIPTION & PRICE COMPARISON ═══ */}
            <section className="trt-medicine-section" ref={medicineRef}>
                <h2 className="trt-section-title"><Pill size={22} /> Doctor's Prescription & Medicine Price Comparison</h2>
                <p className="trt-section-desc">After your appointment, the doctor prescribes medicines. Compare prices at nearby pharmacies to buy at the lowest price and save money.</p>

                <div className="med-content">
                    {/* Left: Select Appointment to get prescription */}
                    <div className="med-appointments-panel">
                        <h4><ClipboardList size={16} /> Your Appointments</h4>
                        <p className="med-panel-desc">Select an appointment to view the doctor's prescribed medicines.</p>

                        {appointments.length === 0 ? (
                            <div className="trt-empty">
                                <Calendar size={36} />
                                <p>No appointments yet.</p>
                                <span>Book an appointment first to receive a prescription.</span>
                            </div>
                        ) : (
                            <div className="med-appt-list">
                                {appointments.map(appt => (
                                    <button
                                        key={appt.id}
                                        className={`med-appt-item ${selectedApptForRx?.id === appt.id ? 'med-appt-item--active' : ''}`}
                                        onClick={() => generatePrescription(appt)}
                                    >
                                        <span className="trt-doc-avatar">{appt.doctor.avatar}</span>
                                        <div className="med-appt-info">
                                            <strong>{appt.doctor.name}</strong>
                                            <span>{appt.condition} &bull; {appt.patientName}</span>
                                            <span className="med-appt-date"><Calendar size={11} /> {new Date(appt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {appt.time}</span>
                                        </div>
                                        <ChevronDown size={16} className={`trt-specialty-chevron ${selectedApptForRx?.id === appt.id ? 'trt-chevron-up' : ''}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Prescription & Price Comparison */}
                    <div className="med-prescription-panel">
                        {!selectedApptForRx ? (
                            <div className="trt-empty">
                                <Pill size={36} />
                                <p>No prescription selected.</p>
                                <span>Select an appointment from the left to view the doctor's prescribed medicines and compare pharmacy prices.</span>
                            </div>
                        ) : (() => {
                            const rx = prescriptions.find(p => p.appointmentId === selectedApptForRx.id);
                            if (!rx) return null;
                            const totalLowest = rx.medicines.reduce((sum, m) => sum + getBestPrice(m).lowestPrice, 0);
                            const totalHighest = rx.medicines.reduce((sum, m) => sum + getBestPrice(m).highestPrice, 0);
                            const totalSavings = totalHighest - totalLowest;
                            return (
                                <>
                                    {/* Prescription Header */}
                                    <div className="med-rx-header">
                                        <div className="med-rx-doctor">
                                            <span className="trt-doc-avatar">{rx.doctor.avatar}</span>
                                            <div>
                                                <strong>Dr. {rx.doctor.name.replace('Dr. ', '')}</strong>
                                                <span className="trt-doc-spec">{rx.doctor.specialization}</span>
                                                <span className="med-rx-meta">Patient: <strong>{rx.patientName}</strong> &bull; {rx.condition}</span>
                                            </div>
                                        </div>
                                        <div className="med-rx-badge">
                                            <BadgeCheck size={14} />
                                            <span>Prescribed</span>
                                        </div>
                                    </div>

                                    {/* Savings Banner */}
                                    <div className="med-savings-banner">
                                        <TrendingDown size={18} />
                                        <div>
                                            <strong>You can save up to ₹{totalSavings}</strong>
                                            <span>By buying from the lowest-priced pharmacy for each medicine. Lowest total: <strong>₹{totalLowest}</strong> vs Highest: ₹{totalHighest}</span>
                                        </div>
                                    </div>

                                    {/* Medicine Cards */}
                                    <div className="med-list">
                                        {rx.medicines.map(med => {
                                            const best = getBestPrice(med);
                                            const pharmacies = getSortedPharmacies(med);
                                            const bestPharmacy = nearbyPharmacies.find(p => p.id === best.lowestId);
                                            return (
                                                <div key={med.id} className="med-card">
                                                    <div className="med-card-top">
                                                        <div className="med-card-icon">
                                                            <Pill size={18} />
                                                        </div>
                                                        <div className="med-card-info">
                                                            <strong>{med.name}</strong>
                                                            <span className="med-generic">Generic: {med.generic}</span>
                                                            <div className="med-dosage-row">
                                                                <span className="med-type-tag">{med.type}</span>
                                                                <span className="med-dosage"><Syringe size={11} /> {med.dosage}</span>
                                                                <span className="med-duration"><Clock size={11} /> {med.duration}</span>
                                                            </div>
                                                        </div>
                                                        <div className="med-best-price">
                                                            <span className="med-best-price-label">Best Price</span>
                                                            <span className="med-best-price-value">₹{best.lowestPrice}</span>
                                                            <span className="med-best-price-save">Save {best.savingsPercent}%</span>
                                                        </div>
                                                    </div>

                                                    {/* Best pharmacy quick info */}
                                                    <div className="med-best-pharmacy">
                                                        <Store size={13} />
                                                        <span>Lowest at <strong>{bestPharmacy?.name}</strong> ({bestPharmacy?.distance})</span>
                                                        <span className="med-best-pharmacy-price">₹{best.lowestPrice}</span>
                                                    </div>

                                                    {/* Expand to see all pharmacies */}
                                                    <button
                                                        className="trt-expand-btn"
                                                        onClick={() => setExpandedMedicine(expandedMedicine === med.id ? null : med.id)}
                                                    >
                                                        <Store size={14} />
                                                        {expandedMedicine === med.id ? 'Hide Price Comparison' : `Compare Prices at ${nearbyPharmacies.length} Pharmacies`}
                                                        <ChevronDown size={14} className={expandedMedicine === med.id ? 'trt-chevron-up' : ''} />
                                                    </button>

                                                    {expandedMedicine === med.id && (
                                                        <div className="med-pharmacies">
                                                            <div className="med-pharmacies-header">
                                                                <span>Nearby Pharmacies</span>
                                                                <button className="med-sort-btn" onClick={() => setSortByPrice(sortByPrice === 'lowest' ? 'highest' : 'lowest')}>
                                                                    <TrendingDown size={12} /> {sortByPrice === 'lowest' ? 'Lowest First' : 'Highest First'}
                                                                </button>
                                                            </div>
                                                            {pharmacies.map((ph, idx) => {
                                                                const isLowest = ph.price === best.lowestPrice;
                                                                return (
                                                                    <div key={ph.id} className={`med-pharmacy-row ${isLowest ? 'med-pharmacy-row--best' : ''}`}>
                                                                        <div className="med-pharmacy-rank">{idx + 1}</div>
                                                                        <div className="med-pharmacy-info">
                                                                            <div className="med-pharmacy-name">
                                                                                <strong>{ph.name}</strong>
                                                                                {ph.verified && <BadgeCheck size={12} className="med-verified-icon" />}
                                                                            </div>
                                                                            <span className="med-pharmacy-meta">
                                                                                <MapPin size={10} /> {ph.distance} &bull; <Star size={10} /> {ph.rating}
                                                                            </span>
                                                                        </div>
                                                                        <div className="med-pharmacy-price">
                                                                            <strong>₹{ph.price}</strong>
                                                                            {isLowest && <span className="med-lowest-tag">Lowest</span>}
                                                                            {!isLowest && <span className="med-extra-cost">+₹{ph.price - best.lowestPrice}</span>}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Total price comparison */}
                                    <div className="med-total-comparison">
                                        <h5><ShoppingCart size={14} /> Total Prescription Cost Comparison</h5>
                                        <div className="med-total-pharmacies">
                                            {nearbyPharmacies.map(ph => {
                                                const total = rx.medicines.reduce((sum, m) => sum + m.prices[ph.id], 0);
                                                const isLowest = total === totalLowest;
                                                return (
                                                    <div key={ph.id} className={`med-total-row ${isLowest ? 'med-total-row--best' : ''}`}>
                                                        <div className="med-total-pharmacy">
                                                            <Store size={13} />
                                                            <div>
                                                                <strong>{ph.name}</strong>
                                                                <span>{ph.distance}</span>
                                                            </div>
                                                        </div>
                                                        <div className="med-total-price">
                                                            <strong>₹{total}</strong>
                                                            {isLowest ? (
                                                                <span className="med-lowest-tag"><TrendingDown size={10} /> Best Deal</span>
                                                            ) : (
                                                                <span className="med-extra-cost">+₹{total - totalLowest} more</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            </section>

            {/* ═══ COST ANALYSIS & BREAKDOWN ═══ */}
            <section className="trt-cost-section" ref={costRef}>
                <div className="cost-header-area">
                    <h2 className="trt-section-title"><BarChart3 size={22} /> Complete Treatment Cost Analysis</h2>
                    <p className="trt-section-desc">Full transparency on treatment costs — from consultation to medicines. Know the actual cost of every step so you can plan financially. We highlight the cheapest options and government schemes to help less-affording patients.</p>

                    {/* Specialty selector */}
                    <div className="cost-specialty-tabs">
                        {Object.entries(treatmentCosts).map(([key, val]) => (
                            <button
                                key={key}
                                className={`cost-spec-tab ${selectedCostSpecialty === key ? 'cost-spec-tab--active' : ''}`}
                                onClick={() => setSelectedCostSpecialty(key)}
                            >
                                {specialtyCategories.find(c => c.key === key)?.icon &&
                                    (() => { const Icon = specialtyCategories.find(c => c.key === key)?.icon; return <Icon size={14} />; })()
                                }
                                {val.label}
                            </button>
                        ))}
                    </div>
                </div>

                {(() => {
                    const cd = getCostData();
                    if (!cd) return null;
                    const { data, medicines, medLowest, medHighest, diagnosticTotal, procMin, procMax, hospitalMin, hospitalMax, followUpTotal, totalMin, totalMax } = cd;

                    return (
                        <div className="cost-analysis-body">
                            {/* ── Total Summary Cards ── */}
                            <div className="cost-summary-cards">
                                <div className="cost-summary-card cost-summary-card--total">
                                    <div className="cost-summary-icon"><Wallet size={20} /></div>
                                    <div>
                                        <span className="cost-summary-label">Estimated Total Cost</span>
                                        <span className="cost-summary-range">{formatCurrency(Math.round(totalMin))} — {formatCurrency(Math.round(totalMax))}</span>
                                        <span className="cost-summary-note">Lowest to highest estimate</span>
                                    </div>
                                </div>
                                <div className="cost-summary-card">
                                    <div className="cost-summary-icon cost-summary-icon--green"><TrendingDown size={20} /></div>
                                    <div>
                                        <span className="cost-summary-label">Max Savings Possible</span>
                                        <span className="cost-summary-value cost-summary-value--green">{formatCurrency(Math.round(totalMax - totalMin))}</span>
                                        <span className="cost-summary-note">By choosing lowest options</span>
                                    </div>
                                </div>
                                <div className="cost-summary-card">
                                    <div className="cost-summary-icon cost-summary-icon--blue"><Pill size={20} /></div>
                                    <div>
                                        <span className="cost-summary-label">Medicine Savings</span>
                                        <span className="cost-summary-value cost-summary-value--blue">{formatCurrency(medHighest - medLowest)}</span>
                                        <span className="cost-summary-note">Jan Aushadhi vs branded</span>
                                    </div>
                                </div>
                                <div className="cost-summary-card">
                                    <div className="cost-summary-icon cost-summary-icon--purple"><Landmark size={20} /></div>
                                    <div>
                                        <span className="cost-summary-label">Govt Scheme Cover</span>
                                        <span className="cost-summary-value cost-summary-value--purple">Up to ₹5L</span>
                                        <span className="cost-summary-note">Ayushman Bharat (PMJAY)</span>
                                    </div>
                                </div>
                            </div>

                            {/* ── Visual Cost Breakdown Bar ── */}
                            <div className="cost-visual-bar-card">
                                <h4><Layers size={16} /> Cost Distribution (Lowest Estimate)</h4>
                                <div className="cost-bar-container">
                                    {[
                                        { label: 'Consultation', value: data.consultation.regular, color: '#10b981' },
                                        { label: 'Diagnostics', value: diagnosticTotal, color: '#3b82f6' },
                                        { label: 'Procedure (Avg)', value: Math.round(procMin), color: '#f59e0b' },
                                        { label: 'Hospital Stay', value: hospitalMin, color: '#8b5cf6' },
                                        { label: 'Medicines', value: medLowest, color: '#ec4899' },
                                        { label: 'Follow-up', value: followUpTotal, color: '#06b6d4' },
                                    ].map((item, i) => {
                                        const pct = Math.max(3, Math.round((item.value / totalMin) * 100));
                                        return (
                                            <div key={i} className="cost-bar-segment" style={{ flex: pct }} title={`${item.label}: ₹${item.value.toLocaleString()}`}>
                                                <div className="cost-bar-fill" style={{ background: item.color }} />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="cost-bar-legend">
                                    {[
                                        { label: 'Consultation', color: '#10b981', value: data.consultation.regular },
                                        { label: 'Diagnostics', color: '#3b82f6', value: diagnosticTotal },
                                        { label: 'Procedure', color: '#f59e0b', value: Math.round(procMin) },
                                        { label: 'Hospital', color: '#8b5cf6', value: hospitalMin },
                                        { label: 'Medicines', color: '#ec4899', value: medLowest },
                                        { label: 'Follow-up', color: '#06b6d4', value: followUpTotal },
                                    ].map((item, i) => (
                                        <div key={i} className="cost-bar-legend-item">
                                            <span className="cost-legend-dot" style={{ background: item.color }} />
                                            <span className="cost-legend-label">{item.label}</span>
                                            <span className="cost-legend-value">₹{item.value.toLocaleString()}</span>
                                            <span className="cost-legend-pct">{Math.round((item.value / totalMin) * 100)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── Detailed Breakdown Accordions ── */}
                            <div className="cost-breakdown-grid">
                                {/* 1. Consultation Fees */}
                                <div className="cost-breakdown-card">
                                    <button className={`cost-accordion-btn ${expandedCostSection.consultation ? 'cost-accordion-btn--open' : ''}`} onClick={() => toggleCostSection('consultation')}>
                                        <div className="cost-acc-left">
                                            <span className="cost-acc-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}><Stethoscope size={16} /></span>
                                            <div>
                                                <strong>Doctor Consultation</strong>
                                                <span>First visit & follow-ups</span>
                                            </div>
                                        </div>
                                        <div className="cost-acc-right">
                                            <span className="cost-acc-price">₹{data.consultation.regular} — ₹{data.consultation.emergency}</span>
                                            <ChevronDown size={16} className={expandedCostSection.consultation ? 'trt-chevron-up' : ''} />
                                        </div>
                                    </button>
                                    {expandedCostSection.consultation && (
                                        <div className="cost-acc-body">
                                            <div className="cost-detail-row">
                                                <span>Regular Consultation</span>
                                                <strong>₹{data.consultation.regular}</strong>
                                            </div>
                                            <div className="cost-detail-row">
                                                <span>Follow-up Visit</span>
                                                <strong>₹{data.consultation.followUp}</strong>
                                            </div>
                                            <div className="cost-detail-row cost-detail-row--highlight">
                                                <span>Emergency Consultation</span>
                                                <strong>₹{data.consultation.emergency}</strong>
                                            </div>
                                            <div className="cost-tip"><Info size={13} /> <span>Tip: Book a regular appointment to avoid emergency charges. Follow-up visits are cheaper.</span></div>
                                        </div>
                                    )}
                                </div>

                                {/* 2. Diagnostics / Tests */}
                                <div className="cost-breakdown-card">
                                    <button className={`cost-accordion-btn ${expandedCostSection.diagnostics ? 'cost-accordion-btn--open' : ''}`} onClick={() => toggleCostSection('diagnostics')}>
                                        <div className="cost-acc-left">
                                            <span className="cost-acc-icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}><Search size={16} /></span>
                                            <div>
                                                <strong>Diagnostic Tests</strong>
                                                <span>{data.diagnostics.length} tests may be required</span>
                                            </div>
                                        </div>
                                        <div className="cost-acc-right">
                                            <span className="cost-acc-price">₹{diagnosticTotal.toLocaleString()}</span>
                                            <ChevronDown size={16} className={expandedCostSection.diagnostics ? 'trt-chevron-up' : ''} />
                                        </div>
                                    </button>
                                    {expandedCostSection.diagnostics && (
                                        <div className="cost-acc-body">
                                            {data.diagnostics.map((d, i) => (
                                                <div key={i} className="cost-detail-row">
                                                    <span>{d.name}</span>
                                                    <strong>₹{d.cost.toLocaleString()}</strong>
                                                </div>
                                            ))}
                                            <div className="cost-detail-total">
                                                <span>Total Diagnostics</span>
                                                <strong>₹{diagnosticTotal.toLocaleString()}</strong>
                                            </div>
                                            <div className="cost-tip"><Info size={13} /> <span>Not all tests may be needed. The doctor will decide based on your condition. Government hospitals offer tests at 50-70% lower cost.</span></div>
                                        </div>
                                    )}
                                </div>

                                {/* 3. Treatment Procedures */}
                                <div className="cost-breakdown-card">
                                    <button className={`cost-accordion-btn ${expandedCostSection.procedures ? 'cost-accordion-btn--open' : ''}`} onClick={() => toggleCostSection('procedures')}>
                                        <div className="cost-acc-left">
                                            <span className="cost-acc-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}><Syringe size={16} /></span>
                                            <div>
                                                <strong>Treatment Procedures</strong>
                                                <span>Surgery / therapy costs</span>
                                            </div>
                                        </div>
                                        <div className="cost-acc-right">
                                            <span className="cost-acc-price">{formatCurrency(Math.round(procMin))} — {formatCurrency(Math.round(procMax))}</span>
                                            <ChevronDown size={16} className={expandedCostSection.procedures ? 'trt-chevron-up' : ''} />
                                        </div>
                                    </button>
                                    {expandedCostSection.procedures && (
                                        <div className="cost-acc-body">
                                            {data.procedures.map((p, i) => (
                                                <div key={i} className="cost-detail-row">
                                                    <span>{p.name}</span>
                                                    <strong>₹{p.costRange[0].toLocaleString()} — ₹{p.costRange[1].toLocaleString()}</strong>
                                                </div>
                                            ))}
                                            <div className="cost-tip"><Info size={13} /> <span>Costs vary by hospital tier (govt/private), city, and implant/material used. Always ask for a detailed estimate before agreeing.</span></div>
                                        </div>
                                    )}
                                </div>

                                {/* 4. Hospital Stay */}
                                <div className="cost-breakdown-card">
                                    <button className={`cost-accordion-btn ${expandedCostSection.hospital ? 'cost-accordion-btn--open' : ''}`} onClick={() => toggleCostSection('hospital')}>
                                        <div className="cost-acc-left">
                                            <span className="cost-acc-icon" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}><Heart size={16} /></span>
                                            <div>
                                                <strong>Hospital Stay</strong>
                                                <span>Avg {data.hospitalStay.avgDays} days admission</span>
                                            </div>
                                        </div>
                                        <div className="cost-acc-right">
                                            <span className="cost-acc-price">₹{hospitalMin.toLocaleString()} — ₹{hospitalMax.toLocaleString()}</span>
                                            <ChevronDown size={16} className={expandedCostSection.hospital ? 'trt-chevron-up' : ''} />
                                        </div>
                                    </button>
                                    {expandedCostSection.hospital && (
                                        <div className="cost-acc-body">
                                            <div className="cost-detail-row">
                                                <span>General Ward (Per Day)</span>
                                                <strong>₹{data.hospitalStay.perDay.toLocaleString()}</strong>
                                            </div>
                                            <div className="cost-detail-row cost-detail-row--highlight">
                                                <span>ICU (Per Day)</span>
                                                <strong>₹{data.hospitalStay.icuPerDay.toLocaleString()}</strong>
                                            </div>
                                            <div className="cost-detail-row">
                                                <span>Average Stay Duration</span>
                                                <strong>{data.hospitalStay.avgDays} days</strong>
                                            </div>
                                            <div className="cost-detail-total">
                                                <span>General Ward ({data.hospitalStay.avgDays} days)</span>
                                                <strong>₹{hospitalMin.toLocaleString()}</strong>
                                            </div>
                                            <div className="cost-detail-total">
                                                <span>ICU ({data.hospitalStay.avgDays} days)</span>
                                                <strong>₹{hospitalMax.toLocaleString()}</strong>
                                            </div>
                                            <div className="cost-tip"><Info size={13} /> <span>General ward is significantly cheaper. Request it unless ICU is medically necessary. Semi-private rooms are a middle option.</span></div>
                                        </div>
                                    )}
                                </div>

                                {/* 5. Medicines */}
                                <div className="cost-breakdown-card">
                                    <button className={`cost-accordion-btn ${expandedCostSection.medicines ? 'cost-accordion-btn--open' : ''}`} onClick={() => toggleCostSection('medicines')}>
                                        <div className="cost-acc-left">
                                            <span className="cost-acc-icon" style={{ background: 'rgba(236,72,153,0.12)', color: '#ec4899' }}><Pill size={16} /></span>
                                            <div>
                                                <strong>Medicines</strong>
                                                <span>{medicines.length} prescribed medicines</span>
                                            </div>
                                        </div>
                                        <div className="cost-acc-right">
                                            <span className="cost-acc-price">₹{medLowest} — ₹{medHighest}</span>
                                            <ChevronDown size={16} className={expandedCostSection.medicines ? 'trt-chevron-up' : ''} />
                                        </div>
                                    </button>
                                    {expandedCostSection.medicines && (
                                        <div className="cost-acc-body">
                                            {medicines.map(med => {
                                                const best = getBestPrice(med);
                                                return (
                                                    <div key={med.id} className="cost-med-row">
                                                        <div className="cost-med-info">
                                                            <strong>{med.name}</strong>
                                                            <span className="cost-med-generic">{med.generic} &bull; {med.type} &bull; Qty: {med.quantity}</span>
                                                        </div>
                                                        <div className="cost-med-prices">
                                                            <span className="cost-med-lowest">₹{best.lowestPrice} <small>(Jan Aushadhi)</small></span>
                                                            <span className="cost-med-branded">₹{best.highestPrice} <small>(Branded)</small></span>
                                                            <span className="cost-med-save">Save {best.savingsPercent}%</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div className="cost-detail-total">
                                                <span>Total (Lowest — Jan Aushadhi)</span>
                                                <strong className="cost-green">₹{medLowest}</strong>
                                            </div>
                                            <div className="cost-detail-total">
                                                <span>Total (Highest — Branded)</span>
                                                <strong>₹{medHighest}</strong>
                                            </div>
                                            <div className="cost-tip cost-tip--green"><TrendingDown size={13} /> <span>Buy generic medicines from Jan Aushadhi Kendras to save 50-80% on medicine costs. Same quality, government approved.</span></div>
                                        </div>
                                    )}
                                </div>

                                {/* 6. Follow-up Care */}
                                <div className="cost-breakdown-card">
                                    <button className={`cost-accordion-btn ${expandedCostSection.followup ? 'cost-accordion-btn--open' : ''}`} onClick={() => toggleCostSection('followup')}>
                                        <div className="cost-acc-left">
                                            <span className="cost-acc-icon" style={{ background: 'rgba(6,182,212,0.12)', color: '#06b6d4' }}><RefreshCw size={16} /></span>
                                            <div>
                                                <strong>Follow-up Care</strong>
                                                <span>{data.followUp.visits} visits + tests</span>
                                            </div>
                                        </div>
                                        <div className="cost-acc-right">
                                            <span className="cost-acc-price">₹{followUpTotal.toLocaleString()}</span>
                                            <ChevronDown size={16} className={expandedCostSection.followup ? 'trt-chevron-up' : ''} />
                                        </div>
                                    </button>
                                    {expandedCostSection.followup && (
                                        <div className="cost-acc-body">
                                            <div className="cost-detail-row">
                                                <span>Follow-up Visits ({data.followUp.visits} visits × ₹{data.followUp.perVisit})</span>
                                                <strong>₹{(data.followUp.visits * data.followUp.perVisit).toLocaleString()}</strong>
                                            </div>
                                            <div className="cost-detail-row">
                                                <span>Follow-up Tests</span>
                                                <strong>₹{data.followUp.tests.toLocaleString()}</strong>
                                            </div>
                                            <div className="cost-detail-total">
                                                <span>Total Follow-up</span>
                                                <strong>₹{followUpTotal.toLocaleString()}</strong>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── Grand Total Summary ── */}
                            <div className="cost-grand-total">
                                <h4><Wallet size={18} /> Grand Total — {data.label} Treatment</h4>
                                <div className="cost-grand-rows">
                                    <div className="cost-grand-row">
                                        <span>Consultation (Regular)</span>
                                        <strong>₹{data.consultation.regular.toLocaleString()}</strong>
                                    </div>
                                    <div className="cost-grand-row">
                                        <span>All Diagnostic Tests</span>
                                        <strong>₹{diagnosticTotal.toLocaleString()}</strong>
                                    </div>
                                    <div className="cost-grand-row">
                                        <span>Avg Procedure Cost</span>
                                        <strong>₹{Math.round(procMin).toLocaleString()} — ₹{Math.round(procMax).toLocaleString()}</strong>
                                    </div>
                                    <div className="cost-grand-row">
                                        <span>Hospital Stay ({data.hospitalStay.avgDays} days)</span>
                                        <strong>₹{hospitalMin.toLocaleString()} — ₹{hospitalMax.toLocaleString()}</strong>
                                    </div>
                                    <div className="cost-grand-row">
                                        <span>Medicines</span>
                                        <strong>₹{medLowest.toLocaleString()} — ₹{medHighest.toLocaleString()}</strong>
                                    </div>
                                    <div className="cost-grand-row">
                                        <span>Follow-up Care</span>
                                        <strong>₹{followUpTotal.toLocaleString()}</strong>
                                    </div>
                                    <div className="cost-grand-divider" />
                                    <div className="cost-grand-row cost-grand-row--final">
                                        <span>ESTIMATED TOTAL</span>
                                        <strong>{formatCurrency(Math.round(totalMin))} — {formatCurrency(Math.round(totalMax))}</strong>
                                    </div>
                                    <div className="cost-grand-row cost-grand-row--savings">
                                        <span><TrendingDown size={14} /> Maximum Possible Savings</span>
                                        <strong>{formatCurrency(Math.round(totalMax - totalMin))}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* ── Government Schemes & Financial Help ── */}
                            <div className="cost-govt-section">
                                <button className={`cost-govt-toggle ${showGovtSchemes ? 'cost-govt-toggle--open' : ''}`} onClick={() => setShowGovtSchemes(!showGovtSchemes)}>
                                    <Landmark size={18} />
                                    <div>
                                        <strong>Government Schemes & Financial Help ({govtSchemes.length} Programs)</strong>
                                        <span>Free / subsidized treatment, medicines & financial aid for eligible patients</span>
                                    </div>
                                    <ChevronDown size={16} className={showGovtSchemes ? 'trt-chevron-up' : ''} />
                                </button>
                                {showGovtSchemes && (
                                    <div className="cost-govt-body">
                                        <div className="cost-govt-intro">
                                            <Info size={15} />
                                            <p>India has multiple government programs to help patients who can't afford treatment. Below are all major central, state and non-profit options. <strong>Click any scheme</strong> to see full details — eligibility, benefits, documents needed, and how to apply.</p>
                                        </div>

                                        {/* Scheme type filters */}
                                        <div className="cost-govt-types">
                                            {['All', 'Central Government', 'State Government', 'Private / Non-Profit'].map(type => (
                                                <span key={type} className="cost-govt-type-badge">{type} ({type === 'All' ? govtSchemes.length : govtSchemes.filter(s => s.type === type).length})</span>
                                            ))}
                                        </div>

                                        <div className="cost-govt-cards-grid">
                                            {govtSchemes.map((scheme, i) => {
                                                const isExpanded = expandedScheme === i;
                                                return (
                                                    <div key={i} className={`cost-govt-detail-card ${isExpanded ? 'cost-govt-detail-card--open' : ''}`}>
                                                        <button className="cost-govt-card-header" onClick={() => setExpandedScheme(isExpanded ? null : i)}>
                                                            <span className="cost-govt-icon">{scheme.icon}</span>
                                                            <div className="cost-govt-header-info">
                                                                <strong>{scheme.name}</strong>
                                                                <span className="cost-govt-fullname">{scheme.fullName}</span>
                                                                <div className="cost-govt-header-tags">
                                                                    <span className="cost-govt-tag cost-govt-tag--type">{scheme.type}</span>
                                                                    {scheme.coverage > 0 && <span className="cost-govt-tag cost-govt-tag--cover">₹{(scheme.coverage / 100000).toFixed(0)}L Coverage</span>}
                                                                </div>
                                                            </div>
                                                            <ChevronDown size={16} className={isExpanded ? 'trt-chevron-up' : ''} />
                                                        </button>

                                                        {isExpanded && (
                                                            <div className="cost-govt-card-body">
                                                                <p className="cost-govt-desc">{scheme.description}</p>

                                                                <div className="cost-govt-detail-grid">
                                                                    {/* Eligibility */}
                                                                    <div className="cost-govt-detail-block">
                                                                        <h5><Users size={14} /> Who Can Apply</h5>
                                                                        <p>{scheme.eligibility}</p>
                                                                    </div>

                                                                    {/* Benefits */}
                                                                    <div className="cost-govt-detail-block cost-govt-detail-block--full">
                                                                        <h5><CheckCircle size={14} /> Benefits & Coverage</h5>
                                                                        <ul className="cost-govt-benefit-list">
                                                                            {scheme.benefits.map((b, j) => (
                                                                                <li key={j}><CheckCircle size={12} /> {b}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>

                                                                    {/* Documents Required */}
                                                                    <div className="cost-govt-detail-block">
                                                                        <h5><FileText size={14} /> Documents Required</h5>
                                                                        <ul className="cost-govt-doc-list">
                                                                            {scheme.documents.map((d, j) => (
                                                                                <li key={j}>{d}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>

                                                                    {/* How to Apply */}
                                                                    <div className="cost-govt-detail-block">
                                                                        <h5><ClipboardList size={14} /> How to Apply</h5>
                                                                        <ol className="cost-govt-steps">
                                                                            {scheme.howToApply.map((step, j) => (
                                                                                <li key={j}>{step}</li>
                                                                            ))}
                                                                        </ol>
                                                                    </div>
                                                                </div>

                                                                {/* Contact Info */}
                                                                <div className="cost-govt-contact">
                                                                    <div className="cost-govt-contact-item">
                                                                        <Phone size={13} />
                                                                        <span>Helpline: <strong>{scheme.helpline}</strong></span>
                                                                    </div>
                                                                    <div className="cost-govt-contact-item">
                                                                        <Globe size={13} />
                                                                        <span>Website: <strong>{scheme.website}</strong></span>
                                                                    </div>
                                                                    {scheme.statePortal && (
                                                                        <div className="cost-govt-contact-item">
                                                                            <Search size={13} />
                                                                            <span>Check Eligibility: <strong>{scheme.statePortal}</strong></span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Quick Action Tips */}
                                        <div className="cost-govt-quick-actions">
                                            <h4><Info size={16} /> Quick Steps for Low-Income Patients</h4>
                                            <div className="cost-govt-action-steps">
                                                <div className="cost-govt-action-step">
                                                    <span className="cost-govt-step-num">1</span>
                                                    <div>
                                                        <strong>Check Ayushman Bharat Eligibility First</strong>
                                                        <p>Call <strong>14555</strong> or visit mera.pmjay.gov.in — if eligible, up to ₹5 Lakh treatment is <strong>completely free</strong>.</p>
                                                    </div>
                                                </div>
                                                <div className="cost-govt-action-step">
                                                    <span className="cost-govt-step-num">2</span>
                                                    <div>
                                                        <strong>Visit District Hospital / PHC</strong>
                                                        <p>Government hospitals provide treatment at 50-80% less cost. Most diagnostic tests and basic surgeries are free.</p>
                                                    </div>
                                                </div>
                                                <div className="cost-govt-action-step">
                                                    <span className="cost-govt-step-num">3</span>
                                                    <div>
                                                        <strong>Talk to Hospital Social Worker</strong>
                                                        <p>Every government hospital has a Patient Welfare Department. They help you apply for RAN, HMDG, state schemes, and NGO funds.</p>
                                                    </div>
                                                </div>
                                                <div className="cost-govt-action-step">
                                                    <span className="cost-govt-step-num">4</span>
                                                    <div>
                                                        <strong>Buy Medicines from Jan Aushadhi</strong>
                                                        <p>Save 50-90% on medicines. Find nearest store on the <strong>Janaushadhi Sugam</strong> app or call 1800-180-8080.</p>
                                                    </div>
                                                </div>
                                                <div className="cost-govt-action-step">
                                                    <span className="cost-govt-step-num">5</span>
                                                    <div>
                                                        <strong>Use State Health Helpline</strong>
                                                        <p>Dial <strong>104</strong> (available in most states) for health information, nearest hospital, scheme guidance, and ambulance.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="cost-tip cost-tip--green cost-govt-bottom-tip">
                                            <Info size={13} />
                                            <span><strong>Important:</strong> You can combine multiple schemes — for example, use Ayushman Bharat for hospitalization + Jan Aushadhi for medicines + state scheme for additional coverage. Always ask the hospital patient welfare officer to help you maximize your benefits.</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── Money Saving Tips ── */}
                            <div className="cost-tips-card">
                                <h4><TrendingDown size={16} /> Tips to Reduce Treatment Cost</h4>
                                <div className="cost-tips-grid">
                                    <div className="cost-tip-item">
                                        <span className="cost-tip-num">1</span>
                                        <div>
                                            <strong>Buy Generic Medicines</strong>
                                            <p>Purchase from Jan Aushadhi Kendras or ask your doctor for generic prescriptions. Same quality at 50-90% less cost.</p>
                                        </div>
                                    </div>
                                    <div className="cost-tip-item">
                                        <span className="cost-tip-num">2</span>
                                        <div>
                                            <strong>Check Government Schemes</strong>
                                            <p>Ayushman Bharat covers up to ₹5 Lakh. Many state schemes provide additional coverage. Check eligibility before treatment.</p>
                                        </div>
                                    </div>
                                    <div className="cost-tip-item">
                                        <span className="cost-tip-num">3</span>
                                        <div>
                                            <strong>Choose General Ward</strong>
                                            <p>General ward costs 50-70% less than private rooms. Medical care quality remains the same.</p>
                                        </div>
                                    </div>
                                    <div className="cost-tip-item">
                                        <span className="cost-tip-num">4</span>
                                        <div>
                                            <strong>Compare Pharmacy Prices</strong>
                                            <p>Use our medicine price comparison above. Prices vary 30-60% across pharmacies for the same medicine.</p>
                                        </div>
                                    </div>
                                    <div className="cost-tip-item">
                                        <span className="cost-tip-num">5</span>
                                        <div>
                                            <strong>Get Tests from Government Labs</strong>
                                            <p>Government hospital labs charge 50-70% less for the same diagnostic tests. Ask for reports to carry to your doctor.</p>
                                        </div>
                                    </div>
                                    <div className="cost-tip-item">
                                        <span className="cost-tip-num">6</span>
                                        <div>
                                            <strong>Ask for Detailed Bills</strong>
                                            <p>Always ask for itemized billing. This helps you identify unnecessary charges and compare with other hospitals.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </section>

            {/* ═══ ORGAN DONATION COST ESTIMATOR ═══ */}
            <section className="trt-organ-cost-section">
                <div className="organ-cost-header-area">
                    <h2 className="trt-section-title"><Heart size={22} /> Organ Donation Cost Estimator</h2>
                    <p className="trt-section-desc">Get the lowest estimated cost for organ donation procedures — auto-calculated based on your age, habits, and medical history screening.</p>
                </div>

                <div className="organ-cost-form-card">
                    {/* Organ Selection */}
                    <h3 className="organ-cost-form-title">🫀 Select Organs</h3>
                    <div className="organ-cost-organ-grid">
                        {organCostData.map(organ => (
                            <button
                                key={organ.id}
                                className={`organ-cost-organ-btn ${organCostSelectedOrgans.includes(organ.id) ? 'organ-cost-organ-btn--active' : ''}`}
                                onClick={() => toggleOrganCostOrgan(organ.id)}
                            >
                                <span className="organ-cost-organ-icon">{organ.icon}</span>
                                <span className="organ-cost-organ-name">{organ.name}</span>
                                {organCostSelectedOrgans.includes(organ.id) && <span className="organ-cost-organ-check">✅</span>}
                            </button>
                        ))}
                    </div>

                    {/* Screening Form */}
                    <h3 className="organ-cost-form-title">🩺 Screening Details</h3>
                    <div className="organ-cost-form-grid">
                        <div className="organ-cost-field">
                            <label>Age *</label>
                            <input type="number" min="1" max="120" placeholder="Enter your age" value={organCostAge} onChange={e => setOrganCostAge(e.target.value)} />
                        </div>
                        <div className="organ-cost-field">
                            <label>Smoking Habit</label>
                            <select value={organCostSmoking} onChange={e => setOrganCostSmoking(e.target.value)}>
                                <option value="">Select</option>
                                <option value="never">Never Smoked</option>
                                <option value="quit">Quit (1+ year ago)</option>
                                <option value="occasional">Occasional</option>
                                <option value="regular">Regular Smoker</option>
                            </select>
                        </div>
                        <div className="organ-cost-field">
                            <label>Alcohol Consumption</label>
                            <select value={organCostAlcohol} onChange={e => setOrganCostAlcohol(e.target.value)}>
                                <option value="">Select</option>
                                <option value="never">Never</option>
                                <option value="social">Social / Occasional</option>
                                <option value="moderate">Moderate (Weekly)</option>
                                <option value="heavy">Heavy / Daily</option>
                            </select>
                        </div>
                        <div className="organ-cost-field">
                            <label>Chronic Disease</label>
                            <select value={organCostDisease} onChange={e => setOrganCostDisease(e.target.value)}>
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
                        <div className="organ-cost-field">
                            <label>Previous Surgery</label>
                            <select value={organCostSurgery} onChange={e => setOrganCostSurgery(e.target.value)}>
                                <option value="">Select</option>
                                <option value="none">No Previous Surgery</option>
                                <option value="minor">Minor Surgery</option>
                                <option value="major">Major Surgery</option>
                                <option value="organ">Organ-related Surgery</option>
                            </select>
                        </div>
                    </div>

                    <button className="organ-cost-calc-btn" onClick={calculateOrganCost} disabled={organCostSelectedOrgans.length === 0 || !organCostAge}>
                        <BarChart3 size={18} /> Calculate Cost Estimate
                    </button>
                </div>

                {/* Results */}
                {organCostResult && (
                    <div className="organ-cost-result">
                        <div className="organ-cost-result__header">
                            <h3>💰 Estimated Cost Distribution (Lowest Estimate)</h3>
                            <div className="organ-cost-result__risk">
                                <span>Screening Risk:</span>
                                <span className={`organ-cost-risk-badge organ-cost-risk-badge--${organCostResult.riskLevel.toLowerCase()}`}>
                                    {organCostResult.riskLevel === 'Low' ? '🟢' : organCostResult.riskLevel === 'Moderate' ? '🟡' : '🔴'} {organCostResult.riskLevel}
                                </span>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="organ-cost-summary-cards">
                            <div className="organ-cost-summary-card organ-cost-summary-card--total">
                                <Wallet size={20} />
                                <div>
                                    <span className="organ-cost-summary-label">Grand Total</span>
                                    <span className="organ-cost-summary-value">₹{organCostResult.grandTotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            <div className="organ-cost-summary-card">
                                <Stethoscope size={20} />
                                <div>
                                    <span className="organ-cost-summary-label">Screening</span>
                                    <span className="organ-cost-summary-value">₹{organCostResult.totalScreening.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            <div className="organ-cost-summary-card">
                                <Activity size={20} />
                                <div>
                                    <span className="organ-cost-summary-label">Procedure</span>
                                    <span className="organ-cost-summary-value">₹{organCostResult.totalProcedure.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Factors */}
                        <div className="organ-cost-factors">
                            <div className="organ-cost-factor">
                                <span className="organ-cost-factor__label">Age Factor</span>
                                <span className="organ-cost-factor__value">{organCostResult.ageFactor.toFixed(2)}x</span>
                                <span className="organ-cost-factor__note">{organCostResult.age} yrs</span>
                            </div>
                            <div className="organ-cost-factor">
                                <span className="organ-cost-factor__label">Habit Factor</span>
                                <span className="organ-cost-factor__value">{organCostResult.habitFactor.toFixed(2)}x</span>
                                <span className="organ-cost-factor__note">Smoking & Alcohol</span>
                            </div>
                            <div className="organ-cost-factor">
                                <span className="organ-cost-factor__label">Medical Factor</span>
                                <span className="organ-cost-factor__value">{organCostResult.medicalFactor.toFixed(2)}x</span>
                                <span className="organ-cost-factor__note">History & Surgery</span>
                            </div>
                        </div>

                        {/* Per-Organ Breakdown */}
                        <div className="organ-cost-organs-list">
                            {organCostResult.breakdown.map(organ => (
                                <div key={organ.id} className="organ-cost-organ-card">
                                    <div className="organ-cost-organ-card__header">
                                        <span>{organ.icon} {organ.name}</span>
                                        <span className="organ-cost-organ-card__total">₹{organ.total.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="organ-cost-organ-card__bars">
                                        {[
                                            { label: '🩺 Screening', value: organ.screeningCost, color: '#3b82f6' },
                                            { label: '⚕️ Procedure', value: organ.procedureCost, color: '#2dce89' },
                                            { label: '🚑 Transport', value: organ.transportCost, color: '#f59e0b' },
                                            { label: '🏥 Hospital Stay', value: organ.hospitalStay, color: '#8b5cf6' },
                                        ].map((item, i) => (
                                            <div key={i} className="organ-cost-bar-row">
                                                <div className="organ-cost-bar-label">
                                                    <span>{item.label}</span>
                                                    <span>₹{item.value.toLocaleString('en-IN')}</span>
                                                </div>
                                                <div className="organ-cost-bar">
                                                    <div className="organ-cost-bar__fill" style={{ width: `${(item.value / organ.total) * 100}%`, background: item.color }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total Summary */}
                        <div className="organ-cost-grand-summary">
                            <div className="organ-cost-grand-row"><span>🩺 Total Screening</span><span>₹{organCostResult.totalScreening.toLocaleString('en-IN')}</span></div>
                            <div className="organ-cost-grand-row"><span>⚕️ Total Procedure</span><span>₹{organCostResult.totalProcedure.toLocaleString('en-IN')}</span></div>
                            <div className="organ-cost-grand-row"><span>🚑 Total Transport</span><span>₹{organCostResult.totalTransport.toLocaleString('en-IN')}</span></div>
                            <div className="organ-cost-grand-row"><span>🏥 Total Hospital Stay</span><span>₹{organCostResult.totalHospital.toLocaleString('en-IN')}</span></div>
                            <div className="organ-cost-grand-row organ-cost-grand-row--total"><span>💰 Grand Total (Lowest Estimate)</span><span>₹{organCostResult.grandTotal.toLocaleString('en-IN')}</span></div>
                        </div>

                        <p className="organ-cost-disclaimer">⚠️ This is an automated lowest estimate based on screening data. Actual costs may vary. Many government programs cover organ donation costs fully.</p>
                    </div>
                )}
            </section>
        </main>
    );
}
