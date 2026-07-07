import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  subscribeToCentres, 
  subscribeToStock, 
  subscribeToFootfall, 
  subscribeToAttendance 
} from '../db/firebase';

const HealthCentreContext = createContext();

export function HealthCentreProvider({ children }) {
  const [centres, setCentres] = useState([]);
  const [stock, setStock] = useState({});
  const [footfall, setFootfall] = useState({});
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const [actionedSuggestions, setActionedSuggestions] = useState(new Set());

  // 1. Subscribe to centres
  useEffect(() => {
    let isMounted = true;
    const unsubCentres = subscribeToCentres((centresList) => {
      if (!isMounted) return;
      setCentres(centresList);
    });
    return () => {
      isMounted = false;
      unsubCentres();
    };
  }, []);

  // 2. Subscribe to sub-collections for each centre
  useEffect(() => {
    if (centres.length === 0) return;

    const unsubs = [];

    centres.forEach((centre) => {
      // Subscribe to stock
      const unsubStock = subscribeToStock(centre.id, (stockList) => {
        setStock((prev) => {
          const centreStockObj = {};
          stockList.forEach((item) => {
            centreStockObj[item.id] = item;
          });
          return {
            ...prev,
            [centre.id]: centreStockObj,
          };
        });
      });
      unsubs.push(unsubStock);

      // Subscribe to footfall
      const unsubFootfall = subscribeToFootfall(centre.id, (footfallObj) => {
        setFootfall((prev) => {
          const sortedArray = Object.entries(footfallObj)
            .map(([date, data]) => ({
              date,
              patientCount: data.patientCount || 0,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

          return {
            ...prev,
            [centre.id]: sortedArray,
          };
        });
      });
      unsubs.push(unsubFootfall);

      // Subscribe to attendance
      const unsubAttendance = subscribeToAttendance(centre.id, (attendanceList) => {
        setAttendance((prev) => ({
          ...prev,
          [centre.id]: attendanceList,
        }));
      });
      unsubs.push(unsubAttendance);
    });

    // Set loading to false since initial snapshots arrive immediately
    setLoading(false);

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [centres]);

  // 3. Dynamically compute alerts from current states
  const alerts = useMemo(() => {
    const list = [];

    centres.forEach((centre) => {
      const centreStockObj = stock[centre.id] || {};
      const centreAttendance = attendance[centre.id] || [];

      // A. Stock alerts
      Object.entries(centreStockObj).forEach(([itemId, item]) => {
        const usage = item.avgDailyUsage || 0;
        if (usage > 0) {
          const days = item.currentStock / usage;
          if (days < 3 || item.currentStock === 0) {
            const alertId = `alert-stock-danger-${centre.id}-${itemId}`;
            if (!dismissedAlerts.has(alertId)) {
              list.push({
                id: alertId,
                title: `Critical Stock-out: ${item.name}`,
                explanation: `${centre.name} is running dangerously low on ${item.name}. There are only ${item.currentStock} units remaining (approx. ${days.toFixed(1)} days of stock).`,
                severity: 'danger',
                category: 'stock',
                centreName: centre.name,
              });
            }
          } else if (item.currentStock <= item.reorderThreshold || days < 7) {
            const alertId = `alert-stock-warning-${centre.id}-${itemId}`;
            if (!dismissedAlerts.has(alertId)) {
              list.push({
                id: alertId,
                title: `Low Stock Warning: ${item.name}`,
                explanation: `${centre.name} stock level for ${item.name} is at ${item.currentStock} units (estimated ${days.toFixed(1)} days remaining). Reorder threshold is ${item.reorderThreshold} units.`,
                severity: 'warning',
                category: 'stock',
                centreName: centre.name,
              });
            }
          }
        }
      });

      // B. Staffing alerts
      if (centreAttendance.length > 0) {
        const checkedInCount = centreAttendance.filter((doc) => doc.checkedIn).length;
        const totalDoctors = centreAttendance.length;
        if (checkedInCount === 0) {
          const alertId = `alert-staff-danger-${centre.id}`;
          if (!dismissedAlerts.has(alertId)) {
            list.push({
              id: alertId,
              title: `No Active Doctor on Duty`,
              explanation: `Zero physicians are checked in at ${centre.name} today. Emergency and consultation services are currently offline.`,
              severity: 'danger',
              category: 'attendance',
              centreName: centre.name,
            });
          }
        } else if (checkedInCount / totalDoctors < 0.5) {
          const alertId = `alert-staff-warning-${centre.id}`;
          if (!dismissedAlerts.has(alertId)) {
            list.push({
              id: alertId,
              title: `Understaffed Duty Warning`,
              explanation: `${centre.name} is running at reduced physician capacity (${checkedInCount}/${totalDoctors} present). Longer waiting lines expected.`,
              severity: 'warning',
              category: 'attendance',
              centreName: centre.name,
            });
          }
        }
      }

      // C. Bed capacity alerts
      if (centre.totalBeds > 0) {
        const occupancyRate = centre.occupiedBeds / centre.totalBeds;
        if (occupancyRate >= 0.9) {
          const alertId = `alert-capacity-danger-${centre.id}`;
          if (!dismissedAlerts.has(alertId)) {
            list.push({
              id: alertId,
              title: `Critical Bed Capacity`,
              explanation: `${centre.name} has reached ${Math.round(occupancyRate * 100)}% bed occupancy (${centre.occupiedBeds}/${centre.totalBeds} beds occupied). Transfer incoming admissions if possible.`,
              severity: 'danger',
              category: 'overcrowding',
              centreName: centre.name,
            });
          }
        } else if (occupancyRate >= 0.75) {
          const alertId = `alert-capacity-warning-${centre.id}`;
          if (!dismissedAlerts.has(alertId)) {
            list.push({
              id: alertId,
              title: `High Bed Capacity Alert`,
              explanation: `${centre.name} bed occupancy is currently high at ${Math.round(occupancyRate * 100)}% (${centre.occupiedBeds}/${centre.totalBeds} beds occupied).`,
              severity: 'warning',
              category: 'overcrowding',
              centreName: centre.name,
            });
          }
        }
      }

      // D. Footfall Alerts
      const centreFootfall = footfall[centre.id] || [];
      if (centreFootfall.length > 0) {
        const todayRecord = centreFootfall[centreFootfall.length - 1];
        const sumActual = centreFootfall.reduce((sum, r) => sum + r.patientCount, 0);
        const avgActual = Math.round(sumActual / centreFootfall.length);
        if (todayRecord && avgActual > 0) {
          const ratio = todayRecord.patientCount / avgActual;
          if (ratio >= 1.4 && todayRecord.patientCount > 80) {
            const alertId = `alert-footfall-overcrowded-${centre.id}`;
            if (!dismissedAlerts.has(alertId)) {
              list.push({
                id: alertId,
                title: `High Patient Surge`,
                explanation: `${centre.name} is experiencing an unexpected surge of patients today (${todayRecord.patientCount} patients registered vs ${avgActual} average). Staff support recommended.`,
                severity: 'info',
                category: 'overcrowding',
                centreName: centre.name,
              });
            }
          } else if (ratio <= 0.4 && todayRecord.patientCount < 20) {
            const alertId = `alert-footfall-underused-${centre.id}`;
            if (!dismissedAlerts.has(alertId)) {
              list.push({
                id: alertId,
                title: `Low Facility Utilization`,
                explanation: `${centre.name} has registered only ${todayRecord.patientCount} patients today (daily average is ${avgActual}). Consider redistributing resources.`,
                severity: 'info',
                category: 'underused',
                centreName: centre.name,
              });
            }
          }
        }
      }
    });

    return list;
  }, [centres, stock, attendance, footfall, dismissedAlerts]);

  // 4. Dynamically compute suggestions from current stock levels
  const suggestions = useMemo(() => {
    const list = [];

    const allItemIds = new Set();
    centres.forEach((centre) => {
      const centreStockObj = stock[centre.id] || {};
      Object.keys(centreStockObj).forEach((itemId) => allItemIds.add(itemId));
    });

    allItemIds.forEach((itemId) => {
      const surpluses = [];
      const deficits = [];

      centres.forEach((centre) => {
        const item = stock[centre.id]?.[itemId];
        if (!item) return;

        const usage = item.avgDailyUsage || 0;
        if (usage === 0) return;

        const days = item.currentStock / usage;

        if (days > 7 && item.currentStock > item.reorderThreshold * 2) {
          surpluses.push({
            centreId: centre.id,
            centreName: centre.name,
            currentStock: item.currentStock,
            usage,
            threshold: item.reorderThreshold,
            item,
            surplusQty: Math.floor(item.currentStock - item.reorderThreshold * 1.5),
          });
        } else if (days < 3 || item.currentStock < item.reorderThreshold) {
          deficits.push({
            centreId: centre.id,
            centreName: centre.name,
            currentStock: item.currentStock,
            usage,
            threshold: item.reorderThreshold,
            item,
            deficitQty: Math.floor(item.reorderThreshold * 1.5 - item.currentStock),
          });
        }
      });

      surpluses.sort((a, b) => b.surplusQty - a.surplusQty);
      deficits.sort((a, b) => b.deficitQty - a.deficitQty);

      let surplusIdx = 0;
      let deficitIdx = 0;

      while (surplusIdx < surpluses.length && deficitIdx < deficits.length) {
        const source = surpluses[surplusIdx];
        const dest = deficits[deficitIdx];

        const transferQty = Math.min(source.surplusQty, dest.deficitQty);
        if (transferQty >= 10) {
          const suggestionId = `suggestion-${source.centreId}-${dest.centreId}-${itemId}`;
          if (!actionedSuggestions.has(suggestionId)) {
            list.push({
              id: suggestionId,
              itemId,
              itemName: source.item.name,
              qty: transferQty,
              sourceCentreId: source.centreId,
              sourceCentreName: source.centreName,
              sourceStock: source.currentStock,
              destCentreId: dest.centreId,
              destCentreName: dest.centreName,
              destStock: dest.currentStock,
            });
          }

          source.surplusQty -= transferQty;
          dest.deficitQty -= transferQty;
        }

        if (source.surplusQty < 10) surplusIdx++;
        if (dest.deficitQty < 10) deficitIdx++;
      }
    });

    return list;
  }, [centres, stock, actionedSuggestions]);

  const dismissAlert = (id) => {
    setDismissedAlerts((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const actionSuggestion = (id) => {
    setActionedSuggestions((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    // Optimistically update stock level state locally to provide immediate feedback
    const suggestion = suggestions.find((s) => s.id === id);
    if (suggestion) {
      setStock((prev) => {
        const next = { ...prev };
        const sourceStock = { ...next[suggestion.sourceCentreId] };
        const destStock = { ...next[suggestion.destCentreId] };

        if (sourceStock[suggestion.itemId]) {
          sourceStock[suggestion.itemId] = {
            ...sourceStock[suggestion.itemId],
            currentStock: Math.max(0, sourceStock[suggestion.itemId].currentStock - suggestion.qty),
          };
        }

        if (destStock[suggestion.itemId]) {
          destStock[suggestion.itemId] = {
            ...destStock[suggestion.itemId],
            currentStock: destStock[suggestion.itemId].currentStock + suggestion.qty,
          };
        }

        next[suggestion.sourceCentreId] = sourceStock;
        next[suggestion.destCentreId] = destStock;
        return next;
      });
    }
  };

  const resetInteractiveStates = () => {
    setDismissedAlerts(new Set());
    setActionedSuggestions(new Set());
  };

  const value = useMemo(
    () => ({
      centres,
      stock,
      footfall,
      attendance,
      loading,
      alerts,
      suggestions,
      dismissAlert,
      actionSuggestion,
      resetInteractiveStates,
    }),
    [centres, stock, footfall, attendance, loading, alerts, suggestions]
  );

  return (
    <HealthCentreContext.Provider value={value}>
      {children}
    </HealthCentreContext.Provider>
  );
}

export function useHealthCentres() {
  const context = useContext(HealthCentreContext);
  if (!context) {
    throw new Error('useHealthCentres must be used within a HealthCentreProvider');
  }
  return context;
}
