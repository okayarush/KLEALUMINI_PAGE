'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, GraduationCap, Users, Sparkles } from 'lucide-react';
import { Alumni } from '@/types/alumni';
import AlumniCard from '@/components/gallery/AlumniCard';
import AlumniDetailModal from '@/components/gallery/AlumniDetailModal';
import SubmissionModal from '@/components/gallery/SubmissionModal';
import BackgroundOrbs from '@/components/ui/BackgroundOrbs';

export default function GalleryPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [filtered, setFiltered] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [showSubmission, setShowSubmission] = useState(false);
  const [search, setSearch] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/alumni');
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      setAlumni(data.alumni || []);
    } catch {
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  useEffect(() => {
    let result = alumni;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          a.department?.toLowerCase().includes(q) ||
          a.current_role?.toLowerCase().includes(q) ||
          a.current_company?.toLowerCase().includes(q)
      );
    }
    if (filterYear) {
      result = result.filter(a => String(a.batch_year) === filterYear);
    }
    setFiltered(result);
  }, [alumni, search, filterYear]);

  const uniqueYears = [...new Set(alumni.map(a => a.batch_year))].sort((a, b) => b - a);

  return (
    <div className="relative min-h-screen" style={{ background: '#06080f' }}>
      <BackgroundOrbs />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-6 pt-10 pb-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
                style={{
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  color: '#c9a84c',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                <Sparkles size={10} />
                KLE Technological University | HUBLI
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1
                  className="text-5xl md:text-6xl font-extrabold leading-tight"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  <span style={{ color: '#e8eaf0' }}>Alumni</span>
                  <br />
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #c9a84c, #f0d080, #c9a84c)',
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Legacy
                  </span>
                </h1>
                <p className="mt-3 text-base max-w-md" style={{ color: 'rgba(232,234,240,0.5)', fontFamily: 'Inter, sans-serif' }}>
                  A timeless digital yearbook celebrating the brilliant minds that shaped KLE&apos;s legacy.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="px-4 py-2.5 rounded-2xl text-center"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: '#f0d080' }}>
                    {alumni.length}
                  </div>
                  <div className="text-xs flex items-center gap-1" style={{ color: 'rgba(232,234,240,0.4)' }}>
                    <Users size={10} />
                    Alumni
                  </div>
                </div>
                <div
                  className="px-4 py-2.5 rounded-2xl text-center"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: '#7ab8f5' }}>
                    {uniqueYears.length}
                  </div>
                  <div className="text-xs flex items-center gap-1" style={{ color: 'rgba(232,234,240,0.4)' }}>
                    <GraduationCap size={10} />
                    Batches
                  </div>
                </div>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'rgba(232,234,240,0.3)' }}
                />
                <input
                  className="input-elegant pl-10 pr-4 py-3 text-sm"
                  placeholder="Search by name, department, company…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                className="input-elegant px-4 py-3 text-sm sm:w-44 appearance-none cursor-pointer"
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
              >
                <option value="" style={{ background: '#08090e' }}>All Batches</option>
                {uniqueYears.map(y => (
                  <option key={y} value={String(y)} style={{ background: '#08090e' }}>{y}</option>
                ))}
              </select>
            </div>
          </motion.div>
        </header>

        {/* Gold divider */}
        <div
          className="mx-6 mb-8 h-px"
          style={{
            maxWidth: 'calc(100% - 3rem)',
            marginLeft: 'auto',
            marginRight: 'auto',
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)',
          }}
        />

        {/* Gallery grid */}
        <main className="flex-1 px-6 pb-32 max-w-7xl mx-auto w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 rounded-full"
                style={{ border: '2px solid rgba(201,168,76,0.15)', borderTopColor: '#c9a84c' }}
              />
              <p className="text-sm" style={{ color: 'rgba(232,234,240,0.4)' }}>Loading alumni gallery…</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 gap-4 text-center"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(201,168,76,0.06)',
                  border: '1px solid rgba(201,168,76,0.15)',
                }}
              >
                <GraduationCap size={28} style={{ color: 'rgba(201,168,76,0.5)' }} />
              </div>
              <p className="text-base font-medium" style={{ color: 'rgba(232,234,240,0.5)' }}>
                {alumni.length === 0 ? 'No alumni yet. Be the first!' : 'No results found.'}
              </p>
              {alumni.length === 0 && (
                <button
                  onClick={() => setShowSubmission(true)}
                  className="btn-gold px-5 py-2.5 text-sm mt-2"
                >
                  Add Your Legacy
                </button>
              )}
            </motion.div>
          ) : (
            <AnimatePresence>
              <div
                className="grid gap-5"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
              >
                {filtered.map((a, i) => (
                  <AlumniCard
                    key={a.id}
                    alumni={a}
                    index={i}
                    onClick={setSelectedAlumni}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </main>

      </div>

<AlumniDetailModal
        alumni={selectedAlumni}
        onClose={() => setSelectedAlumni(null)}
      />
      <SubmissionModal
        isOpen={showSubmission}
        onClose={() => setShowSubmission(false)}
        onSuccess={fetchAlumni}
      />
    </div>
  );
}
