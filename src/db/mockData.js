// Mock database seed and simulation logic for Smart Health Centres
export const initialCentres = {
  'c-1': { id: 'c-1', name: 'Metro Health Hub', location: 'District Sector 4', totalBeds: 120, occupiedBeds: 82 },
  'c-2': { id: 'c-2', name: 'Valley Community Clinic', location: 'North Ridge', totalBeds: 45, occupiedBeds: 18 },
  'c-3': { id: 'c-3', name: 'Riverside Medical Outpost', location: 'East Bank Delta', totalBeds: 25, occupiedBeds: 22 },
  'c-4': { id: 'c-4', name: 'Summit Wellness Centre', location: 'Highland Ridge', totalBeds: 60, occupiedBeds: 41 },
  'c-5': { id: 'c-5', name: 'Forest Ridge Care Point', location: 'South Woods', totalBeds: 30, occupiedBeds: 12 }
};

export const initialStock = {
  'c-1': {
    'item-1': { id: 'item-1', name: 'Paracetamol 500mg', currentStock: 1200, avgDailyUsage: 150, reorderThreshold: 400 },
    'item-2': { id: 'item-2', name: 'Amoxicillin capsules', currentStock: 340, avgDailyUsage: 45, reorderThreshold: 100 },
    'item-3': { id: 'item-3', name: 'Insulin Glargine', currentStock: 80, avgDailyUsage: 35, reorderThreshold: 50 },
    'item-4': { id: 'item-4', name: 'Disposable Syringes 5ml', currentStock: 4500, avgDailyUsage: 600, reorderThreshold: 1000 },
    'item-5': { id: 'item-5', name: 'Oral Rehydration Salts', currentStock: 250, avgDailyUsage: 90, reorderThreshold: 300 } // low: 2.7 days stockout
  },
  'c-2': {
    'item-1': { id: 'item-1', name: 'Paracetamol 500mg', currentStock: 400, avgDailyUsage: 30, reorderThreshold: 100 },
    'item-2': { id: 'item-2', name: 'Amoxicillin capsules', currentStock: 180, avgDailyUsage: 15, reorderThreshold: 45 },
    'item-3': { id: 'item-3', name: 'Disposable Syringes 5ml', currentStock: 1200, avgDailyUsage: 120, reorderThreshold: 300 },
    'item-5': { id: 'item-5', name: 'Oral Rehydration Salts', currentStock: 600, avgDailyUsage: 40, reorderThreshold: 80 }
  },
  'c-3': {
    'item-1': { id: 'item-1', name: 'Paracetamol 500mg', currentStock: 80, avgDailyUsage: 40, reorderThreshold: 100 }, // low: 2.0 days stockout
    'item-2': { id: 'item-2', name: 'Amoxicillin capsules', currentStock: 15, avgDailyUsage: 10, reorderThreshold: 30 }, // low: 1.5 days stockout
    'item-3': { id: 'item-3', name: 'Insulin Glargine', currentStock: 5, avgDailyUsage: 3, reorderThreshold: 10 }, // low: 1.6 days stockout
    'item-4': { id: 'item-4', name: 'Disposable Syringes 5ml', currentStock: 3000, avgDailyUsage: 150, reorderThreshold: 400 },
    'item-5': { id: 'item-5', name: 'Oral Rehydration Salts', currentStock: 40, avgDailyUsage: 35, reorderThreshold: 100 } // low: 1.1 days stockout
  },
  'c-4': {
    'item-1': { id: 'item-1', name: 'Paracetamol 500mg', currentStock: 950, avgDailyUsage: 100, reorderThreshold: 200 },
    'item-3': { id: 'item-3', name: 'Insulin Glargine', currentStock: 140, avgDailyUsage: 20, reorderThreshold: 40 },
    'item-4': { id: 'item-4', name: 'Disposable Syringes 5ml', currentStock: 2200, avgDailyUsage: 400, reorderThreshold: 800 },
    'item-6': { id: 'item-6', name: 'Ibuprofen 400mg', currentStock: 75, avgDailyUsage: 30, reorderThreshold: 100 } // low: 2.5 days stockout
  },
  'c-5': {
    'item-1': { id: 'item-1', name: 'Paracetamol 500mg', currentStock: 350, avgDailyUsage: 40, reorderThreshold: 80 },
    'item-2': { id: 'item-2', name: 'Amoxicillin capsules', currentStock: 220, avgDailyUsage: 25, reorderThreshold: 50 },
    'item-4': { id: 'item-4', name: 'Disposable Syringes 5ml', currentStock: 1800, avgDailyUsage: 200, reorderThreshold: 400 }
  }
};

// Doctors list for formatting detailed rosters
export const doctorProfiles = {
  'doc-1': { name: 'Dr. Sarah Connor', specialty: 'General Physician', avatar: 'SC' },
  'doc-2': { name: 'Dr. John Doe', specialty: 'Pediatrician', avatar: 'JD' },
  'doc-3': { name: 'Dr. Elena Rostova', specialty: 'Internal Medicine', avatar: 'ER' },
  'doc-4': { name: 'Dr. Raj Patel', specialty: 'Emergency Specialist', avatar: 'RP' },
  'doc-5': { name: 'Dr. Maya Lin', specialty: 'Cardiologist', avatar: 'ML' }
};

export const initialAttendance = {
  'c-1': [
    { doctorId: 'doc-1', checkedIn: true },
    { doctorId: 'doc-2', checkedIn: true },
    { doctorId: 'doc-3', checkedIn: false },
    { doctorId: 'doc-4', checkedIn: true }
  ],
  'c-2': [
    { doctorId: 'doc-2', checkedIn: true },
    { doctorId: 'doc-5', checkedIn: false }
  ],
  'c-3': [
    { doctorId: 'doc-1', checkedIn: false },
    { doctorId: 'doc-3', checkedIn: true },
    { doctorId: 'doc-4', checkedIn: false }
  ],
  'c-4': [
    { doctorId: 'doc-3', checkedIn: true },
    { doctorId: 'doc-4', checkedIn: true },
    { doctorId: 'doc-5', checkedIn: true }
  ],
  'c-5': [
    { doctorId: 'doc-2', checkedIn: true },
    { doctorId: 'doc-1', checkedIn: false }
  ]
};

// Generate 30 days of footfall records
const generateFootfallData = (baseCount) => {
  const data = {};
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Create random variance, lower on weekends
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const factor = isWeekend ? 0.4 : 1.0;
    const variance = (Math.random() * 0.4 - 0.2) + 1; // +/- 20%
    data[dateStr] = { patientCount: Math.round(baseCount * factor * variance) };
  }
  return data;
};

export const initialFootfall = {
  'c-1': generateFootfallData(140),
  'c-2': generateFootfallData(45),
  'c-3': generateFootfallData(25),
  'c-4': generateFootfallData(75),
  'c-5': generateFootfallData(35)
};

export const testAvailability = {
  'c-1': [
    { name: 'Malaria Rapid Test', status: 'available' },
    { name: 'Dengue NS1 Antigen', status: 'available' },
    { name: 'Tuberculosis RT-PCR', status: 'available' },
    { name: 'COVID-19 Ag Rapid', status: 'available' },
    { name: 'Complete Blood Count', status: 'available' }
  ],
  'c-2': [
    { name: 'Malaria Rapid Test', status: 'available' },
    { name: 'Dengue NS1 Antigen', status: 'unavailable' },
    { name: 'COVID-19 Ag Rapid', status: 'available' }
  ],
  'c-3': [
    { name: 'Malaria Rapid Test', status: 'available' },
    { name: 'Dengue NS1 Antigen', status: 'unavailable' },
    { name: 'COVID-19 Ag Rapid', status: 'unavailable' },
    { name: 'Complete Blood Count', status: 'unavailable' }
  ],
  'c-4': [
    { name: 'Malaria Rapid Test', status: 'available' },
    { name: 'Dengue NS1 Antigen', status: 'available' },
    { name: 'Tuberculosis RT-PCR', status: 'unavailable' },
    { name: 'COVID-19 Ag Rapid', status: 'available' }
  ],
  'c-5': [
    { name: 'Malaria Rapid Test', status: 'available' },
    { name: 'Dengue NS1 Antigen', status: 'available' },
    { name: 'COVID-19 Ag Rapid', status: 'available' }
  ]
};

// Simulation Store representing the "Firestore Database" in RAM
class LiveMockDatabase {
  constructor() {
    this.centres = { ...initialCentres };
    this.stock = JSON.parse(JSON.stringify(initialStock));
    this.attendance = JSON.parse(JSON.stringify(initialAttendance));
    this.footfall = JSON.parse(JSON.stringify(initialFootfall));
    this.tests = JSON.parse(JSON.stringify(testAvailability));

    this.listeners = {
      centres: [],
      stock: {},
      attendance: {},
      footfall: {},
      tests: {}
    };

    this.startSimulation();
  }

  // Trigger snapshot updates
  notify(type, key) {
    if (type === 'centres') {
      this.listeners.centres.forEach(cb => cb(Object.values(this.centres)));
    } else if (type === 'stock' && this.listeners.stock[key]) {
      this.listeners.stock[key].forEach(cb => cb(Object.values(this.stock[key] || {})));
    } else if (type === 'attendance' && this.listeners.attendance[key]) {
      this.listeners.attendance[key].forEach(cb => cb(this.attendance[key] || []));
    } else if (type === 'footfall' && this.listeners.footfall[key]) {
      this.listeners.footfall[key].forEach(cb => cb(this.footfall[key] || {}));
    } else if (type === 'tests' && this.listeners.tests[key]) {
      this.listeners.tests[key].forEach(cb => cb(this.tests[key] || []));
    }
  }

  subscribe(type, key, callback) {
    if (type === 'centres') {
      this.listeners.centres.push(callback);
      // Immediate call
      callback(Object.values(this.centres));
      return () => {
        this.listeners.centres = this.listeners.centres.filter(cb => cb !== callback);
      };
    }

    if (!this.listeners[type][key]) {
      this.listeners[type][key] = [];
    }
    this.listeners[type][key].push(callback);

    // Initial load
    if (type === 'stock') callback(Object.values(this.stock[key] || {}));
    if (type === 'attendance') callback(this.attendance[key] || []);
    if (type === 'footfall') callback(this.footfall[key] || {});
    if (type === 'tests') callback(this.tests[key] || []);

    return () => {
      this.listeners[type][key] = this.listeners[type][key].filter(cb => cb !== callback);
    };
  }

  startSimulation() {
    // Modify values every 5 seconds to simulate real-time patient footfall / doctor check-ins
    this.intervalId = setInterval(() => {
      const todayStr = new Date().toISOString().split('T')[0];
      
      // Randomly change patient footfall for one centre
      const cKeys = Object.keys(this.centres);
      const randomCentreId = cKeys[Math.floor(Math.random() * cKeys.length)];
      
      if (this.footfall[randomCentreId] && this.footfall[randomCentreId][todayStr]) {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        this.footfall[randomCentreId][todayStr].patientCount = Math.max(0, this.footfall[randomCentreId][todayStr].patientCount + delta);
        this.notify('footfall', randomCentreId);
      }

      // Randomly toggle a doctor check-in status
      const randomAttendanceCentre = cKeys[Math.floor(Math.random() * cKeys.length)];
      const docRecords = this.attendance[randomAttendanceCentre];
      if (docRecords && docRecords.length > 0) {
        const randomDocIdx = Math.floor(Math.random() * docRecords.length);
        docRecords[randomDocIdx].checkedIn = !docRecords[randomDocIdx].checkedIn;
        this.notify('attendance', randomAttendanceCentre);
      }

      // Randomly adjust stock level of Paracetamol or Syringes
      const randomStockCentre = cKeys[Math.floor(Math.random() * cKeys.length)];
      const centreStock = this.stock[randomStockCentre];
      if (centreStock) {
        const items = Object.keys(centreStock);
        const randomItemKey = items[Math.floor(Math.random() * items.length)];
        const item = centreStock[randomItemKey];
        // Consume stock
        const consumption = Math.round(item.avgDailyUsage * 0.1);
        item.currentStock = Math.max(0, item.currentStock - consumption);
        
        // Randomly simulate delivery / replenishment
        if (Math.random() > 0.85) {
          item.currentStock += Math.round(item.avgDailyUsage * 10);
        }
        
        this.notify('stock', randomStockCentre);
      }

      // Slightly fluctuate bed occupancy
      const randomBedCentre = this.centres[randomCentreId];
      if (randomBedCentre) {
        const deltaBed = Math.floor(Math.random() * 3) - 1; // -1 to +1
        randomBedCentre.occupiedBeds = Math.min(
          randomBedCentre.totalBeds,
          Math.max(0, randomBedCentre.occupiedBeds + deltaBed)
        );
        this.notify('centres');
      }

    }, 6000);
  }

  stopSimulation() {
    clearInterval(this.intervalId);
  }
}

export const liveMockDb = new LiveMockDatabase();
