import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';
import { decisionsApi } from '../services/api';
import { DashboardStats, Decision } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ErrorBanner from '../components/common/ErrorBanner';
import StatusBadge from '../components/common/StatusBadge';
import { formatDate } from '../utils/formatters';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, decisionsRes] = await Promise.all([
        decisionsApi.getStats(),
        decisionsApi.getAll()
      ]);
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      if (decisionsRes.success && decisionsRes.data) {
        setDecisions(decisionsRes.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner size="lg" message="Loading dashboard..." />;
  if (error) return <ErrorBanner message={error} onRetry={fetchData} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="page-title text-gradient">Dashboard</h1>
        <button className="btn-primary flex items-center gap-2" onClick={() => navigate('/decisions/new')}>
          <Plus size={20} /> New Decision
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <h3 className="label">Total</h3>
            <p className="text-2xl font-bold">{stats.totalDecisions}</p>
          </div>
          <div className="card">
            <h3 className="label">Pending</h3>
            <p className="text-2xl font-bold">{stats.pendingDecisions}</p>
          </div>
          <div className="card">
            <h3 className="label">Completed</h3>
            <p className="text-2xl font-bold">{stats.completedDecisions}</p>
          </div>
          <div className="card">
            <h3 className="label">Avg Quality</h3>
            <p className="text-2xl font-bold">{stats.averageQuality !== null ? stats.averageQuality.toFixed(1) : '-'}</p>
          </div>
        </div>
      )}

      <div>
        <h2 className="section-title mb-4">Recent Decisions</h2>
        {decisions.length === 0 ? (
          <EmptyState
            icon={<LayoutDashboard size={48} />}
            title="No decisions yet"
            description="Start by creating your first decision."
            actionLabel="Create Decision"
            onAction={() => navigate('/decisions/new')}
          />
        ) : (
          <div className="grid gap-4">
            {decisions.map(d => (
              <div key={d.id} className="card card-hover cursor-pointer" onClick={() => navigate(`/decisions/${d.id}`)}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{d.title}</h3>
                    <p className="text-sm text-gray-500">{formatDate(d.createdAt)}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
