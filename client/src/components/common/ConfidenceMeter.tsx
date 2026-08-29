import React from 'react';
import { getConfidenceColor } from '../../utils/formatters';

interface ConfidenceMeterProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ value, size = 'md', showLabel = true }) => {
  const colorClass = getConfidenceColor(value);
  
  // Use stroke color based on value
  let strokeColor = '#ef4444'; // red-500
  if (value >= 70) strokeColor = '#22c55e'; // green-500
  else if (value >= 40) strokeColor = '#eab308'; // yellow-500

  const sizeMap = {
    sm: { radius: 14, strokeWidth: 3, text: 'text-xs' },
    md: { radius: 24, strokeWidth: 4, text: 'text-sm' },
    lg: { radius: 36, strokeWidth: 5, text: 'text-xl' },
  };

  const { radius, strokeWidth, text } = sizeMap[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <div className="relative inline-flex items-center justify-center">
        <svg
          className="transform -rotate-90"
          width={(radius + strokeWidth) * 2}
          height={(radius + strokeWidth) * 2}
        >
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#f3f4f6" // gray-100
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <span className={`absolute font-semibold text-gray-700 ${text}`}>
          {Math.round(value)}%
        </span>
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-600">Confidence</span>
      )}
    </div>
  );
};

export default ConfidenceMeter;
