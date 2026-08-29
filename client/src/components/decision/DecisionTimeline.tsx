import React from 'react';
import { Decision } from '../../types';
import { CheckCircle2, Circle, Clock, Brain, FastForward, Sparkles } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

interface DecisionTimelineProps {
  decision: Decision;
}

export default function DecisionTimeline({ decision }: DecisionTimelineProps) {
  const statusOrder = ['DRAFT', 'ANALYZING', 'ANALYZED', 'DECISION_MADE', 'AWAITING_OUTCOME', 'OUTCOME_RECORDED', 'COMPLETED'];
  const currentIndex = statusOrder.indexOf(decision.status);

  const stages = [
    { id: 'DRAFT', label: 'Decision Captured', icon: <Circle className="w-5 h-5" />, date: decision.createdAt },
    { id: 'ANALYZED', label: 'AI Analyzed', icon: <Brain className="w-5 h-5" />, date: decision.analysis ? decision.updatedAt : null },
    { id: 'DECISION_MADE', label: 'Decision Made', icon: <CheckCircle2 className="w-5 h-5" />, date: decision.decidedAt },
    { id: 'AWAITING_OUTCOME', label: 'Awaiting Outcome', icon: <Clock className="w-5 h-5" />, date: decision.decisionDate },
    { id: 'OUTCOME_RECORDED', label: 'Outcome Recorded', icon: <FastForward className="w-5 h-5" />, date: decision.outcomeRecordedAt },
    { id: 'COMPLETED', label: 'Decision Replay', icon: <Sparkles className="w-5 h-5" />, date: decision.replayGeneratedAt }
  ];

  return (
    <div className="py-6">
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-[21px] w-0.5 bg-surface-200"></div>
        <div className="space-y-8">
          {stages.map((stage, index) => {
            const stageIndex = statusOrder.indexOf(stage.id);
            const isCompleted = currentIndex > stageIndex;
            const isCurrent = currentIndex === stageIndex;
            const isFuture = currentIndex < stageIndex;
            const isWaiting = stage.id === 'AWAITING_OUTCOME' && isCurrent;

            return (
              <div key={stage.id} className="relative flex gap-6 items-start">
                <div className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-full border-4 border-white ${
                  isCompleted ? 'bg-brand-600 text-white' : 
                  isCurrent ? 'bg-brand-100 text-brand-600' : 
                  'bg-surface-100 text-surface-400'
                } ${isCurrent && !isWaiting ? 'animate-pulse-slow' : ''}`}>
                  {stage.icon}
                </div>
                
                <div className="pt-2">
                  <h4 className={`font-medium ${isFuture ? 'text-surface-400' : 'text-surface-900'}`}>
                    {stage.label}
                  </h4>
                  {stage.date && !isFuture && (
                    <p className="text-sm text-surface-500 mt-1">
                      {formatDateTime(stage.date)}
                    </p>
                  )}
                  {isWaiting && stage.date && (
                    <p className="text-sm text-amber-600 mt-1 font-medium">
                      Expected by {formatDateTime(stage.date)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
