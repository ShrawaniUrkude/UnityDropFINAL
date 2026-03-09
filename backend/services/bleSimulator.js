/**
 * BLE Beacon Simulator
 * Simulates equipment movement in a hospital environment
 * Updates equipment locations randomly every 5-8 seconds
 */

const Equipment = require('../models/Equipment');
const MovementHistory = require('../models/MovementHistory');

// Hospital locations
const HOSPITAL_LOCATIONS = [
    'Emergency Room',
    'ICU',
    'Ward A',
    'Ward B',
    'Corridor',
    'Radiology'
];

// Simulator state
let simulatorInterval = null;
let isRunning = false;

/**
 * Get random location different from current
 */
const getRandomNewLocation = (currentLocation) => {
    const otherLocations = HOSPITAL_LOCATIONS.filter(loc => loc !== currentLocation);
    return otherLocations[Math.floor(Math.random() * otherLocations.length)];
};

/**
 * Generate random signal strength (BLE RSSI typically -30 to -100 dBm)
 */
const getRandomSignalStrength = () => {
    return Math.floor(Math.random() * 50) - 80; // -80 to -30 dBm
};

/**
 * Simulate battery drain (very minimal - realistic for BLE beacons)
 */
const simulateBatteryDrain = (currentLevel) => {
    // BLE beacons drain very slowly - 0.01% to 0.05% per update
    const drain = Math.random() * 0.05;
    // Sometimes battery gets replaced/recharged (5% chance to restore)
    if (Math.random() < 0.05 && currentLevel < 50) {
        return Math.min(100, currentLevel + 30); // Battery replaced
    }
    return Math.max(5, Math.round((currentLevel - drain) * 100) / 100);
};

/**
 * Simulate a single beacon update for one equipment
 */
const simulateBeaconUpdate = async (equipment) => {
    try {
        // 30% chance equipment moves to a new location
        const shouldMove = Math.random() < 0.3;
        
        const previousLocation = equipment.location;
        const newLocation = shouldMove ? getRandomNewLocation(previousLocation) : previousLocation;
        const signalStrength = getRandomSignalStrength();
        
        // Update equipment
        equipment.location = newLocation;
        equipment.signal_strength = signalStrength;
        equipment.battery_level = simulateBatteryDrain(equipment.battery_level);
        equipment.last_updated = new Date();
        
        // 20% chance to toggle status (Available <-> In Use)
        if (Math.random() < 0.2) {
            equipment.status = equipment.status === 'Available' ? 'In Use' : 'Available';
        }
        
        await equipment.save();
        
        // Log movement if location changed
        if (shouldMove && previousLocation !== newLocation) {
            await MovementHistory.create({
                device_id: equipment.device_id,
                equipment_type: equipment.equipment_type,
                previous_location: previousLocation,
                new_location: newLocation,
                signal_strength: signalStrength,
                timestamp: new Date()
            });
            
            console.log(`🔵 BLE: ${equipment.device_id} moved from ${previousLocation} → ${newLocation}`);
            return { moved: true, equipment };
        }
        
        return { moved: false, equipment };
    } catch (error) {
        console.error(`❌ Beacon simulation error for ${equipment.device_id}:`, error.message);
        return { moved: false, error: error.message };
    }
};

/**
 * Run one simulation cycle for all equipment
 */
const runSimulationCycle = async () => {
    try {
        const allEquipment = await Equipment.find({});
        
        if (allEquipment.length === 0) {
            console.log('⚠️ No equipment found. Run seed first: POST /api/equipment/seed');
            return;
        }
        
        // Pick 1-3 random equipment to update
        const updateCount = Math.floor(Math.random() * 3) + 1;
        const shuffled = allEquipment.sort(() => 0.5 - Math.random());
        const toUpdate = shuffled.slice(0, Math.min(updateCount, shuffled.length));
        
        const results = await Promise.all(toUpdate.map(simulateBeaconUpdate));
        const movements = results.filter(r => r.moved).length;
        
        if (movements > 0) {
            console.log(`📍 Simulation cycle: ${movements} equipment moved`);
        }
    } catch (error) {
        console.error('❌ Simulation cycle error:', error.message);
    }
};

/**
 * Start the beacon simulator
 */
const startSimulator = (intervalMs = 6000) => {
    if (isRunning) {
        console.log('⚠️ Simulator already running');
        return;
    }
    
    // Run first cycle immediately
    runSimulationCycle();
    
    // Then run at random intervals (5-8 seconds)
    const scheduleNext = () => {
        const randomInterval = 5000 + Math.random() * 3000; // 5-8 seconds
        simulatorInterval = setTimeout(() => {
            runSimulationCycle();
            if (isRunning) scheduleNext();
        }, randomInterval);
    };
    
    isRunning = true;
    scheduleNext();
    
    console.log('🟢 BLE Beacon Simulator started (updates every 5-8 seconds)');
};

/**
 * Stop the beacon simulator
 */
const stopSimulator = () => {
    if (simulatorInterval) {
        clearTimeout(simulatorInterval);
        simulatorInterval = null;
    }
    isRunning = false;
    console.log('🔴 BLE Beacon Simulator stopped');
};

/**
 * Check if simulator is running
 */
const isSimulatorRunning = () => isRunning;

module.exports = {
    startSimulator,
    stopSimulator,
    isSimulatorRunning,
    runSimulationCycle
};
