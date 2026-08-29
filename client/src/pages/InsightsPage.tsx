import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { insightsApi } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBanner from '../components/common/ErrorBanner';
import EmptyState from '../components/common/EmptyState';

import { PersonalInsight } from '../types';

export default function InsightsPage() {
  const [insights, setInsights] = useState<PersonalInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await insightsApi.getInsights();
      if (res.success && res.data) {
        setInsights(res.data.insights);
      } else {
        throw new Error(res.error || 'Failed to fetch insights');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error} onRetry={fetchInsights} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-5xl mx-auto">
      <h1 className="page-title text-gradient mb-8">AI Insights</h1>

      {insights.length === 0 ? (
        <EmptyState
          icon={<Lightbulb size={48} />}
          title="No insights yet"
          description="Make more decisions and record outcomes to generate insights."
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {insights.map((insight, idx) => (
            <div key={idx} className="card card-hover flex flex-col h-full">
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-2 py-1 rounded">
                  {insight.type}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{insight.title}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{insight.description}</p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-auto">
                <strong className="block text-sm mb-1 text-gray-800">Actionable Advice:</strong>
                <p className="text-sm text-gray-600">{insight.actionableAdvice}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
