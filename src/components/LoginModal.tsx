import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, Key, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState<string>('JediMaster');
  const [password, setPassword] = useState<string>('force123');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(username, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = () => {
    setUsername('JediMaster');
    setPassword('force123');
    setError(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md relative p-6 sm:p-8 text-black z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 p-2 rounded-xl border-2 border-black bg-yellow-300 hover:bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-yellow-300 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Lock className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-black tracking-tight">
                JWT Authentication
              </h2>
              <p className="text-xs font-semibold text-neutral-500">
                Log in to access user sessions & silent refresh demo
              </p>
            </div>
          </div>

          {/* Quick Demo Credentials Pill */}
          <button
            type="button"
            onClick={handleAutofill}
            className="w-full mb-5 bg-neutral-100 border-2 border-black rounded-xl p-3 text-left hover:bg-yellow-100 transition-colors flex items-center justify-between gap-2 text-xs cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center gap-1.5 font-bold text-neutral-700">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Demo Fill: <strong className="text-black">JediMaster / force123</strong></span>
            </div>
            <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Click to use
            </span>
          </button>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-100 border-2 border-black text-red-700 text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="usernameInput" className="block text-xs font-black uppercase text-neutral-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="usernameInput"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username..."
                  className="w-full bg-white border-2 border-black rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-black placeholder-neutral-400 outline-none focus:ring-4 focus:ring-yellow-300/60 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="passwordInput" className="block text-xs font-black uppercase text-neutral-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="passwordInput"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full bg-white border-2 border-black rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-black placeholder-neutral-400 outline-none focus:ring-4 focus:ring-yellow-300/60 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-yellow-300 hover:bg-yellow-400 text-black font-extrabold text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In & Generate JWT</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;
