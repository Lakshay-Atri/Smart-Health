import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  db,
  subscribeToCentres, 
  subscribeToStock, 
  subscribeToFootfall, 
  subscribeToAttendance 
} from '../db/firebase';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { SkeletonCard } from '../components/SkeletonCard';
import { useHealthCentres } from '../context/HealthCentreContext';
import { 
  Search, 
  Users, 
  Bed, 
  Activity, 
  AlertCircle,
  CheckCircle2,
  MapPin,
  Heart,
  Calendar,
  Building2,
  ListFilter
} from 'lucide-react';

// Sub-component to manage individual centre subscriptions for modular real-time updates
function CentreCard({ centre, onClick, onMetricsResolved }) {
  const [stock, setStock] = useState([]);
  const [footfall, setFootfall] = useState({});
  const [attendance, setAttendance] = useState([]);
  const { useLocalMock } = useHealthCentres();

  // Fetch real-time stock, footfall, and attendance
  useEffect(() => {
    const unsubStock = subscribeToStock(centre.id, setStock, useLocalMock);
    const unsubFootfall = subscribeToFootfall(centre.id, setFootfall, useLocalMock);
    const unsubAttendance = subscribeToAttendance(centre.id, setAttendance, useLocalMock);

    return () => {
      unsubStock();
      unsubFootfall();
      unsubAttendance();
    };
  }, [centre.id, useLocalMock]);

  // Compute metrics
  // 1. Stock Health
  const computeStockStatus = () => {
    if (stock.length === 0) return { status: 'green', label: 'All Good' };
    
    let hasCritical = false; // daysUntilStockout < 3
    let hasWarning = false; // currentStock <= reorderThreshold

    stock.forEach(item => {
      const days = item.avgDailyUsage > 0 ? (item.currentStock / item.avgDailyUsage) : 999;
      if (days < 3 || item.currentStock === 0) {
        hasCritical = true;
      } else if (item.currentStock <= item.reorderThreshold || days < 7) {
        hasWarning = true;
      }
    });

    if (hasCritical) return { status: 'red', label: 'Urgent' };
    if (hasWarning) return { status: 'yellow', label: 'Running Low' };
    return { status: 'green', label: 'All Good' };
  };

  const stockInfo = computeStockStatus();

  // 2. Footfall Today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayFootfall = footfall[todayStr]?.patientCount ?? 0;

  // 3. Bed Availability
  const totalBeds = centre.totalBeds ?? centre.bedsTotal ?? 0;
  const occupiedBeds = centre.occupiedBeds ?? centre.bedsOccupied ?? 0;
  const availableBeds = totalBeds - occupiedBeds;
  const bedAvailabilityPercent = totalBeds > 0 
    ? Math.round((availableBeds / totalBeds) * 100) 
    : 0;

  // 4. Doctor Attendance
  const checkedInCount = attendance.filter(doc => doc.checkedIn).length;
  const totalDoctors = attendance.length;
  const doctorStatusText = totalDoctors > 0 ? `${checkedInCount}/${totalDoctors} Checked In` : 'No Doctor Roster';
  const doctorAttendanceStatus = checkedInCount > 0 ? 'checkedin' : 'checkedout';

  // Bubble resolved status to parent for parent-level statistics aggregation
  useEffect(() => {
    if (onMetricsResolved) {
      onMetricsResolved(centre.id, {
        stockStatus: stockInfo.status,
        todayFootfall,
        occupiedBeds: occupiedBeds,
        totalBeds: totalBeds,
        activeDoctors: checkedInCount,
        totalDoctors: totalDoctors
      });
    }
  }, [stockInfo.status, todayFootfall, occupiedBeds, totalBeds, checkedInCount, totalDoctors]);

  return (
    <Card 
      onClick={onClick}
      className="overflow-hidden hover:scale-[1.02] active:scale-[0.98] bg-white border-slate-100 shadow-sm"
    >
      <div className="flex flex-col space-y-4">
        {/* Card Title & Location */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
              {centre.name}
            </h4>
            <div className="flex items-center text-xs text-slate-455 text-slate-400 font-semibold">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-450" />
              {centre.location}
            </div>
          </div>
          <StatusBadge status={stockInfo.status} label={stockInfo.label} />
        </div>

        <hr className="border-slate-100" />

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {/* Footfall */}
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/50 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-wide">Patients Today</span>
            <div className="flex items-baseline space-x-1.5 mt-1.5">
              <span className="text-xl font-bold text-slate-800">{todayFootfall}</span>
              <span className="text-[10px] text-slate-400 font-semibold">patients</span>
            </div>
          </div>

          {/* Doctor Attendance */}
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/50 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-wide">Doctors Present</span>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">{doctorStatusText}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${checkedInCount > 0 ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse-subtle`}></span>
            </div>
          </div>
        </div>

        {/* Bed occupancy progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide text-slate-450">
            <span>Bed Availability</span>
            <span className="text-slate-700 whitespace-nowrap">{availableBeds} of {totalBeds} beds available</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              style={{ width: `${bedAvailabilityPercent}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                bedAvailabilityPercent < 15 
                  ? 'bg-rose-500' 
                  : bedAvailabilityPercent < 40 
                    ? 'bg-amber-500' 
                    : 'bg-emerald-500'
              }`}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function DistrictOverview() {
  const { 
    useLocalMock, 
    setUseLocalMock, 
    seeding, 
    seedDatabase 
  } = useHealthCentres();

  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, red, yellow, green
  const [metricsAggregator, setMetricsAggregator] = useState({});
  const navigate = useNavigate();

  // Alert State
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: '' }

  const triggerAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  // Subscribe to centers from DB
  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToCentres((centresList) => {
      setCentres(centresList);
      setLoading(false);
    }, useLocalMock);
    return () => unsub();
  }, [useLocalMock]);

  // Seeding button handler
  const handleSeedDatabase = async () => {
    if (!db) return;
    triggerAlert('success', 'Starting database seed... Please wait.');
    try {
      await seedDatabase();
      triggerAlert('success', 'Database seeded successfully! All health centres are now loaded.');
    } catch (err) {
      console.error(err);
      triggerAlert('error', `Seeding failed: ${err.message || err}`);
    }
  };

  const handleUseMockDataOnly = () => {
    setUseLocalMock(true);
    triggerAlert('success', 'Switched to Local Mock Preview Mode.');
  };

  // Handler to gather sub-component states for overall district summary cards
  const handleMetricsResolved = (centreId, metrics) => {
    setMetricsAggregator(prev => {
      // Only update if metrics have actually changed to avoid re-render loops
      if (
        prev[centreId] &&
        prev[centreId].stockStatus === metrics.stockStatus &&
        prev[centreId].todayFootfall === metrics.todayFootfall &&
        prev[centreId].occupiedBeds === metrics.occupiedBeds &&
        prev[centreId].totalBeds === metrics.totalBeds &&
        prev[centreId].activeDoctors === metrics.activeDoctors &&
        prev[centreId].totalDoctors === metrics.totalDoctors
      ) {
        return prev;
      }
      return { ...prev, [centreId]: metrics };
    });
  };

  // Compute aggregated stats
  const totalCentresCount = centres.length;
  const aggregatedStats = Object.values(metricsAggregator).reduce((acc, curr) => {
    acc.totalFootfall += curr.todayFootfall;
    acc.occupiedBeds += curr.occupiedBeds;
    acc.totalBeds += curr.totalBeds;
    acc.activeDoctors += curr.activeDoctors;
    acc.totalDoctors += curr.totalDoctors;
    if (curr.stockStatus === 'red') acc.criticalStockCount++;
    return acc;
  }, { totalFootfall: 0, occupiedBeds: 0, totalBeds: 0, activeDoctors: 0, totalDoctors: 0, criticalStockCount: 0 });

  const bedOccupancyRate = aggregatedStats.totalBeds > 0 
    ? Math.round((aggregatedStats.occupiedBeds / aggregatedStats.totalBeds) * 100)
    : 0;

  const doctorAttendanceRate = aggregatedStats.totalDoctors > 0
    ? Math.round((aggregatedStats.activeDoctors / aggregatedStats.totalDoctors) * 100)
    : 0;

  // Filter centres based on search query & stock health status
  const filteredCentres = centres.filter(centre => {
    const matchesSearch = (centre.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (centre.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const centreMetrics = metricsAggregator[centre.id];
    const matchesStatus = statusFilter === 'all' || (centreMetrics && centreMetrics.stockStatus === statusFilter);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 relative">
      {/* Alert Banner Container */}
      {alert && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2.5 px-6 py-4 rounded-2xl shadow-xl border text-sm font-semibold transition-all duration-300 animate-bounce ${
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

      {/* Top Banner section */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-900/10 border border-slate-800/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 transform translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-10 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">All Health Centres</h2>
            <p className="text-indigo-200 text-sm max-w-lg">
              Live updates on available beds, medicine stock levels, and active doctors for all health centres in your district.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs bg-slate-900/60 border border-slate-800/80 px-4 py-2.5 rounded-2xl">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">Live operational hours (08:00 - 20:00)</span>
          </div>
        </div>
      </div>

      {/* Aggregate metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Card: Total Centres */}
        <Card className="!p-0 border-l-4 border-l-indigo-500 bg-white">
          <div className="p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-widest block">Active Centres</span>
              <span className="text-3xl font-extrabold text-slate-800 block">{totalCentresCount}</span>
            </div>
            <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100/40 text-indigo-500">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Metric Card: Total Today Patients */}
        <Card className="!p-0 border-l-4 border-l-emerald-500 bg-white">
          <div className="p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-widest block">Patients Today</span>
              <span className="text-3xl font-extrabold text-slate-800 block">{aggregatedStats.totalFootfall}</span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100/40 text-emerald-500">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Metric Card: Bed Occupancy */}
        <Card className="!p-0 border-l-4 border-l-amber-500 bg-white">
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <span className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-widest block">Beds Available</span>
              <div className="flex flex-wrap items-baseline gap-x-1">
                <span className="text-xl font-extrabold text-slate-800 whitespace-nowrap">
                  {aggregatedStats.totalBeds - aggregatedStats.occupiedBeds} of {aggregatedStats.totalBeds}
                </span>
                <span className="text-[10px] font-bold text-slate-455 text-slate-400 whitespace-nowrap">available</span>
              </div>
            </div>
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100/40 text-amber-500 shrink-0">
              <Bed className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Metric Card: Critical Stock */}
        <Card className="!p-0 border-l-4 border-l-rose-500 bg-white">
          <div className="p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-widest block">Medicines Running Low</span>
              <span className="text-3xl font-extrabold text-slate-800 block">{aggregatedStats.criticalStockCount} centres</span>
            </div>
            <div className={`p-3 rounded-2xl border ${aggregatedStats.criticalStockCount > 0 ? 'bg-rose-50 border-rose-100 text-rose-500 animate-pulse' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-450" />
          <input
            type="text"
            placeholder="Search by health centre name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition-all"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[10px] font-bold text-slate-455 text-slate-400 uppercase tracking-wider flex items-center mr-1">
            <ListFilter className="w-3.5 h-3.5 mr-1" />
            Filter Stock Status:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Health Centres
          </button>
          <button
            onClick={() => setStatusFilter('green')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === 'green'
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-emerald-50 border-emerald-200/50 text-emerald-750 hover:bg-emerald-100/50'
            }`}
          >
            All Good
          </button>
          <button
            onClick={() => setStatusFilter('yellow')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === 'yellow'
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'bg-amber-50 border-amber-200/50 text-amber-750 hover:bg-amber-100/50'
            }`}
          >
            Running Low
          </button>
          <button
            onClick={() => setStatusFilter('red')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === 'red'
                ? 'bg-rose-500 border-rose-500 text-white'
                : 'bg-rose-50 border-rose-200/50 text-rose-750 hover:bg-rose-100/50'
            }`}
          >
            Urgent
          </button>
        </div>
      </div>

      {/* Grid of Centres */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : db && centres.length === 0 && !useLocalMock ? (
        <div className="bg-gradient-to-br from-indigo-50/50 via-slate-50 to-indigo-50/20 rounded-3xl p-8 md:p-12 border border-indigo-100 shadow-md flex flex-col items-center text-center max-w-2xl mx-auto my-6 animate-fade-in">
          <div className="bg-indigo-600/10 p-4 rounded-full text-indigo-650 mb-5 relative animate-pulse-subtle">
            <Building2 className="w-10 h-10 text-indigo-650" />
            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-indigo-600"></span>
            </span>
          </div>
          
          <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2">
            Database Configured & Ready
          </h3>
          <p className="text-slate-550 text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
            Your live Firestore project (<code className="bg-slate-100/90 text-indigo-700 px-1.5 py-0.5 rounded font-mono text-xs font-bold border border-slate-200">smart-health-39f2c</code>) is connected successfully, but it doesn't contain any operational data yet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-400 font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-indigo-650/15 cursor-pointer active:scale-97 text-sm"
            >
              {seeding ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Seeding Firestore...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Seed Live Database</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleUseMockDataOnly}
              className="flex-1 flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-6 rounded-2xl border border-slate-200 transition-all cursor-pointer text-sm shadow-sm active:scale-97"
            >
              <span>Preview with Mock Data</span>
            </button>
          </div>
          
          {seeding && (
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-8 overflow-hidden max-w-sm">
              <div className="bg-indigo-650 h-full rounded-full animate-pulse" style={{ width: '65%' }}></div>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-fade-in">
          {filteredCentres.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCentres.map((centre) => (
                <CentreCard
                  key={centre.id}
                  centre={centre}
                  onClick={() => navigate(`/centre/${centre.id}`)}
                  onMetricsResolved={handleMetricsResolved}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 py-16 px-4 text-center">
              <Building2 className="w-12 h-12 text-slate-350 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-lg">No Health Centres Found</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">
                We couldn't find any health center matching your search criteria. Try modifying your filters.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DistrictOverview;
