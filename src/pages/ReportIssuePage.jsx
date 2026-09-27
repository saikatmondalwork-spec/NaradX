import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Image, Mic, MicOff, MapPin, Upload, X,
  ChevronRight, ArrowLeft, Home, Globe, HelpCircle,
  Zap, Droplets, Wifi, AlertTriangle, CheckCircle, AlertCircle,
  Phone, FileText, ChevronLeft, Navigation, Loader2, Camera, Trash2
} from 'lucide-react';
import { submitReport } from '../services/api';
import { useAppStore } from '../store/appStore';
import { useToast } from '../components/common/Toast';

const steps = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Category' },
  { id: 3, label: 'Location' },
  { id: 4, label: 'Review' },
];

const categories = [
  { id: 'Roads', label: 'Roads', icon: '🛣️', description: 'Potholes, road damage, signage', color: 'border-brand-blue bg-blue-50' },
  { id: 'Water', label: 'Water', icon: '💧', description: 'Supply issues, pipe leaks, quality', color: 'border-brand-cyan bg-cyan-50' },
  { id: 'Drainage', label: 'Drainage', icon: '🌊', description: 'Flooding, blocked drains, sewage', color: 'border-purple-400 bg-purple-50' },
  { id: 'Electricity', label: 'Electricity', icon: '⚡', description: 'Power cuts, street lights, meters', color: 'border-brand-amber bg-amber-50' },
  { id: 'Connectivity', label: 'Connectivity', icon: '📡', description: 'Internet, mobile signals, broadband', color: 'border-green-400 bg-green-50' },
  { id: 'Other', label: 'Other', icon: '📋', description: 'Sanitation, parks, public spaces', color: 'border-gray-300 bg-gray-50' },
];

const languagesList = ['English', 'Hindi', 'Bengali', 'Telugu', 'Tamil', 'Marathi', 'Gujarati', 'Punjabi'];

const DRAFT_KEY = 'naradx_report_draft';

// ─── Helper: load draft from localStorage ────────────────────────────────────
function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Only restore if the draft is less than 24h old
      if (parsed._savedAt && Date.now() - parsed._savedAt < 86400000) {
        const { _savedAt, ...data } = parsed;
        return data;
      }
    }
  } catch { /* ignore corrupt data */ }
  return null;
}

function saveDraft(formData, currentStep) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      ...formData,
      _currentStep: currentStep,
      _savedAt: Date.now(),
    }));
  } catch { /* quota exceeded etc */ }
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

export default function ReportIssuePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const addCitizenReport = useAppStore(s => s.addCitizenReport);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // ── Restore draft ──────────────────────────────────────────────────────────
  const draft = loadDraft();
  const [currentStep, setCurrentStep] = useState(draft?._currentStep || 1);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Photo upload state: store actual File objects + preview URLs
  const [uploadedFiles, setUploadedFiles] = useState([]); // { file: File, preview: string, name: string }
  const [isDragging, setIsDragging] = useState(false);

  // Geolocation state
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoCoords, setGeoCoords] = useState(draft?.coordinates || null); // [lat, lng]
  const [draftRestored, setDraftRestored] = useState(!!draft);

  const [formData, setFormData] = useState({
    description: draft?.description || '',
    category: draft?.category || '',
    location: draft?.location || '',
    severity: draft?.severity || 'Medium',
    language: draft?.language || 'English',
    startMethod: draft?.startMethod || 'text',
    ward: draft?.ward || '',
    district: draft?.district || '',
  });

  // ── Auto-save draft on every change ────────────────────────────────────────
  useEffect(() => {
    const data = { ...formData };
    if (geoCoords) data.coordinates = geoCoords;
    saveDraft(data, currentStep);
  }, [formData, currentStep, geoCoords]);

  // Show "draft restored" toast once
  useEffect(() => {
    if (draftRestored) {
      toast.info('Draft restored from your previous session');
      setDraftRestored(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cleanup object URLs on unmount ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(f => URL.revokeObjectURL(f.preview));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Photo upload handlers ──────────────────────────────────────────────────
  const processFiles = useCallback((fileList) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];
    const maxSize = 25 * 1024 * 1024; // 25MB
    const maxFiles = 5;

    const currentCount = uploadedFiles.length;
    const incoming = Array.from(fileList);
    const toAdd = [];

    for (const file of incoming) {
      if (currentCount + toAdd.length >= maxFiles) {
        toast.warning(`Maximum ${maxFiles} files allowed`);
        break;
      }
      if (!validTypes.includes(file.type)) {
        toast.error(`"${file.name}" is not a supported format`);
        continue;
      }
      if (file.size > maxSize) {
        toast.error(`"${file.name}" exceeds 25MB limit`);
        continue;
      }
      toAdd.push({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      });
    }

    if (toAdd.length > 0) {
      setUploadedFiles(prev => [...prev, ...toAdd]);
      toast.success(`${toAdd.length} file${toAdd.length > 1 ? 's' : ''} added`);
    }
  }, [uploadedFiles.length, toast]);

  const handleFileInputChange = (e) => {
    processFiles(e.target.files);
    e.target.value = ''; // reset so same file can be re-selected
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
    toast.info('File removed');
  };

  // ── Drag and Drop ─────────────────────────────────────────────────────────
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // ── Geolocation ────────────────────────────────────────────────────────────
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setGeoCoords([latitude, longitude]);
        
        // Reverse geocoding using OpenStreetMap Nominatim (free, no API key)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await response.json();
          const addr = data.address || {};
          const parts = [
            addr.road || addr.pedestrian || addr.footway,
            addr.neighbourhood || addr.suburb,
            addr.city || addr.town || addr.village,
          ].filter(Boolean);
          
          const locationStr = parts.join(', ') || data.display_name?.split(',').slice(0, 3).join(',');
          setFormData(prev => ({
            ...prev,
            location: locationStr || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            district: addr.county || addr.state_district || prev.district,
            ward: addr.neighbourhood || prev.ward,
          }));
          toast.success('Location detected successfully!');
        } catch {
          // If reverse geocoding fails, just use coordinates
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }));
          toast.info('Coordinates captured. Enter address details manually.');
        }
        setGeoLoading(false);
      },
      (error) => {
        setGeoLoading(false);
        const messages = {
          1: 'Location permission denied. Please enable it in browser settings.',
          2: 'Location unavailable. Please try again.',
          3: 'Location request timed out. Please try again.',
        };
        toast.error(messages[error.code] || 'Failed to detect location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        coordinates: geoCoords,
        evidenceCount: uploadedFiles.length,
        files: uploadedFiles.map(f => f.file), // actual File objects for Supabase Storage upload
        attachments: uploadedFiles.map(f => f.name),
      };
      const result = await submitReport(payload);

      // Push into Zustand store so Dashboard & Reports table update instantly
      addCitizenReport({
        ...result.data,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        severity: formData.severity,
        language: formData.language,
        coordinates: geoCoords,
        evidenceCount: uploadedFiles.length,
        attachments: result.data?.attachments || uploadedFiles.map(f => f.name),
        district: formData.district,
      });

      // Clear draft on successful submission
      clearDraft();

      // Cleanup file previews
      uploadedFiles.forEach(f => URL.revokeObjectURL(f.preview));

      toast.success('Report submitted successfully!');
      navigate('/report/success', { state: { report: result.data } });
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Save Draft Button ──────────────────────────────────────────────────────
  const handleSaveDraft = () => {
    saveDraft({ ...formData, coordinates: geoCoords }, currentStep);
    toast.success('Draft saved! You can continue later.');
  };

  const canProceed = () => {
    if (currentStep === 1) return formData.description.length >= 5;
    if (currentStep === 2) return !!formData.category;
    if (currentStep === 3) return formData.location.length >= 3;
    return true;
  };

  return (
    <div className="min-h-screen bg-civic-bg">
      {/* Sub-nav */}
      <div className="bg-white border-b border-civic-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-11 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="btn-ghost text-xs px-2 py-1">
              <ChevronLeft size={14} />
              Back
            </Link>
            <span className="text-civic-muted text-xs">/</span>
            <Home size={13} className="text-civic-muted" />
            <span className="text-civic-muted text-xs">›</span>
            <span className="text-xs font-semibold text-civic-heading">Report Issue</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-ghost text-xs px-2 py-1">
              <Globe size={13} />
              English
            </button>
            <button className="btn-ghost text-xs px-2 py-1">
              <HelpCircle size={13} />
              Help
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-civic-heading mb-2">Report a Development Issue</h1>
          <p className="text-civic-muted text-sm max-w-lg mx-auto">
            Your feedback directly impacts city planning. Provide as much detail as possible to help us prioritize and resolve the issue.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${
                    step.id === currentStep
                      ? 'border-brand-blue bg-brand-blue text-white'
                      : step.id < currentStep
                      ? 'border-brand-blue bg-brand-blue text-white cursor-pointer'
                      : 'border-civic-border text-civic-muted bg-white'
                  }`}
                >
                  {step.id < currentStep ? <CheckCircle size={16} /> : step.id}
                </button>
                <span className={`text-xs font-semibold mt-1 uppercase tracking-wide ${
                  step.id === currentStep ? 'text-brand-blue' : 'text-civic-muted'
                }`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-5 transition-colors ${
                  step.id < currentStep ? 'bg-brand-blue' : 'bg-civic-border'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {/* STEP 1: Details */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-civic-heading mb-4">How would you like to start?</h2>
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, startMethod: 'text' }))}
                      className={`card p-4 flex items-center gap-4 text-left transition-all ${
                        formData.startMethod === 'text' ? 'border-brand-blue bg-blue-50' : 'hover:border-brand-blue'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        formData.startMethod === 'text' ? 'bg-brand-blue text-white' : 'bg-civic-bg text-civic-muted'
                      }`}>
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-civic-heading text-sm">Type a Message</p>
                        <p className="text-xs text-civic-muted">Describe the issue in your own words</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, startMethod: 'image' }))}
                      className={`card p-4 flex items-center gap-4 text-left transition-all ${
                        formData.startMethod === 'image' ? 'border-brand-amber bg-amber-50' : 'hover:border-brand-amber'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        formData.startMethod === 'image' ? 'bg-brand-amber text-white' : 'bg-civic-bg text-civic-muted'
                      }`}>
                        <Image size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-civic-heading text-sm">Upload Image</p>
                        <p className="text-xs text-civic-muted">Start with a photo of the infrastructure issue</p>
                      </div>
                    </button>
                  </div>

                  {/* Language selector */}
                  <div className="mb-4">
                    <label className="label">Report Language</label>
                    <select
                      className="select max-w-xs"
                      value={formData.language}
                      onChange={e => setFormData(prev => ({ ...prev, language: e.target.value }))}
                    >
                      {languagesList.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="label m-0">Description</label>
                      <button
                        onClick={() => setIsVoiceActive(!isVoiceActive)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                          isVoiceActive
                            ? 'bg-status-critical text-white border-status-critical animate-pulse'
                            : 'border-brand-blue text-brand-blue hover:bg-navy-50'
                        }`}
                      >
                        {isVoiceActive ? <MicOff size={12} /> : <Mic size={12} />}
                        {isVoiceActive ? 'Stop Recording' : 'Voice Input'}
                      </button>
                    </div>
                    <textarea
                      className="input min-h-[140px] resize-none"
                      placeholder="Provide specific details about the issue. E.g., 'There is a large pothole at the intersection of Main St and 4th Ave that is causing traffic delays...'"
                      value={formData.description}
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-xs text-civic-muted flex items-center gap-1">
                        <AlertCircle size={11} />
                        Minimum 5 characters required.
                      </p>
                      <span className={`text-xs font-medium ${formData.description.length >= 5 ? 'text-status-low' : 'text-civic-muted'}`}>
                        {formData.description.length} chars
                      </span>
                    </div>
                  </div>

                  {/* ── Photo Upload with Drag & Drop + Preview ── */}
                  <div>
                    <label className="label">Evidence (Optional)</label>
                    <div
                      ref={dropZoneRef}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                        isDragging
                          ? 'border-brand-blue bg-blue-50 scale-[1.02]'
                          : 'border-civic-border hover:border-brand-blue'
                      }`}
                    >
                      <div className={`transition-transform ${isDragging ? 'scale-110' : ''}`}>
                        <Upload size={20} className={`mx-auto mb-2 ${isDragging ? 'text-brand-blue' : 'text-civic-muted'}`} />
                        <p className="text-sm text-civic-muted mb-1">
                          {isDragging ? 'Drop files here...' : 'Drag & drop photos or click to upload'}
                        </p>
                        <p className="text-xs text-civic-muted-light">PNG, JPG, WebP, MP4 up to 25MB · Max 5 files</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4"
                        onChange={handleFileInputChange}
                      />
                      {/* Mobile camera capture button */}
                      <div className="mt-3 flex items-center justify-center gap-3">
                        <span className="text-xs font-semibold text-brand-blue hover:underline">
                          Browse Files
                        </span>
                        <span className="text-xs text-civic-muted">or</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const camInput = document.createElement('input');
                            camInput.type = 'file';
                            camInput.accept = 'image/*';
                            camInput.capture = 'environment';
                            camInput.onchange = (ev) => processFiles(ev.target.files);
                            camInput.click();
                          }}
                          className="flex items-center gap-1.5 text-xs font-semibold text-brand-amber hover:underline"
                        >
                          <Camera size={13} />
                          Take Photo
                        </button>
                      </div>
                    </div>

                    {/* ── Photo Preview Thumbnails ── */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {uploadedFiles.map((f, i) => (
                          <motion.div
                            key={f.preview}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative group rounded-xl overflow-hidden border border-civic-border aspect-square bg-civic-bg"
                          >
                            {f.file.type.startsWith('video/') ? (
                              <video
                                src={f.preview}
                                className="w-full h-full object-cover"
                                muted
                              />
                            ) : (
                              <img
                                src={f.preview}
                                alt={f.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                            {/* Overlay with filename and remove button */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                              <button
                                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1.5 rounded-lg shadow-md hover:bg-white"
                              >
                                <Trash2 size={14} className="text-status-critical" />
                              </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 py-1">
                              <p className="text-[10px] text-white truncate font-medium">{f.name}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Category */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-lg font-bold text-civic-heading mb-1">What type of issue is this?</h2>
                <p className="text-sm text-civic-muted mb-5">Select the category that best describes the infrastructure problem.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                      className={`card p-4 text-left transition-all border-2 relative ${
                        formData.category === cat.id ? cat.color : 'border-civic-border hover:border-brand-blue'
                      }`}
                    >
                      <div className="text-2xl mb-2">{cat.icon}</div>
                      <p className="font-semibold text-civic-heading text-sm">{cat.label}</p>
                      <p className="text-xs text-civic-muted mt-0.5">{cat.description}</p>
                      {formData.category === cat.id && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle size={16} className="text-brand-blue" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Severity */}
                <div className="mt-6">
                  <label className="label">Severity Assessment</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Low', 'Medium', 'High', 'Critical'].map(s => (
                      <button
                        key={s}
                        onClick={() => setFormData(prev => ({ ...prev, severity: s }))}
                        className={`py-2 rounded-lg border text-xs font-semibold transition-all ${
                          formData.severity === s
                            ? s === 'Critical' ? 'bg-status-critical text-white border-status-critical'
                              : s === 'High' ? 'bg-status-high text-white border-status-high'
                              : s === 'Medium' ? 'bg-status-medium text-white border-status-medium'
                              : 'bg-status-low text-white border-status-low'
                            : 'border-civic-border text-civic-muted hover:border-gray-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Location */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-lg font-bold text-civic-heading mb-1">Where is the issue located?</h2>
                <p className="text-sm text-civic-muted mb-5">Pinpoint the location as accurately as possible.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="label">Address or Area Description</label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3 top-3 text-civic-muted" />
                      <input
                        type="text"
                        className="input pl-9"
                        placeholder="E.g., Nehru Road junction near Ward 12 market..."
                        value={formData.location}
                        onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* ── Map with Geolocation ── */}
                  <div>
                    <label className="label">Map Preview</label>
                    <div className="bg-navy-50 border border-civic-border rounded-xl h-52 flex items-center justify-center relative overflow-hidden">
                      {/* Grid background */}
                      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#1A56DB_1px,transparent_1px),linear-gradient(to_right,#1A56DB_1px,transparent_1px)] bg-[size:20px_20px]" />
                      
                      {geoCoords ? (
                        /* ── Location detected view ── */
                        <div className="text-center z-10">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-12 h-12 rounded-full bg-brand-blue/15 flex items-center justify-center mx-auto mb-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center">
                              <Navigation size={14} className="text-white" />
                            </div>
                          </motion.div>
                          <p className="text-sm font-semibold text-navy-800">📍 Location Pinned</p>
                          <p className="text-xs text-civic-muted mt-1 font-mono">
                            {geoCoords[0].toFixed(5)}, {geoCoords[1].toFixed(5)}
                          </p>
                          <button
                            onClick={detectLocation}
                            className="mt-2 text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1 mx-auto"
                          >
                            <Navigation size={11} />
                            Re-detect
                          </button>
                        </div>
                      ) : (
                        /* ── No location yet ── */
                        <div className="text-center z-10">
                          <MapPin size={28} className="text-brand-blue mx-auto mb-2" />
                          <p className="text-sm font-medium text-navy-700">Click to pin your location</p>
                          <p className="text-xs text-civic-muted mt-1">Or use the address field above</p>
                          <button
                            onClick={detectLocation}
                            disabled={geoLoading}
                            className="mt-3 btn-primary text-xs px-4 py-2 inline-flex items-center gap-2"
                          >
                            {geoLoading ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                Detecting...
                              </>
                            ) : (
                              <>
                                <Navigation size={14} />
                                Use My Location
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ward info */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="label">Ward / Zone</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Ward 12"
                        value={formData.ward}
                        onChange={e => setFormData(prev => ({ ...prev, ward: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="label">District</label>
                      <select
                        className="select"
                        value={formData.district}
                        onChange={e => setFormData(prev => ({ ...prev, district: e.target.value }))}
                      >
                        <option value="">Select district...</option>
                        <option>Central District</option>
                        <option>North District</option>
                        <option>South District</option>
                        <option>East District</option>
                        <option>West District</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Review */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-lg font-bold text-civic-heading mb-1">Review Your Report</h2>
                <p className="text-sm text-civic-muted mb-5">Please confirm the details before submission.</p>
                
                <div className="card divide-y divide-civic-border">
                  <div className="p-4 flex items-start gap-3">
                    <MessageSquare size={16} className="text-brand-blue shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-civic-muted uppercase mb-0.5">Description</p>
                      <p className="text-sm text-civic-body">{formData.description || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-start gap-3">
                    <AlertTriangle size={16} className="text-brand-amber shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-civic-muted uppercase mb-0.5">Category & Severity</p>
                      <p className="text-sm text-civic-body">
                        {formData.category || 'Not selected'} — <span className="font-semibold">{formData.severity}</span>
                      </p>
                    </div>
                  </div>
                  <div className="p-4 flex items-start gap-3">
                    <MapPin size={16} className="text-status-critical shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-civic-muted uppercase mb-0.5">Location</p>
                      <p className="text-sm text-civic-body">{formData.location || 'Not provided'}</p>
                      {geoCoords && (
                        <p className="text-xs text-civic-muted font-mono mt-0.5">
                          GPS: {geoCoords[0].toFixed(5)}, {geoCoords[1].toFixed(5)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-4 flex items-start gap-3">
                    <Globe size={16} className="text-brand-cyan shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-civic-muted uppercase mb-0.5">Language</p>
                      <p className="text-sm text-civic-body">{formData.language}</p>
                    </div>
                  </div>
                  {/* Evidence preview */}
                  {uploadedFiles.length > 0 && (
                    <div className="p-4 flex items-start gap-3">
                      <FileText size={16} className="text-civic-muted shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-civic-muted uppercase mb-2">Evidence ({uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''})</p>
                        <div className="flex flex-wrap gap-2">
                          {uploadedFiles.map((f, i) => (
                            <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-civic-border">
                              {f.file.type.startsWith('video/') ? (
                                <video src={f.preview} className="w-full h-full object-cover" muted />
                              ) : (
                                <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Consent */}
                <div className="mt-4 p-4 bg-navy-50 rounded-xl border border-navy-100">
                  <p className="text-xs text-navy-700 leading-relaxed">
                    By submitting this report, you confirm that the information provided is accurate to the best of your knowledge. 
                    Your data will be processed in accordance with the NaradX Privacy Policy and Municipal Data Governance Policy.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action bar */}
        <div className="mt-8 pt-6 border-t border-civic-border flex items-center justify-between">
          <button
            className="btn-secondary"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(prev => prev - 1);
              } else {
                handleSaveDraft();
              }
            }}
          >
            {currentStep === 1 ? 'Save Draft' : 'Back'}
          </button>
          {currentStep < 4 ? (
            <button
              className={`btn-primary ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => canProceed() && setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
              title={!canProceed() ? 'Please fill in the required fields to continue' : 'Continue to next step'}
            >
              Continue
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Report
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          )}
        </div>

        {/* Help line */}
        <p className="text-center text-xs text-civic-muted mt-4">
          Need immediate assistance? Call the Civic Helpline at{' '}
          <a href="tel:311" className="font-bold text-brand-blue">3-1-1</a>
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-civic-border py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
          <div>
            <p className="font-bold text-civic-heading mb-2 text-sm">NaradX</p>
            <p className="text-xs text-civic-muted">Bridging the gap between citizens and government through transparent, data-driven community engagement tools.</p>
          </div>
          {[
            { heading: 'Platform', links: ['Features', 'Impact Stories', 'Policy Dashboard', 'Civic Tools', 'API Access'] },
            { heading: 'Resources', links: ['Help Center', 'Terms of Service', 'Privacy Policy', 'Cookie Settings', 'Security'] },
            { heading: 'Connect', links: ['Municipal Hub, Tech District, City', 'contact@naradx.gov', '+1 (555) 123-4567'] },
          ].map(col => (
            <div key={col.heading}>
              <p className="font-semibold text-civic-heading mb-2 text-xs uppercase tracking-wide">{col.heading}</p>
              <ul className="space-y-1.5">{col.links.map(l => <li key={l} className="text-xs text-civic-muted">{l}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 border-t border-civic-border pt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-civic-muted">© 2026 NaradX Systems. All rights reserved.</p>
          <div className="flex gap-3 text-xs text-civic-muted">
            <span>Compliance</span><span>Accessibility</span><span>English (US)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
