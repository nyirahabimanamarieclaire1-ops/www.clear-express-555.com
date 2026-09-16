import React, { useState } from 'react';
import { Shield, KeyRound, Lock, CheckCircle2, AlertCircle, ArrowRight, X, Mail } from 'lucide-react';
import { User } from '../../shared/types.ts';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (adminUser: User) => void;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the admin password');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/admin-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid admin password. Access denied.');
        setLoading(false);
        return;
      }

      setSuccessMsg('Access Authorized! Dispatched login log to clearexpress555@gmail.com');
      setTimeout(() => {
        onSuccess(data.user);
        setPassword('');
        setSuccessMsg('');
        onClose();
      }, 700);
    } catch (err: any) {
      console.error(err);
      setError('Network error while validating admin password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#0A2540] via-[#0047AB] to-[#0A2540] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-[#FF6B00]">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-orange-400">
                CLEAR EXPRESS 555 SECURITY GATE
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Admin Authorization</h3>
            </div>
          </div>
          <p className="mt-2 text-xs text-blue-100">
            Admin access requires password authorization only.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{error}</p>
                <p className="text-[11px] text-rose-600 mt-0.5">
                  Security alert will be logged to <strong>clearexpress555@gmail.com</strong>.
                </p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
              <p className="font-semibold">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Admin Master Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter admin password"
                  autoFocus
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-wider focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0047AB] to-[#0A2540] hover:from-blue-700 hover:to-slate-900 text-white font-bold text-sm shadow-lg hover:shadow-blue-900/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating & Logging...</span>
              ) : (
                <>
                  <span>Unlock Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Audit notice */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Logs dispatched to: <strong>clearexpress555@gmail.com</strong></span>
            </div>
            <span className="font-semibold text-slate-500">256-bit Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};
