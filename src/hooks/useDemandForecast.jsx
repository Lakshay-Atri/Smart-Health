import { useMemo } from 'react';

export function useDemandForecast(historicalData = [], forecastDays = 7, windowSize = 7) {
  return useMemo(() => {
    if (!historicalData || historicalData.length === 0) return [];

    // Clone the historical data as the base
    const result = historicalData.map(d => ({
      date: d.date,
      patientCount: d.patientCount,
      isForecast: false
    }));

    // Find the last date
    let lastDate = new Date(historicalData[historicalData.length - 1].date);

    // Let's compute forecasts for the next N days
    for (let i = 0; i < forecastDays; i++) {
      // Calculate the moving average of the last `windowSize` items in `result`
      const windowStart = result.length - windowSize;
      const windowItems = result.slice(Math.max(0, windowStart));
      const sum = windowItems.reduce((acc, curr) => acc + curr.patientCount, 0);
      const avg = windowItems.length > 0 ? Math.round(sum / windowItems.length) : 0;

      // Increment date
      lastDate.setDate(lastDate.getDate() + 1);
      const nextDateStr = lastDate.toISOString().split('T')[0];

      result.push({
        date: nextDateStr,
        patientCount: avg,
        isForecast: true
      });
    }

    return result;
  }, [historicalData, forecastDays, windowSize]);
}

export default useDemandForecast;
