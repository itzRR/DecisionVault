import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { decisionsApi } from '../services/api';
import { CreateDecisionInput, DecisionCategory, Priority, DecisionOption } from '../types';

const CATEGORIES: DecisionCategory[] = ['Career', 'Education', 'Technology', 'Money', 'Business', 'Travel', 'Personal', 'Other'];
const PRIORITIES: Priority[] = ['Cost', 'Time', 'Quality', 'Risk', 'Growth', 'Convenience', 'Long-term value', 'Happiness', 'Other'];

export default function NewDecisionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDecisionInput>({
    title: '',
    category: 'Other',
    question: '',
    options: [{ id: '1', label: '', description: '' }, { id: '2', label: '', description: '' }],
    priorities: [],
    constraints: '',
    decisionDate: '',
    initialConfidence: 50,
    notes: '',
    expectedOutcome: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await decisionsApi.create(formData);
      if (res.success && res.data) {
        toast.success('Decision created');
        // Trigger analysis in background
        decisionsApi.analyze(res.data.id).catch(console.error);
        navigate(`/decisions/${res.data.id}`);
      } else {
        throw new Error(res.error || 'Failed to create');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error creating decision');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (id: string, field: 'label' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(o => o.id === id ? { ...o, [field]: value } : o)
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { id: Date.now().toString(), label: '', description: '' }]
    }));
  };

  const removeOption = (id: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter(o => o.id !== id)
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-3xl mx-auto">
      <h1 className="page-title text-gradient mb-8">New Decision</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <div>
            <label className="label">Title</label>
            <input required className="input-field w-full" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="label">Question</label>
            <textarea required className="input-field w-full" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input-field w-full" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as DecisionCategory})}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="section-title">Options</h2>
          {formData.options.map((opt, i) => (
            <div key={opt.id} className="flex gap-4 items-start">
              <div className="flex-1 space-y-2">
                <input required placeholder="Option label" className="input-field w-full" value={opt.label} onChange={e => handleOptionChange(opt.id, 'label', e.target.value)} />
                <input placeholder="Description (optional)" className="input-field w-full text-sm" value={opt.description || ''} onChange={e => handleOptionChange(opt.id, 'description', e.target.value)} />
              </div>
              {formData.options.length > 2 && (
                <button type="button" onClick={() => removeOption(opt.id)} className="btn-danger p-2"><Trash2 size={20} /></button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOption} className="btn-secondary flex items-center gap-2"><Plus size={16} /> Add Option</button>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Creating...' : 'Create Decision'}
        </button>
      </form>
    </motion.div>
  );
}
