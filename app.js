// AURA Healthcare - Core Frontend and Database Simulator Engine

// ==========================================
// 1. DEFAULT DATA CONFIGURATION
// ==========================================

const DEFAULT_HOSPITALS = [
  {
    id: "hospital_1",
    name: "St. Jude General Hospital",
    patientCount: 180,
    beds: { total: 250, occupied: 180, available: 70 },
    doctors: { total: 45, present: 38, attendanceRate: 84.4 },
    medicines: [
      {
        name: "Paracetamol 500mg",
        currentStock: 1200,
        unit: "tablets",
        reorderLevel: 500,
        dailyUsage: 85.0,
        usageHistory: [
          { date: "2026-06-26", quantity: 80 },
          { date: "2026-06-27", quantity: 85 },
          { date: "2026-06-28", quantity: 90 },
          { date: "2026-06-29", quantity: 75 },
          { date: "2026-06-30", quantity: 88 },
          { date: "2026-07-01", quantity: 92 },
          { date: "2026-07-02", quantity: 85 }
        ]
      },
      {
        name: "Amoxicillin 500mg",
        currentStock: 150,
        unit: "tablets",
        reorderLevel: 200,
        dailyUsage: 30.0,
        usageHistory: [
          { date: "2026-06-26", quantity: 25 },
          { date: "2026-06-27", quantity: 30 },
          { date: "2026-06-28", quantity: 28 },
          { date: "2026-06-29", quantity: 35 },
          { date: "2026-06-30", quantity: 32 },
          { date: "2026-07-01", quantity: 30 },
          { date: "2026-07-02", quantity: 29 }
        ]
      },
      {
        name: "Insulin Glargine 100 U/mL",
        currentStock: 80,
        unit: "vials",
        reorderLevel: 50,
        dailyUsage: 12.3,
        usageHistory: [
          { date: "2026-06-26", quantity: 12 },
          { date: "2026-06-27", quantity: 10 },
          { date: "2026-06-28", quantity: 15 },
          { date: "2026-06-29", quantity: 11 },
          { date: "2026-06-30", quantity: 14 },
          { date: "2026-07-01", quantity: 13 },
          { date: "2026-07-02", quantity: 12 }
        ]
      },
      {
        name: "Ibuprofen 400mg",
        currentStock: 900,
        unit: "tablets",
        reorderLevel: 300,
        dailyUsage: 49.6,
        usageHistory: [
          { date: "2026-06-26", quantity: 50 },
          { date: "2026-06-27", quantity: 45 },
          { date: "2026-06-28", quantity: 52 },
          { date: "2026-06-29", quantity: 48 },
          { date: "2026-06-30", quantity: 55 },
          { date: "2026-07-01", quantity: 47 },
          { date: "2026-07-02", quantity: 50 }
        ]
      },
      {
        name: "Atorvastatin 20mg",
        currentStock: 600,
        unit: "tablets",
        reorderLevel: 150,
        dailyUsage: 21.7,
        usageHistory: [
          { date: "2026-06-26", quantity: 20 },
          { date: "2026-06-27", quantity: 22 },
          { date: "2026-06-28", quantity: 21 },
          { date: "2026-06-29", quantity: 19 },
          { date: "2026-06-30", quantity: 25 },
          { date: "2026-07-01", quantity: 23 },
          { date: "2026-07-02", quantity: 22 }
        ]
      }
    ]
  },
  {
    id: "hospital_2",
    name: "Metro Health Medical Center",
    patientCount: 420,
    beds: { total: 500, occupied: 420, available: 80 },
    doctors: { total: 120, present: 105, attendanceRate: 87.5 },
    medicines: [
      {
        name: "Paracetamol 500mg",
        currentStock: 3000,
        unit: "tablets",
        reorderLevel: 1000,
        dailyUsage: 205.7,
        usageHistory: [
          { date: "2026-06-26", quantity: 200 },
          { date: "2026-06-27", quantity: 210 },
          { date: "2026-06-28", quantity: 190 },
          { date: "2026-06-29", quantity: 220 },
          { date: "2026-06-30", quantity: 205 },
          { date: "2026-07-01", quantity: 215 },
          { date: "2026-07-02", quantity: 200 }
        ]
      },
      {
        name: "Metformin 500mg",
        currentStock: 450,
        unit: "tablets",
        reorderLevel: 500,
        dailyUsage: 85.0,
        usageHistory: [
          { date: "2026-06-26", quantity: 80 },
          { date: "2026-06-27", quantity: 85 },
          { date: "2026-06-28", quantity: 90 },
          { date: "2026-06-29", quantity: 75 },
          { date: "2026-06-30", quantity: 88 },
          { date: "2026-07-01", quantity: 92 },
          { date: "2026-07-02", quantity: 85 }
        ]
      },
      {
        name: "Amoxicillin 500mg",
        currentStock: 800,
        unit: "tablets",
        reorderLevel: 300,
        dailyUsage: 62.9,
        usageHistory: [
          { date: "2026-06-26", quantity: 60 },
          { date: "2026-06-27", quantity: 65 },
          { date: "2026-06-28", quantity: 58 },
          { date: "2026-06-29", quantity: 70 },
          { date: "2026-06-30", quantity: 62 },
          { date: "2026-07-01", quantity: 64 },
          { date: "2026-07-02", quantity: 61 }
        ]
      },
      {
        name: "Losartan 50mg",
        currentStock: 120,
        unit: "tablets",
        reorderLevel: 150,
        dailyUsage: 31.3,
        usageHistory: [
          { date: "2026-06-26", quantity: 30 },
          { date: "2026-06-27", quantity: 32 },
          { date: "2026-06-28", quantity: 28 },
          { date: "2026-06-29", quantity: 35 },
          { date: "2026-06-30", quantity: 31 },
          { date: "2026-07-01", quantity: 33 },
          { date: "2026-07-02", quantity: 30 }
        ]
      },
      {
        name: "Azithromycin 250mg",
        currentStock: 400,
        unit: "tablets",
        reorderLevel: 200,
        dailyUsage: 41.6,
        usageHistory: [
          { date: "2026-06-26", quantity: 40 },
          { date: "2026-06-27", quantity: 45 },
          { date: "2026-06-28", quantity: 38 },
          { date: "2026-06-29", quantity: 42 },
          { date: "2026-06-30", quantity: 41 },
          { date: "2026-07-01", quantity: 44 },
          { date: "2026-07-02", quantity: 40 }
        ]
      }
    ]
  },
  {
    id: "hospital_3",
    name: "City Children's Clinic",
    patientCount: 45,
    beds: { total: 100, occupied: 45, available: 55 },
    doctors: { total: 25, present: 22, attendanceRate: 88.0 },
    medicines: [
      {
        name: "Pediatric Paracetamol Syrup",
        currentStock: 80,
        unit: "bottles",
        reorderLevel: 50,
        dailyUsage: 15.9,
        usageHistory: [
          { date: "2026-06-26", quantity: 15 },
          { date: "2026-06-27", quantity: 18 },
          { date: "2026-06-28", quantity: 14 },
          { date: "2026-06-29", quantity: 16 },
          { date: "2026-06-30", quantity: 17 },
          { date: "2026-07-01", quantity: 15 },
          { date: "2026-07-02", quantity: 16 }
        ]
      },
      {
        name: "Amoxicillin Suspension 250mg/5mL",
        currentStock: 250,
        unit: "bottles",
        reorderLevel: 100,
        dailyUsage: 12.7,
        usageHistory: [
          { date: "2026-06-26", quantity: 12 },
          { date: "2026-06-27", quantity: 14 },
          { date: "2026-06-28", quantity: 11 },
          { date: "2026-06-29", quantity: 15 },
          { date: "2026-06-30", quantity: 13 },
          { date: "2026-07-01", quantity: 12 },
          { date: "2026-07-02", quantity: 13 }
        ]
      },
      {
        name: "Salbutamol Inhaler 100mcg",
        currentStock: 35,
        unit: "inhalers",
        reorderLevel: 30,
        dailyUsage: 8.4,
        usageHistory: [
          { date: "2026-06-26", quantity: 8 },
          { date: "2026-06-27", quantity: 9 },
          { date: "2026-06-28", quantity: 7 },
          { date: "2026-06-29", quantity: 10 },
          { date: "2026-06-30", quantity: 8 },
          { date: "2026-07-01", quantity: 9 },
          { date: "2026-07-02", quantity: 8 }
        ]
      },
      {
        name: "Multivitamin Liquid",
        currentStock: 600,
        unit: "bottles",
        reorderLevel: 150,
        dailyUsage: 31.3,
        usageHistory: [
          { date: "2026-06-26", quantity: 30 },
          { date: "2026-06-27", quantity: 32 },
          { date: "2026-06-28", quantity: 28 },
          { date: "2026-06-29", quantity: 35 },
          { date: "2026-06-30", quantity: 31 },
          { date: "2026-07-01", quantity: 33 },
          { date: "2026-07-02", quantity: 30 }
        ]
      }
    ]
  },
  {
    id: "hospital_4",
    name: "Hope Psychiatric Hospital",
    patientCount: 135,
    beds: { total: 150, occupied: 135, available: 15 },
    doctors: { total: 30, present: 25, attendanceRate: 83.3 },
    medicines: [
      {
        name: "Sertraline 50mg",
        currentStock: 950,
        unit: "tablets",
        reorderLevel: 300,
        dailyUsage: 47.0,
        usageHistory: [
          { date: "2026-06-26", quantity: 45 },
          { date: "2026-06-27", quantity: 48 },
          { date: "2026-06-28", quantity: 50 },
          { date: "2026-06-29", quantity: 44 },
          { date: "2026-06-30", quantity: 47 },
          { date: "2026-07-01", quantity: 49 },
          { date: "2026-07-02", quantity: 46 }
        ]
      },
      {
        name: "Fluoxetine 20mg",
        currentStock: 180,
        unit: "tablets",
        reorderLevel: 200,
        dailyUsage: 24.9,
        usageHistory: [
          { date: "2026-06-26", quantity: 25 },
          { date: "2026-06-27", quantity: 22 },
          { date: "2026-06-28", quantity: 26 },
          { date: "2026-06-29", quantity: 24 },
          { date: "2026-06-30", quantity: 28 },
          { date: "2026-07-01", quantity: 23 },
          { date: "2026-07-02", quantity: 25 }
        ]
      },
      {
        name: "Lorazepam 1mg",
        currentStock: 40,
        unit: "tablets",
        reorderLevel: 50,
        dailyUsage: 12.7,
        usageHistory: [
          { date: "2026-06-26", quantity: 12 },
          { date: "2026-06-27", quantity: 14 },
          { date: "2026-06-28", quantity: 11 },
          { date: "2026-06-29", quantity: 15 },
          { date: "2026-06-30", quantity: 13 },
          { date: "2026-07-01", quantity: 12 },
          { date: "2026-07-02", quantity: 13 }
        ]
      },
      {
        name: "Risperidone 2mg",
        currentStock: 500,
        unit: "tablets",
        reorderLevel: 100,
        dailyUsage: 21.7,
        usageHistory: [
          { date: "2026-06-26", quantity: 20 },
          { date: "2026-06-27", quantity: 22 },
          { date: "2026-06-28", quantity: 21 },
          { date: "2026-06-29", quantity: 19 },
          { date: "2026-06-30", quantity: 25 },
          { date: "2026-07-01", quantity: 23 },
          { date: "2026-07-02", quantity: 22 }
        ]
      }
    ]
  },
  {
    id: "hospital_5",
    name: "Grace Maternity & Surgical Center",
    patientCount: 160,
    beds: { total: 200, occupied: 160, available: 40 },
    doctors: { total: 50, present: 47, attendanceRate: 94.0 },
    medicines: [
      {
        name: "Oxytocin 10 IU/mL",
        currentStock: 120,
        unit: "ampoules",
        reorderLevel: 100,
        dailyUsage: 38.4,
        usageHistory: [
          { date: "2026-06-26", quantity: 35 },
          { date: "2026-06-27", quantity: 40 },
          { date: "2026-06-28", quantity: 38 },
          { date: "2026-06-29", quantity: 42 },
          { date: "2026-06-30", quantity: 37 },
          { date: "2026-07-01", quantity: 39 },
          { date: "2026-07-02", quantity: 38 }
        ]
      },
      {
        name: "Folic Acid 5mg",
        currentStock: 1500,
        unit: "tablets",
        reorderLevel: 500,
        dailyUsage: 74.6,
        usageHistory: [
          { date: "2026-06-26", quantity: 70 },
          { date: "2026-06-27", quantity: 75 },
          { date: "2026-06-28", quantity: 72 },
          { date: "2026-06-29", quantity: 78 },
          { date: "2026-06-30", quantity: 74 },
          { date: "2026-07-01", quantity: 76 },
          { date: "2026-07-02", quantity: 73 }
        ]
      },
      {
        name: "Cefazolin 1g",
        currentStock: 300,
        unit: "vials",
        reorderLevel: 250,
        dailyUsage: 47.0,
        usageHistory: [
          { date: "2026-06-26", quantity: 45 },
          { date: "2026-06-27", quantity: 48 },
          { date: "2026-06-28", quantity: 50 },
          { date: "2026-06-29", quantity: 44 },
          { date: "2026-06-30", quantity: 47 },
          { date: "2026-07-01", quantity: 49 },
          { date: "2026-07-02", quantity: 46 }
        ]
      },
      {
        name: "Morphine Injection 10mg/mL",
        currentStock: 90,
        unit: "ampoules",
        reorderLevel: 30,
        dailyUsage: 9.3,
        usageHistory: [
          { date: "2026-06-26", quantity: 8 },
          { date: "2026-06-27", quantity: 10 },
          { date: "2026-06-28", quantity: 9 },
          { date: "2026-06-29", quantity: 11 },
          { date: "2026-06-30", quantity: 8 },
          { date: "2026-07-01", quantity: 10 },
          { date: "2026-07-02", quantity: 9 }
        ]
      }
    ]
  }
];

// ==========================================
// 2. STATE MANAGEMENT & CONNECTIVITY
// ==========================================

let appState = {
  hospitals: [],
  selectedHospitalId: "hospital_1",
  activeFilter: "all", // "all", "critical", "warning"
  currentDate: new Date("2026-07-03"),
  isFirebaseConnected: false,
  firebaseConfig: null,
  db: null // Firestore instance if connected
};

// DOM Elements
const dom = {
  systemDate: document.getElementById("current-system-date"),
  hospitalTabs: document.getElementById("hospital-tabs-list"),
  
  // Summary Stats
  netPatients: document.getElementById("net-patients"),
  netBeds: document.getElementById("net-beds"),
  netCritical: document.getElementById("net-critical"),
  
  // Circular gauge / stats
  bedsRadial: document.getElementById("beds-radial-progress"),
  bedsPercent: document.getElementById("beds-percent-val"),
  bedsOccupied: document.getElementById("beds-occupied-val"),
  bedsAvailable: document.getElementById("beds-available-val"),
  bedsTotal: document.getElementById("beds-total-val"),
  
  // Doctor attendance
  docRate: document.getElementById("doctors-attendance-rate"),
  docPresent: document.getElementById("doctors-present"),
  docTotal: document.getElementById("doctors-total"),
  docStatus: document.getElementById("doctors-status"),
  
  // Patient details
  patientCount: document.getElementById("patients-count"),
  todaySpark: document.getElementById("today-spark-bar"),
  
  // Table
  tableBody: document.getElementById("inventory-table-body"),
  filterAll: document.getElementById("btn-filter-all"),
  filterCritical: document.getElementById("btn-filter-critical"),
  filterWarning: document.getElementById("btn-filter-warning"),
  
  // Console
  consoleLogs: document.getElementById("console-logs"),
  btnClearConsole: document.getElementById("btn-clear-console"),
  
  // Buttons
  btnSimulate: document.getElementById("btn-simulate-day"),
  btnPredict: document.getElementById("btn-run-predictions"),
  btnOpenRestock: document.getElementById("btn-open-restock"),
  
  // Modals
  modalConfig: document.getElementById("modal-firebase-config"),
  btnOpenConfig: document.getElementById("btn-open-config"),
  btnCloseConfig: document.getElementById("btn-close-config"),
  btnSaveConfig: document.getElementById("btn-save-firebase-config"),
  btnDisconnect: document.getElementById("btn-disconnect-firebase"),
  fbStatusBadge: document.getElementById("fb-status-badge"),
  
  modalRestock: document.getElementById("modal-restock"),
  btnCloseRestock: document.getElementById("btn-close-restock"),
  btnCancelRestock: document.getElementById("btn-cancel-restock"),
  btnConfirmRestock: document.getElementById("btn-confirm-restock"),
  selectRestockHospital: document.getElementById("restock-hospital-select"),
  selectRestockMedicine: document.getElementById("restock-medicine-select"),
  inputRestockQty: document.getElementById("restock-quantity"),
  
  // Inputs
  apiKeyInput: document.getElementById("fb-api-key"),
  projIdInput: document.getElementById("fb-project-id"),
  authDomInput: document.getElementById("fb-auth-domain"),
  appIdInput: document.getElementById("fb-app-id")
};

// ==========================================
// 3. LOGGER HELPER
// ==========================================

function log(message, type = "system") {
  const time = new Date().toLocaleTimeString();
  const line = document.createElement("div");
  line.className = `log-line ${type}-line`;
  line.innerHTML = `[${time}] ${message}`;
  dom.consoleLogs.appendChild(line);
  dom.consoleLogs.scrollTop = dom.consoleLogs.scrollHeight;
}

// ==========================================
// 4. STORAGE & DATABASE SIMULATOR (LOCAL STORAGE)
// ==========================================

const LOCAL_STORE_KEY = "aura_mock_firestore_db";

function loadLocalSimulatorData() {
  const raw = localStorage.getItem(LOCAL_STORE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Local data parse error", e);
    }
  }
  // Initialize with defaults if empty
  localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(DEFAULT_HOSPITALS));
  return JSON.parse(JSON.stringify(DEFAULT_HOSPITALS));
}

function saveLocalSimulatorData(data) {
  localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(data));
}

// ==========================================
// 5. DATABASE SYNC ENGINE (DUAL SIMULATOR / FIREBASE)
// ==========================================

async function fetchDatabase() {
  if (appState.isFirebaseConnected) {
    try {
      const snap = await appState.db.collection("hospitals").get();
      let hospitals = [];
      for (const doc of snap.docs) {
        const hospitalData = doc.data();
        hospitalData.id = doc.id;
        
        // Fetch subcollection medicines
        const medSnap = await doc.ref.collection("medicines").get();
        hospitalData.medicines = medSnap.docs.map(mDoc => {
          const mData = mDoc.data();
          mData.id = mDoc.id;
          return mData;
        });
        hospitals.push(hospitalData);
      }
      // Sort hospitals by ID to keep order
      hospitals.sort((a,b) => a.id.localeCompare(b.id));
      appState.hospitals = hospitals;
      log("Data successfully synced from live Firestore database.", "success");
    } catch (error) {
      log(`Firebase Sync Error: ${error.message}. Reverting to Simulator Mode.`, "error");
      disconnectFirebase();
    }
  } else {
    // Simulator Mode
    appState.hospitals = loadLocalSimulatorData();
  }
  
  updateGlobalStats();
  renderDashboard();
}

async function saveHospitalDoc(hospitalId, hospitalData, medicines = []) {
  if (appState.isFirebaseConnected) {
    try {
      const { id, medicines: omitMeds, ...dataToSave } = hospitalData;
      await appState.db.collection("hospitals").doc(hospitalId).set({
        ...dataToSave,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      // Update medicines
      const batch = appState.db.batch();
      medicines.forEach(med => {
        const medRef = appState.db.collection("hospitals").doc(hospitalId).collection("medicines").doc(med.id);
        const { id: mId, ...medData } = med;
        batch.set(medRef, medData, { merge: true });
      });
      await batch.commit();
    } catch (e) {
      log(`Firebase update failure: ${e.message}`, "error");
    }
  } else {
    // Simulator write
    const hIndex = appState.hospitals.findIndex(h => h.id === hospitalId);
    if (hIndex > -1) {
      const curMeds = appState.hospitals[hIndex].medicines;
      appState.hospitals[hIndex] = {
        ...appState.hospitals[hIndex],
        ...hospitalData
      };
      // Merge medicines
      if (medicines.length > 0) {
        medicines.forEach(newMed => {
          const mIdx = curMeds.findIndex(m => m.name === newMed.name);
          if (mIdx > -1) {
            curMeds[mIdx] = { ...curMeds[mIdx], ...newMed };
          }
        });
      }
      appState.hospitals[hIndex].medicines = curMeds;
      saveLocalSimulatorData(appState.hospitals);
    }
  }
}

// Seed Remote Firebase Database
async function seedRemoteFirestore() {
  if (!appState.isFirebaseConnected) return;
  log("Seeding remote Firestore database...", "system");
  try {
    for (const hospital of DEFAULT_HOSPITALS) {
      const { id, name, patientCount, beds, doctors, medicines } = hospital;
      const hospitalRef = appState.db.collection("hospitals").doc(id);

      await hospitalRef.set({
        name,
        patientCount,
        beds,
        doctors,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      });

      for (let i = 0; i < medicines.length; i++) {
        const med = medicines[i];
        const medicineId = `med_${id}_${i + 1}`;
        
        let totalUsage = med.usageHistory.reduce((sum, item) => sum + item.quantity, 0);
        let avgUsage = Number((totalUsage / med.usageHistory.length).toFixed(2));
        let predictedDays = Number((med.currentStock / avgUsage).toFixed(1));
        
        let status = "NORMAL";
        if (predictedDays <= 3) status = "CRITICAL";
        else if (predictedDays <= 7) status = "WARNING";
        else if (med.currentStock <= med.reorderLevel) status = "REORDER";

        await hospitalRef.collection("medicines").doc(medicineId).set({
          name: med.name,
          currentStock: med.currentStock,
          unit: med.unit,
          reorderLevel: med.reorderLevel,
          dailyUsage: avgUsage,
          usageHistory: med.usageHistory,
          predictedStockOutDays: predictedDays,
          status: status,
          lastPredicted: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
      log(`Remote Seeding successful for: ${name}`, "success");
    }
    log("Remote database seeding completed successfully!", "success");
    await fetchDatabase();
  } catch (error) {
    log(`Seeding failed: ${error.message}`, "error");
  }
}

// ==========================================
// 6. FIREBASE CONNECTIVITY DRAWER
// ==========================================

function loadFirebaseConfig() {
  const config = localStorage.getItem("aura_firebase_config");
  if (config) {
    try {
      const parsed = JSON.parse(config);
      dom.apiKeyInput.value = parsed.apiKey || "";
      dom.projIdInput.value = parsed.projectId || "";
      dom.authDomInput.value = parsed.authDomain || "";
      dom.appIdInput.value = parsed.appId || "";
      return parsed;
    } catch(e) {}
  }
  return null;
}

function connectFirebase(config) {
  try {
    // Prevent re-initialization if already connected
    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);
    }
    appState.db = firebase.firestore();
    appState.isFirebaseConnected = true;
    appState.firebaseConfig = config;
    localStorage.setItem("aura_firebase_config", JSON.stringify(config));
    
    // UI Update
    dom.fbStatusBadge.className = "badge badge-online";
    dom.fbStatusBadge.innerText = "Firestore Connected";
    
    // Add "Seed Firestore" option to Sidebar connection card
    const card = document.getElementById("fb-connection-card");
    const desc = card.querySelector(".widget-desc");
    desc.innerText = `Connected to ${config.projectId}. Remote data loaded.`;
    
    let seedBtn = document.getElementById("btn-seed-firestore");
    if (!seedBtn) {
      seedBtn = document.createElement("button");
      seedBtn.id = "btn-seed-firestore";
      seedBtn.className = "btn btn-accent btn-block";
      seedBtn.style.marginTop = "8px";
      seedBtn.innerHTML = "<span class='btn-icon'>🌱</span> Seed Remote DB";
      seedBtn.onclick = seedRemoteFirestore;
      card.appendChild(seedBtn);
    }
    
    log(`Connected to Firebase project: ${config.projectId}`, "success");
    fetchDatabase();
  } catch (e) {
    log(`Connection failed: ${e.message}`, "error");
    disconnectFirebase();
  }
}

function disconnectFirebase() {
  appState.isFirebaseConnected = false;
  appState.db = null;
  
  dom.fbStatusBadge.className = "badge badge-offline";
  dom.fbStatusBadge.innerText = "Simulator Mode";
  
  const card = document.getElementById("fb-connection-card");
  const desc = card.querySelector(".widget-desc");
  desc.innerText = "Running locally using local storage. Connect to a live Firestore database below.";
  
  const seedBtn = document.getElementById("btn-seed-firestore");
  if (seedBtn) seedBtn.remove();
  
  log("Switched back to local Database Simulator mode.", "system");
  fetchDatabase();
}

// ==========================================
// 7. PREDICTION ALGORITHM & STATS COMPILATION
// ==========================================

function runPredictiveCalculations() {
  log("Triggering stock-out prediction pipeline...", "predict");
  
  let totalProcessed = 0;
  let criticalCount = 0;
  let warningCount = 0;
  let reorderCount = 0;
  
  appState.hospitals.forEach(hospital => {
    let hCritical = 0;
    let hWarning = 0;
    let hReorder = 0;
    
    hospital.medicines.forEach(med => {
      // Calculate 7-day average daily usage
      const recentUsage = med.usageHistory.slice(-7);
      const totalUsage = recentUsage.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const avgUsage = recentUsage.length > 0 ? Number((totalUsage / recentUsage.length).toFixed(2)) : 0;
      
      let predictedDays = 999;
      let status = "NORMAL";
      
      if (avgUsage > 0) {
        predictedDays = Number((med.currentStock / avgUsage).toFixed(1));
        
        if (predictedDays <= 3) {
          status = "CRITICAL";
          hCritical++;
          criticalCount++;
        } else if (predictedDays <= 7) {
          status = "WARNING";
          hWarning++;
          warningCount++;
        } else if (med.currentStock <= med.reorderLevel) {
          status = "REORDER";
          hReorder++;
          reorderCount++;
        }
      } else {
        if (med.currentStock <= med.reorderLevel) {
          status = "REORDER";
          hReorder++;
          reorderCount++;
        }
      }
      
      med.dailyUsage = avgUsage;
      med.predictedStockOutDays = predictedDays;
      med.status = status;
      totalProcessed++;
    });
    
    hospital.criticalAlertsCount = hCritical;
    hospital.warningAlertsCount = hWarning;
    hospital.reorderAlertsCount = hReorder;
    
    // Save locally or to remote
    saveHospitalDoc(hospital.id, hospital, hospital.medicines);
  });
  
  log(`Analysis Complete. Checked ${totalProcessed} medicines across ${appState.hospitals.length} facilities.`, "success");
  log(`Results: ${criticalCount} Critical, ${warningCount} Warning, ${reorderCount} below Reorder level.`, "predict");
  
  updateGlobalStats();
  renderDashboard();
}

function updateGlobalStats() {
  let netP = 0;
  let netBO = 0;
  let netBT = 0;
  let netCrit = 0;
  
  appState.hospitals.forEach(h => {
    netP += h.patientCount || 0;
    netBO += h.beds ? h.beds.occupied : 0;
    netBT += h.beds ? h.beds.total : 0;
    
    // Sum critical medicines
    if (h.medicines) {
      h.medicines.forEach(m => {
        if (m.status === "CRITICAL") netCrit++;
      });
    }
  });
  
  dom.netPatients.innerText = netP;
  dom.netBeds.innerText = `${netBO} / ${netBT}`;
  dom.netCritical.innerText = netCrit;
  
  if (netCrit > 0) {
    dom.netCritical.className = "stat-val alert-pulse-red";
  } else {
    dom.netCritical.className = "stat-val";
  }
}

// ==========================================
// 8. SIMULATION ENGINE ACTIONS
// ==========================================

function simulateOneDay() {
  // Advance date
  appState.currentDate.setDate(appState.currentDate.getDate() + 1);
  const dateStr = appState.currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  dom.systemDate.innerText = `System Date: ${dateStr}`;
  
  log(`--- Simulation Day: ${dateStr} ---`, "sim");
  
  const todayISO = appState.currentDate.toISOString().split("T")[0];
  
  appState.hospitals.forEach(hospital => {
    // 1. Simulate Patient fluctuations (+/- 5% with some random drift)
    const patientDrift = Math.round((Math.random() - 0.5) * 12);
    hospital.patientCount = Math.max(10, hospital.patientCount + patientDrift);
    
    // Ensure patient count stays within bed capacity bounds
    hospital.patientCount = Math.min(hospital.beds.total, hospital.patientCount);
    hospital.beds.occupied = hospital.patientCount;
    hospital.beds.available = hospital.beds.total - hospital.beds.occupied;
    
    // 2. Simulate Doctor attendance fluctuations
    const docDiff = Math.round((Math.random() - 0.5) * 4);
    hospital.doctors.present = Math.max(Math.ceil(hospital.doctors.total * 0.6), Math.min(hospital.doctors.total, hospital.doctors.present + docDiff));
    hospital.doctors.attendanceRate = Number(((hospital.doctors.present / hospital.doctors.total) * 100).toFixed(1));
    
    // 3. Simulate Medicine usage based on patient count and previous rate + random variance (+/- 15%)
    let stockoutMedicines = [];
    
    hospital.medicines.forEach(med => {
      // Base daily usage is scaled to the patient load relative to initial hospital capacity
      const usageScaling = hospital.patientCount / (hospital.beds.total * 0.7); // normal occupancy scaling
      const baseConsumption = (med.dailyUsage || 15) * usageScaling;
      const variance = 1 + (Math.random() - 0.5) * 0.3; // +/- 15% noise
      const consumed = Math.round(baseConsumption * variance);
      
      // Update stock
      med.currentStock = Math.max(0, med.currentStock - consumed);
      
      // Log consumption log
      if (med.currentStock === 0) {
        stockoutMedicines.push(med.name);
      }
      
      // Log current usage to history (keeping recent 7 days)
      med.usageHistory.shift();
      med.usageHistory.push({ date: todayISO, quantity: consumed });
    });
    
    if (stockoutMedicines.length > 0) {
      log(`⚠️ STOCKOUT at ${hospital.name}: ${stockoutMedicines.join(", ")} is empty!`, "error");
    }
    
    // Save update
    saveHospitalDoc(hospital.id, hospital, hospital.medicines);
  });
  
  log("Stocks decremented based on usage parameters. Recalculating forecasts.", "sim");
  runPredictiveCalculations();
}

function restockMedicine(hospitalId, medicineIndex, quantity) {
  const hospital = appState.hospitals.find(h => h.id === hospitalId);
  if (!hospital) return;
  
  const med = hospital.medicines[medicineIndex];
  if (!med) return;
  
  const prevStock = med.currentStock;
  med.currentStock += quantity;
  
  log(`📦 Restocked ${med.name} at ${hospital.name}: ${prevStock} ➔ ${med.currentStock} ${med.unit}.`, "success");
  
  saveHospitalDoc(hospital.id, hospital, [med]);
  runPredictiveCalculations();
}

// ==========================================
// 9. UI RENDERING & EVENT HANDLERS
// ==========================================

function renderDashboard() {
  const selectedHospital = appState.hospitals.find(h => h.id === appState.selectedHospitalId);
  if (!selectedHospital) return;
  
  // Render Hospital Tabs
  renderHospitalTabs();
  
  // Bed Availability Circular Progress Gauge
  const bedPercent = Math.round((selectedHospital.beds.occupied / selectedHospital.beds.total) * 100);
  dom.bedsRadial.style.setProperty("--percent", bedPercent);
  dom.bedsPercent.innerText = `${bedPercent}%`;
  dom.bedsOccupied.innerText = selectedHospital.beds.occupied;
  dom.bedsAvailable.innerText = selectedHospital.beds.available;
  dom.bedsTotal.innerText = selectedHospital.beds.total;
  
  // Update border styling depending on occupancy severity
  if (bedPercent > 90) {
    dom.bedsRadial.querySelector(".progress-bar-circle").style.stroke = "var(--alert-red)";
    dom.bedsRadial.querySelector(".progress-bar-circle").style.filter = "drop-shadow(0 0 6px var(--alert-red-glow))";
  } else if (bedPercent > 75) {
    dom.bedsRadial.querySelector(".progress-bar-circle").style.stroke = "var(--alert-orange)";
    dom.bedsRadial.querySelector(".progress-bar-circle").style.filter = "drop-shadow(0 0 6px var(--alert-orange-glow))";
  } else {
    dom.bedsRadial.querySelector(".progress-bar-circle").style.stroke = "var(--color-primary)";
    dom.bedsRadial.querySelector(".progress-bar-circle").style.filter = "drop-shadow(0 0 6px var(--color-primary-glow))";
  }
  
  // Doctor Attendance rate
  dom.docRate.innerText = `${selectedHospital.doctors.attendanceRate}%`;
  dom.docPresent.innerText = selectedHospital.doctors.present;
  dom.docTotal.innerText = selectedHospital.doctors.total;
  
  if (selectedHospital.doctors.attendanceRate >= 85) {
    dom.docStatus.innerText = "Optimal";
    dom.docStatus.className = "value badge badge-success";
  } else if (selectedHospital.doctors.attendanceRate >= 70) {
    dom.docStatus.innerText = "Warning";
    dom.docStatus.className = "value badge badge-warning";
  } else {
    dom.docStatus.innerText = "Critical";
    dom.docStatus.className = "value badge badge-danger";
  }
  
  // Active Inpatients
  dom.patientCount.innerText = selectedHospital.patientCount;
  // Modify spark bar height based on relative patient counts
  const relativePercent = Math.round((selectedHospital.patientCount / selectedHospital.beds.total) * 100);
  dom.todaySpark.style.height = `${Math.max(15, relativePercent)}%`;
  
  // Render Medicine Table
  renderMedicineTable(selectedHospital);
}

function renderHospitalTabs() {
  dom.hospitalTabs.innerHTML = "";
  appState.hospitals.forEach(h => {
    const tab = document.createElement("button");
    tab.className = `hospital-tab ${h.id === appState.selectedHospitalId ? "active" : ""}`;
    tab.onclick = () => {
      appState.selectedHospitalId = h.id;
      renderDashboard();
    };
    
    // Sum critical count
    let criticalCount = 0;
    if (h.medicines) {
      criticalCount = h.medicines.filter(m => m.status === "CRITICAL").length;
    }
    
    tab.innerHTML = `
      <h4>${h.name}</h4>
      <div class="tab-mini-metrics">
        <span>Beds: ${h.beds.occupied}/${h.beds.total}</span>
        ${criticalCount > 0 ? `<span class="alert alert-pulse-red">⚠️ ${criticalCount} Critical</span>` : `<span>All Clear</span>`}
      </div>
    `;
    dom.hospitalTabs.appendChild(tab);
  });
}

function renderMedicineTable(hospital) {
  dom.tableBody.innerHTML = "";
  
  if (!hospital.medicines || hospital.medicines.length === 0) {
    dom.tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No inventory records available.</td></tr>`;
    return;
  }
  
  let filteredMeds = hospital.medicines;
  if (appState.activeFilter === "critical") {
    filteredMeds = hospital.medicines.filter(m => m.status === "CRITICAL");
  } else if (appState.activeFilter === "warning") {
    filteredMeds = hospital.medicines.filter(m => m.status === "WARNING");
  }
  
  if (filteredMeds.length === 0) {
    dom.tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No items match this filter criteria.</td></tr>`;
    return;
  }
  
  filteredMeds.forEach((med, index) => {
    const tr = document.createElement("tr");
    
    // Status Badge Details
    let statusClass = "badge badge-success";
    if (med.status === "CRITICAL") statusClass = "badge badge-danger";
    else if (med.status === "WARNING") statusClass = "badge badge-warning";
    else if (med.status === "REORDER") statusClass = "badge badge-warning";
    
    // Progress Bar Details
    const stockPercent = Math.min(100, Math.round((med.currentStock / (med.reorderLevel * 2)) * 100));
    let fillClass = "stock-progress-fill fill-normal";
    if (med.status === "CRITICAL") fillClass = "stock-progress-fill fill-critical";
    else if (med.status === "WARNING" || med.status === "REORDER") fillClass = "stock-progress-fill fill-warning";
    
    // Days Remaining details
    let daysDisplay = med.predictedStockOutDays === 999 ? "∞ Days" : `${med.predictedStockOutDays} Days`;
    let daysClass = "days-left-cell";
    if (med.status === "CRITICAL") daysClass = "days-left-cell critical";
    else if (med.status === "WARNING") daysClass = "days-left-cell warning";
    else daysClass = "days-left-cell normal";
    
    tr.innerHTML = `
      <td><strong>${med.name}</strong></td>
      <td>
        <div class="stock-val-cell">
          <span>${med.currentStock} ${med.unit}</span>
          <div class="stock-progress-bar">
            <div class="${fillClass}" style="width: ${stockPercent}%"></div>
          </div>
        </div>
      </td>
      <td>${med.reorderLevel} ${med.unit}</td>
      <td>${med.dailyUsage} / day</td>
      <td class="${daysClass}">${daysDisplay}</td>
      <td><span class="${statusClass}">${med.status}</span></td>
    `;
    
    dom.tableBody.appendChild(tr);
  });
}

// Populate Restock Dropdowns
function populateRestockDropdowns() {
  dom.selectRestockHospital.innerHTML = "";
  dom.selectRestockMedicine.innerHTML = "";
  
  appState.hospitals.forEach(h => {
    const opt = document.createElement("option");
    opt.value = h.id;
    opt.innerText = h.name;
    dom.selectRestockHospital.appendChild(opt);
  });
  
  // Set change triggers
  dom.selectRestockHospital.onchange = (e) => {
    updateRestockMedicineOptions(e.target.value);
  };
  
  // Trigger initial populate
  if (appState.hospitals.length > 0) {
    updateRestockMedicineOptions(appState.hospitals[0].id);
  }
}

function updateRestockMedicineOptions(hospitalId) {
  dom.selectRestockMedicine.innerHTML = "";
  const hospital = appState.hospitals.find(h => h.id === hospitalId);
  if (!hospital || !hospital.medicines) return;
  
  hospital.medicines.forEach((med, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.innerText = `${med.name} (Current: ${med.currentStock})`;
    dom.selectRestockMedicine.appendChild(opt);
  });
}

// ==========================================
// 10. SETUP INITIALIZERS & LISTENERS
// ==========================================

function initApp() {
  // Load config if exists
  const savedConfig = loadFirebaseConfig();
  if (savedConfig) {
    log("Discovered saved Firebase config in browser storage.", "system");
    // Connect firebase
    connectFirebase(savedConfig);
  } else {
    // Simulator default
    log("No Firebase config found. Initializing Local Storage Database Emulator.", "system");
    fetchDatabase();
  }
  
  populateRestockDropdowns();
  
  // Setup filter buttons
  dom.filterAll.onclick = () => {
    appState.activeFilter = "all";
    dom.filterAll.classList.add("active");
    dom.filterCritical.classList.remove("active");
    dom.filterWarning.classList.remove("active");
    renderDashboard();
  };
  
  dom.filterCritical.onclick = () => {
    appState.activeFilter = "critical";
    dom.filterAll.classList.remove("active");
    dom.filterCritical.classList.add("active");
    dom.filterWarning.classList.remove("active");
    renderDashboard();
  };
  
  dom.filterWarning.onclick = () => {
    appState.activeFilter = "warning";
    dom.filterAll.classList.remove("active");
    dom.filterCritical.classList.remove("active");
    dom.filterWarning.classList.add("active");
    renderDashboard();
  };
  
  // Config Modal actions
  dom.btnOpenConfig.onclick = () => {
    dom.modalConfig.classList.add("show");
  };
  
  dom.btnCloseConfig.onclick = () => {
    dom.modalConfig.classList.remove("show");
  };
  
  dom.btnSaveConfig.onclick = () => {
    const apiKey = dom.apiKeyInput.value.trim();
    const projectId = dom.projIdInput.value.trim();
    const authDomain = dom.authDomInput.value.trim();
    const appId = dom.appIdInput.value.trim();
    
    if (!apiKey || !projectId || !authDomain || !appId) {
      log("Connection Error: All configuration fields are required.", "error");
      alert("Please fill in all config parameters to connect.");
      return;
    }
    
    const config = { apiKey, projectId, authDomain, appId };
    dom.modalConfig.classList.remove("show");
    connectFirebase(config);
  };
  
  dom.btnDisconnect.onclick = () => {
    localStorage.removeItem("aura_firebase_config");
    dom.modalConfig.classList.remove("show");
    dom.apiKeyInput.value = "";
    dom.projIdInput.value = "";
    dom.authDomInput.value = "";
    dom.appIdInput.value = "";
    disconnectFirebase();
  };
  
  // Restock Modal actions
  dom.btnOpenRestock.onclick = () => {
    populateRestockDropdowns();
    dom.modalRestock.classList.add("show");
  };
  
  dom.btnCloseRestock.onclick = () => {
    dom.modalRestock.classList.remove("show");
  };
  
  dom.btnCancelRestock.onclick = () => {
    dom.modalRestock.classList.remove("show");
  };
  
  dom.btnConfirmRestock.onclick = () => {
    const hId = dom.selectRestockHospital.value;
    const medIdx = parseInt(dom.selectRestockMedicine.value);
    const qty = parseInt(dom.inputRestockQty.value);
    
    if (isNaN(qty) || qty <= 0) {
      alert("Please enter a valid positive restocking quantity.");
      return;
    }
    
    restockMedicine(hId, medIdx, qty);
    dom.modalRestock.classList.remove("show");
  };
  
  // Simulation and predictions triggers
  dom.btnSimulate.onclick = () => {
    simulateOneDay();
  };
  
  dom.btnPredict.onclick = () => {
    runPredictiveCalculations();
  };
  
  dom.btnClearConsole.onclick = () => {
    dom.consoleLogs.innerHTML = "";
    log("Console log cleared.", "system");
  };
}

// Fire up dashboard when window loads
window.onload = initApp;
