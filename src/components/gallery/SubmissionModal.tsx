'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Upload, ArrowRight, ArrowLeft, Check, Loader2, User, BookOpen, Image as ImageIcon, Sparkles } from 'lucide-react';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 1 | 2 | 3 | 4;

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Computer Science & Engineering (AI)',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Information Technology',
  'Chemical Engineering',
  'MBA / Management',
  'Law',
  'Medicine / MBBS',
  'Architecture',
  'Other',
];

const STEP_ICONS = [User, BookOpen, Sparkles, ImageIcon];
const STEP_LABELS = ['Identity', 'Memory', 'Legacy', 'Portrait'];

export default function SubmissionModal({ isOpen, onClose, onSuccess }: SubmissionModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    batch_year: '',
    department: '',
    description: '',
    quote: '',
    current_role: '',
    current_company: '',
    linkedin_url: '',
    image: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setSubmitted(false);
        setImagePreview(null);
        setForm({
          name: '', batch_year: '', department: '', description: '',
          quote: '', current_role: '', current_company: '', linkedin_url: '', image: null,
        });
        setErrors({});
      }, 400);
    }
  }, [isOpen]);

  function update(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: '' }));
  }

  function validateStep(s: Step): boolean {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) newErrors.name = 'Your name is required.';
      if (!form.batch_year) newErrors.batch_year = 'Batch year is required.';
      else if (Number(form.batch_year) < 1960 || Number(form.batch_year) > new Date().getFullYear())
        newErrors.batch_year = 'Enter a valid year.';
    }
    if (s === 3) {
      if (form.linkedin_url && !form.linkedin_url.startsWith('https://')) {
        newErrors.linkedin_url = 'LinkedIn URL must start with https://';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function nextStep() {
    if (validateStep(step as Step)) {
      setStep(s => Math.min(4, s + 1) as Step);
    }
  }

  function handleFileChange(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors(e => ({ ...e, image: 'Please upload an image file.' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(e => ({ ...e, image: 'Image must be under 5MB.' }));
      return;
    }
    setForm(f => ({ ...f, image: file }));
    setErrors(e => ({ ...e, image: '' }));
    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
      setTimeout(() => setIsScanning(false), 1800);
    };
    reader.readAsDataURL(file);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  }, []);

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v && k !== 'image') fd.append(k, v as string);
      });
      if (form.image) fd.append('image', form.image);

      const res = await fetch('/api/alumni', { method: 'POST', body: fd });

      // Safely parse JSON — empty body will throw, so we catch that
      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        if (!res.ok) throw new Error(`Server error (${res.status})`);
      }

      if (!res.ok) throw new Error(data.error || `Server error (${res.status})`);
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed.';
      setErrors({ submit: msg });
    } finally {
      setIsSubmitting(false);
    }
  }

  const canProceed = step < 4;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="submission-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 modal-backdrop"
            style={{ background: 'rgba(6,8,15,0.9)' }}
            onClick={!isSubmitting ? onClose : undefined}
          />

          <motion.div
            key="submission-modal"
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.94 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-lg pointer-events-auto overflow-hidden rounded-3xl"
              style={{
                background: 'rgba(8,11,22,0.98)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,76,0.06)',
              }}
            >
              {/* Gold top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)' }}
              />

              {/* Header */}
              <div className="px-6 pt-6 pb-4 flex items-start justify-between">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ color: 'rgba(201,168,76,0.7)' }}
                  >
                    Leave Your Mark
                  </p>
                  <h2
                    className="text-xl font-bold"
                    style={{ fontFamily: 'Outfit, sans-serif', color: '#e8eaf0' }}
                  >
                    {submitted ? 'Legacy Submitted' : 'Add Your Legacy'}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105 disabled:opacity-40"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(232,234,240,0.5)',
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Step indicators */}
              {!submitted && (
                <div className="px-6 pb-5 flex items-center gap-2">
                  {([1, 2, 3, 4] as Step[]).map((s) => {
                    const Icon = STEP_ICONS[s - 1];
                    const isActive = s === step;
                    const isDone = s < step;
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <motion.div
                          animate={{
                            width: isActive ? 80 : 32,
                            background: isDone
                              ? 'rgba(201,168,76,0.4)'
                              : isActive
                                ? 'linear-gradient(90deg, #c9a84c, #f0d080)'
                                : 'rgba(255,255,255,0.08)',
                          }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="h-8 rounded-full flex items-center justify-center overflow-hidden"
                          style={{ minWidth: 32 }}
                        >
                          {isDone ? (
                            <Check size={13} style={{ color: '#c9a84c' }} />
                          ) : (
                            <div className="flex items-center gap-1.5 px-2">
                              <Icon size={13} style={{ color: isActive ? '#06080f' : 'rgba(232,234,240,0.3)' }} />
                              {isActive && (
                                <span
                                  className="text-xs font-semibold whitespace-nowrap"
                                  style={{ color: '#06080f', fontFamily: 'Outfit, sans-serif' }}
                                >
                                  {STEP_LABELS[s - 1]}
                                </span>
                              )}
                            </div>
                          )}
                        </motion.div>
                        {s < 4 && (
                          <div
                            className="flex-1 h-px"
                            style={{
                              background: s < step ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)',
                              width: 12,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Form content */}
              <div className="px-6 pb-6" style={{ minHeight: 280 }}>
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-col items-center justify-center py-8 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                        style={{
                          background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(240,208,128,0.1))',
                          border: '1px solid rgba(201,168,76,0.4)',
                        }}
                      >
                        <Check size={28} style={{ color: '#f0d080' }} />
                      </motion.div>
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ fontFamily: 'Outfit, sans-serif', color: '#e8eaf0' }}
                      >
                        Your legacy is submitted!
                      </h3>
                      <p className="text-sm" style={{ color: 'rgba(232,234,240,0.5)' }}>
                        It will appear in the gallery after admin approval.
                      </p>
                    </motion.div>
                  ) : step === 1 ? (
                    <StepOne form={form} errors={errors} update={update} key="step1" />
                  ) : step === 2 ? (
                    <StepTwo form={form} errors={errors} update={update} key="step2" />
                  ) : step === 3 ? (
                    <StepThree form={form} errors={errors} update={update} key="step3" />
                  ) : (
                    <StepFour
                      key="step4"
                      imagePreview={imagePreview}
                      isScanning={isScanning}
                      dragOver={dragOver}
                      fileRef={fileRef}
                      onFile={handleFileChange}
                      onDragOver={() => setDragOver(true)}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      errors={errors}
                    />
                  )}
                </AnimatePresence>

                {errors.submit && (
                  <p className="text-xs mt-3 text-red-400 text-center">{errors.submit}</p>
                )}
              </div>

              {/* Footer actions */}
              {!submitted && (
                <div
                  className="px-6 pb-6 flex items-center justify-between"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}
                >
                  <button
                    onClick={() => setStep(s => Math.max(1, s - 1) as Step)}
                    disabled={step === 1 || isSubmitting}
                    className="btn-ghost flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>

                  {canProceed ? (
                    <button
                      onClick={nextStep}
                      className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm"
                    >
                      Continue
                      <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <Check size={14} />
                          Submit Legacy
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ---- Sub-steps ----

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StepOne({ form, errors, update }: any) {
  // Track what's selected in the dropdown separately from the final department value
  const presetDepts = DEPARTMENTS.filter(d => d !== 'Other');
  const initialSelect = presetDepts.includes(form.department)
    ? form.department
    : form.department
      ? 'Other'
      : '';
  const [selectVal, setSelectVal] = useState(initialSelect);

  function handleSelectChange(val: string) {
    setSelectVal(val);
    if (val !== 'Other') {
      update('department', val);
    } else {
      // Clear department until they type their custom value
      update('department', '');
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(201,168,76,0.8)' }}>
          Full Name <span style={{ color: '#f56565' }}>*</span>
        </label>
        <input
          className="input-elegant px-4 py-3 text-sm"
          placeholder="e.g. Rajesh Kumar"
          value={form.name}
          onChange={e => update('name', e.target.value)}
          autoFocus
        />
        {errors.name && <p className="text-xs mt-1 text-red-400">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(201,168,76,0.8)' }}>
          Batch Year <span style={{ color: '#f56565' }}>*</span>
        </label>
        <input
          className="input-elegant px-4 py-3 text-sm"
          placeholder="e.g. 2018"
          type="number"
          min="1960"
          max={new Date().getFullYear()}
          value={form.batch_year}
          onChange={e => update('batch_year', e.target.value)}
        />
        {errors.batch_year && <p className="text-xs mt-1 text-red-400">{errors.batch_year}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(201,168,76,0.8)' }}>
          Department
        </label>
        <select
          className="input-elegant px-4 py-3 text-sm appearance-none"
          value={selectVal}
          onChange={e => handleSelectChange(e.target.value)}
          style={{ cursor: 'pointer' }}
        >
          <option value="" style={{ background: '#08090e' }}>Select department…</option>
          {DEPARTMENTS.map(d => (
            <option key={d} value={d} style={{ background: '#08090e' }}>{d}</option>
          ))}
        </select>

        {/* Custom department input — shown when "Other" is selected */}
        <AnimatePresence>
          {selectVal === 'Other' && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              <input
                className="input-elegant px-4 py-3 text-sm"
                placeholder="Enter your department name…"
                value={form.department}
                onChange={e => update('department', e.target.value)}
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StepTwo({ form, errors, update }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(201,168,76,0.8)' }}>
          Your Memory
        </label>
        <textarea
          className="input-elegant px-4 py-3 text-sm resize-none"
          placeholder="Share a cherished memory, a moment that defined your journey at KLE…"
          rows={4}
          value={form.description}
          onChange={e => update('description', e.target.value)}
          autoFocus
        />
        {errors.description && <p className="text-xs mt-1 text-red-400">{errors.description}</p>}
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(201,168,76,0.8)' }}>
          Your Quote
        </label>
        <input
          className="input-elegant px-4 py-3 text-sm"
          placeholder="A quote that captures who you are…"
          value={form.quote}
          onChange={e => update('quote', e.target.value)}
        />
      </div>
    </motion.div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StepThree({ form, errors, update }: any) {
  const linkedinOk = !form.linkedin_url || form.linkedin_url.startsWith('https://');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(201,168,76,0.8)' }}>
          Current Role
        </label>
        <input
          className="input-elegant px-4 py-3 text-sm"
          placeholder="e.g. Senior Software Engineer"
          value={form.current_role}
          onChange={e => update('current_role', e.target.value)}
          autoFocus
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(201,168,76,0.8)' }}>
          Company / Organization
        </label>
        <input
          className="input-elegant px-4 py-3 text-sm"
          placeholder="e.g. Google, Infosys, ISRO…"
          value={form.current_company}
          onChange={e => update('current_company', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(201,168,76,0.8)' }}>
          LinkedIn Profile
        </label>
        <div className="relative">
          <input
            className="input-elegant px-4 py-3 text-sm pr-24"
            placeholder="https://linkedin.com/in/yourname"
            value={form.linkedin_url}
            onChange={e => update('linkedin_url', e.target.value)}
            style={{
              borderColor: errors.linkedin_url
                ? 'rgba(252,129,129,0.5)'
                : form.linkedin_url && !linkedinOk
                  ? 'rgba(252,129,129,0.4)'
                  : undefined,
            }}
          />
          {/* Live preview link — only shows when URL is valid */}
          {form.linkedin_url && linkedinOk && (
            <a
              href={form.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-all hover:scale-105"
              style={{
                background: 'rgba(74,144,217,0.12)',
                border: '1px solid rgba(74,144,217,0.25)',
                color: '#7ab8f5',
                textDecoration: 'none',
              }}
              onClick={e => e.stopPropagation()}
            >
              Open ↗
            </a>
          )}
        </div>
        <p className="text-xs mt-1.5" style={{ color: 'rgba(232,234,240,0.3)' }}>
          Must start with <span style={{ color: 'rgba(201,168,76,0.6)' }}>https://</span>
        </p>
        {errors.linkedin_url && (
          <p className="text-xs mt-1 text-red-400">{errors.linkedin_url}</p>
        )}
      </div>
    </motion.div>
  );
}

interface StepFourProps {
  imagePreview: string | null;
  isScanning: boolean;
  dragOver: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onFile: (f: File | null) => void;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  errors: Record<string, string>;
}

function StepFour({ imagePreview, isScanning, dragOver, fileRef, onFile, onDragOver, onDragLeave, onDrop, errors }: StepFourProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      <p className="text-xs mb-3" style={{ color: 'rgba(232,234,240,0.45)' }}>
        Upload your portrait photo (optional — max 5MB)
      </p>
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); onDragOver(); }}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
        style={{
          height: 220,
          border: `2px dashed ${dragOver ? 'rgba(201,168,76,0.6)' : imagePreview ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.1)'}`,
          background: dragOver ? 'rgba(201,168,76,0.04)' : 'rgba(255,255,255,0.02)',
        }}
      >
        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
              style={{ opacity: isScanning ? 0.6 : 1, transition: 'opacity 0.3s' }}
            />
            {isScanning && (
              <>
                <div className="absolute inset-0" style={{ background: 'rgba(201,168,76,0.05)' }} />
                <div className="scan-line" />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'rgba(6,8,15,0.3)' }}
                >
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      background: 'rgba(201,168,76,0.15)',
                      border: '1px solid rgba(201,168,76,0.3)',
                      color: '#f0d080',
                      fontFamily: 'Outfit, sans-serif',
                    }}
                  >
                    Scanning…
                  </span>
                </div>
              </>
            )}
            {!isScanning && (
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                style={{ background: 'rgba(6,8,15,0.6)' }}
              >
                <span className="text-sm" style={{ color: '#e8eaf0' }}>Click to change</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,168,76,0.2)',
              }}
            >
              <Upload size={20} style={{ color: 'rgba(201,168,76,0.7)' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: 'rgba(232,234,240,0.7)' }}>
                Drop your photo here
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(232,234,240,0.35)' }}>
                or click to browse
              </p>
            </div>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => onFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {errors.image && <p className="text-xs mt-2 text-red-400">{errors.image}</p>}
      <p className="text-xs mt-3 text-center" style={{ color: 'rgba(232,234,240,0.3)' }}>
        A professional portrait works best. PNG, JPG, or WebP.
      </p>
    </motion.div>
  );
}
