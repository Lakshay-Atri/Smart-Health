/**
 * Seeding Script for Healthcare Firebase Database
 * 
 * This script runs locally using Node.js. It requires:
 * 1. The Firebase Admin SDK ('firebase-admin' npm package)
 * 2. A Service Account Key JSON file from the Firebase Console (Settings > Service accounts)
 * 
 * Usage:
 *   export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account.json"
 *   node seed-script.js
 */

const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
// If GOOGLE_APPLICATION_CREDENTIALS environment variable is set, it will load it automatically.
// Otherwise, it falls back to emulator mode if FIRESTORE_EMULATOR_HOST is set.
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  } else if (process.env.FIRESTORE_EMULATOR_HOST) {
    admin.initializeApp({
      projectId: "healthcare-mock-project"
    });
    console.log("Using Firestore Emulator at " + process.env.FIRESTORE_EMULATOR_HOST);
  } else {
    console.error("Error: Please set GOOGLE_APPLICATION_CREDENTIALS or FIRESTORE_EMULATOR_HOST to run this script.");
    console.log("\nTo run using the local emulator:");
    console.log("  $env:FIRESTORE_EMULATOR_HOST=\"localhost:8080\"");
    console.log("  node seed-script.js");
    process.exit(1);
  }
} catch (e) {
  console.error("Initialization error:", e);
  process.exit(1);
}

const db = admin.firestore();

const mockHospitals = [
  {
    id: "hospital_1",
    name: "Bhatkal Taluka Hospital ",
    patientCount: 180,
    beds: { total: 250, occupied: 180, available: 70 },
    doctors: { total: 45, present: 38, attendanceRate: 84.4 },
    medicines: [
      {
        name: "Paracetamol 500mg",
        currentStock: 1200,
        unit: "tablets",
        reorderLevel: 500,
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
    name: "Life Care Bhatkal",
    patientCount: 420,
    beds: { total: 500, occupied: 420, available: 80 },
    doctors: { total: 120, present: 105, attendanceRate: 87.5 },
    medicines: [
      {
        name: "Paracetamol 500mg",
        currentStock: 3000,
        unit: "tablets",
        reorderLevel: 1000,
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
    name: "Ambedkar International Hospital",
    patientCount: 45,
    beds: { total: 100, occupied: 45, available: 55 },
    doctors: { total: 25, present: 22, attendanceRate: 88.0 },
    medicines: [
      {
        name: "Pediatric Paracetamol Syrup",
        currentStock: 80,
        unit: "bottles",
        reorderLevel: 50,
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
    name: "Apollo International",
    patientCount: 135,
    beds: { total: 150, occupied: 135, available: 15 },
    doctors: { total: 30, present: 25, attendanceRate: 83.3 },
    medicines: [
      {
        name: "Sertraline 50mg",
        currentStock: 950,
        unit: "tablets",
        reorderLevel: 300,
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

async function seedDatabase() {
  console.log("Starting database seed...");
  
  for (const hospital of mockHospitals) {
    const { id, name, patientCount, beds, doctors, medicines } = hospital;
    const hospitalRef = db.collection("hospitals").doc(id);

    console.log(`Writing hospital document for: ${name} (${id})...`);
    await hospitalRef.set({
      name,
      patientCount,
      beds,
      doctors,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Populating medicines subcollection for: ${name}...`);
    for (let i = 0; i < medicines.length; i++) {
      const med = medicines[i];
      const medicineId = `med_${id}_${i + 1}`;
      
      // Calculate initial dailyUsage rate average
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
        lastPredicted: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }

  console.log("\nDatabase seeding completed successfully!");
  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error("Error seeding database: ", error);
  process.exit(1);
});
