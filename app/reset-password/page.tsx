'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const key = searchParams.get('key') || '';
  const login = searchParams.get('login') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!key || !login) {
      setStatusMessage({
        type: 'error',
        text: 'Invalid reset link. Please request a new password reset invitation.',
      });
      return;
    }

    if (newPassword.length < 8) {
      setStatusMessage({
        type: 'error',
        text: 'Password must be at least 8 characters in length.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({
        type: 'error',
        text: 'The passwords do not match. Please ensure both fields are identical.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, login, newPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatusMessage({
          type: 'error',
          text: data.error || data.message || 'Failed to update credentials. The token may have expired.',
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: 'Your atelier password has been updated successfully. Redirecting you to the collections...',
        });
        setTimeout(() => {
          router.push('/collections');
        }, 2200);
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Network error communicating with the authentication registry. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0807] text-neutral-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-brand-gold selection:text-black">
      {/* Background ambient luxury lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,#1c1611_0%,#0a0807_70%)] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
        <Link href="/" className="inline-block group">
          <span className="font-serif text-2xl tracking-[0.25em] text-brand-gold uppercase font-semibold">
            ZEBDECOR
          </span>
          <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mt-1 font-mono">
            Bespoke Luxury Interiors &bull; Abuja Atelier
          </p>
        </Link>
        <h2 className="mt-8 font-serif text-2xl text-white font-medium">
          Establish New Credentials
        </h2>
        <p className="mt-2 text-xs text-neutral-400 font-sans max-w-sm mx-auto">
          Create a confidential high-entropy passphrase for your Zebdecor collector account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-[#14110e]/90 border border-brand-gold/30 rounded-2xl py-8 px-6 sm:px-10 shadow-2xl backdrop-blur-xl">
          {statusMessage && (
            <div
              className={`mb-6 p-4 rounded-xl text-xs leading-relaxed border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  : 'bg-red-950/60 border-red-500/40 text-red-200'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {!key || !login ? (
            <div className="text-center space-y-4">
              <p className="text-xs text-neutral-300">
                This password reset session is missing a cryptographic token. Please initiate a fresh password reset request.
              </p>
              <Link
                href="/collections"
                className="inline-block py-2.5 px-6 rounded-lg bg-brand-gold text-black font-semibold text-xs uppercase tracking-wider transition hover:brightness-110"
              >
                Return to Storefront
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-goldLight font-mono mb-2">
                  Atelier Client Identifier
                </label>
                <input
                  type="text"
                  disabled
                  value={login}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-neutral-400 text-xs font-mono select-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-goldLight font-mono mb-2">
                  New Passphrase
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-brand-gold/40 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-goldLight font-mono mb-2">
                  Confirm Passphrase
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter your new passphrase"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-brand-gold/40 text-white text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg bg-brand-gold hover:brightness-110 text-black font-semibold text-xs uppercase tracking-widest transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? 'Securing Credentials...' : 'Save New Passphrase'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center border-t border-white/10 pt-4">
            <Link
              href="/"
              className="text-[11px] text-neutral-400 hover:text-brand-gold transition font-mono"
            >
              &larr; Return to Zebdecor Abuja Atelier
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0807] flex items-center justify-center text-brand-gold font-mono text-xs">
          Loading Security Handshake...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
