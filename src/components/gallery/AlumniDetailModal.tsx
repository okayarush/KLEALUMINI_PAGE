'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Alumni } from '@/types/alumni';
import { X, GraduationCap, Building2, Linkedin, Quote, Calendar } from 'lucide-react';
import { useEffect } from 'react';

interface AlumniDetailModalProps {
  alumni: Alumni | null;
  onClose: () => void;
}

export default function AlumniDetailModal({ alumni, onClose }: AlumniDetailModalProps) {
  useEffect(() => {
    if (alumni) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [alumni]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const initials = alumni?.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '';

  return (
    <AnimatePresence>
      {alumni && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 modal-backdrop"
            style={{ background: 'rgba(6,8,15,0.85)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl pointer-events-auto"
              style={{
                background: 'rgba(10,14,28,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.08)',
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(232,234,240,0.6)',
                }}
              >
                <X size={16} />
              </button>

              {/* Hero section */}
              <div className="relative overflow-hidden rounded-t-3xl" style={{ height: 280 }}>
                {alumni.image_url ? (
                  <img
                    src={alumni.image_url}
                    alt={alumni.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #1a1f35 0%, #0d1020 100%)' }}
                  >
                    <span
                      className="text-8xl font-bold"
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1c] via-[#0a0e1c]/30 to-transparent" />

                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2
                        className="text-3xl font-bold text-white mb-1"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      >
                        {alumni.name}
                      </h2>
                      <div className="flex items-center gap-2">
                        <Calendar size={13} style={{ color: '#c9a84c' }} />
                        <span style={{ color: '#c9a84c', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 500 }}>
                          Batch of {alumni.batch_year}
                        </span>
                      </div>
                    </div>
                    {alumni.linkedin_url && (
                      <a
                        href={alumni.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                        style={{
                          background: 'rgba(74,144,217,0.15)',
                          border: '1px solid rgba(74,144,217,0.3)',
                          color: '#7ab8f5',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Linkedin size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Role & Department */}
                <div className="grid grid-cols-2 gap-3">
                  {alumni.current_role && (
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 size={13} style={{ color: '#c9a84c' }} />
                        <span style={{ color: 'rgba(232,234,240,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Role</span>
                      </div>
                      <p className="text-sm font-medium" style={{ color: '#e8eaf0' }}>
                        {alumni.current_role}
                        {alumni.current_company && (
                          <span style={{ color: 'rgba(232,234,240,0.55)' }}> · {alumni.current_company}</span>
                        )}
                      </p>
                    </div>
                  )}
                  {alumni.department && (
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <GraduationCap size={13} style={{ color: '#c9a84c' }} />
                        <span style={{ color: 'rgba(232,234,240,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Department</span>
                      </div>
                      <p className="text-sm font-medium" style={{ color: '#e8eaf0' }}>{alumni.department}</p>
                    </div>
                  )}
                </div>

                {/* Quote */}
                {alumni.quote && (
                  <div
                    className="p-4 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 100%)',
                      border: '1px solid rgba(201,168,76,0.15)',
                    }}
                  >
                    <Quote size={20} className="mb-2" style={{ color: 'rgba(201,168,76,0.5)' }} />
                    <p
                      className="text-base leading-relaxed italic"
                      style={{ color: 'rgba(232,234,240,0.8)', fontFamily: 'Inter, sans-serif' }}
                    >
                      {alumni.quote}
                    </p>
                  </div>
                )}

                {/* Description */}
                {alumni.description && (
                  <div>
                    <h4
                      className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{ color: 'rgba(201,168,76,0.6)' }}
                    >
                      Memory
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'rgba(232,234,240,0.65)', fontFamily: 'Inter, sans-serif' }}
                    >
                      {alumni.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom gold line */}
              <div
                className="mx-6 mb-6 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
