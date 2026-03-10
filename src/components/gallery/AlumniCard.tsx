'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Alumni } from '@/types/alumni';
import { GraduationCap, Building2, Quote } from 'lucide-react';

interface AlumniCardProps {
  alumni: Alumni;
  index: number;
  onClick: (alumni: Alumni) => void;
}

export default function AlumniCard({ alumni, index, onClick }: AlumniCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseY, [-100, 100], [8, -8]);
  const rotateY = useTransform(mouseX, [-100, 100], [-8, 8]);

  const floatDelay = (index % 5) * 0.4;
  const floatDuration = 3 + (index % 3) * 0.8;

  const initials = alumni.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const gradients = [
    'from-amber-900/40 via-yellow-800/20 to-transparent',
    'from-blue-900/40 via-indigo-800/20 to-transparent',
    'from-rose-900/40 via-red-800/20 to-transparent',
    'from-emerald-900/40 via-teal-800/20 to-transparent',
    'from-purple-900/40 via-violet-800/20 to-transparent',
  ];
  const gradient = gradients[index % gradients.length];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(e.clientX - cx);
    y.set(e.clientY - cy);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
      className="cursor-pointer"
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: floatDuration,
          delay: floatDelay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClick(alumni)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative rounded-2xl overflow-hidden group"
      >
        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.1) 0%, transparent 70%)',
            boxShadow: 'inset 0 1px 0 rgba(201,168,76,0.2)',
          }}
        />

        {/* Image or Gradient Placeholder */}
        <div className="relative overflow-hidden" style={{ paddingTop: '100%' }}>
          {alumni.image_url ? (
            <img
              src={alumni.image_url}
              alt={alumni.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}
              style={{ background: 'linear-gradient(135deg, #1a1f35 0%, #0d1020 100%)' }}
            >
              <span
                className="text-4xl font-bold text-gold-gradient"
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

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Year badge */}
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.3)',
              color: '#f0d080',
              fontFamily: 'Outfit, sans-serif',
              backdropFilter: 'blur(8px)',
            }}
          >
            {alumni.batch_year}
          </div>
        </div>

        {/* Card content */}
        <div className="p-4" style={{ transform: 'translateZ(20px)' }}>
          <h3
            className="font-semibold text-base leading-tight mb-1 truncate"
            style={{ fontFamily: 'Outfit, sans-serif', color: '#e8eaf0' }}
          >
            {alumni.name}
          </h3>

          {alumni.current_role && (
            <div className="flex items-center gap-1.5 mb-1">
              <Building2 size={11} style={{ color: 'rgba(201,168,76,0.7)', flexShrink: 0 }} />
              <span className="text-xs truncate" style={{ color: 'rgba(232,234,240,0.55)' }}>
                {alumni.current_role}
                {alumni.current_company ? ` · ${alumni.current_company}` : ''}
              </span>
            </div>
          )}

          {alumni.department && (
            <div className="flex items-center gap-1.5">
              <GraduationCap size={11} style={{ color: 'rgba(201,168,76,0.5)', flexShrink: 0 }} />
              <span className="text-xs truncate" style={{ color: 'rgba(232,234,240,0.4)' }}>
                {alumni.department}
              </span>
            </div>
          )}

          {alumni.quote && (
            <div
              className="mt-3 pt-3 flex gap-2"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Quote size={12} className="shrink-0 mt-0.5" style={{ color: 'rgba(201,168,76,0.4)' }} />
              <p
                className="text-xs leading-relaxed line-clamp-2"
                style={{ color: 'rgba(232,234,240,0.45)', fontStyle: 'italic' }}
              >
                {alumni.quote}
              </p>
            </div>
          )}
        </div>

        {/* Bottom border glow on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)' }}
        />
      </motion.div>
    </motion.div>
  );
}
