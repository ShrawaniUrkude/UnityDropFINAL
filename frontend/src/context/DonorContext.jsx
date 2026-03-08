import { createContext, useContext, useState, useEffect } from 'react';

const DonorContext = createContext();

const STORAGE_KEY = 'unitydrop_donors';

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

    // Persist to localStorage whenever donors change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(donors));
    }, [donors]);

    const registerDonor = (donorData) => {
        const newDonor = {
            ...donorData,
            donorId: `UD-${Date.now().toString(36).toUpperCase()}`,
            registeredAt: new Date().toISOString(),
            status: 'pending',
            approvalDetails: null,
            tracking: null,
        };
        setDonors(prev => [newDonor, ...prev]);
        return newDonor;
    };

    const updateDonorStatus = (donorId, status, approvalDetails = null) => {
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
                            { name: 'Donation Approved', icon: '✅', status: 'completed', timestamp: new Date().toISOString(), note: 'Donation approved by NGO partner' },
                            { name: 'Donor Check-in', icon: '🏥', status: 'pending', timestamp: null, note: '' },
                            { name: 'Medical Screening', icon: '🩺', status: 'pending', timestamp: null, note: '' },
                            { name: 'Organ Retrieval', icon: '🫀', status: 'pending', timestamp: null, note: '' },
                            { name: 'Quality Testing', icon: '🔬', status: 'pending', timestamp: null, note: '' },
                            { name: 'Organ Packaging', icon: '📦', status: 'pending', timestamp: null, note: '' },
                            { name: 'In Transit', icon: '🚑', status: 'pending', timestamp: null, note: '' },
                            { name: 'Delivered to Hospital', icon: '🏨', status: 'pending', timestamp: null, note: '' },
                            { name: 'Transplant Complete', icon: '🎉', status: 'pending', timestamp: null, note: '' },
                        ]
                    } : d.tracking,
                }
                : d
            )
        );
    };

    const updateTracking = (donorId, stageIndex, note = '') => {
        setDonors(prev =>
            prev.map(d => {
                if (d.donorId !== donorId || !d.tracking) return d;
                const stages = d.tracking.stages.map((s, i) => {
                    if (i < stageIndex) return { ...s, status: 'completed' };
                    if (i === stageIndex) return { ...s, status: 'completed', timestamp: new Date().toISOString(), note: note || s.note };
                    return s;
                });
                return { ...d, tracking: { currentStage: stageIndex, stages } };
            })
        );
    };

    return (
        <DonorContext.Provider value={{ donors, registerDonor, updateDonorStatus, updateTracking }}>
            {children}
        </DonorContext.Provider>
    );
}

export function useDonors() {
    const ctx = useContext(DonorContext);
    if (!ctx) throw new Error('useDonors must be used within DonorProvider');
    return ctx;
}
