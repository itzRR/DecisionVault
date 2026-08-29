import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { RecordOutcomeInput, ExpectationMatch } from '../../types';

interface OutcomeFormProps {
  onSubmit: (input: RecordOutcomeInput) => Promise<void>;
}

const EXPECTATION_OPTIONS: { value: ExpectationMatch; label: string; emoji: string }[] = [
  { value: 'Much better', label: 'Much better', emoji: '🎉' },
  { value: 'Better', label: 'Better', emoji: '😊' },
  { value: 'About the same', label: 'About the same', emoji: '😐' },
  { value: 'Worse', label: 'Worse', emoji: '😟' },
  { value: 'Much worse', label: 'Much worse', emoji: '😞' },
];

export default function OutcomeForm({ onSubmit }: OutcomeFormProps) {
  const [form, setForm] = useState<RecordOutcomeInput>({
    description: '',
    expectationMatch: 'About the same',
    satisfaction: 3,
    surprises: '',
    wouldDoDifferently: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) {
      setError('Please describe what happened.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(err.message || 'Failed to record outcome');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 space-y-6"
    >
      <div>
        <h3 className="section-title">How did it actually turn out?</h3>
        <p className="text-sm text-surface-500 mt-1">Record the real outcome to compare with your original expectations.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* What happened */}
        <div>
          <label className="label">What happened? *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the actual outcome..."
            className="input-field h-28 resize-none"
            maxLength={5000}
          />
        </div>

        {/* Expectation match */}
        <div>
          <label className="label">Did the result match your expectations?</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {EXPECTATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, expectationMatch: option.value }))}
                className={`p-3 rounded-xl border text-center transition-colors ${
                  form.expectationMatch === option.value
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-surface-200 hover:bg-surface-50 text-surface-600'
                }`}
              >
                <span className="text-lg block mb-1">{option.emoji}</span>
                <span className="text-xs font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Satisfaction */}
        <div>
          <label className="label">Overall satisfaction</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, satisfaction: star }))}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= form.satisfaction ? 'text-amber-400 fill-amber-400' : 'text-surface-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Surprises */}
        <div>
          <label className="label">What surprised you?</label>
          <textarea
            value={form.surprises}
            onChange={(e) => setForm(prev => ({ ...prev, surprises: e.target.value }))}
            placeholder="Anything unexpected..."
            className="input-field h-20 resize-none"
          />
        </div>

        {/* Would do differently */}
        <div>
          <label className="label">What would you do differently?</label>
          <textarea
            value={form.wouldDoDifferently}
            onChange={(e) => setForm(prev => ({ ...prev, wouldDoDifferently: e.target.value }))}
            placeholder="Looking back, what would you change..."
            className="input-field h-20 resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">{error}</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Recording...' : 'Record Outcome & Generate Decision Replay'}
        </button>
      </form>
    </motion.div>
  );
}
