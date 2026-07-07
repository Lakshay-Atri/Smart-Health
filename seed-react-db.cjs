const admin = require("firebase-admin");

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  } else if (process.env.FIRESTORE_EMULATOR_HOST) {
    admin.initializeApp({ projectId: "healthcare-mock-project" });
    console.log("Using Firestore Emulator at " + process.env.FIRESTORE_EMULATOR_HOST);
  } else {
    console.error("Error: Please set GOOGLE_APPLICATION_CREDENTIALS or FIRESTORE_EMULATOR_HOST to run this script.");
    process.exit(1);
  }
} catch (e) {
  console.error("Initialization error:", e);
  process.exit(1);
}

const db = admin.firestore();

const centres = [
  { id: "centre_1", name: "Bhatkal Taluk General Hospital", location: "Bhatkal, Uttara Kannada" },
  { id: "centre_2", name: "CHC Shirali", location: "Shirali, Bhatkal Taluk" },
  { id: "centre_3", name: "PHC Murdeshwar", location: "Murdeshwar, Bhatkal Taluk" },
  { id: "centre_4", name: "PHC Mavalli", location: "Mavalli, Bhatkal Taluk" },
  { id: "centre_5", name: "PHC Jali", location: "Jali, Bhatkal Taluk" }
];

const stockItemsByCentre = {
  centre_1: [
    { id: "med_1", name: "Paracetamol 500mg", currentStock: 1200, avgDailyUsage: 85, reorderThreshold: 500 },
    { id: "med_2", name: "Amoxicillin 500mg", currentStock: 150, avgDailyUsage: 30, reorderThreshold: 200 },
    { id: "med_3", name: "ORS Packets", currentStock: 900, avgDailyUsage: 50, reorderThreshold: 300 },
    { id: "med_4", name: "Iron Folic Acid Tablets", currentStock: 1500, avgDailyUsage: 75, reorderThreshold: 500 }
  ],
  centre_2: [
    { id: "med_1", name: "Paracetamol 500mg", currentStock: 3000, avgDailyUsage: 205, reorderThreshold: 1000 },
    { id: "med_2", name: "Metformin 500mg", currentStock: 450, avgDailyUsage: 85, reorderThreshold: 500 },
    { id: "med_3", name: "ORS Packets", currentStock: 200, avgDailyUsage: 60, reorderThreshold: 300 }
  ],
  centre_3: [
    { id: "med_1", name: "Pediatric Paracetamol Syrup", currentStock: 80, avgDailyUsage: 16, reorderThreshold: 50 },
    { id: "med_2", name: "Amoxicillin Suspension", currentStock: 250, avgDailyUsage: 13, reorderThreshold: 100 }
  ],
  centre_4: [
    { id: "med_1", name: "Paracetamol 500mg", currentStock: 400, avgDailyUsage: 45, reorderThreshold: 300 },
    { id: "med_2", name: "Iron Folic Acid Tablets", currentStock: 90, avgDailyUsage: 25, reorderThreshold: 150 }
  ],
  centre_5: [
    { id: "med_1", name: "Oxytocin Injection", currentStock: 120, avgDailyUsage: 38, reorderThreshold: 100 },
    { id: "med_2", name: "Folic Acid 5mg", currentStock: 1500, avgDailyUsage: 74, reorderThreshold: 500 }
  ]
};

const footfallByCentre = {
  centre_1: { "2026-07-01": { patientCount: 145 }, "2026-07-02": { patientCount: 152 }, "2026-07-03": { patientCount: 138 } },
  centre_2: { "2026-07-01": { patientCount: 210 }, "2026-07-02": { patientCount: 198 }, "2026-07-03": { patientCount: 225 } },
  centre_3: { "2026-07-01": { patientCount: 60 }, "2026-07-02": { patientCount: 55 }, "2026-07-03": { patientCount: 65 } },
  centre_4: { "2026-07-01": { patientCount: 40 }, "2026-07-02": { patientCount: 38 }, "2026-07-03": { patientCount: 42 } },
  centre_5: { "2026-07-01": { patientCount: 90 }, "2026-07-02": { patientCount: 85 }, "2026-07-03": { patientCount: 95 } }
};

const attendanceByCentre = {
  centre_1: [{ doctorId: "dr_1", checkedIn: true }, { doctorId: "dr_2", checkedIn: true }],
  centre_2: [{ doctorId: "dr_3", checkedIn: true }, { doctorId: "dr_4", checkedIn: false }],
  centre_3: [{ doctorId: "dr_5", checkedIn: true }],
  centre_4: [{ doctorId: "dr_6", checkedIn: false }],
  centre_5: [{ doctorId: "dr_7", checkedIn: true }]
};

async function seedDatabase() {
  console.log("Starting database seed...");

  for (const centre of centres) {
    console.log(`Writing centre: ${centre.name}...`);
    await db.collection("centres").doc(centre.id).set({
      name: centre.name,
      location: centre.location
    });

    const stockItems = stockItemsByCentre[centre.id] || [];
    for (const item of stockItems) {
      await db.collection("stock").doc(centre.id).collection("items").doc(item.id).set({
        name: item.name,
        currentStock: item.currentStock,
        avgDailyUsage: item.avgDailyUsage,
        reorderThreshold: item.reorderThreshold
      });
    }

    const footfallRecords = footfallByCentre[centre.id] || {};
    for (const [date, data] of Object.entries(footfallRecords)) {
      await db.collection("footfall").doc(centre.id).collection("records").doc(date).set(data);
    }

    const attendanceRecords = attendanceByCentre[centre.id] || [];
    for (let i = 0; i < attendanceRecords.length; i++) {
      await db.collection("attendance").doc(centre.id).collection("records").doc(`rec_${i + 1}`).set(attendanceRecords[i]);
    }
  }

  console.log("\nDatabase seeding completed successfully!");
  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error("Error seeding database: ", error);
  process.exit(1);
});
