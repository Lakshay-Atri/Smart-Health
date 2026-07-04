import React from 'react';
import theme from '../styles/theme';

export function StatusBadge({ status, label }) {
  const normStatus = (status || '').toLowerCase();
  
  let styles = theme.colors.status.green; // default fallback
  let displayLabel = label || 'Stable';
  
  if (normStatus === 'red' || normStatus === 'critical' || normStatus === 'danger' || normStatus === 'low') {
    styles = theme.colors.status.red;
    displayLabel = label || 'Critical';
  } else if (normStatus === 'yellow' || normStatus === 'warning' || normStatus === 'medium' || normStatus === 'reorder') {
    styles = theme.colors.status.yellow;
    displayLabel = label || 'Reorder';
  } else if (normStatus === 'green' || normStatus === 'stable' || normStatus === 'good' || normStatus === 'healthy' || normStatus === 'normal') {
    styles = theme.colors.status.green;
    displayLabel = label || 'Healthy';
  } else if (normStatus === 'checkedin' || normStatus === 'present' || normStatus === 'active') {
    styles = theme.colors.status.green;
    displayLabel = label || 'Checked In';
  } else if (normStatus === 'checkedout' || normStatus === 'absent' || normStatus === 'inactive') {
    styles = theme.colors.status.red;
    displayLabel = label || 'Checked Out';
  } else if (normStatus === 'available') {
    styles = theme.colors.status.green;
    displayLabel = label || 'Available';
  } else if (normStatus === 'unavailable' || normStatus === 'out of stock') {
    styles = theme.colors.status.red;
    displayLabel = label || 'Unavailable';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles.bg} transition-all duration-200`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${styles.dot} animate-pulse-subtle`}></span>
      {displayLabel}
    </span>
  );
}

export default StatusBadge;
