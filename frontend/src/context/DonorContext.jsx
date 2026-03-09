import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { donorAPI } from '../services/api';

const DonorContext = createContext();

const STORAGE_KEY = 'unitydrop_donors';
const API_AVAILABLE_KEY = 'unitydrop_api_available';

function loadDonors() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

export function DonorProvider({ children }) {
    const [donors, setDonors] = useState(loadDonors);
    const [apiAvailable, setApiAvailable] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check if API is available on mount
    useEffect(() => {
        const checkAPI = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/health');
                if (response.ok) {
                    setApiAvailable(true);
                    localStorage.setItem(API_AVAILABLE_KEY, 'true');
                    // Fetch donors from API
                    fetchDonorsFromAPI();
                }
            } catch {
                setApiAvailable(false);
                localStorage.setItem(API_AVAILABLE_KEY, 'false');
            }
        };
        checkAPI();
    }, []);

    const fetchDonorsFromAPI = async () => {
        try {
            setLoading(true);
            const response = await donorAPI.getAll();
            if (response.success) {
                setDonors(response.data);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
            }
        } catch (error) {
            console.log('Using local storage fallback');
        } finally {
            setLoading(false);
        }
    };

    // Persist to localStorage whenever donors change (fallback)
    useEffect(() => {
        if (!apiAvailable) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(donors));
        }
    }, [donors, apiAvailable]);

    const registerDonor = useCallback(async (donorData) => {
        const newDonor = {
            ...donorData,
            donorId: `UD-${Date.now().toString(36).toUpperCase()}`,
            registeredAt: new Date().toISOString(),
            status: 'pending',
            approvalDetails: null,
            tracking: null,
        };

        // Try API first
        if (apiAvailable) {
            try {
                const response = await donorAPI.register(donorData);
                if (response.success) {
                    setDonors(prev => [response.data, ...prev]);
                    return response.data;
                }
            } catch (error) {
                console.error('API registration failed, using local storage');
            }
        }

        // Fallback to local storage
        setDonors(prev => [newDonor, ...prev]);
        return newDonor;
    }, [apiAvailable]);

    const updateDonorStatus = useCallback(async (donorId, status, approvalDetails = null) => {
        // Try API first
        if (apiAvailable) {
            try {
                const response = await donorAPI.updateStatus(donorId, { status, approvalDetails });
                if (response.success) {
                    setDonors(prev =>
                        prev.map(d => d.donorId === donorId ? response.data : d)
                    );
                    return;
                }
            } catch (error) {
                console.error('API update failed, using local storage');
            }
        }

        // Fallback to local state update
        setDonors(prev =>
            prev.map(d => d.donorId === donorId
                ? {
                    ...d,
                    status,
                    approvalDetails: status === 'approved' ? approvalDetails : d.approvalDetails,
                    approvedAt: status === 'approved' ? new Date().toISOString() : d.approvedAt,
                    tracking: status === 'approved' && !d.tracking ? {
                        currentStage: 0,
                        stages: [
                            { name: 'Donation Approved', icon: '✅', status: 'completed', timestamp: new Date().toISOString(), note: 'Donation approved by NGO partner', location: approvalDetails?.hospitalName || 'NGO Office' },
                            { name: 'Donor Check-in', icon: '🏥', status: 'pending', timestamp: null, note: '', location: '' },
                            { name: 'Medical Screening', icon: '🩺', status: 'pending', timestamp: null, note: '', location: '' },
                            { name: 'Organ Retrieval', icon: '🫀', status: 'pending', timestamp: null, note: '', location: '' },
                            { name: 'Quality Testing', icon: '🔬', status: 'pending', timestamp: null, note: '', location: '' },
                            { name: 'Organ Packaging', icon: '📦', status: 'pending', timestamp: null, note: '', location: '' },
                            { name: 'In Transit', icon: '🚑', status: 'pending', timestamp: null, note: '', location: '' },
                            { name: 'Delivered to Hospital', icon: '🏨', status: 'pending', timestamp: null, note: '', location: '' },
                            { name: 'Transplant Complete', icon: '🎉', status: 'pending', timestamp: null, note: '', location: '' },
                        ]
                    } : d.tracking,
                }
                : d
            )
        );
    }, [apiAvailable]);

    const updateTracking = useCallback(async (donorId, stageIndex, note = '', location = '') => {
        // Try API first
        if (apiAvailable) {
            try {
                const response = await donorAPI.addTracking(donorId, { 
                    status: `stage_${stageIndex}`, 
                    note, 
                    location 
                });
                if (response.success) {
                    // Refetch to get updated data
                    fetchDonorsFromAPI();
                    return;
                }
            } catch (error) {
                console.error('API tracking update failed, using local storage');
            }
        }

        // Fallback to local state update
        setDonors(prev =>
            prev.map(d => {
                if (d.donorId !== donorId || !d.tracking) return d;
                const stages = d.tracking.stages.map((s, i) => {
                    if (i < stageIndex) return { ...s, status: 'completed' };
                    if (i === stageIndex) return { ...s, status: 'completed', timestamp: new Date().toISOString(), note: note || s.note, location: location || s.location };
                    return s;
                });
                return { ...d, tracking: { currentStage: stageIndex, stages } };
            })
        );
    }, [apiAvailable]);

    const searchDonor = useCallback(async (email, phone) => {
        if (apiAvailable) {
            try {
                const response = await donorAPI.search({ email, phone });
                if (response.success) {
                    return response.data;
                }
            } catch (error) {
                console.log('API search failed, searching locally');
            }
        }

        // Fallback to local search
        return donors.find(d => 
            (email && d.email?.toLowerCase() === email.toLowerCase()) ||
            (phone && d.phone === phone)
        );
    }, [apiAvailable, donors]);

    return (
        <DonorContext.Provider value={{ 
            donors, 
            loading,
            apiAvailable,
            registerDonor, 
            updateDonorStatus, 
            updateTracking,
            searchDonor,
            refreshDonors: fetchDonorsFromAPI
        }}>
            {children}
        </DonorContext.Provider>
    );
}

export function useDonors() {
    const ctx = useContext(DonorContext);
    if (!ctx) throw new Error('useDonors must be used within DonorProvider');
    return ctx;
}
