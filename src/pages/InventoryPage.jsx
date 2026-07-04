import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { subscribeToStock, subscribeToCentres } from '../db/firebase';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { 
  ArrowLeft, 
  Search, 
  ArrowUpDown, 
  AlertTriangle,
  CheckCircle,
  Database,
  Building2,
  Info,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export function InventoryPage() {
  const { centreId } = useParams();
  
  const [centre, setCentre] = useState(null);
  const [stock, setStock] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, critical, low, healthy
  const [sortField, setSortField] = useState('name'); // name, currentStock, reorderThreshold, daysUntilStockout
  const [sortDirection, setSortDirection] = useState('asc'); // asc or desc
  const [loading, setLoading] = useState(true);

  // Subscribe to inputs
  useEffect(() => {
    setLoading(true);
    
    const unsubCentres = subscribeToCentres((centresList) => {
      const target = centresList.find(c => c.id === centreId);
      if (target) {
        setCentre(target);
      }
      setLoading(false);
    });

    const unsubStock = subscribeToStock(centreId, setStock);

    return () => {
      unsubCentres();
      unsubStock();
    };
  }, [centreId]);

  // Handle Header Click for Sorting
  const requestSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Compute calculated stock attributes
  const processStockItems = () => {
    return stock.map(item => {
      const daysUntilStockout = item.avgDailyUsage > 0 
        ? item.currentStock / item.avgDailyUsage 
        : 999; // Represents infinite days
      
      const isCritical = daysUntilStockout < 3 || item.currentStock === 0;
      const isLow = item.currentStock <= item.reorderThreshold && !isCritical;
      
      return {
        ...item,
        daysUntilStockout,
        isCritical,
        isLow
      };
    });
  };

  const processedStock = processStockItems();

  // Apply search & filterType
  const filteredStock = processedStock.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'critical') return matchesSearch && item.isCritical;
    if (filterType === 'low') return matchesSearch && (item.isLow || item.isCritical);
    if (filterType === 'healthy') return matchesSearch && !item.isCritical && !item.isLow;
    
    return matchesSearch;
  });

  // Apply sorting
  const sortedStock = [...filteredStock].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'name') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Count summaries
  const criticalCount = processedStock.filter(i => i.isCritical).length;
  const lowCount = processedStock.filter(i => i.isLow).length;
  const healthyCount = processedStock.filter(i => !i.isCritical && !i.isLow).length;

  // Sorting indicator utility
  const renderSortArrow = (field) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-slate-400 opacity-60" />;
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-3.5 h-3.5 ml-1 text-indigo-600" />
      : <ChevronDown className="w-3.5 h-3.5 ml-1 text-indigo-600" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-semibold text-sm">Syncing inventory database...</p>
      </div>
    );
  }

  if (!centre) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 max-w-lg mx-auto mt-12">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="font-extrabold text-slate-800 text-xl">Centre Not Found</h3>
        <p className="text-slate-505 text-sm mt-2 mb-6">
          Could not retrieve stock database. The health center ID '{centreId}' was not recognized.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/10 text-sm"
        >
          Return to Overview
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Back Link */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Link 
            to={`/centre/${centreId}`}
            className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            {centre.name}
          </Link>
          <span className="text-slate-350 text-xs">/</span>
          <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Inventory</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Stock Sheet Manager</h2>
            <p className="text-slate-400 text-sm font-medium">Real-time depletion tracking and reorder sheets for {centre.name}.</p>
          </div>
          <div className="flex items-center space-x-1 text-xs text-slate-400 bg-white border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm">
            <Building2 className="w-4 h-4 text-slate-400 mr-1.5" />
            <span className="font-semibold text-slate-700">{centre.location}</span>
          </div>
        </div>
      </div>

      {/* Row Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total unique items */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Items</span>
          <span className="text-2xl font-extrabold text-slate-850 text-slate-800 block mt-1">{processedStock.length}</span>
        </div>

        {/* Critical items count */}
        <div className={`border p-4 rounded-2xl shadow-sm ${criticalCount > 0 ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100'}`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${criticalCount > 0 ? 'text-rose-700' : 'text-slate-400'}`}>Critical Depletions</span>
          <span className={`text-2xl font-extrabold block mt-1 ${criticalCount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>{criticalCount}</span>
        </div>

        {/* Low items count */}
        <div className={`border p-4 rounded-2xl shadow-sm ${lowCount > 0 ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-100'}`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${lowCount > 0 ? 'text-amber-700' : 'text-slate-400'}`}>Below Threshold</span>
          <span className={`text-2xl font-extrabold block mt-1 ${lowCount > 0 ? 'text-amber-600' : 'text-slate-800'}`}>{lowCount}</span>
        </div>

        {/* Fully stocked count */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stable Items</span>
          <span className="text-2xl font-extrabold text-emerald-600 block mt-1">{healthyCount}</span>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search catalog by item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium transition-all"
          />
        </div>

        {/* Filter categories */}
        <div className="flex space-x-1.5 overflow-x-auto pb-0.5 md:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filterType === 'all'
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-650 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Catalog
          </button>
          <button
            onClick={() => setFilterType('critical')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filterType === 'critical'
                ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                : 'bg-rose-50 border-rose-200/50 text-rose-700 hover:bg-rose-100/50'
            }`}
          >
            Critical (&lt;3 Days)
          </button>
          <button
            onClick={() => setFilterType('low')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filterType === 'low'
                ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                : 'bg-amber-50 border-amber-200/50 text-amber-700 hover:bg-amber-100/50'
            }`}
          >
            Alerts / Low
          </button>
          <button
            onClick={() => setFilterType('healthy')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filterType === 'healthy'
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 border-emerald-200/50 text-emerald-700 hover:bg-emerald-100/50'
            }`}
          >
            Stable Stock
          </button>
        </div>
      </div>

      {/* Main Stock Table */}
      <Card className="!p-0 overflow-hidden">
        {sortedStock.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th 
                    onClick={() => requestSort('name')}
                    className="py-4 px-6 cursor-pointer select-none hover:text-indigo-600 transition-colors"
                  >
                    <div className="flex items-center">
                      Item Name
                      {renderSortArrow('name')}
                    </div>
                  </th>
                  <th 
                    onClick={() => requestSort('currentStock')}
                    className="py-4 px-6 cursor-pointer select-none hover:text-indigo-600 transition-colors text-right"
                  >
                    <div className="flex items-center justify-end">
                      Current Quantity
                      {renderSortArrow('currentStock')}
                    </div>
                  </th>
                  <th 
                    onClick={() => requestSort('reorderThreshold')}
                    className="py-4 px-6 cursor-pointer select-none hover:text-indigo-600 transition-colors text-right"
                  >
                    <div className="flex items-center justify-end">
                      Reorder Threshold
                      {renderSortArrow('reorderThreshold')}
                    </div>
                  </th>
                  <th 
                    onClick={() => requestSort('avgDailyUsage')}
                    className="py-4 px-6 cursor-pointer select-none hover:text-indigo-600 transition-colors text-right"
                  >
                    <div className="flex items-center justify-end">
                      Avg Daily Burn
                      {renderSortArrow('avgDailyUsage')}
                    </div>
                  </th>
                  <th 
                    onClick={() => requestSort('daysUntilStockout')}
                    className="py-4 px-6 cursor-pointer select-none hover:text-indigo-600 transition-colors text-right"
                  >
                    <div className="flex items-center justify-end">
                      Days Until Stockout
                      {renderSortArrow('daysUntilStockout')}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedStock.map((item) => {
                  // Check color alert requirements
                  const isRed = item.daysUntilStockout < 3;
                  const isYellow = item.currentStock <= item.reorderThreshold && !isRed;
                  
                  let rowClass = 'hover:bg-slate-50/50 transition-colors';
                  if (isRed) {
                    rowClass = 'bg-rose-50/50 hover:bg-rose-100/30 text-slate-800 transition-colors';
                  } else if (isYellow) {
                    rowClass = 'bg-amber-50/20 hover:bg-amber-100/20 text-slate-800 transition-colors';
                  }

                  return (
                    <tr key={item.id} className={rowClass}>
                      {/* Name */}
                      <td className="py-4.5 px-6 py-4 font-bold text-sm text-slate-800">
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">ID: {item.id}</span>
                        </div>
                      </td>
                      
                      {/* Current Stock */}
                      <td className="py-4.5 px-6 py-4 text-right font-bold text-sm text-slate-800">
                        {item.currentStock.toLocaleString()}
                      </td>
                      
                      {/* Reorder Threshold */}
                      <td className="py-4.5 px-6 py-4 text-right font-semibold text-xs text-slate-400">
                        {item.reorderThreshold.toLocaleString()}
                      </td>

                      {/* Avg Daily Usage */}
                      <td className="py-4.5 px-6 py-4 text-right font-semibold text-xs text-slate-400">
                        {item.avgDailyUsage} / day
                      </td>
                      
                      {/* Days Until Stockout */}
                      <td className="py-4.5 px-6 py-4 text-right font-extrabold text-sm">
                        {item.currentStock === 0 ? (
                          <span className="text-rose-600 animate-pulse">0.0 (Immediate)</span>
                        ) : item.daysUntilStockout === 999 ? (
                          <span className="text-slate-400 font-semibold">N/A (Stable)</span>
                        ) : (
                          <span className={isRed ? 'text-rose-600' : isYellow ? 'text-amber-600' : 'text-emerald-600'}>
                            {item.daysUntilStockout.toFixed(1)} days
                          </span>
                        )}
                      </td>
                      
                      {/* Status badge */}
                      <td className="py-4.5 px-6 py-4 text-center">
                        <StatusBadge 
                          status={
                            item.currentStock === 0 
                              ? 'red' 
                              : isRed 
                                ? 'red' 
                                : isYellow 
                                  ? 'yellow' 
                                  : 'green'
                          } 
                          label={
                            item.currentStock === 0 
                              ? 'Stockout' 
                              : isRed 
                                ? 'Critical Risk' 
                                : isYellow 
                                  ? 'Reorder Alert' 
                                  : 'Stock Healthy'
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">No Inventory Items Found</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">
              There are no catalog lines matching your filter settings or search string.
            </p>
          </div>
        )}
      </Card>
      
      {/* Information Helper box */}
      <div className="flex items-start space-x-3 bg-indigo-50/50 border border-indigo-150 border-indigo-100 p-4.5 rounded-2xl text-xs text-indigo-750">
        <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-indigo-900">Formulas & Depletion Metrics</h5>
          <p className="text-indigo-700/90 font-medium">
            The <b>Days Until Stockout</b> is computed live as <code className="bg-indigo-100/80 px-1 py-0.5 rounded font-mono font-bold text-indigo-800">Current Stock / Avg Daily Burn Rate</code>. 
            Rows highlighted in red indicate supply lines that will reach stockout within 3 days based on current burn rates and require immediate requisition orders from district reserves.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;
