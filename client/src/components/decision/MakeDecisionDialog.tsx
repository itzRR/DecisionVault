import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Decision, MakeDecisionInput } from '../../types';

interface MakeDecisionDialogProps {
  decision: Decision;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: MakeDecisionInput) => Promise<void>;
}

export default function MakeDecisionDialog({ decision, isOpen, onClose, onSubmit }: MakeDecisionDialogProps) {
  const [selectedOption, setSelectedOption] = useState('');
  const [customOption, setCustomOption] = useState('');
  const [finalConfidence, setFinalConfidence] = useState(decision.initialConfidence);
  const [decisionRationale, setDecisionRationale] = useState('');
  const [loading, setLoading] = useState(false);
  const [useCustom, setUseCustom] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const option = useCustom ? customOption : selectedOption;
    if (!option) return;

    setLoading(true);
    try {
      await onSubmit({
        selectedOption: option,
        finalConfidence,
        decisionRationale,
      });
      onClose();
    } catch (error) {
      console.error('Failed to record decision:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-surface-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-elevated w-full max-w-lg overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-surface-200">
                <h3 className="text-xl font-bold text-surface-900">What did you decide?</h3>
                <button onClick={onClose} className="btn-ghost p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Option Selection */}
                <div>
                  <label className="label">Select your decision</label>
                  <div className="space-y-2">
                    {decision.options.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          selectedOption === option.label && !useCustom
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-surface-200 hover:bg-surface-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="option"
                          value={option.label}
                          checked={selectedOption === option.label && !useCustom}
                          onChange={(e) => { setSelectedOption(e.target.value); setUseCustom(false); }}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span className="font-medium text-surface-900">{option.label}</span>
                      </label>
                    ))}
                    <label
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        useCustom ? 'border-brand-500 bg-brand-50' : 'border-surface-200 hover:bg-surface-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="option"
                        checked={useCustom}
                        onChange={() => setUseCustom(true)}
                        className="text-brand-600 focus:ring-brand-500"
                      />
                      <span className="font-medium text-surface-900">Custom decision</span>
                    </label>
                    {useCustom && (
                      <input
                        type="text"
                        value={customOption}
                        onChange={(e) => setCustomOption(e.target.value)}
                        placeholder="Describe your decision..."
                        className="input-field mt-2"
                      />
                    )}
                  </div>
                </div>

                {/* Confidence Slider */}
                <div>
                  <label className="label">How confident are you now? — {finalConfidence}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={finalConfidence}
                    onChange={(e) => setFinalConfidence(parseInt(e.target.value))}
                    className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                  <div className="flex justify-between text-xs text-surface-400 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Rationale */}
                <div>
                  <label className="label">What influenced your decision? (optional)</label>
                  <textarea
                    value={decisionRationale}
                    onChange={(e) => setDecisionRationale(e.target.value)}
                    placeholder="What changed your mind or solidified your choice..."
                    className="input-field h-24 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                  <button
                    type="submit"
                    disabled={loading || (!selectedOption && !customOption) || (useCustom && !customOption)}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : 'Confirm Decision'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
