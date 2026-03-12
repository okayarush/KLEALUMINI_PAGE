'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Check, X, Clock, Users, CheckCircle, XCircle, LogOut,
  GraduationCap, Building2, Linkedin, Quote, Calendar,
  ChevronRight, RefreshCw, Inbox
} from 'lucide-react';
import { Alumni } from '@/types/alumni';
import BackgroundOrbs from '@/components/ui/BackgroundOrbs';

type FilterStatus = 'pending' | 'approved' | 'rejected';

const STATUS_CONFIG = {
  pending: { icon: Clock, color: '#c9a84c', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.25)', label: 'Pending' },
  approved: { icon: CheckCircle, color: '#68d391', bg: 'rgba(104,211,145,0.1)', border: 'rgba(104,211,145,0.25)', label: 'Approved' },
  rejected: { icon: XCircle, color: '#fc8181', bg: 'rgba(252,129,129,0.1)', border: 'rgba(252,129,129,0.25)', label: 'Rejected' },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Alumni[]>([]);
  const [selected, setSelected] = useState<Alumni | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('pending');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSubmissions = useCallback(async (status: FilterStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?status=${status}`);
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      setSubmissions(data.submissions || []);
      setSelected(data.submissions?.[0] || null);
    } catch {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const safeJson = async (res: Response) => {
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  };

  const fetchCounts = useCallback(async () => {
    try {
      const [p, a, r] = await Promise.all([
        fetch('/api/admin/submissions?status=pending').then(safeJson),
        fetch('/api/admin/submissions?status=approved').then(safeJson),
        fetch('/api/admin/submissions?status=rejected').then(safeJson),
      ]);
      setCounts({
        pending: p.submissions?.length ?? 0,
        approved: a.submissions?.length ?? 0,
        rejected: r.submissions?.length ?? 0,
      });
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchSubmissions(filterStatus);
  }, [fetchSubmissions, filterStatus]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts, submissions]);

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setActionLoading(id + action);
    try {
      const res = await fetch('/api/admin/review', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) {
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        throw new Error(data.error || `Error ${res.status}`);
      }
      showToast(action === 'approve' ? 'Alumni approved and published!' : 'Submission rejected.', 'success');
      setSubmissions(prev => {
        const remaining = prev.filter(s => s.id !== id);
        setSelected(remaining[0] || null);
        return remaining;
      });
      fetchCounts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed.';
      showToast(msg, 'error');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
  }

  const initials = selected?.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '';

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: '#06080f' }}>
      <BackgroundOrbs />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-5 left-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-medium"
            style={{
              background: toast.type === 'success' ? 'rgba(104,211,145,0.12)' : 'rgba(252,129,129,0.12)',
              border: `1px solid ${toast.type === 'success' ? 'rgba(104,211,145,0.3)' : 'rgba(252,129,129,0.3)'}`,
              color: toast.type === 'success' ? '#68d391' : '#fc8181',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header
        className="relative z-10 px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.2)',
              color: '#c9a84c',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            KLE
          </div>
          <div>
            <h1 className="text-base font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: '#e8eaf0' }}>
              Admin Dashboard
            </h1>
            <p className="text-xs" style={{ color: 'rgba(232,234,240,0.35)' }}>Legacy Professional</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Stats pills */}
          {(Object.keys(STATUS_CONFIG) as FilterStatus[]).map(s => {
            const cfg = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all duration-200"
                style={{
                  background: filterStatus === s ? cfg.bg : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${filterStatus === s ? cfg.border : 'rgba(255,255,255,0.07)'}`,
                  color: filterStatus === s ? cfg.color : 'rgba(232,234,240,0.4)',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                <cfg.icon size={11} />
                {cfg.label}
                <span
                  className="px-1.5 py-0.5 rounded-md text-xs"
                  style={{ background: filterStatus === s ? cfg.bg : 'rgba(255,255,255,0.05)' }}
                >
                  {counts[s]}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => fetchSubmissions(filterStatus)}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(232,234,240,0.4)' }}
          >
            <RefreshCw size={13} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all hover:scale-105"
            style={{ background: 'rgba(252,129,129,0.06)', border: '1px solid rgba(252,129,129,0.15)', color: '#fc8181' }}
          >
            <LogOut size={12} />
            Logout
          </button>
        </div>
      </header>

      {/* Main dual-column layout */}
      <div className="relative z-10 flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 65px)' }}>
        {/* LEFT: submission list */}
        <div
          className="w-80 flex-shrink-0 overflow-y-auto"
          style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 rounded-full"
                style={{ border: '2px solid rgba(201,168,76,0.15)', borderTopColor: '#c9a84c' }}
              />
              <p className="text-xs" style={{ color: 'rgba(232,234,240,0.35)' }}>Loading submissions…</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <Inbox size={32} style={{ color: 'rgba(232,234,240,0.2)' }} />
              <p className="text-sm" style={{ color: 'rgba(232,234,240,0.4)' }}>
                No {filterStatus} submissions
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(232,234,240,0.3)' }}>
                {submissions.length} {filterStatus}
              </p>
              <AnimatePresence>
                {submissions.map((sub, i) => (
                  <SubmissionListItem
                    key={sub.id}
                    alumni={sub}
                    index={i}
                    isSelected={selected?.id === sub.id}
                    onClick={() => setSelected(sub)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* RIGHT: detail view */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {!selected ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full gap-4 text-center"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <Users size={24} style={{ color: 'rgba(232,234,240,0.2)' }} />
                </div>
                <p className="text-sm" style={{ color: 'rgba(232,234,240,0.35)' }}>
                  Select a submission to review
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="p-6 max-w-2xl"
              >
                {/* Hero */}
                <div
                  className="relative rounded-2xl overflow-hidden mb-6"
                  style={{ height: 280 }}
                >
                  {selected.image_url ? (
                    <img
                      src={selected.image_url}
                      alt={selected.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #1a1f35 0%, #0d1020 100%)' }}
                    >
                      <span
                        className="text-7xl font-bold"
                        style={{
                          fontFamily: 'Outfit, sans-serif',
                          background: 'linear-gradient(135deg, #c9a84c, #f0d080)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {initials}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <h2
                      className="text-2xl font-bold text-white"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {selected.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={12} style={{ color: '#c9a84c' }} />
                      <span style={{ color: '#c9a84c', fontSize: 13, fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}>
                        Batch of {selected.batch_year}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <StatusBadge status={selected.status} />
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {selected.department && (
                    <InfoBlock icon={GraduationCap} label="Department" value={selected.department} />
                  )}
                  {selected.current_role && (
                    <InfoBlock
                      icon={Building2}
                      label="Role"
                      value={`${selected.current_role}${selected.current_company ? ` · ${selected.current_company}` : ''}`}
                    />
                  )}
                  {selected.linkedin_url && (
                    <InfoBlock
                      icon={Linkedin}
                      label="LinkedIn"
                      value={selected.linkedin_url}
                      isLink
                    />
                  )}
                  <div
                    className="p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={13} style={{ color: '#c9a84c' }} />
                      <span style={{ color: 'rgba(232,234,240,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Submitted
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: '#e8eaf0' }}>
                      {new Date(selected.submitted_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Quote */}
                {selected.quote && (
                  <div
                    className="p-4 rounded-xl mb-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 100%)',
                      border: '1px solid rgba(201,168,76,0.15)',
                    }}
                  >
                    <Quote size={18} className="mb-2" style={{ color: 'rgba(201,168,76,0.5)' }} />
                    <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(232,234,240,0.75)' }}>
                      {selected.quote}
                    </p>
                  </div>
                )}

                {/* Description */}
                {selected.description && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(201,168,76,0.6)' }}>
                      Memory
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(232,234,240,0.6)' }}>
                      {selected.description}
                    </p>
                  </div>
                )}

                {/* Action buttons — only show for pending */}
                {selected.status === 'pending' && (
                  <div className="flex gap-3 sticky bottom-0 pb-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAction(selected.id, 'reject')}
                      disabled={actionLoading !== null}
                      className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition-all disabled:opacity-50"
                      style={{
                        background: 'rgba(252,129,129,0.08)',
                        border: '1px solid rgba(252,129,129,0.25)',
                        color: '#fc8181',
                        fontFamily: 'Outfit, sans-serif',
                      }}
                    >
                      <X size={16} />
                      Reject
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAction(selected.id, 'approve')}
                      disabled={actionLoading !== null}
                      className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition-all disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, rgba(104,211,145,0.12), rgba(104,211,145,0.06))',
                        border: '1px solid rgba(104,211,145,0.3)',
                        color: '#68d391',
                        fontFamily: 'Outfit, sans-serif',
                      }}
                    >
                      <Check size={16} />
                      Approve & Publish
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ---- Sub-components ----

function SubmissionListItem({
  alumni, index, isSelected, onClick
}: {
  alumni: Alumni;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const cfg = STATUS_CONFIG[alumni.status];
  const initials = alumni.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className="w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all duration-200 group"
      style={{
        background: isSelected ? 'rgba(201,168,76,0.07)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isSelected ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)'}`,
      }}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1a1f35, #0d1020)' }}
      >
        {alumni.image_url ? (
          <img src={alumni.image_url} alt={alumni.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-bold" style={{ color: '#c9a84c', fontFamily: 'Outfit, sans-serif' }}>
            {initials}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{ fontFamily: 'Outfit, sans-serif', color: isSelected ? '#e8eaf0' : 'rgba(232,234,240,0.75)' }}
        >
          {alumni.name}
        </p>
        <p className="text-xs truncate" style={{ color: 'rgba(232,234,240,0.35)' }}>
          Batch {alumni.batch_year}{alumni.department ? ` · ${alumni.department}` : ''}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: cfg.color }}
        />
        <ChevronRight size={12} style={{ color: isSelected ? 'rgba(201,168,76,0.6)' : 'rgba(232,234,240,0.2)' }} />
      </div>
    </motion.button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as FilterStatus] || STATUS_CONFIG.pending;
  return (
    <div
      className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontFamily: 'Outfit, sans-serif', backdropFilter: 'blur(8px)' }}
    >
      <cfg.icon size={10} />
      {cfg.label}
    </div>
  );
}

function InfoBlock({
  icon: Icon, label, value, isLink = false
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div
      className="p-3 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon size={13} style={{ color: '#c9a84c' }} />
        <span style={{ color: 'rgba(232,234,240,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </span>
      </div>
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm truncate block hover:underline"
          style={{ color: '#7ab8f5' }}
        >
          {value}
        </a>
      ) : (
        <p className="text-sm" style={{ color: '#e8eaf0' }}>{value}</p>
      )}
    </div>
  );
}
