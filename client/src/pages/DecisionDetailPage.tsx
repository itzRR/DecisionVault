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
