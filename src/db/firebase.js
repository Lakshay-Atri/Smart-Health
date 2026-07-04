import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  query,
  limit,
  orderBy
} from 'firebase/firestore';
import { liveMockDb } from './mockData';

// Load configuration from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if variables are configured
const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_PROJECT_ID;

let db = null;
if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('Firebase initialized successfully. Operating in Live Firestore Mode.');
  } catch (error) {
    console.error('Firebase initialization failed. Falling back to Mock Database.', error);
  }
} else {
  console.warn(
    'VITE_FIREBASE_PROJECT_ID is not configured in .env file.\n' +
    'Smart Health Dashboard is starting in Real-time Mock Mode (simulating onSnapshot updates).'
  );
}

// ----------------------------------------------------
// Real-time synchronization hooks matching API specs
// ----------------------------------------------------

/**
 * Subscribes to all health centres
 */
export function subscribeToCentres(callback) {
  if (!db) {
    return liveMockDb.subscribe('centres', null, callback);
  }

  const centresCol = collection(db, 'centres');
  return onSnapshot(
    centresCol,
    (snapshot) => {
      const centresList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(centresList);
    },
    (error) => {
      console.error('Error fetching centres from Firestore:', error);
      // Fallback on permission/connection errors
      liveMockDb.subscribe('centres', null, callback);
    }
  );
}

/**
 * Subscribes to inventory stock items of a specific health centre
 */
export function subscribeToStock(centreId, callback) {
  if (!db) {
    return liveMockDb.subscribe('stock', centreId, callback);
  }

  const stockCol = collection(db, `stock/${centreId}/items`);
  return onSnapshot(
    stockCol,
    (snapshot) => {
      const stockList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(stockList);
    },
    (error) => {
      console.error(`Error fetching stock for ${centreId} from Firestore:`, error);
      liveMockDb.subscribe('stock', centreId, callback);
    }
  );
}

/**
 * Subscribes to footfall history for a specific centre
 */
export function subscribeToFootfall(centreId, callback) {
  if (!db) {
    return liveMockDb.subscribe('footfall', centreId, callback);
  }

  const footfallCol = collection(db, `footfall/${centreId}/records`);
  // Order records by date if possible or read raw map
  return onSnapshot(
    footfallCol,
    (snapshot) => {
      const footfallData = {};
      snapshot.forEach(doc => {
        footfallData[doc.id] = doc.data(); // doc.id is date (e.g. "2026-07-01")
      });
      callback(footfallData);
    },
    (error) => {
      console.error(`Error fetching footfall for ${centreId} from Firestore:`, error);
      liveMockDb.subscribe('footfall', centreId, callback);
    }
  );
}

/**
 * Subscribes to doctor attendance for a specific centre today
 */
export function subscribeToAttendance(centreId, callback) {
  if (!db) {
    return liveMockDb.subscribe('attendance', centreId, callback);
  }

  const attendanceCol = collection(db, `attendance/${centreId}/records`);
  return onSnapshot(
    attendanceCol,
    (snapshot) => {
      const attendanceList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(attendanceList);
    },
    (error) => {
      console.error(`Error fetching attendance for ${centreId} from Firestore:`, error);
      liveMockDb.subscribe('attendance', centreId, callback);
    }
  );
}

/**
 * Subscribes to test availability for a specific centre (optional subcollection, falls back to mock)
 */
export function subscribeToTests(centreId, callback) {
  if (!db) {
    return liveMockDb.subscribe('tests', centreId, callback);
  }

  // Check tests collection
  const testsCol = collection(db, `centres/${centreId}/tests`);
  return onSnapshot(
    testsCol,
    (snapshot) => {
      if (snapshot.empty) {
        // Fallback to mock test list if Firestore collection doesn't exist
        liveMockDb.subscribe('tests', centreId, callback);
        return;
      }
      const testList = snapshot.docs.map(doc => ({
        name: doc.id,
        ...doc.data()
      }));
      callback(testList);
    },
    () => {
      liveMockDb.subscribe('tests', centreId, callback);
    }
  );
}
