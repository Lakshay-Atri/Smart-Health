import React from 'react';
import theme from '../styles/theme';
import { Check, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

export function StatusBadge({ status, label }) {
  const normStatus = (status || '').toLowerCase();
  
  let styles = theme.colors.status.green; // default fallback
  let displayLabel = label || 'All Good';
  let IconComponent = Check;
  
  if (normStatus === 'red' || normStatus === 'critical' || normStatus === 'danger' || normStatus === 'low') {
    styles = theme.colors.status.red;
    displayLabel = label || 'Urgent';
    IconComponent = AlertCircle;
  } else if (normStatus === 'yellow' || normStatus === 'warning' || normStatus === 'medium' || normStatus === 'reorder') {
    styles = theme.colors.status.yellow;
    displayLabel = label || 'Running Low';
    IconComponent = AlertTriangle;
  } else if (normStatus === 'green' || normStatus === 'stable' || normStatus === 'good' || normStatus === 'healthy' || normStatus === 'normal') {
    styles = theme.colors.status.green;
    displayLabel = label || 'All Good';
    IconComponent = Check;
  } else if (normStatus === 'checkedin' || normStatus === 'present' || normStatus === 'active') {
    styles = theme.colors.status.green;
    displayLabel = label || 'Checked In';
    IconComponent = Check;
  } else if (normStatus === 'checkedout' || normStatus === 'absent' || normStatus === 'inactive') {
    styles = theme.colors.status.red;
    displayLabel = label || 'Checked Out';
    IconComponent = AlertCircle;
  } else if (normStatus === 'available') {
    styles = theme.colors.status.green;
    displayLabel = label || 'Available';
    IconComponent = Check;
  } else if (normStatus === 'unavailable' || normStatus === 'out of stock') {
    styles = theme.colors.status.red;
    displayLabel = label || 'Unavailable';
    IconComponent = AlertCircle;
  }

  // Ensure high contrast text colors by leveraging theme styles but keeping text and icon matching
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles.bg} transition-all duration-200`}>
      <IconComponent className="w-3.5 h-3.5 mr-1 shrink-0" />
      {displayLabel}
    </span>
  );
}

export default StatusBadge;
