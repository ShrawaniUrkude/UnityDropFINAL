// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generic fetch wrapper with error handling
const fetchAPI = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };
    
    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
};

// ═══════════════════════════════════════════════════════════════
// DONOR API
// ═══════════════════════════════════════════════════════════════

export const donorAPI = {
    // Register new donor
    register: (donorData) => 
        fetchAPI('/donors', { method: 'POST', body: donorData }),
    
    // Get all donors
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`/donors${query ? `?${query}` : ''}`);
    },
    
    // Get donor by ID/email/phone
    getById: (id) => 
        fetchAPI(`/donors/${id}`),
    
    // Search donor by email or phone
    search: (searchData) => 
        fetchAPI('/donors/search', { method: 'POST', body: searchData }),
    
    // Update donor status
    updateStatus: (id, statusData) => 
        fetchAPI(`/donors/${id}/status`, { method: 'PUT', body: statusData }),
    
    // Add tracking update
    addTracking: (id, trackingData) => 
        fetchAPI(`/donors/${id}/tracking`, { method: 'POST', body: trackingData }),
    
    // Get statistics
    getStats: () => 
        fetchAPI('/donors/stats'),
};

// ═══════════════════════════════════════════════════════════════
// FOOD DONATION API
// ═══════════════════════════════════════════════════════════════

export const foodDonationAPI = {
    // Create food donation
    create: (donationData) => 
        fetchAPI('/food-donations', { method: 'POST', body: donationData }),
    
    // Get all food donations
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`/food-donations${query ? `?${query}` : ''}`);
    },
    
    // Get food donation by ID
    getById: (id) => 
        fetchAPI(`/food-donations/${id}`),
    
    // Update delivery status
    updateStatus: (id, statusData) => 
        fetchAPI(`/food-donations/${id}/status`, { method: 'PUT', body: statusData }),
    
    // Volunteer response
    volunteerResponse: (id, response) => 
        fetchAPI(`/food-donations/${id}/volunteer-response`, { method: 'PUT', body: response }),
    
    // Get volunteers
    getVolunteers: () => 
        fetchAPI('/food-donations/volunteers'),
};

// ═══════════════════════════════════════════════════════════════
// MONETARY DONATION API
// ═══════════════════════════════════════════════════════════════

export const donationAPI = {
    // Create donation
    create: (donationData) => 
        fetchAPI('/donations', { method: 'POST', body: donationData }),
    
    // Get all donations
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`/donations${query ? `?${query}` : ''}`);
    },
    
    // Get donation by receipt ID
    getById: (id) => 
        fetchAPI(`/donations/${id}`),
    
    // Get statistics
    getStats: () => 
        fetchAPI('/donations/stats'),
};

// ═══════════════════════════════════════════════════════════════
// NGO API
// ═══════════════════════════════════════════════════════════════

export const ngoAPI = {
    // Get all NGOs
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`/ngos${query ? `?${query}` : ''}`);
    },
    
    // Get NGO by ID
    getById: (id) => 
        fetchAPI(`/ngos/${id}`),
    
    // Get statistics
    getStats: () => 
        fetchAPI('/ngos/stats'),
};

// ═══════════════════════════════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════════════════════════════

export const authAPI = {
    // Register
    register: (userData) => 
        fetchAPI('/auth/register', { method: 'POST', body: userData }),
    
    // Login
    login: (credentials) => 
        fetchAPI('/auth/login', { method: 'POST', body: credentials }),
    
    // Get current user
    getMe: () => 
        fetchAPI('/auth/me'),
    
    // Logout
    logout: () => 
        fetchAPI('/auth/logout', { method: 'POST' }),
};

// ═══════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════

export const healthCheck = () => fetchAPI('/health');

// ═══════════════════════════════════════════════════════════════
// EQUIPMENT TRACKING API
// ═══════════════════════════════════════════════════════════════

export const equipmentAPI = {
    // Get all equipment with optional filters
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`/equipment${query ? `?${query}` : ''}`);
    },
    
    // Get single equipment by device_id
    getById: (deviceId) => 
        fetchAPI(`/equipment/${deviceId}`),
    
    // Update equipment location (simulate beacon event)
    updateLocation: (data) => 
        fetchAPI('/equipment/update-location', { method: 'POST', body: data }),
    
    // Update equipment status
    updateStatus: (deviceId, statusData) => 
        fetchAPI(`/equipment/${deviceId}/status`, { method: 'PUT', body: statusData }),
    
    // Get zone statistics
    getZoneStats: () => 
        fetchAPI('/equipment/zones'),
    
    // Seed initial equipment data
    seed: () => 
        fetchAPI('/equipment/seed', { method: 'POST' }),
};

// ═══════════════════════════════════════════════════════════════
// MOVEMENT HISTORY API
// ═══════════════════════════════════════════════════════════════

export const historyAPI = {
    // Get movement history
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`/history${query ? `?${query}` : ''}`);
    },
};

export default {
    donor: donorAPI,
    foodDonation: foodDonationAPI,
    donation: donationAPI,
    ngo: ngoAPI,
    auth: authAPI,
    equipment: equipmentAPI,
    history: historyAPI,
    healthCheck,
};
