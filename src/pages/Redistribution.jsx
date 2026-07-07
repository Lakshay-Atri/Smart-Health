import React, { useState, useMemo } from 'react';
import { useHealthCentres } from '../context/HealthCentreContext';
import Card from '../components/shared/Card';
import StatusBadge from '../components/shared/StatusBadge';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  ReferenceLine 
} from 'recharts';
import { ArrowRight, Send, CheckCircle2, AlertCircle, RefreshCw, BarChart4, HelpCircle } from 'lucide-react';

export const Redistribution = () => {
  const { suggestions, actionSuggestion, stock, centres, loading } = useHealthCentres();
  
  // Selected item ID for detailed comparison chart
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  // Animate dismissed cards
  const [dismissingIds, setDismissingIds] = useState([]);

  const handleAction = (id) => {
    setDismissingIds(prev => [...prev, id]);
    // Allow animation to finish
    setTimeout(() => {
      actionSuggestion(id);
      setDismissingIds(prev => prev.filter(item => item !== id));
    }, 300);
  };

  // Get currently selected item details
  const selectedItemDetails = useMemo(() => {
    if (!selectedItemId || loading) return null;
    
    // Find item name
    let itemName = '';
    const comparisonData = centres.map(centre => {
      const itemStock = stock[centre.id]?.[selectedItemId] || {};
      if (itemStock.name) itemName = itemStock.name;
      const cleanName = (centre.name || 'Clinic').replace(' Health Hub', '').replace(' Community Clinic', '').replace(' General Outpost', '').replace(' Wellness Station', '');
      return {
        centreName: cleanName,
        stock: itemStock.currentStock || 0,
        threshold: itemStock.reorderThreshold || 0,
        isSurplus: itemStock.currentStock > (itemStock.reorderThreshold * 2),
        isShortage: itemStock.currentStock < itemStock.reorderThreshold
      };
    });

    return { itemId: selectedItemId, itemName, comparisonData };
  }, [selectedItemId, centres, stock, loading]);

  // Set default selected item if none selected and suggestions exist
  React.useEffect(() => {
    if (suggestions.length > 0 && !selectedItemId) {
      setSelectedItemId(suggestions[0].itemId);
    }
  }, [suggestions, selectedItemId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-slate-400 animate-pulse text-sm">Running redistribution comparative engines...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
          <RefreshCw className="text-indigo-500 w-7 h-7 animate-spin-slow" />
          Move Supplies Between Centres
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          We recommend moving stock from centres with extra supplies to those that are running low.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Suggestions List */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2 px-1">
            <Send className="w-4 h-4 text-indigo-500" />
            Suggested Stock Transfers ({suggestions.length})
          </h2>

          {suggestions.length === 0 ? (
            <Card hoverEffect={false} className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-100 shadow-sm">
              <CheckCircle2 className="w-16 h-16 text-emerald-500/20 mb-4" />
              <h3 className="text-lg font-semibold text-slate-800">All Medicine Stock Balanced</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                No active transfer suggestions. The redistribution engine did not find any facilities with stock shortages that can be supplied by existing surpluses.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((s) => {
                const isSelected = selectedItemId === s.itemId;
                const isDismissing = dismissingIds.includes(s.id);
                
                return (
                  <div 
                    key={s.id}
                    onClick={() => setSelectedItemId(s.itemId)}
                    className={`
                      bg-white border border-slate-150 hover:border-slate-350 rounded-xl p-5 cursor-pointer shadow-sm transition-all duration-300 flex flex-col justify-between gap-4
                      ${isSelected ? 'border-indigo-500/80 ring-1 ring-indigo-500/10' : ''}
                      ${isDismissing ? 'opacity-0 scale-95 duration-300' : 'opacity-100 scale-100'}
                    `}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-semibold text-slate-800 text-base">{s.itemName}</h4>
                        <span className="text-xs text-slate-450 font-medium">ID: {s.itemId}</span>
                      </div>
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-150 font-bold px-2 py-0.5 rounded text-[10px]">
                        Transfer Qty: {s.qty}
                      </span>
                    </div>

                    {/* Transfer Visual */}
                    <div className="grid grid-cols-5 gap-2 items-center bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <div className="col-span-2 text-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">From</span>
                        <span className="text-xs text-slate-800 font-bold truncate block mt-0.5">{s.sourceCentreName}</span>
                        <span className="text-[10px] text-emerald-700 font-bold block mt-1">Stock: {s.sourceStock}</span>
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <ArrowRight className="w-5 h-5 text-indigo-500 animate-pulse-subtle" />
                      </div>

                      <div className="col-span-2 text-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">To</span>
                        <span className="text-xs text-slate-800 font-bold truncate block mt-0.5">{s.destCentreName}</span>
                        <span className="text-[10px] text-rose-700 font-bold block mt-1">Stock: {s.destStock}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-slate-550 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        Prevents running out of stock
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Avoid triggering details select
                          handleAction(s.id);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-bold py-1.5 px-3 rounded-lg shadow-lg flex items-center gap-1.5 transition-colors border border-indigo-400/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Done
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Comparative Chart Detail */}
        <div className="xl:col-span-1 space-y-4">
          <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2 px-1">
            <BarChart4 className="w-4 h-4 text-indigo-500" />
            Comparative Stock Levels
          </h2>

          {selectedItemDetails ? (
            <Card hoverEffect={false} className="h-full flex flex-col justify-between min-h-[400px] bg-white border-slate-100 shadow-sm">
              <div className="mb-4">
                <span className="text-[10px] text-indigo-650 font-bold uppercase tracking-wider block">Selected Supply Item</span>
                <h3 className="text-lg font-bold text-slate-800 mt-0.5">{selectedItemDetails.itemName}</h3>
                <span className="text-xs text-slate-500">Inventory comparison across all registered facilities.</span>
              </div>

              {/* Recharts Bar Chart */}
              <div className="h-64 w-full my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedItemDetails.comparisonData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                    <XAxis dataKey="centreName" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 border border-slate-850 rounded-lg p-3 text-xs text-white shadow-xl backdrop-blur-md">
                              <p className="font-semibold text-slate-200">{payload[0].name}</p>
                              <p className="text-indigo-300 font-bold mt-1">Stock: {data.stock} units</p>
                              <p className="text-slate-400">Restock Level: {data.threshold}</p>
                              {data.isSurplus && <p className="text-emerald-400 font-semibold mt-1">● Extra Supplies</p>}
                              {data.isShortage && <p className="text-rose-400 font-semibold mt-1">● Shortage Alert</p>}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {selectedItemDetails.comparisonData && selectedItemDetails.comparisonData.length > 0 && selectedItemDetails.comparisonData[0].threshold !== undefined && (
                      <ReferenceLine y={selectedItemDetails.comparisonData[0].threshold} stroke="#f59e0b" strokeDasharray="3 3" />
                    )}
                    <Bar dataKey="stock" name="Stock Count" radius={[4, 4, 0, 0]}>
                      {selectedItemDetails.comparisonData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isShortage ? '#ef4444' : entry.isSurplus ? '#10b981' : '#6366f1'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend explanation */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-slate-700 font-medium">Running Low (Below Restock Level)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-700 font-medium">Extra Supplies (Above 2x Restock Level)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-slate-700 font-medium">All Good (Safe stock levels)</span>
                </div>
              </div>
            </Card>
          ) : (
            <Card hoverEffect={false} className="flex flex-col items-center justify-center py-20 text-center bg-white border-slate-100 shadow-sm">
              <HelpCircle className="w-12 h-12 text-slate-400 mb-3" />
              <p className="text-sm text-slate-500">Select an item card to inspect the inventory balance chart.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Redistribution;
