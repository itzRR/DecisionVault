import type { DecisionStatus } from '../types';

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch {
    return dateString;
  }
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const getStatusColor = (status: DecisionStatus): string => {
  switch (status) {
    case 'DRAFT': return 'bg-surface-100 text-surface-600';
    case 'ANALYZING': return 'bg-amber-100 text-amber-700';
    case 'ANALYZED': return 'bg-blue-100 text-blue-700';
    case 'DECISION_MADE': return 'bg-indigo-100 text-indigo-700';
    case 'AWAITING_OUTCOME': return 'bg-purple-100 text-purple-700';
    case 'OUTCOME_RECORDED': return 'bg-teal-100 text-teal-700';
    case 'REPLAY_READY': return 'bg-orange-100 text-orange-700';
    case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
    case 'FAILED': return 'bg-red-100 text-red-700';
    default: return 'bg-surface-100 text-surface-600';
  }
};

export const getStatusLabel = (status: DecisionStatus): string => {
  switch (status) {
    case 'DRAFT': return 'Draft';
    case 'ANALYZING': return 'Analyzing';
    case 'ANALYZED': return 'Analyzed';
    case 'DECISION_MADE': return 'Decided';
    case 'AWAITING_OUTCOME': return 'Awaiting Outcome';
    case 'OUTCOME_RECORDED': return 'Outcome Recorded';
    case 'REPLAY_READY': return 'Replay Ready';
    case 'COMPLETED': return 'Completed';
    case 'FAILED': return 'Failed';
    default: return status;
  }
};

export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 70) return 'text-emerald-600';
  if (confidence >= 40) return 'text-amber-600';
  return 'text-red-500';
};

export const getConfidenceBgColor = (confidence: number): string => {
  if (confidence >= 70) return 'bg-emerald-500';
  if (confidence >= 40) return 'bg-amber-500';
  return 'bg-red-500';
};

export const getQualityColor = (quality: number): string => {
  if (quality >= 70) return 'text-emerald-600';
  if (quality >= 40) return 'text-amber-600';
  return 'text-red-500';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
};

export const timeAgo = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return formatDate(dateString);
};

export const getCategoryEmoji = (category: string): string => {
  switch (category) {
    case 'Career': return '💼';
    case 'Education': return '🎓';
    case 'Technology': return '💻';
    case 'Money': return '💰';
    case 'Business': return '📊';
    case 'Travel': return '✈️';
    case 'Personal': return '🏠';
    default: return '📋';
  }
};
