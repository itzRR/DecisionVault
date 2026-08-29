import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Play } from 'lucide-react';
import { decisionsApi } from '../services/api';
import { Decision } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBanner from '../components/common/ErrorBanner';

export default function ReplayPage() {
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
        throw new Error(res.error || 'Failed to fetch');
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

  if (loading) return <LoadingSpinner />;
  if (error || !decision) return <ErrorBanner message={error || 'Not found'} onRetry={fetchDecision} />;

  const replay = decision.replay;
  const outcome = decision.outcome;

  if (!replay || !outcome) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-4xl mx-auto text-center py-20">
        <Play size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Replay not available</h2>
        <p className="text-gray-500 mb-6">You need to record an outcome and generate a replay first.</p>
        <button className="btn-primary" onClick={() => navigate(`/decisions/${decision.id}`)}>Back to Decision</button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="page-title text-gradient">Decision Replay</h1>
        <p className="text-xl mt-2 font-medium">{decision.title}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <h3 className="section-title text-green-600">What you got right</h3>
          <ul className="list-disc pl-5 space-y-2">
            {replay.gotRight.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="card space-y-4">
          <h3 className="section-title text-red-600">What you misjudged</h3>
          <ul className="list-disc pl-5 space-y-2">
            {replay.misjudged.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title mb-3">What Changed</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{replay.whatChanged}</p>
      </div>

      <div className="card">
        <h3 className="section-title mb-3">Reflection</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{replay.reflection}</p>
      </div>

      <div className="card bg-purple-50">
        <h3 className="section-title mb-4">Quality Score: {replay.decisionQuality}/100</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          {replay.qualityReasons.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>

      <div className="text-center">
        <button className="btn-secondary" onClick={() => navigate(`/decisions/${decision.id}`)}>Back to Decision</button>
      </div>
    </motion.div>
  );
}
