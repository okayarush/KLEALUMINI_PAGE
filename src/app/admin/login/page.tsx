'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';
import BackgroundOrbs from '@/components/ui/BackgroundOrbs';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Invalid credentials.');
        return;
      }

      router.push('/admin/dashboard');
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center" style={{ background: '#06080f' }}>
      <BackgroundOrbs />

      <div className="relative z-10 w-full max-w-sm px-4">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo / brand */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{
                background: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,168,76,0.2)',
              }}
            >
              <Sparkles size={12} style={{ color: '#c9a84c' }} />
              <span className="text-xs font-semibold" style={{ color: '#c9a84c', fontFamily: 'Outfit, sans-serif' }}>
                KLE Alumni
              </span>
            </div>
            <h1
              className="text-3xl font-extrabold"
              style={{ fontFamily: 'Outfit, sans-serif', color: '#e8eaf0' }}
            >
              Admin Portal
            </h1>
            <p className="text-sm mt-2" style={{ color: 'rgba(232,234,240,0.4)' }}>
              Sign in to review and approve submissions
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-3xl p-6"
            style={{
              background: 'rgba(10,14,28,0.95)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Top gold accent */}
            <div
              className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }}
            />

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(201,168,76,0.7)' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'rgba(232,234,240,0.3)' }}
                  />
                  <input
                    type="email"
                    required
                    className="input-elegant pl-10 pr-4 py-3 text-sm"
                    placeholder="admin@klealumni.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(201,168,76,0.7)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'rgba(232,234,240,0.3)' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-elegant pl-10 pr-10 py-3 text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(232,234,240,0.3)' }}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 text-center"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-5 text-xs" style={{ color: 'rgba(232,234,240,0.25)' }}>
            KLE Alumni — Legacy Professional
          </p>
        </motion.div>
      </div>
    </div>
  );
}
