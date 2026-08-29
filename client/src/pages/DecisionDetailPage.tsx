import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { decisionsApi } from '../services/api';
import { Decision, MakeDecisionInput, RecordOutcomeInput } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBanner from '../components/common/ErrorBanner';
import StatusBadge from '../components/common/StatusBadge';
import ConfidenceMeter from '../components/common/ConfidenceMeter';
import { formatDate } from '../utils/formatters';

export default function DecisionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDecision = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await decisionsApi.get(id);
      if (res.success && res.data) {
        setDecision(res.data);
      } else {
        throw new Error(res.error || 'Failed to fetch decision');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecision();
  }, [id]);

  const handleAnalyze = async () => {
    if (!id) return;
    try {
      toast.loading('Analyzing...', { id: 'analyze' });
      await decisionsApi.analyze(id);
      toast.success('Analysis complete', { id: 'analyze' });
      fetchDecision();
    } catch (err: any) {
      toast.error('Analysis failed', { id: 'analyze' });
    }
  };

  const handleMakeDecision = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    const formData = new FormData(e.currentTarget);
    try {
      toast.loading('Saving decision...', { id: 'decide' });
      await decisionsApi.makeDecision(id, {
        selectedOption: formData.get('selectedOption') as string,
        finalConfidence: parseInt(formData.get('finalConfidence') as string, 10),
        decisionRationale: formData.get('decisionRationale') as string,
      });
      toast.success('Decision recorded!', { id: 'decide' });
      fetchDecision();
    } catch (err: any) {
      toast.error('Failed to save decision', { id: 'decide' });
    }
  };

  const handleRecordOutcome = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    const formData = new FormData(e.currentTarget);
    try {
      toast.loading('Recording outcome...', { id: 'outcome' });
      await decisionsApi.recordOutcome(id, {
        description: formData.get('description') as string,
        expectationMatch: formData.get('expectationMatch') as 'Much better' | 'Better' | 'About the same' | 'Worse' | 'Much worse',
        satisfaction: parseInt(formData.get('satisfaction') as string, 10),
        surprises: (formData.get('surprises') as string) || '',
        wouldDoDifferently: (formData.get('wouldDoDifferently') as string) || '',
      });
      toast.success('Outcome recorded!', { id: 'outcome' });
      fetchDecision();
    } catch (err: any) {
      toast.error('Failed to record outcome', { id: 'outcome' });
    }
  };

  const handleGenerateReplay = async () => {
    if (!id) return;
    try {
      toast.loading('Generating AI Replay...', { id: 'replay' });
      await decisionsApi.generateReplay(id);
      toast.success('Replay generated!', { id: 'replay' });
      fetchDecision();
    } catch (err: any) {
      toast.error('Failed to generate replay', { id: 'replay' });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this decision?')) {
      try {
        await decisionsApi.delete(id);
        toast.success('Deleted');
        navigate('/dashboard');
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !decision) return <ErrorBanner message={error || 'Not found'} onRetry={fetchDecision} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="page-title text-gradient">{decision.title}</h1>
          <p className="text-gray-500 mt-2">Question: {decision.question}</p>
        </div>
        <StatusBadge status={decision.status} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="card">
            <h2 className="section-title mb-4">Options</h2>
            <ul className="space-y-3">
              {decision.options.map(opt => (
                <li key={opt.id} className="p-3 border rounded-lg bg-gray-50/50">
                  <div className="font-medium">{opt.label}</div>
                  {opt.description && <div className="text-sm text-gray-500">{opt.description}</div>}
                </li>
              ))}
            </ul>
          </div>

          {decision.analysis && (
            <div className="card bg-blue-50/30">
              <h2 className="section-title mb-4 flex items-center gap-2"><CheckCircle className="text-blue-500" /> Analysis</h2>
              <p className="mb-4">{decision.analysis.summary}</p>
              <div className="mb-4">
                <strong className="block text-sm text-gray-600">Recommendation</strong>
                <p className="text-lg font-medium text-blue-700">{decision.analysis.recommendation}</p>
              </div>
              <div className="mb-4">
                <strong className="block text-sm text-gray-600">Confidence</strong>
                <ConfidenceMeter value={decision.analysis.confidence} />
              </div>
            </div>
          )}

          {/* Make Decision Form (Shows after analysis is done) */}
          {decision.status === 'ANALYZED' && (
            <div className="card">
              <h2 className="section-title mb-4">Make Your Decision</h2>
              <form onSubmit={handleMakeDecision} className="space-y-4">
                <div>
                  <label className="label">Which option did you choose?</label>
                  <select name="selectedOption" required className="input-field">
                    <option value="">Select an option...</option>
                    {decision.options.map(opt => (
                      <option key={opt.id} value={opt.label}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Confidence Level (0-100)</label>
                  <input type="number" name="finalConfidence" required min="0" max="100" defaultValue="50" className="input-field" />
                </div>
                <div>
                  <label className="label">Why did you choose this?</label>
                  <textarea name="decisionRationale" required className="input-field h-24" placeholder="Record your rationale here..." />
                </div>
                <button type="submit" className="btn-primary w-full">Record Decision</button>
              </form>
            </div>
          )}

          {/* Record Outcome Form (Shows after decision is made) */}
          {decision.status === 'AWAITING_OUTCOME' && (
            <div className="card">
              <h2 className="section-title mb-4">Record Outcome</h2>
              <form onSubmit={handleRecordOutcome} className="space-y-4">
                <div>
                  <label className="label">What actually happened?</label>
                  <textarea name="description" required className="input-field h-24" placeholder="Describe the actual outcome..." />
                </div>
                <div>
                  <label className="label">Did it match expectations?</label>
                  <select name="expectationMatch" required className="input-field">
                    <option value="">Select...</option>
                    <option value="Much better">Much better than expected</option>
                    <option value="Better">Better than expected</option>
                    <option value="About the same">Exactly as expected</option>
                    <option value="Worse">Worse than expected</option>
                    <option value="Much worse">Much worse than expected</option>
                  </select>
                </div>
                <div>
                  <label className="label">Satisfaction (1-5)</label>
                  <input type="number" name="satisfaction" required min="1" max="5" defaultValue="3" className="input-field" />
                </div>
                <div>
                  <label className="label">Any surprises? (Optional)</label>
                  <textarea name="surprises" className="input-field h-20" />
                </div>
                <button type="submit" className="btn-primary w-full">Save Outcome</button>
              </form>
            </div>
          )}

          {/* AI Replay (Shows after outcome is recorded) */}
          {decision.status === 'OUTCOME_RECORDED' && (
            <div className="card text-center py-10 space-y-4">
              <h2 className="section-title text-2xl">Ready for AI Replay</h2>
              <p className="text-surface-600 max-w-lg mx-auto">
                Now that you've recorded the outcome, Gemini can evaluate your original decision-making process to help you learn and improve.
              </p>
              <button onClick={handleGenerateReplay} className="btn-primary">Generate AI Replay</button>
            </div>
          )}

          {/* Completed Replay View */}
          {decision.replay && (
            <div className="card bg-purple-50/30">
              <h2 className="section-title mb-4 flex items-center gap-2">🧠 AI Decision Replay</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <strong className="block text-sm text-surface-600 mb-1">What you got right</strong>
                  <ul className="list-disc pl-4 text-green-700 space-y-1">
                    {decision.replay.gotRight.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <strong className="block text-sm text-surface-600 mb-1">What you misjudged</strong>
                  <ul className="list-disc pl-4 text-red-700 space-y-1">
                    {decision.replay.misjudged.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </div>
              <div className="mb-4">
                <strong className="block text-sm text-surface-600 mb-1">Reflection</strong>
                <p className="text-surface-800">{decision.replay.reflection}</p>
              </div>
              <div className="pt-4 border-t border-surface-200 mt-6">
                <strong className="block text-sm text-surface-600 mb-2">Decision Quality Score</strong>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-brand-600">{decision.replay.decisionQuality}/100</div>
                  <p className="text-sm text-surface-500 italic">{decision.replay.qualityReasons[0]}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="label">Details</h3>
            <div className="space-y-2 mt-2 text-sm">
              <p><strong>Category:</strong> {decision.category}</p>
              <p><strong>Created:</strong> {formatDate(decision.createdAt)}</p>
              <p><strong>Priorities:</strong> {decision.priorities.join(', ')}</p>
            </div>
          </div>

          <div className="card space-y-3">
            <h3 className="label">Actions</h3>
            {!decision.analysis && (
              <button onClick={handleAnalyze} className="btn-secondary w-full">Generate Analysis</button>
            )}
            <button onClick={handleDelete} className="btn-danger w-full text-white">Delete Decision</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
