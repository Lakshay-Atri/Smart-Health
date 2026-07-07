import React, { useState } from 'react';
import { useHealthCentres } from '../context/HealthCentreContext';
import { useDemandForecast } from '../hooks/useDemandForecast';
import Card from '../components/shared/Card';
import { 
  ResponsiveContainer, 
  ComposedChart,
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { TrendingUp, Users, Calendar, Info, MapPin } from 'lucide-react';

export const FootfallForecast = () => {
  const { centres, footfall, loading } = useHealthCentres();
  
  // States to customize moving average window in UI
  const [windowSize, setWindowSize] = useState(7);
  const [selectedCentreId, setSelectedCentreId] = useState('c1');

  // Find selected centre details
  const activeCentre = centres.find(c => c.id === selectedCentreId) || centres[0];
  const activeHistorical = footfall[activeCentre?.id] || [];

  // Generate forecast data using our custom SMA hook
  const forecastData = useDemandForecast(activeHistorical, 7, windowSize);

  // Split data into actual vs forecast sets for seamless charting
  const chartData = React.useMemo(() => {
    if (forecastData.length === 0) return [];
    
    // To make a continuous line chart, the forecasted line needs to start from the last actual point.
    // So we project:
    // actualData: has actual count, forecast count as null
    // forecastData: has forecast count, actual count is null EXCEPT for the boundary point which has both!
    const lastActualIndex = forecastData.findIndex(d => d.isForecast) - 1;
    
    return forecastData.map((d, index) => {
      const isBoundary = index === lastActualIndex;
      return {
        date: d.date.substring(5), // YYYY-MM-DD -> MM-DD for cleaner X axis
        actual: d.isForecast ? null : d.patientCount,
        forecast: (d.isForecast || isBoundary) ? d.patientCount : null,
      };
    });
  }, [forecastData]);

  // Calculate statistics for display cards
  const stats = React.useMemo(() => {
    if (activeHistorical.length === 0 || forecastData.length === 0) {
      return { avgActual: 0, peakForecast: 0, percentChange: 0 };
    }

    const sumActual = activeHistorical.reduce((sum, r) => sum + r.patientCount, 0);
    const avgActual = Math.round(sumActual / activeHistorical.length);

    const forecastedRecords = forecastData.filter(d => d.isForecast);
    const peakForecast = Math.max(...forecastedRecords.map(d => d.patientCount));

    const avgForecast = forecastedRecords.reduce((sum, r) => sum + r.patientCount, 0) / forecastedRecords.length;
    const percentChange = ((avgForecast - avgActual) / avgActual) * 100;

    return { avgActual, peakForecast, percentChange };
  }, [activeHistorical, forecastData]);

  if (loading || !activeCentre) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-slate-400 animate-pulse text-sm">Computing Simple Moving Average forecasts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-indigo-500 w-7 h-7" />
            Expected Patients Next Week
          </h1>
          <p className="text-slate-505 text-sm mt-1">
            Based on how many patients visited in past weeks.
          </p>
        </div>

        {/* Customization controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Centre Select */}
          <div className="flex items-center gap-2 bg-white border border-slate-150 rounded-lg px-3 py-1.5 shadow-sm">
            <MapPin className="w-4 h-4 text-slate-450" />
            <select
              value={selectedCentreId}
              onChange={(e) => setSelectedCentreId(e.target.value)}
              className="bg-transparent text-sm text-slate-750 border-none outline-none font-semibold pr-8 cursor-pointer focus:ring-0"
            >
              {centres.map(c => (
                <option key={c.id} value={c.id} className="bg-white text-slate-800">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* SMA Window Select */}
          <div className="flex items-center gap-2 bg-white border border-slate-150 rounded-lg px-3 py-1.5 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-450" />
            <span className="text-xs text-slate-500 font-semibold">Average Window:</span>
            <select
              value={windowSize}
              onChange={(e) => setWindowSize(Number(e.target.value))}
              className="bg-transparent text-sm text-indigo-650 border-none outline-none font-bold cursor-pointer focus:ring-0"
            >
              <option value={3} className="bg-white text-slate-800">3 Days</option>
              <option value={5} className="bg-white text-slate-800">5 Days</option>
              <option value={7} className="bg-white text-slate-800">7 Days (Default)</option>
              <option value={10} className="bg-white text-slate-800">10 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Clinics summary cards & active details */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Clinic selector side list */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-xs font-semibold text-slate-505 uppercase tracking-wider block px-1">Registered Centres</span>
          
          {centres.map(centre => {
            const isActive = centre.id === selectedCentreId;
            const records = footfall[centre.id] || [];
            const lastRecord = records[records.length - 1];
            
            return (
              <div
                key={centre.id}
                onClick={() => setSelectedCentreId(centre.id)}
                className={`
                  p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col gap-1.5 shadow-sm
                  ${isActive 
                    ? 'bg-indigo-50 border-indigo-500/80 shadow-md' 
                    : 'bg-white border-slate-150 hover:bg-slate-50 hover:border-slate-300'}
                `}
              >
                <div className="flex justify-between items-start gap-1">
                  <h3 className={`font-semibold text-sm truncate ${isActive ? 'text-indigo-900 font-bold' : 'text-slate-850'}`}>{centre.name}</h3>
                </div>
                <div className="flex items-center justify-between text-xs mt-1 text-slate-500 font-medium">
                  <span className="truncate">{centre.location}</span>
                  <span className="bg-slate-50 px-2 py-0.5 rounded text-indigo-650 font-bold border border-slate-150">
                    {lastRecord ? lastRecord.patientCount : '-'} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Chart & Forecast Statistics */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Quick stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-white border border-slate-150 shadow-sm p-4 rounded-xl flex items-center gap-4">
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Avg Daily Load</span>
                <p className="text-xl font-extrabold text-slate-800 mt-0.5">{stats.avgActual} <span className="text-xs font-normal text-slate-500">patients</span></p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 shadow-sm p-4 rounded-xl flex items-center gap-4">
              <div className="bg-violet-50 p-3 rounded-lg border border-violet-100">
                <TrendingUp className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Expected Peak Patients</span>
                <p className="text-xl font-extrabold text-slate-800 mt-0.5">{stats.peakForecast} <span className="text-xs font-normal text-rose-600">pts/day</span></p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 shadow-sm p-4 rounded-xl flex items-center gap-4">
              <div className={`p-3 rounded-lg border ${stats.percentChange >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                <TrendingUp className={`w-5 h-5 ${stats.percentChange >= 0 ? 'text-emerald-600' : 'text-rose-600'} ${stats.percentChange < 0 ? 'transform rotate-180' : ''}`} />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Expected Trend</span>
                <p className={`text-xl font-bold mt-0.5 ${stats.percentChange >= 0 ? 'text-emerald-650' : 'text-rose-600'}`}>
                  {stats.percentChange >= 0 ? '+' : ''}{stats.percentChange.toFixed(1)}%
                </p>
              </div>
            </div>
            
          </div>

          {/* Recharts Chart */}
          <Card 
            title={`${activeCentre.name} Patient Numbers`}
            subtitle="Actual patient visits (last 14 days) and expected patients next week"
            hoverEffect={false}
            className="bg-white border border-slate-100 shadow-sm"
          >
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid stroke="#e2e8f0" vertical={false} strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const isActual = payload[0].value !== null;
                        const ptCount = isActual ? payload[0].value : payload[1]?.value;
                        return (
                          <div className="bg-slate-900 border border-slate-850 rounded-lg p-3 text-xs text-white shadow-xl backdrop-blur-md">
                            <p className="font-semibold text-slate-200">{`Date: ${data.date}`}</p>
                            <p className="mt-1 font-bold text-sm text-indigo-300">
                              Patient Load: {ptCount}
                            </p>
                            <p className={`text-[10px] font-semibold mt-1 uppercase ${isActual ? 'text-indigo-300' : 'text-violet-300'}`}>
                              {isActual ? '● Past Visits' : '◌ Expected Patients'}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-xs text-slate-600 font-medium capitalize pr-3">{value}</span>}
                  />
                  {/* Historical load line */}
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    name="Past Visits" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ r: 4, stroke: '#fff', strokeWidth: 2, fill: '#6366f1' }}
                    activeDot={{ r: 6 }}
                  />
                  {/* Projected load line */}
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    name="Expected Patients Next Week" 
                    stroke="#8b5cf6" 
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-150">
              <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-655 leading-relaxed font-medium">
                <strong>Calculation Note:</strong> The expected patient line shows a running average of the past weeks to smooth out day-to-day jumps and show the general trend.
              </p>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default FootfallForecast;
