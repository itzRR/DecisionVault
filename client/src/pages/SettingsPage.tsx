import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Download, Trash2, LogOut } from 'lucide-react';
import { authApi, exportApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleExportJSON = async () => {
    try {
      await exportApi.exportJSON();
      toast.success('Export successful');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authApi.deleteAccount();
      toast.success('Account deleted');
      signOut();
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="page-title text-gradient">Settings</h1>

      <div className="card space-y-6">
        <h2 className="section-title border-b pb-2">Account Details</h2>
        <div>
          <p className="label">Email</p>
          <p className="text-gray-800">{user?.email || 'Not logged in'}</p>
        </div>
        <div>
          <button onClick={signOut} className="btn-secondary flex items-center gap-2">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="card space-y-6">
        <h2 className="section-title border-b pb-2">Data Management</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={handleExportJSON} className="btn-primary flex items-center gap-2 justify-center flex-1">
            <Download size={18} /> Export as JSON
          </button>
        </div>
      </div>

      <div className="card space-y-6 border-red-200 bg-red-50/30">
        <h2 className="section-title text-red-600 border-b border-red-200 pb-2">Danger Zone</h2>
        <p className="text-gray-600 text-sm">
          Deleting your account is permanent. All your decisions, analyses, and insights will be removed.
        </p>
        <button onClick={() => setIsConfirmOpen(true)} className="btn-danger flex items-center gap-2">
          <Trash2 size={16} /> Delete Account
        </button>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Account"
        message="Are you absolutely sure you want to delete your account? This action cannot be undone."
        confirmLabel="Delete Everything"
        confirmVariant="danger"
        onConfirm={() => { setIsConfirmOpen(false); handleDeleteAccount(); }}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </motion.div>
  );
}
