const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * Helper to calculate average daily usage from the last 7 entries of usage history.
 * @param {Array} usageHistory - Array of { date: string, quantity: number }
 * @param {number} fallbackDailyUsage - Default daily usage if history is empty
 * @returns {number} Average daily usage
 */
function calculateAverageUsage(usageHistory, fallbackDailyUsage = 0) {
  if (!usageHistory || !Array.isArray(usageHistory) || usageHistory.length === 0) {
    return fallbackDailyUsage;
  }
  
  // Take at most the last 7 records
  const recentHistory = usageHistory.slice(-7);
  const total = recentHistory.reduce((sum, record) => sum + (record.quantity || 0), 0);
  return Number((total / recentHistory.length).toFixed(2));
}

/**
 * Core prediction logic that computes remaining stock days and flags critical stockouts.
 * This function can be run on a schedule or triggered manually.
 */
async function runStockPredictions() {
  const hospitalsSnapshot = await db.collection("hospitals").get();
  const summary = {
    hospitalsProcessed: 0,
    medicinesProcessed: 0,
    criticalMedicinesCount: 0,
    warningMedicinesCount: 0
  };

  const now = admin.firestore.Timestamp.now();
  const todayMs = now.toMillis();

  for (const hospitalDoc of hospitalsSnapshot.docs) {
    const hospitalId = hospitalDoc.id;
    const medicinesSnapshot = await db.collection("hospitals").doc(hospitalId).collection("medicines").get();
    
    let criticalCount = 0;
    let warningCount = 0;
    let reorderCount = 0;
    
    const batch = db.batch();

    medicinesSnapshot.docs.forEach((medDoc) => {
      const medData = medDoc.data();
      const currentStock = medData.currentStock || 0;
      const reorderLevel = medData.reorderLevel || 0;
      
      // Calculate daily usage from history
      const avgUsage = calculateAverageUsage(medData.usageHistory, medData.dailyUsage || 0);
      
      let predictedDays = 999;
      let predictedStockOutDate = null;
      let status = "NORMAL";

      if (avgUsage > 0) {
        predictedDays = Number((currentStock / avgUsage).toFixed(1));
        
        // Calculate predicted date
        const msRemaining = predictedDays * 24 * 60 * 60 * 1000;
        predictedStockOutDate = admin.firestore.Timestamp.fromMillis(todayMs + msRemaining);
        
        if (predictedDays <= 3) {
          status = "CRITICAL";
          criticalCount++;
        } else if (predictedDays <= 7) {
          status = "WARNING";
          warningCount++;
        } else if (currentStock <= reorderLevel) {
          status = "REORDER";
          reorderCount++;
        }
      } else {
        // If average usage is 0, but current stock is below reorder level
        if (currentStock <= reorderLevel) {
          status = "REORDER";
          reorderCount++;
        }
      }

      batch.update(medDoc.ref, {
        dailyUsage: avgUsage,
        predictedStockOutDays: predictedDays,
        predictedStockOutDate: predictedStockOutDate,
        status: status,
        lastPredicted: now
      });

      summary.medicinesProcessed++;
    });

    // Update hospital stats summary
    batch.update(hospitalDoc.ref, {
      criticalAlertsCount: criticalCount,
      warningAlertsCount: warningCount,
      reorderAlertsCount: reorderCount,
      lastUpdated: now
    });

    await batch.commit();

    summary.criticalMedicinesCount += criticalCount;
    summary.warningMedicinesCount += warningCount;
    summary.hospitalsProcessed++;
  }

  return summary;
}

/**
 * 1. HTTPS Callable Function
 * Allows clients to manually trigger the prediction calculations on demand.
 */
exports.predictStockOut = functions.https.onCall(async (data, context) => {
  try {
    const summary = await runStockPredictions();
    return {
      success: true,
      message: "Stock out prediction completed successfully.",
      summary: summary
    };
  } catch (error) {
    console.error("Error predicting stock-out:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to calculate stock-out predictions.",
      error.message
    );
  }
});

/**
 * 2. Scheduled Cron Function
 * Runs daily at midnight to update stock predictions automatically.
 */
exports.scheduledPredictStockOut = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("UTC")
  .onRun(async (context) => {
    try {
      const summary = await runStockPredictions();
      console.log("Daily scheduled stock prediction completed:", summary);
      return null;
    } catch (error) {
      console.error("Daily scheduled stock prediction failed:", error);
      return null;
    }
  });

/**
 * 3. HTTP Trigger Function (For testing or webhooks)
 */
exports.triggerPredictionHttp = functions.https.onRequest(async (req, res) => {
  try {
    const summary = await runStockPredictions();
    res.status(200).json({
      success: true,
      message: "Predictions run successfully",
      summary: summary
    });
  } catch (error) {
    console.error("HTTP trigger error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
