# AURA Healthcare - Firebase backend & Stock Prediction Dashboard

A complete backend and predictive monitoring platform designed for a network of 5 hospitals. It monitors inpatient admissions, bed availability, doctor attendance, and tracks critical medical inventory. Using daily consumption logs, it forecasts stock levels and warns administrators about imminent stockouts.

## Folder Structure

```
Smart Health/
├── firebase.json              # Firebase CLI Configuration
├── firestore.rules            # Security Rules for Firestore Database
├── firestore.indexes.json    # Composite Indexes Configuration
├── seed-script.js             # Standalone Admin SDK Node Database Seeder
├── index.html                 # Premium Visual Analytics Dashboard 
├── styles.css                 # Custom Dark Mode styling stylesheets
├── app.js                     # Core State Controller, Simulator, and Web SDK Client
└── functions/
    ├── index.js               # Firebase Cloud Functions (Stock Predictions)
    └── package.json           # Cloud Functions dependencies
```

---

## 1. Quick Start (Zero-Configuration Simulator)

Since Node.js/NPM may not be configured in your environment, the dashboard includes a built-in **Local Storage Database Emulator**. This enables you to run the entire application instantly with full features without setting up Firebase.

### Steps to Run:
1. Open the [index.html](file:///D:/Smart%20Health/index.html) file directly in your web browser.
2. The dashboard will automatically detect that no Firebase configuration is present, seed itself with default mock metrics, and run in **Simulator Mode** using your browser's local storage.
3. You can click **Simulate +1 Day** to decrease inventory based on daily patients, view warning lights, or trigger predictions via the console.

---

## 2. Setting Up Live Firebase Integration

To link the dashboard with a live Cloud Firestore instance:

### A. Firebase Console Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
2. Name your project (e.g. `AURA-Healthcare`).
3. Under **Build > Firestore Database**, click **Create Database** and start it in test mode or production mode.
4. Under **Project Settings > General**, scroll down to "Your apps", click the **Web App (</>)** icon, register the app, and copy the `firebaseConfig` object keys:
   - `apiKey`
   - `projectId`
   - `authDomain`
   - `appId`

### B. Connecting the Dashboard
1. Open the dashboard in your browser.
2. Click the **Configure Firebase** button on the bottom of the sidebar.
3. Paste your credentials into the inputs and click **Connect Firestore**.
4. The dashboard status badge will switch to **Firestore Connected**.
5. Click the newly visible **Seed Remote DB** button to automatically populate your live Firestore database with all mock records!

---

## 3. Deploying Firebase Configurations & Cloud Functions

To deploy the security rules, indexes, and Cloud Functions to your project, you'll need the Firebase CLI:

### Setup CLI:
```bash
npm install -g firebase-tools
firebase login
```

### Initialize Project:
Run the following in the `Smart Health/` root directory:
```bash
firebase use --add [YOUR_PROJECT_ID]
```

### Deploy Rules & Indexes:
```bash
firebase deploy --only firestore
```

### Deploy Cloud Functions:
Ensure you install Node dependencies in the functions directory first:
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

## 4. Database Schema Design

### Collection: `hospitals`
- Document IDs: `hospital_1`, `hospital_2`, `hospital_3`, `hospital_4`, `hospital_5`
- Document Structure:
  ```json
  {
    "name": "St. Jude General Hospital",
    "patientCount": 180,
    "beds": {
      "total": 250,
      "occupied": 180,
      "available": 70
    },
    "doctors": {
      "total": 45,
      "present": 38,
      "attendanceRate": 84.4
    },
    "lastUpdated": "Timestamp"
  }
  ```

### Subcollection: `hospitals/{hospitalId}/medicines`
- Document Structure:
  ```json
  {
    "name": "Amoxicillin 500mg",
    "currentStock": 150,
    "unit": "tablets",
    "reorderLevel": 200,
    "dailyUsage": 30.0, // Moving average consumption
    "usageHistory": [
      { "date": "2026-06-26", "quantity": 25 },
      { "date": "2026-06-27", "quantity": 30 }
      // ... stores last 7 days of logs
    ],
    "predictedStockOutDays": 5.0,
    "predictedStockOutDate": "Timestamp",
    "status": "CRITICAL", // NORMAL, REORDER, WARNING, CRITICAL
    "lastPredicted": "Timestamp"
  }
  ```

---

## 5. Stock-Out Prediction Logic

The prediction algorithm calculates stock longevity using moving averages:

1. **Calculate Moving Average Daily Usage ($U_{avg}$)**:
   It takes the last $N$ records (up to 7 days) from the medicine's `usageHistory` array:
   $$U_{avg} = \frac{\sum_{i=1}^{N} \text{usage}_i}{N}$$

2. **Forecast Remaining Stock Days ($D_{remain}$)**:
   If $U_{avg}$ is greater than zero:
   $$D_{remain} = \frac{\text{Current Stock}}{U_{avg}}$$
   *(If $U_{avg}$ is $0$, remaining days defaults to a placeholder $999$ representing infinite stock).*

3. **Status Transitions**:
   - **CRITICAL**: $D_{remain} \le 3$ (Runout danger in 3 days)
   - **WARNING**: $D_{remain} \le 7$ (Runout danger in 7 days)
   - **REORDER**: $\text{Current Stock} \le \text{Reorder Level}$ and $D_{remain} > 7$
   - **NORMAL**: $\text{Current Stock} > \text{Reorder Level}$ and $D_{remain} > 7$
