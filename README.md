# UnityDrop

> **Connect. Donate. Impact.**

UnityDrop is a comprehensive social impact platform that connects verified donors, NGOs, local businesses, volunteers, and beneficiaries to ensure every donation reaches the right person at the right time. Built with React + Vite and featuring stunning GSAP animations.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-ISC-green)

---

## 🌟 Features

### 🏠 Home Page
- **Hero Section** with auto-sliding image carousel and parallax scrolling effects
- **Animated Statistics** showing platform impact (500+ NGOs, 100K+ lives impacted)
- **Problem Statement Section** highlighting issues in traditional donation systems
- **How It Works** step-by-step guide with scroll-triggered animations
- **Featured Campaigns** showcase with interactive cards
- **Trust & Transparency** section with real-time counters
- **Floating Particles** and custom cursor glow effects for enhanced UX

### 🩺 Organ Donation System
- **Organ Catalog** displaying all donatable organs (Kidney, Liver, Heart, Lungs, Cornea, Bone Marrow, Pancreas, Skin)
- **Filtering System** to view organs by Living Donor or Posthumous donation type
- **Detailed Organ Pages** with:
  - Success rates and recovery times
  - Number of waiting patients
  - Eligibility criteria
  - Medical procedures explained
  - Living vs posthumous donation info

### 📋 Donor Registration
- **Multi-Step Form** (4 steps) for comprehensive donor registration:
  - Personal Information (Name, DOB, Gender, Blood Group)
  - Contact & Address Details
  - Medical History (Smoking, Alcohol, Chronic diseases, Previous surgeries)
  - Emergency Contact & Consent
- **Real-Time Cost Estimation Algorithm** that calculates:
  - Base cost per organ
  - Age factor adjustments
  - Lifestyle habit factors
  - Medical condition adjustments
  - Screening costs
- **Organ Selection** with detailed information for each organ type
- **Form Validation** with error handling

### 📊 Donor Dashboard
- **Donation Status Tracking** - Search by email or phone to find your registration
- **Status Cards** showing registration progress (Pending, Approved, Rejected)
- **Approved Donations Section** displaying:
  - Hospital appointment details
  - Doctor information
  - Scheduled date and time
  - Special instructions
- **Real-Time Updates** when NGOs approve donor registrations

### 🏢 NGO Dashboard
- **Partnered NGOs Display** with verification badges and ratings
- **Donor Management System** for NGOs to:
  - View all registered donors
  - Filter by status (Pending, Approved, Rejected)
  - Expand donor details (organs pledged, medical history, cost estimates)
- **Approval Workflow** with form to add:
  - Donation date and time
  - Hospital name and address
  - Doctor assignment
  - Contact numbers
  - Special instructions
- **Tracking Updates** - Add location and status notes for donors
- **Status Counters** showing distribution of donor statuses

### 🏥 Hospital Navigation System
- **Interactive Hospital Map** with:
  - Multi-floor visualization (Basement to 3rd Floor)
  - 2D grid layout of all hospital rooms/departments
  - Color-coded room types (Emergency, ICU, Surgery, Wards, etc.)
  - Room search functionality
  - Bed availability indicators
- **Department Categories**:
  - Emergency & Reception
  - Surgery Suites & ICU
  - Maternity, NICU, Pediatrics
  - General Wards & Private Rooms
  - Support Services (Pharmacy, Lab, Blood Bank)
  - Amenities (Cafeteria, Chapel, Waiting Areas)

### 👨‍⚕️ Medical Dashboard
- **Specialist Doctor Directory** organized by department:
  - Cardiac (Interventional Cardiology, Electrophysiology, Pediatric Cardiology)
  - Orthopedic (Joint Replacement, Spine Surgery, Sports Medicine)
  - Neurological (Neurosurgery, Stroke, Epilepsy, Neuro-Oncology)
- **Doctor Profiles** including:
  - Specialization and experience
  - Education background
  - Patient ratings and reviews
  - Availability status
- **Treatment Conditions Search** for finding appropriate specialists
- **Medicine Price Comparison** - Compare drug prices across pharmacies with:
  - Generic alternatives
  - Discounts and savings calculations
  - Multiple pharmacy options

### 🍲 Food Donation System
- **Food Donation Form** with:
  - Donor information
  - Pickup address
  - Food category selection (Cooked Food, Vegetables, Fruits, Grains, Dairy, Packaged)
  - Quantity and description
  - Preferred pickup time
- **Volunteer Allocation** - Automatically assigns nearby available volunteers
- **Donation Tracking** with status updates:
  - Waiting for pickup
  - Picked up
  - In transit
  - Delivered
- **Volunteer Profiles** showing ratings and delivery counts

### 💰 Donation Page
- **Flexible Amount Selection** - Preset amounts (₹500 - ₹25,000) or custom
- **Payment Type Options** - One-time or Monthly recurring
- **Donation Categories**:
  - Where Most Needed
  - Food & Nutrition
  - Education
  - Healthcare
  - Emergency Relief
- **Multi-Step Checkout** process
- **Success Confirmation** with:
  - Receipt ID generation
  - Tax exemption info (80G eligible)
  - Impact tracking promise

### ℹ️ About Page
- **Platform Statistics** with animated counters (₹2.8Cr+ raised, 98,400+ lives impacted)
- **Core Values** section (Transparency, Trust, Real-Time Delivery, Recognition, Zero Misuse, Inclusive Coverage)
- **Company Timeline** from 2022 founding to present milestones
- **Team Profiles** with roles and backgrounds
- **Partner Organizations** (UNICEF India, NITI Aayog, Give India, etc.)
- **Press Mentions** from Forbes India, Economic Times, NDTV, etc.
- **FAQ Section** addressing common donor questions

---

## 🎨 UI/UX Features

- **Dark Theme Design** with gradient accents
- **GSAP Animations** including:
  - Scroll-triggered reveals
  - Parallax effects
  - Counter animations
  - Elastic button interactions
  - Page transitions
- **Responsive Layout** for all screen sizes
- **Custom Cursor** with glow effect on interactive elements
- **Scroll Progress Bar** at the top of the page
- **Floating Particles** background effect
- **Glassmorphism** effects on cards and navigation
- **Lucide React Icons** throughout the interface

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **Vite 7** | Build Tool & Dev Server |
| **React Router 7** | Client-side Routing |
| **GSAP** | Advanced Animations |
| **Lucide React** | Icon Library |
| **React CountUp** | Animated Counters |
| **Recharts** | Data Visualization |
| **CSS3** | Styling (No CSS framework) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ShrawaniUrkude/UnityDrop.git

# Navigate to frontend directory
cd UnityDrop/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
UnityDrop/
├── frontend/
│   ├── public/
│   │   └── hero-images/          # Hero slider images
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx    # Navigation with scroll effects
│   │   │   │   └── Footer.jsx    # Site footer
│   │   │   └── ui/
│   │   │       └── CampaignCard.jsx
│   │   ├── context/
│   │   │   └── DonorContext.jsx  # Global donor state management
│   │   ├── data/
│   │   │   └── mockData.js       # Sample campaigns, NGOs, organs data
│   │   ├── hooks/
│   │   │   └── useGsap.js        # GSAP & ScrollTrigger setup
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Campaigns.jsx     # Organ donation catalog
│   │   │   ├── OrganDetail.jsx   # Individual organ details
│   │   │   ├── DonorRegistration.jsx  # Multi-step donor form
│   │   │   ├── DonarDashboard.jsx     # Donor status tracking
│   │   │   ├── NGOs.jsx          # NGO management dashboard
│   │   │   ├── Hospital.jsx      # Hospital floor map
│   │   │   ├── Dashboard.jsx     # Medical dashboard
│   │   │   ├── FoodDonation.jsx  # Food donation system
│   │   │   ├── Donate.jsx        # Monetary donation page
│   │   │   ├── About.jsx         # About the platform
│   │   │   └── Volunteers.jsx    # Volunteer management
│   │   ├── App.jsx               # Main app with routing
│   │   ├── App.css               # Global styles
│   │   ├── index.css             # Base styles
│   │   └── main.jsx              # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── package.json
```

---

## 📱 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with hero, stats, features |
| `/campaigns` | Campaigns | Organ donation catalog |
| `/campaigns/:id` | OrganDetail | Detailed organ information |
| `/donate` | Donate | Monetary donation form |
| `/ngos` | NGOs | NGO dashboard & donor management |
| `/hospital` | Hospital | Interactive hospital floor map |
| `/dashboard` | Dashboard | Medical specialists & price comparison |
| `/donor-registration` | DonorRegistration | Multi-step donor signup |
| `/donor-dashboard` | DonarDashboard | Track donation status |
| `/food-donation` | FoodDonation | Food donation with volunteer matching |
| `/about` | About | Platform info, team, timeline |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the ISC License.

---

## 👩‍💻 Author

**Shrawani Urkude**

- GitHub: [@ShrawaniUrkude](https://github.com/ShrawaniUrkude)

---

<p align="center">Built with ❤️ for a better world</p>
