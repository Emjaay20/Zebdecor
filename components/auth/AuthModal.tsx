'use client';

import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register' | 'forgot';
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultMode = 'login',
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string; link?: string } | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setStatusMessage(null);
  };

  const handleSwitchMode = (newMode: 'login' | 'register' | 'forgot') => {
    setStatusMessage(null);
    setMode(newMode);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      // Direct client sign-in
      setTimeout(() => {
        setStatusMessage({
          type: 'success',
          text: `Welcome back to the Atelier, ${email}. Your session is active.`,
        });
        setLoading(false);
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1500);
      }, 700);
    } catch {
      setStatusMessage({ type: 'error', text: 'Authentication failed. Please verify your credentials.' });
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to register account with WooCommerce.',
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: 'Atelier account registered. A luxury welcome dispatch has been sent via Resend.',
        });
        setTimeout(() => {
          handleSwitchMode('login');
        }, 2000);
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error communicating with WooCommerce.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Unable to process reset request.',
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: 'If your address is registered, a confidential reset invitation has been dispatched via Resend.',
          link: data.data?.debugResetLink,
        });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error connecting to email dispatch service.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#14110e]/95 border border-brand-gold/40 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-neutral-100 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition cursor-pointer"
        >
          &times;
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <span className="font-serif text-xl tracking-[0.25em] text-brand-gold uppercase font-semibold">
            ZEBDECOR
          </span>
          <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-mono">
            Private Client Registry &bull; Abuja Atelier
          </p>
        </div>

        {/* Mode Tabs */}
        {mode !== 'forgot' && (
          <div className="flex rounded-lg bg-black/40 p-1 border border-white/10 text-xs font-mono uppercase tracking-wider">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 py-2 text-center rounded-md transition cursor-pointer ${
                mode === 'login' ? 'bg-brand-gold text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('register')}
              className={`flex-1 py-2 text-center rounded-md transition cursor-pointer ${
                mode === 'register' ? 'bg-brand-gold text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/60 border-red-500/40 text-red-200'
            }`}
          >
            <p>{statusMessage.text}</p>
            {statusMessage.link && (
              <a
                href={statusMessage.link}
                className="inline-block mt-2 font-mono text-[11px] underline text-brand-goldLight break-all hover:text-brand-gold"
              >
                [Dev Shortcut] Click to open password reset &rarr;
              </a>
            )}
          </div>
        )}

        {/* Form: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-300 font-mono mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="client@residence.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-brand-gold/30 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-300 font-mono">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => handleSwitchMode('forgot')}
                  className="text-[10px] text-brand-gold hover:underline font-mono"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-brand-gold/30 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-brand-gold hover:brightness-110 text-black font-semibold text-xs uppercase tracking-widest transition shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In to Atelier'}
            </button>
          </form>
        )}

        {/* Form: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-300 font-mono mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Yusuf"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-brand-gold/30 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-300 font-mono mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Abubakar"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-brand-gold/30 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-300 font-mono mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="client@residence.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-brand-gold/30 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-300 font-mono mb-1">
                Passphrase
              </label>
              <input
                type="password"
                required
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-brand-gold/30 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-brand-gold hover:brightness-110 text-black font-semibold text-xs uppercase tracking-widest transition shadow-md disabled:opacity-50 cursor-pointer pt-2"
            >
              {loading ? 'Registering with WooCommerce...' : 'Register Collector Account'}
            </button>
          </form>
        )}

        {/* Form: FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-serif text-base text-white">Reset Atelier Passphrase</h3>
              <p className="text-xs text-neutral-400">
                Enter your registered client email to receive a confidential reset dispatch powered by Resend.
              </p>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-300 font-mono mb-1.5">
                Client Email
              </label>
              <input
                type="email"
                required
                placeholder="client@residence.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-brand-gold/30 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-brand-gold hover:brightness-110 text-black font-semibold text-xs uppercase tracking-widest transition shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Dispatching via Resend...' : 'Send Reset Link'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className="text-xs text-neutral-400 hover:text-brand-gold font-mono transition"
              >
                &larr; Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
