import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Target } from 'lucide-react';
import { Decision } from '../../types';
import { timeAgo, getStatusLabel, getStatusColor, getConfidenceColor } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';
import ConfidenceMeter from '../common/ConfidenceMeter';

interface DecisionCardProps {
  decision: Decision;
  onClick?: () => void;
}

export default function DecisionCard({ decision, onClick }: DecisionCardProps) {
  const isAwaitingOutcome = decision.status === 'AWAITING_OUTCOME';
  const isOverdue = isAwaitingOutcome && decision.decisionDate && new Date(decision.decisionDate) < new Date();

  const CardContent = (
    <div className="card card-hover p-5 w-full flex flex-col h-full bg-white relative overflow-hidden text-left border border-slate-200 rounded-xl transition-all shadow-sm hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          {decision.category.replace(/_/g, ' ')}
        </span>
        <StatusBadge status={decision.status} />
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
        {decision.title}
      </h3>
      
      <div className="mt-auto pt-4 space-y-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Confidence</span>
          <ConfidenceMeter value={decision.finalConfidence ?? decision.initialConfidence} size="sm" />
        </div>
        
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{timeAgo(decision.updatedAt)}</span>
          </div>
          
          {isOverdue && (
            <div className="flex items-center gap-1 text-rose-500 font-medium">
              <Target className="w-3.5 h-3.5" />
              <span>Outcome due</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full h-full text-left">
        {CardContent}
      </button>
    );
  }

  return (
    <Link to={`/decisions/${decision.id}`} className="block w-full h-full">
      {CardContent}
    </Link>
  );
}
