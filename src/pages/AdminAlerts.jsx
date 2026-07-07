import React, { useState } from 'react';
import { useHealthCentres } from '../context/HealthCentreContext';
import Card from '../components/shared/Card';
import StatusBadge from '../components/shared/StatusBadge';
import { 
  Bell, 
  Trash2, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Filter,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';

export const AdminAlerts = () => {
  const { alerts, dismissAlert, resetInteractiveStates, loading } = useHealthCentres();
  
  // Filter states
  const [severityFilter, setSeverityFilter] = useState('all'); // all, danger, warning, info
  const [categoryFilter, setCategoryFilter] = useState('all'); // all, stock, attendance, overcrowding, underused
  const [dismissingIds, setDismissingIds] = useState([]);

  // Animate alert removal
  const handleDismiss = (id) => {
    setDismissingIds(prev => [...prev, id]);
    // Allow slide-out animation to complete
    setTimeout(() => {
      dismissAlert(id);
      setDismissingIds(prev => prev.filter(item => item !== id));
    }, 250);
  };

  // Filter alerts based on criteria
  const filteredAlerts = React.useMemo(() => {
    return alerts.filter(alert => {
      const matchSeverity = severityFilter === 'all' || alert.severity === severityFilter;
      const matchCategory = categoryFilter === 'all' || alert.category === categoryFilter;
      return matchSeverity && matchCategory;
    });
  }, [alerts, severityFilter, categoryFilter]);

  // Alert icon renderer based on severity
  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'danger':
        return <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-650 shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 text-sky-650 shrink-0" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-600 shrink-0" />;
    }
  };

  // Alert border color class based on severity
  const getAlertBorderClass = (severity) => {
    switch (severity) {
      case 'danger':
        return 'border-l-rose-500 hover:border-rose-600/40 bg-rose-50/50 border border-slate-150 shadow-sm';
      case 'warning':
        return 'border-l-amber-500 hover:border-amber-600/40 bg-amber-50/40 border border-slate-150 shadow-sm';
      case 'info':
        return 'border-l-sky-500 hover:border-sky-600/40 bg-sky-50/40 border border-slate-150 shadow-sm';
      default:
        return 'border-l-indigo-500 hover:border-indigo-600/40 bg-indigo-50/40 border border-slate-150 shadow-sm';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-slate-500 animate-pulse text-sm">Aggregating alerts and attendance cycles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Bell className="text-rose-500 w-7 h-7 animate-pulse" />
            Needs Attention
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Important tasks and warnings that need action across all facilities.
          </p>
        </div>

        {/* System controls */}
        <button
          onClick={resetInteractiveStates}
          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3.5 py-2 rounded-lg transition-colors shadow-sm outline-none cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          Reset Cleared Alerts
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-150 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
            <Filter className="w-3.5 h-3.5 text-indigo-500" />
            Filter Feed
          </span>
          
          {/* Severity Filters */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-250/60">
            <button 
              onClick={() => setSeverityFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${severityFilter === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-800'}`}
            >
              All ({alerts.length})
            </button>
            <button 
              onClick={() => setSeverityFilter('danger')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${severityFilter === 'danger' ? 'bg-rose-600 text-white shadow' : 'text-slate-600 hover:text-rose-700'}`}
            >
              Urgent ({alerts.filter(a => a.severity === 'danger').length})
            </button>
            <button 
              onClick={() => setSeverityFilter('warning')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${severityFilter === 'warning' ? 'bg-amber-500 text-white shadow' : 'text-slate-600 hover:text-amber-700'}`}
            >
              Running Low ({alerts.filter(a => a.severity === 'warning').length})
            </button>
            <button 
              onClick={() => setSeverityFilter('info')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${severityFilter === 'info' ? 'bg-sky-600 text-white shadow' : 'text-slate-600 hover:text-sky-700'}`}
            >
              All Good ({alerts.filter(a => a.severity === 'info').length})
            </button>
          </div>

          {/* Category Select Filters */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-700 border-none outline-none font-semibold cursor-pointer focus:ring-0"
            >
              <option value="all" className="bg-white text-slate-800">All Categories</option>
              <option value="stock" className="bg-white text-slate-800">Medicine Stock</option>
              <option value="attendance" className="bg-white text-slate-800">Staffing</option>
              <option value="overcrowding" className="bg-white text-slate-800">Bed Availability</option>
              <option value="underused" className="bg-white text-slate-800">Patient Numbers</option>
            </select>
          </div>
        </div>

        <div className="text-right text-xs text-slate-500 font-medium">
          Showing {filteredAlerts.length} of {alerts.length} operational alerts
        </div>
      </div>

      {/* Alerts Feed */}
      {filteredAlerts.length === 0 ? (
        <Card hoverEffect={false} className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-100 shadow-sm">
          <CheckCircle className="w-16 h-16 text-emerald-500/20 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800">All Good</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            No alerts found matching your selected criteria. All facilities are performing inside normal operational tolerances.
          </p>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {filteredAlerts.map((alert) => {
            const isDismissing = dismissingIds.includes(alert.id);
            return (
              <div 
                key={alert.id}
                className={`
                  border-l-4 rounded-r-xl p-5 flex items-start gap-4 transition-all duration-350
                  ${getAlertBorderClass(alert.severity)}
                  ${isDismissing ? 'opacity-0 translate-x-[40px] scale-95 duration-250' : 'opacity-100 translate-x-0'}
                `}
              >
                {/* Severity icon */}
                <div className="mt-1">
                  {getAlertIcon(alert.severity)}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                      {alert.title}
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-655 font-bold border border-slate-200 capitalize">
                        {alert.category === 'stock' ? 'Medicine Stock' : alert.category === 'overcrowding' ? 'Bed Availability' : alert.category === 'underused' ? 'Patient Numbers' : alert.category}
                      </span>
                    </h3>
                    <span className="text-[10px] text-slate-550 font-bold font-mono">{alert.centreName}</span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-4xl">
                    {alert.explanation}
                  </p>
                </div>

                {/* Dismiss button */}
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="bg-slate-105 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-slate-500 p-2 rounded-lg transition-colors outline-none cursor-pointer self-center"
                  title="Dismiss alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminAlerts;
