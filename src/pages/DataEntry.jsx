import React, { useState, useEffect } from 'react';
import { db, subscribeToCentres, subscribeToStock } from '../db/firebase';
import { liveMockDb, initialCentres, initialStock, initialAttendance, initialFootfall } from '../db/mockData';
import { doc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { Card } from '../components/Card';
import { Users, BedDouble, Pill, ClipboardList, Save, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useHealthCentres } from '../context/HealthCentreContext';

export default function DataEntry() {
  const { useLocalMock, seedDatabase } = useHealthCentres();
  const [centres, setCentres] = useState([]);
  const [selectedCentreId, setSelectedCentreId] = useState('');
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Today's date helper
  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTodayFriendlyDate = () => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const todayStr = getTodayDateString();

  // Alert State
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: '' }

  const triggerAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  // Form States
  const [patientCount, setPatientCount] = useState('');
  const [bedsTotal, setBedsTotal] = useState('');
  const [bedsOccupied, setBedsOccupied] = useState('');
  const [selectedStockItemId, setSelectedStockItemId] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');

  // Add New Medicine Form States
  const [newMedName, setNewMedName] = useState('');
  const [newMedStock, setNewMedStock] = useState('');
  const [newMedUsage, setNewMedUsage] = useState('');
  const [newMedThreshold, setNewMedThreshold] = useState('');

  // Subscribe to centres list
  useEffect(() => {
    const unsub = subscribeToCentres((list) => {
      setCentres(list);
      // Add a small 800ms delay to make the modern pulsing loading animation visible to users
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }, useLocalMock);
    return unsub;
  }, [useLocalMock]);

  // Subscribe to stock list for selected centre
  useEffect(() => {
    if (!selectedCentreId) {
      setStockItems([]);
      return;
    }
    const unsub = subscribeToStock(selectedCentreId, (list) => {
      setStockItems(list);
    }, useLocalMock);
    return unsub;
  }, [selectedCentreId, useLocalMock]);

  // Seeding Firestore database directly from the browser
  const handleSeedDatabase = async () => {
    if (!db) return;
    setSeeding(true);
    triggerAlert('success', 'Starting database seed... Please wait.');

    try {
      await seedDatabase();
      triggerAlert('success', 'Database seeded successfully! All health centres are now loaded.');
    } catch (err) {
      console.error(err);
      triggerAlert('error', `Seeding failed: ${err.message || err}`);
    } finally {
      setSeeding(false);
    }
  };

  // Pre-populate beds info when centre selection changes
  useEffect(() => {
    if (selectedCentreId && centres.length > 0) {
      const selectedCentre = centres.find(c => c.id === selectedCentreId);
      if (selectedCentre) {
        const total = selectedCentre.bedsTotal ?? selectedCentre.totalBeds ?? '';
        const occupied = selectedCentre.bedsOccupied ?? selectedCentre.occupiedBeds ?? '';
        setBedsTotal(total);
        setBedsOccupied(occupied);
      }
    } else {
      setBedsTotal('');
      setBedsOccupied('');
      setPatientCount('');
      setSelectedStockItemId('');
      setStockQuantity('');
      resetNewMedForm();
    }
  }, [selectedCentreId, centres]);

  const resetNewMedForm = () => {
    setNewMedName('');
    setNewMedStock('');
    setNewMedUsage('');
    setNewMedThreshold('');
  };

  // Handle Save Today's Patient Count
  const handleSavePatientCount = async (e) => {
    e.preventDefault();
    if (!selectedCentreId) return;
    if (patientCount === '') {
      triggerAlert('error', 'Please enter today\'s patient count.');
      return;
    }

    const countVal = Number(patientCount);
    if (countVal < 0) {
      triggerAlert('error', 'Patient count cannot be negative.');
      return;
    }

    try {
      if (db) {
        // Live Firestore Mode
        const docRef = doc(db, 'footfall', selectedCentreId, 'records', todayStr);
        await setDoc(docRef, { patientCount: countVal });
      } else {
        // Mock Database Mode
        if (!liveMockDb.footfall[selectedCentreId]) {
          liveMockDb.footfall[selectedCentreId] = {};
        }
        liveMockDb.footfall[selectedCentreId][todayStr] = { patientCount: countVal };
        liveMockDb.notify('footfall', selectedCentreId);
      }
      triggerAlert('success', 'Patient count saved successfully!');
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'Failed to save patient count. Please try again.');
    }
  };

  // Handle Save Bed Availability
  const handleSaveBeds = async (e) => {
    e.preventDefault();
    if (!selectedCentreId) return;
    if (bedsTotal === '' || bedsOccupied === '') {
      triggerAlert('error', 'Please enter both total beds and occupied beds.');
      return;
    }

    const totalVal = Number(bedsTotal);
    const occupiedVal = Number(bedsOccupied);

    if (totalVal < 0 || occupiedVal < 0) {
      triggerAlert('error', 'Bed counts cannot be negative.');
      return;
    }

    if (occupiedVal > totalVal) {
      triggerAlert('error', 'Occupied beds cannot be greater than total beds.');
      return;
    }

    try {
      if (db) {
        // Live Firestore Mode
        const docRef = doc(db, 'centres', selectedCentreId);
        await updateDoc(docRef, {
          totalBeds: totalVal,
          occupiedBeds: occupiedVal,
          bedsTotal: totalVal,
          bedsOccupied: occupiedVal
        });
      } else {
        // Mock Database Mode
        if (liveMockDb.centres[selectedCentreId]) {
          liveMockDb.centres[selectedCentreId] = {
            ...liveMockDb.centres[selectedCentreId],
            totalBeds: totalVal,
            occupiedBeds: occupiedVal,
            bedsTotal: totalVal,
            bedsOccupied: occupiedVal
          };
          liveMockDb.notify('centres');
        }
      }
      triggerAlert('success', 'Bed availability updated successfully!');
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'Failed to update beds availability. Please try again.');
    }
  };

  // Handle Save Medicine Stock Update
  const handleSaveStockQuantity = async (e) => {
    e.preventDefault();
    if (!selectedCentreId) return;
    if (!selectedStockItemId) {
      triggerAlert('error', 'Please select a medicine to update.');
      return;
    }
    if (stockQuantity === '') {
      triggerAlert('error', 'Please enter the new quantity.');
      return;
    }

    const qtyVal = Number(stockQuantity);
    if (qtyVal < 0) {
      triggerAlert('error', 'Medicine stock cannot be negative.');
      return;
    }

    try {
      if (db) {
        // Live Firestore Mode
        const docRef = doc(db, 'stock', selectedCentreId, 'items', selectedStockItemId);
        await updateDoc(docRef, {
          currentStock: qtyVal
        });
      } else {
        // Mock Database Mode
        if (liveMockDb.stock[selectedCentreId] && liveMockDb.stock[selectedCentreId][selectedStockItemId]) {
          liveMockDb.stock[selectedCentreId][selectedStockItemId].currentStock = qtyVal;
          liveMockDb.notify('stock', selectedCentreId);
        }
      }
      triggerAlert('success', 'Medicine quantity updated successfully!');
      setStockQuantity('');
      setSelectedStockItemId('');
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'Failed to update medicine stock. Please try again.');
    }
  };

  // Handle Save Add New Medicine
  const handleAddNewMedicine = async (e) => {
    e.preventDefault();
    if (!selectedCentreId) return;
    if (!newMedName.trim() || newMedStock === '' || newMedUsage === '' || newMedThreshold === '') {
      triggerAlert('error', 'Please fill in all medicine details.');
      return;
    }

    const stockVal = Number(newMedStock);
    const usageVal = Number(newMedUsage);
    const thresholdVal = Number(newMedThreshold);

    if (stockVal < 0 || usageVal < 0 || thresholdVal < 0) {
      triggerAlert('error', 'Values cannot be negative.');
      return;
    }

    try {
      if (db) {
        // Live Firestore Mode
        const collRef = collection(db, 'stock', selectedCentreId, 'items');
        await addDoc(collRef, {
          name: newMedName.trim(),
          currentStock: stockVal,
          avgDailyUsage: usageVal,
          reorderThreshold: thresholdVal
        });
      } else {
        // Mock Database Mode
        if (!liveMockDb.stock[selectedCentreId]) {
          liveMockDb.stock[selectedCentreId] = {};
        }
        const newId = `med-${Date.now()}`;
        liveMockDb.stock[selectedCentreId][newId] = {
          id: newId,
          name: newMedName.trim(),
          currentStock: stockVal,
          avgDailyUsage: usageVal,
          reorderThreshold: thresholdVal
        };
        liveMockDb.notify('stock', selectedCentreId);
      }
      triggerAlert('success', `Added new medicine: ${newMedName.trim()}`);
      resetNewMedForm();
    } catch (err) {
      console.error(err);
      triggerAlert('error', 'Failed to add new medicine. Please try again.');
    }
  };

  const isFormDisabled = !selectedCentreId;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-8 bg-slate-200 rounded-xl w-48"></div>
          <div className="h-4 bg-slate-200 rounded-lg w-full max-w-lg"></div>
          <div className="h-16 bg-slate-100 rounded-2xl w-full"></div>
        </div>

        {/* Centre Selector Card Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3 shadow-sm">
          <div className="h-4 bg-slate-200 rounded-md w-32"></div>
          <div className="h-12 bg-slate-50 rounded-xl w-full"></div>
        </div>

        {/* Forms Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div className="h-4 bg-slate-200 rounded-md w-28"></div>
                <div className="h-8 w-8 bg-indigo-50/55 border border-indigo-100/30 rounded-xl"></div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-slate-200 rounded-md w-1/3"></div>
                <div className="h-10 bg-slate-50 rounded-xl w-full"></div>
              </div>
              <div className="h-12 bg-slate-200 rounded-xl w-full mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      {/* Alert Banner Container */}
      {alert && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-6 py-4 rounded-2xl shadow-lg border text-sm font-semibold transition-all duration-300 animate-bounce ${
          alert.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {alert.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Staff Data Entry</h1>
        <p className="text-slate-500 text-sm mt-2">
          Select a health centre below to enter daily details like today's patient count, bed availability, and medicine updates.
        </p>

        {/* Demo Purpose Note */}
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200/50 rounded-2xl flex items-start space-x-3 text-xs text-amber-800">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Demo Purpose Note</span>
            In a live system, this Data Entry page would only be accessible locally within the respective health care centre's internal network. It is made available here on the main operator dashboard solely for demo and testing purposes.
          </div>
        </div>
      </div>

      {/* 1. Centre Selector */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Which Health Centre are you entering data for?
          </label>
            <select
              value={selectedCentreId}
              onChange={(e) => setSelectedCentreId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-base font-medium transition-all"
            >
              <option value="">-- Click here to select your health centre --</option>
              {centres.map((centre) => (
                <option key={centre.id} value={centre.id}>
                  {centre.name} {centre.location ? `(${centre.location})` : ''}
                </option>
              ))}
            </select>

          {db && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-700 block">Live Database Mode Active</span>
                <span className="text-xs text-slate-400">If no health centres are showing or you want to reset, click to populate the database with default centres and mock records.</span>
              </div>
              <button
                type="button"
                onClick={handleSeedDatabase}
                disabled={seeding}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 font-semibold py-2.5 px-4 rounded-xl text-xs transition-all border border-indigo-100/50 cursor-pointer flex-shrink-0"
              >
                {seeding ? 'Seeding Firestore...' : 'Seed Live Database'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Forms Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-opacity duration-300 ${
        isFormDisabled ? 'opacity-50 pointer-events-none' : 'opacity-100'
      }`}>
        
        {/* 2. Today's Patient Count */}
        <Card 
          title="Today's Patient Count" 
          icon={<Users className="w-5 h-5 text-indigo-600" />}
        >
          <form onSubmit={handleSavePatientCount} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Date
              </label>
              <div className="text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl">
                {getTodayFriendlyDate()}
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="patientCount" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Number of Patients Seen Today
              </label>
              <input
                id="patientCount"
                type="number"
                min="0"
                placeholder="e.g. 45"
                disabled={isFormDisabled}
                value={patientCount}
                onChange={(e) => setPatientCount(e.target.value)}
                className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-sm font-medium transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isFormDisabled}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Patient Count</span>
            </button>
          </form>
        </Card>

        {/* 3. Bed Availability */}
        <Card 
          title="Bed Availability" 
          icon={<BedDouble className="w-5 h-5 text-indigo-600" />}
        >
          <form onSubmit={handleSaveBeds} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label htmlFor="bedsTotal" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Beds
                </label>
                <input
                  id="bedsTotal"
                  type="number"
                  min="0"
                  placeholder="e.g. 100"
                  disabled={isFormDisabled}
                  value={bedsTotal}
                  onChange={(e) => setBedsTotal(e.target.value)}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-sm font-medium transition-all"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="bedsOccupied" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Occupied Beds
                </label>
                <input
                  id="bedsOccupied"
                  type="number"
                  min="0"
                  placeholder="e.g. 35"
                  disabled={isFormDisabled}
                  value={bedsOccupied}
                  onChange={(e) => setBedsOccupied(e.target.value)}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-sm font-medium transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isFormDisabled}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Update Bed Counts</span>
            </button>
          </form>
        </Card>

        {/* 4. Update Medicine Stock */}
        <Card 
          title="Update Medicine Stock" 
          icon={<Pill className="w-5 h-5 text-indigo-600" />}
        >
          <form onSubmit={handleSaveStockQuantity} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="medicineSelect" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Select Medicine to Update
              </label>
              <select
                id="medicineSelect"
                disabled={isFormDisabled}
                value={selectedStockItemId}
                onChange={(e) => setSelectedStockItemId(e.target.value)}
                className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-sm font-medium transition-all"
              >
                <option value="">-- Choose a medicine --</option>
                {stockItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} (Current: {item.currentStock} units)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="stockQuantity" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                New Quantity (total in stock)
              </label>
              <input
                id="stockQuantity"
                type="number"
                min="0"
                placeholder="e.g. 500"
                disabled={isFormDisabled || !selectedStockItemId}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-sm font-medium transition-all disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={isFormDisabled || !selectedStockItemId || stockQuantity === ''}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Update Stock Quantity</span>
            </button>
          </form>
        </Card>

        {/* 5. Add New Medicine */}
        <Card 
          title="Add New Medicine" 
          icon={<ClipboardList className="w-5 h-5 text-indigo-600" />}
        >
          <form onSubmit={handleAddNewMedicine} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="newMedName" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Medicine Name
              </label>
              <input
                id="newMedName"
                type="text"
                placeholder="e.g. Ibuprofen 400mg"
                disabled={isFormDisabled}
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
                className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-sm font-medium transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col space-y-1 col-span-1">
                <label htmlFor="newMedStock" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
                  In Stock
                </label>
                <input
                  id="newMedStock"
                  type="number"
                  min="0"
                  placeholder="e.g. 500"
                  disabled={isFormDisabled}
                  value={newMedStock}
                  onChange={(e) => setNewMedStock(e.target.value)}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-xs font-medium transition-all"
                />
              </div>

              <div className="flex flex-col space-y-1 col-span-1">
                <label htmlFor="newMedUsage" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
                  Used / Day
                </label>
                <input
                  id="newMedUsage"
                  type="number"
                  min="0"
                  placeholder="e.g. 20"
                  disabled={isFormDisabled}
                  value={newMedUsage}
                  onChange={(e) => setNewMedUsage(e.target.value)}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-xs font-medium transition-all"
                />
              </div>

              <div className="flex flex-col space-y-1 col-span-1">
                <label htmlFor="newMedThreshold" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
                  Restock Level
                </label>
                <input
                  id="newMedThreshold"
                  type="number"
                  min="0"
                  placeholder="e.g. 100"
                  disabled={isFormDisabled}
                  value={newMedThreshold}
                  onChange={(e) => setNewMedThreshold(e.target.value)}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-xs font-medium transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isFormDisabled}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medicine to List</span>
            </button>
          </form>
        </Card>

      </div>
    </div>
  );
}
