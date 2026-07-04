import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  subscribeToCentres, 
  subscribeToStock, 
  subscribeToFootfall, 
  subscribeToAttendance,
  subscribeToTests
} from '../db/firebase';
import { doctorProfiles } from '../db/mockData';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Bed, 
  Stethoscope, 
  FlaskConical, 
  AlertTriangle, 
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Database,
  CalendarCheck
} from 'lucide-react';

export function CentreDetail() {
  const { centreId } = useParams();
  const navigate = useNavigate();
  
  const [centre, setCentre] = useState(null);
  const [stock, setStock] = useState([]);
  const [footfall, setFootfall] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [tests, setTests] = useState([]);
  
  const [timeRange, setTimeRange] = useState(7); // 7 or 30 days
  const [loading, setLoading] = useState(true);

  // Subscribe to all inputs for this centre
  useEffect(() => {
    setLoading(true);
    
    // Listen to centres to extract our target centre details
    const unsubCentres = subscribeToCentres((centresList) => {
      const target = centresList.find(c => c.id === centreId);
      if (target) {
        setCentre(target);
      }
      setLoading(false);
    });

    const unsubStock = subscribeToStock(centreId, setStock);
    const unsubFootfall = subscribeToFootfall(centreId, setFootfall);
    const unsubAttendance = subscribeToAttendance(centreId, setAttendance);
    const unsubTests = subscribeToTests(centreId, setTests);

    return () => {
      unsubCentres();
      unsubStock();
      unsubFootfall();
      unsubAttendance();
      unsubTests();
    };
  }, [centreId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-semibold text-sm">Syncing clinic details...</p>
      </div>
    );
  }

  if (!centre) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 max-w-lg mx-auto mt-12">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="font-extrabold text-slate-800 text-xl">Centre Not Found</h3>
        <p className="text-slate-500 text-sm mt-2 mb-6">
          The health centre ID '{centreId}' could not be resolved in our district databases. It may have been decommissioned.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/10 text-sm"
        >
          Return to Overview
        </button>
      </div>
    );
  }

  // Formatting footfall data for Recharts
  const formatChartData = () => {
    const dates = Object.keys(footfall).sort();
    const lastNDates = dates.slice(-timeRange);
    
    return lastNDates.map(dateStr => {
      const dateObj = new Date(dateStr);
      const formattedDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      return {
        dateRaw: dateStr,
        date: formattedDate,
        patients: footfall[dateStr]?.patientCount || 0
      };
    });
  };

  const chartData = formatChartData();

  // Compute stats
  const bedOccupancyPercent = centre.totalBeds > 0 
    ? Math.round((centre.occupiedBeds / centre.totalBeds) * 100) 
    : 0;

  const lowStockItems = stock.filter(item => {
    const days = item.avgDailyUsage > 0 ? (item.currentStock / item.avgDailyUsage) : 999;
    return days < 3 || item.currentStock <= item.reorderThreshold;
  });

  const checkedInDoctors = attendance.filter(doc => doc.checkedIn);
  const checkedInCount = checkedInDoctors.length;
  const totalDoctors = attendance.length;

  return (
    <div className="space-y-6">
      {/* Back navigation and title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Link 
              to="/" 
              className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              District
            </Link>
            <span className="text-slate-350 text-xs">/</span>
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">{centre.name}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">{centre.name}</h2>
          <p className="text-slate-400 text-sm font-medium">{centre.location}</p>
        </div>

        {/* Action Header Button */}
        <Link
          to={`/centre/${centreId}/inventory`}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-white text-indigo-600 hover:text-indigo-700 border border-slate-100 hover:border-indigo-100/50 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all text-sm"
        >
          <Database className="w-4 h-4 text-indigo-500" />
          <span>Go to Stock Sheet</span>
          <ChevronRight className="w-4 h-4 text-indigo-400" />
        </Link>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bed Utilization Card */}
        <Card title="Bed Occupancy" icon={<Bed className="w-5 h-5 text-indigo-500" />}>
          <div className="flex items-center justify-between mt-2">
            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-slate-800">{bedOccupancyPercent}%</span>
              <span className="text-xs text-slate-400 font-semibold block">{centre.occupiedBeds} of {centre.totalBeds} beds occupied</span>
            </div>
            <div className="relative flex items-center justify-center">
              {/* Simple Circular Progress */}
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="26" 
                  stroke={bedOccupancyPercent > 80 ? '#ef4444' : '#6366f1'} 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray={163.3}
                  strokeDashoffset={163.3 - (163.3 * bedOccupancyPercent) / 100}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-slate-600">{centre.totalBeds - centre.occupiedBeds} free</span>
            </div>
          </div>
        </Card>

        {/* Doctor Duty Card */}
        <Card title="Roster Status" icon={<Stethoscope className="w-5 h-5 text-indigo-500" />}>
          <div className="flex items-center justify-between mt-2">
            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-slate-800">
                {totalDoctors > 0 ? `${checkedInCount} / ${totalDoctors}` : '0 / 0'}
              </span>
              <span className="text-xs text-slate-400 font-semibold block">Doctors currently checked in</span>
            </div>
            <div className="p-3.5 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100/40">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Low Stock Threats Card */}
        <Card title="Supply Risk Alerts" icon={<AlertTriangle className="w-5 h-5 text-indigo-500" />}>
          <div className="flex items-center justify-between mt-2">
            <div className="space-y-1">
              <span className={`text-3xl font-extrabold ${lowStockItems.length > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
                {lowStockItems.length}
              </span>
              <span className="text-xs text-slate-400 font-semibold block">Supply items below threshold</span>
            </div>
            <div className={`p-3.5 rounded-2xl border ${
              lowStockItems.length > 0 
                ? 'bg-rose-50 border-rose-100 text-rose-500' 
                : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Chart vs Sidebar panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Footfall Chart (Colspan 2) */}
        <Card 
          title="Patient Footfall Trend" 
          icon={<TrendingUp className="w-5 h-5 text-indigo-500" />}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6 mt-1">
            <span className="text-xs text-slate-400 font-semibold">Real-time daily patient registration counter</span>
            <div className="bg-slate-100 rounded-xl p-0.5 flex space-x-0.5 border border-slate-200/40">
              <button
                onClick={() => setTimeRange(7)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  timeRange === 7 
                    ? 'bg-white text-slate-850 shadow-sm text-slate-800' 
                    : 'text-slate-450 text-slate-400 hover:text-slate-650 hover:text-slate-600'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange(30)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  timeRange === 30 
                    ? 'bg-white text-slate-850 shadow-sm text-slate-800' 
                    : 'text-slate-450 text-slate-400 hover:text-slate-650 hover:text-slate-600'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight="bold" 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight="bold" 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    border: 'none', 
                    fontSize: '11px',
                    fontWeight: '600'
                  }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="#6366f1" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#patientGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Doctor Roster & Attendance Status */}
        <Card title="Active Duty Doctors" icon={<Stethoscope className="w-5 h-5 text-indigo-500" />}>
          <div className="space-y-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Duty Roster Today</div>
            {attendance.length > 0 ? (
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                {attendance.map((docRecord) => {
                  const profile = doctorProfiles[docRecord.doctorId] || { 
                    name: `Doctor (${docRecord.doctorId})`, 
                    specialty: 'Medical Specialist',
                    avatar: 'MD'
                  };
                  return (
                    <div key={docRecord.doctorId} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-600">
                          {profile.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800 leading-tight">{profile.name}</div>
                          <div className="text-[10px] text-slate-400 font-semibold">{profile.specialty}</div>
                        </div>
                      </div>
                      <StatusBadge 
                        status={docRecord.checkedIn ? 'checkedin' : 'checkedout'} 
                        label={docRecord.checkedIn ? 'Checked In' : 'Checked Out'}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No doctors registered on today's shift roster.
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Availability Status */}
        <Card title="Diagnostic Lab Services" icon={<FlaskConical className="w-5 h-5 text-indigo-500" />} className="lg:col-span-1">
          <div className="space-y-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Available Tests</div>
            {tests.length > 0 ? (
              <div className="space-y-2.5">
                {tests.map((test, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/20 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm font-bold text-slate-700">{test.name}</span>
                    <StatusBadge 
                      status={test.status === 'available' ? 'available' : 'unavailable'} 
                      label={test.status === 'available' ? 'Available' : 'Unavailable'}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No diagnostic test registers found.
              </div>
            )}
          </div>
        </Card>

        {/* Quick Inventory Alert List */}
        <Card title="Supply Health Risk Summary" icon={<Database className="w-5 h-5 text-indigo-500" />} className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Critical & Low Stock Items</span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100/30">
                {lowStockItems.length} items flagged
              </span>
            </div>

            {lowStockItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                {lowStockItems.map((item) => {
                  const days = item.avgDailyUsage > 0 ? (item.currentStock / item.avgDailyUsage) : 999;
                  const isOut = item.currentStock === 0;
                  const isCritical = days < 3;
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`p-3 rounded-xl border flex flex-col justify-between ${
                        isOut 
                          ? 'bg-rose-50/50 border-rose-100'
                          : isCritical 
                            ? 'bg-rose-50/30 border-rose-100/60'
                            : 'bg-amber-50/30 border-amber-100/60'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-bold text-slate-800 truncate pr-2">{item.name}</span>
                        <StatusBadge 
                          status={isCritical ? 'red' : 'yellow'} 
                          label={isOut ? 'Stockout' : isCritical ? 'Critical' : 'Low Stock'}
                        />
                      </div>
                      <div className="flex justify-between items-baseline mt-3">
                        <span className="text-xs text-slate-400 font-medium">Stock: <b className="text-slate-700 font-bold">{item.currentStock}</b></span>
                        <span className="text-xs text-slate-500 font-semibold bg-white px-2 py-0.5 rounded-lg border border-slate-100 shadow-sm">
                          {isOut ? 'Stockout' : `${days.toFixed(1)} days left`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm border border-dashed border-slate-200 rounded-2xl">
                <Database className="w-8 h-8 text-slate-350 mx-auto mb-2" />
                No supply threats! All stock lines are healthy and above reorder levels.
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Link 
                to={`/centre/${centreId}/inventory`}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center hover:underline"
              >
                Open detailed stock spreadsheet
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CentreDetail;
