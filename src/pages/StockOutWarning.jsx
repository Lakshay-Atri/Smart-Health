import React, { useState, useMemo } from 'react';
import { useHealthCentres } from '../context/HealthCentreContext';
import Card from '../components/shared/Card';
import StatusBadge from '../components/shared/StatusBadge';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { AlertTriangle, Clock, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const StockOutWarning = () => {
  const { stock, centres, loading } = useHealthCentres();
  const [warningThreshold, setWarningThreshold] = useState(5); // Default 5 days threshold

  // Flatten and calculate stock out statistics
  const atRiskItems = useMemo(() => {
    if (loading || Object.keys(stock).length === 0) return [];

    const items = [];

    centres.forEach(centre => {
      const centreStock = stock[centre.id] || {};
      Object.entries(centreStock).forEach(([itemId, item]) => {
        const usage = item.avgDailyUsage || 0;
        if (usage === 0) return; // Ignore items with no usage records

        const daysUntilStockout = item.currentStock / usage;

        // Create projected depletion path for chart (next 5 days)
        const chartData = [];
        for (let day = 0; day <= 5; day++) {
          const projectedStock = Math.max(0, item.currentStock - (day * usage));
          chartData.push({
            day: `Day ${day}`,
            stock: Math.round(projectedStock),
            threshold: item.reorderThreshold
          });
        }

        items.push({
          id: `${centre.id}_${itemId}`,
          centreName: centre.name,
          centreLocation: centre.location,
          itemName: item.name,
          currentStock: item.currentStock,
          avgDailyUsage: usage,
          reorderThreshold: item.reorderThreshold,
          daysUntilStockout,
          chartData
        });
      });
    });

    // Filter by threshold and sort by urgency (lowest days first)
    return items
      .filter(item => item.daysUntilStockout <= warningThreshold)
      .sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);
  }, [stock, centres, loading, warningThreshold]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-slate-400 animate-pulse text-sm">Loading early warning system data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <AlertTriangle className="text-rose-400 w-7 h-7" />
            Stock-Out Early Warning
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time analytics predicting pharmacy and medical supply depletion across clinics.
          </p>
        </div>

        {/* Dynamic Threshold Slider */}
        <div className="glass-panel p-3.5 rounded-xl flex items-center gap-4 border border-slate-800">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 block">
              Urgency Threshold: <span className="text-indigo-400 text-sm font-bold">{warningThreshold} Days</span>
            </label>
            <input 
              type="range" 
              min="2" 
              max="14" 
              value={warningThreshold} 
              onChange={(e) => setWarningThreshold(Number(e.target.value))}
              className="w-44 accent-indigo-500 cursor-pointer h-1.5 bg-slate-850 rounded-lg appearance-none"
            />
          </div>
          <div className="h-8 w-px bg-slate-850" />
          <div className="text-right">
            <span className="text-xs text-slate-500 block">At-Risk Count</span>
            <span className={`text-xl font-bold ${atRiskItems.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {atRiskItems.length}
            </span>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card title="Immediate Crisis Items" hoverEffect={false} className="border-l-4 border-l-rose-500 bg-gradient-to-r from-rose-950/10 to-transparent">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-extrabold text-rose-400">
                {atRiskItems.filter(i => i.daysUntilStockout <= 2).length}
              </p>
              <p className="text-xs text-slate-400 mt-1">Depleting within 48 Hours</p>
            </div>
            <Clock className="w-10 h-10 text-rose-500/20" />
          </div>
        </Card>

        <Card title="Upcoming Warnings" hoverEffect={false} className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-950/10 to-transparent">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-extrabold text-amber-400">
                {atRiskItems.filter(i => i.daysUntilStockout > 2 && i.daysUntilStockout <= 5).length}
              </p>
              <p className="text-xs text-slate-400 mt-1">Depleting in 3-5 Days</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-amber-500/20" />
          </div>
        </Card>

        <Card title="System Safety Status" hoverEffect={false} className="border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-950/10 to-transparent">
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-xl font-bold ${atRiskItems.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {atRiskItems.length > 0 ? 'Needs Attention' : 'Optimal'}
              </p>
              <p className="text-xs text-slate-400 mt-1">All facilities operating safely</p>
            </div>
            <ShieldCheck className="w-10 h-10 text-emerald-500/20" />
          </div>
        </Card>
      </div>

      {/* Main List */}
      {atRiskItems.length === 0 ? (
        <Card hoverEffect={false} className="flex flex-col items-center justify-center py-16 text-center">
          <ShieldCheck className="w-16 h-16 text-emerald-500/30 mb-4" />
          <h3 className="text-lg font-semibold text-slate-200">No Stock-Out Risks Found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-md">
            All medical supplies and items across centres are currently above the safety threshold of {warningThreshold} days.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <div className="col-span-3">Item Details</div>
            <div className="col-span-2">Health Centre</div>
            <div className="col-span-1 text-center">Current Stock</div>
            <div className="col-span-1 text-center">Daily Usage</div>
            <div className="col-span-2 text-center">Status / Urgency</div>
            <div className="col-span-3 text-center">Projected 5-Day Depletion</div>
          </div>

          {atRiskItems.map((item) => {
            const urgency = item.daysUntilStockout <= 2 ? 'at_risk' : 'warning';
            return (
              <div 
                key={item.id} 
                className="glass-panel hover:border-slate-700 rounded-xl p-5 lg:p-6 transition-all duration-200 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center"
              >
                {/* Item Details */}
                <div className="col-span-1 lg:col-span-3 space-y-1">
                  <h4 className="font-semibold text-slate-100 text-base">{item.itemName}</h4>
                  <span className="text-xs text-slate-500 block">ID: {item.id.split('_')[1]}</span>
                </div>

                {/* Centre Details */}
                <div className="col-span-1 lg:col-span-2 space-y-1">
                  <span className="text-sm text-slate-200 font-medium block">{item.centreName}</span>
                  <span className="text-xs text-slate-500 block">{item.centreLocation}</span>
                </div>

                {/* Current Stock */}
                <div className="col-span-1 lg:col-span-1 flex lg:flex-col items-center justify-between lg:justify-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 lg:hidden uppercase tracking-wider">Current Stock</span>
                  <div className="text-center">
                    <span className="text-base font-bold text-slate-100">{item.currentStock}</span>
                    <span className="text-xs text-slate-500 block lg:inline"> units</span>
                  </div>
                </div>

                {/* Daily Usage */}
                <div className="col-span-1 lg:col-span-1 flex lg:flex-col items-center justify-between lg:justify-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 lg:hidden uppercase tracking-wider">Daily Usage</span>
                  <div className="text-center">
                    <span className="text-sm font-semibold text-slate-300">-{item.avgDailyUsage}</span>
                    <span className="text-xs text-slate-500 block">/day</span>
                  </div>
                </div>

                {/* Days remaining and Status */}
                <div className="col-span-1 lg:col-span-2 flex lg:flex-col items-center justify-between lg:justify-center gap-4">
                  <span className="text-xs font-semibold text-slate-400 lg:hidden uppercase tracking-wider">Urgency</span>
                  <div className="text-center flex flex-col items-center justify-center gap-1.5">
                    <StatusBadge status={urgency} text={`${item.daysUntilStockout.toFixed(1)} Days Left`} />
                    <span className="text-[10px] text-slate-500">Reorder Threshold: {item.reorderThreshold}</span>
                  </div>
                </div>

                {/* Depletion Chart */}
                <div className="col-span-1 lg:col-span-3 flex flex-col justify-center">
                  <span className="text-xs font-semibold text-slate-400 lg:hidden uppercase tracking-wider mb-2">Depletion Trend</span>
                  <div className="h-16 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={item.chartData} margin={{ top: 2, right: 10, left: 10, bottom: 2 }}>
                        <XAxis dataKey="day" hide />
                        <YAxis domain={[0, 'dataMax']} hide />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs shadow-xl backdrop-blur-md">
                                  <p className="font-semibold text-slate-200">{data.day}</p>
                                  <p className="text-indigo-400">Stock: <span className="font-bold">{data.stock}</span></p>
                                  <p className="text-slate-500">Threshold: {data.threshold}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        {/* Reference Line showing the safety threshold */}
                        <ReferenceLine y={item.reorderThreshold} stroke="#f59e0b" strokeDasharray="3 3" opacity={0.5} />
                        <Line 
                          type="monotone" 
                          dataKey="stock" 
                          stroke={item.daysUntilStockout <= 2 ? '#f43f5e' : '#f59e0b'} 
                          strokeWidth={2.5}
                          dot={{ r: 3, fill: item.daysUntilStockout <= 2 ? '#f43f5e' : '#f59e0b', strokeWidth: 0 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StockOutWarning;
