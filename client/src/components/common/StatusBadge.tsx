import React from 'react';
import { DecisionStatus } from '../../types';
import { getStatusColor, getStatusLabel } from '../../utils/formatters';

interface StatusBadgeProps {
  status: DecisionStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorClass = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
