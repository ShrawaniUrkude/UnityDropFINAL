// NGO Controller
// In-memory store for NGOs
const ngos = [
    { id: 1, name: 'Life Foundation', logo: '❤️', focus: 'Organ Transplant Coordination', location: 'Mumbai', verified: true, rating: 4.9, donorsHelped: 1240 },
    { id: 2, name: 'Gift of Life Trust', logo: '🎁', focus: 'Living Donor Support', location: 'Delhi', verified: true, rating: 4.8, donorsHelped: 890 },
    { id: 3, name: 'Hope Medical NGO', logo: '🏥', focus: 'Hospital Partnerships', location: 'Bangalore', verified: true, rating: 4.7, donorsHelped: 650 },
    { id: 4, name: 'Organ India', logo: '🇮🇳', focus: 'Awareness & Education', location: 'Chennai', verified: true, rating: 4.6, donorsHelped: 420 },
    { id: 5, name: 'Second Chance Foundation', logo: '🔄', focus: 'Post-Transplant Care', location: 'Pune', verified: false, rating: 4.5, donorsHelped: 310 },
];

// @desc    Get all NGOs
// @route   GET /api/ngos
exports.getAllNGOs = async (req, res) => {
    try {
        const { verified } = req.query;
        let filtered = ngos;
        
        if (verified === 'true') {
            filtered = ngos.filter(n => n.verified);
        } else if (verified === 'false') {
            filtered = ngos.filter(n => !n.verified);
        }
        
        res.json({ success: true, data: filtered });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get NGO by ID
// @route   GET /api/ngos/:id
exports.getNGO = async (req, res) => {
    try {
        const { id } = req.params;
        const ngo = ngos.find(n => n.id === parseInt(id));
        
        if (!ngo) {
            return res.status(404).json({ success: false, message: 'NGO not found' });
        }
        
        res.json({ success: true, data: ngo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get NGO statistics
// @route   GET /api/ngos/stats
exports.getNGOStats = async (req, res) => {
    try {
        const stats = {
            total: ngos.length,
            verified: ngos.filter(n => n.verified).length,
            totalDonorsHelped: ngos.reduce((sum, n) => sum + n.donorsHelped, 0),
            averageRating: (ngos.reduce((sum, n) => sum + n.rating, 0) / ngos.length).toFixed(1)
        };
        
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
