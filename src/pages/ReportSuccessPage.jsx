import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Zap, MapPin, FileText, Globe, Home,
  ArrowRight, RefreshCw, ChevronRight, Shield, Clock,
  AlertCircle
} from 'lucide-react';

const processingSteps = [
  { id: 1, label: 'Submitted', sublabel: 'Report Received', icon: CheckCircle, done: true },
  { id: 2, label: 'AI Analysis', sublabel: 'Automated Triaging', icon: Zap, done: true, active: true },
  { id: 3, label: 'Geographic Analysis', sublabel: 'Hotspot Mapping', icon: MapPin, done: false },
  { id: 4, label: 'Policy Intelligence', sublabel: 'Budget Planning', icon: FileText, done: false },
];

export default function ReportSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const report = location.state?.report || {
    id: 'REQ-00123',
    category: 'Electricity & Power',
    location: 'Sector 12, Municipal Zone 4',
    language: 'English (United States)',
    submittedAt: new Date().toISOString(),
    status: 'Under Analysis',
  };

  const submittedAt = new Date(report.submittedAt || Date.now());
  const formattedDate = submittedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = submittedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

  return (
    <div className="min-h-screen bg-civic-bg">
      {/* Sub-nav */}
      <div className="bg-white border-b border-civic-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-11 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-civic-muted">
            <span className="hover:text-brand-blue cursor-pointer">Portal</span>
            <ChevronRight size={12} />
            <span className="hover:text-brand-blue cursor-pointer">Citizen Reporting</span>
            <ChevronRight size={12} />
            <span className="font-semibold text-civic-heading">Confirmation</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-civic-muted">
            <span className="flex items-center gap-1"><Globe size={12} /> English (US)</span>
            <span className="w-px h-3 bg-civic-border" />
            <span className="flex items-center gap-1 cursor-pointer hover:text-brand-blue"><AlertCircle size={12} /> Get Help</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Success header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Evidence image placeholder */}
          <div className="w-36 h-24 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-blue mx-auto mb-6 flex items-center justify-center overflow-hidden">
            <div className="text-center text-white/80">
              <MapPin size={24} className="mx-auto mb-1" />
              <p className="text-xs font-medium">Location Mapped</p>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold text-civic-heading mb-2">Your Report Has Been Submitted</h1>
            <p className="text-sm text-civic-muted max-w-md mx-auto">
              Thank you for contributing to your community. Your feedback has been encrypted and successfully routed to the municipal analytical engine.
            </p>
          </motion.div>

          {/* Request ID */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-3 mt-4 bg-white border border-civic-border rounded-xl px-5 py-3"
          >
            <span className="text-xs font-semibold text-civic-muted uppercase tracking-wide">Request ID:</span>
            <span className="text-lg font-black text-brand-blue">{report.id || 'REQ-00123'}</span>
            <span className="badge-low flex items-center gap-1">
              <Shield size={10} />
              Verified Secure
            </span>
          </motion.div>
        </motion.div>

        {/* Processing Lifecycle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 mb-6"
        >
          <p className="section-label mb-5 text-center">Processing Lifecycle</p>
          <div className="flex items-start">
            {processingSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-start flex-1">
                  <div className="flex flex-col items-center w-full">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 transition-all ${
                      step.active
                        ? 'border-brand-blue bg-brand-blue text-white shadow-navy animate-pulse'
                        : step.done
                        ? 'border-brand-blue bg-brand-blue text-white'
                        : 'border-civic-border bg-white text-civic-muted'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <p className={`text-xs font-bold uppercase tracking-wide text-center ${
                      step.active ? 'text-brand-blue' : step.done ? 'text-civic-heading' : 'text-civic-muted'
                    }`}>{step.label}</p>
                    <p className="text-xs text-civic-muted text-center mt-0.5">{step.sublabel}</p>
                  </div>
                  {i < processingSteps.length - 1 && (
                    <div className={`flex-shrink-0 w-full max-w-[60px] h-0.5 mt-5 mx-1 ${
                      step.done ? 'bg-brand-blue' : 'bg-civic-border'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Two-column: Summary + Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid sm:grid-cols-5 gap-5"
        >
          {/* Submission Summary */}
          <div className="sm:col-span-3 card p-5">
            <h2 className="font-bold text-civic-heading mb-4 flex items-center gap-2">
              <FileText size={16} className="text-brand-blue" />
              Submission Summary
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold text-civic-muted uppercase tracking-wide mb-1">
                  <Zap size={10} className="inline mr-1" />
                  Issue Category
                </p>
                <p className="text-sm font-semibold text-civic-heading">
                  {report.category || 'Electricity & Power'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-civic-muted uppercase tracking-wide mb-1">
                  <MapPin size={10} className="inline mr-1" />
                  Location
                </p>
                <p className="text-sm font-semibold text-civic-heading">
                  {report.location || 'Sector 12, Municipal Zone 4'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-civic-muted uppercase tracking-wide mb-1">
                  <Clock size={10} className="inline mr-1" />
                  Submission Time
                </p>
                <p className="text-sm font-semibold text-civic-heading">
                  {formattedDate} • {formattedTime}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-civic-muted uppercase tracking-wide mb-1">
                  <Globe size={10} className="inline mr-1" />
                  Language
                </p>
                <p className="text-sm font-semibold text-civic-heading">
                  {report.language || 'English (United States)'}
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-navy-100 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center shrink-0">
                <Zap size={14} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-civic-heading">Current Status: Under Analysis</p>
                  <span className="badge bg-blue-100 text-brand-blue text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                    ANALYZING
                  </span>
                </div>
                <p className="text-xs text-civic-muted mt-0.5">
                  AI models are currently validating the severity and clustering with existing reports.
                </p>
              </div>
            </div>
          </div>

          {/* Action Center */}
          <div className="sm:col-span-2 space-y-3">
            <h2 className="font-bold text-civic-heading text-sm">Action Center</h2>
            <Link
              to="/dashboard"
              className="btn-primary w-full justify-center py-3"
            >
              Track Report Progress
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/report"
              className="btn-secondary w-full justify-center"
            >
              <RefreshCw size={14} />
              Submit Another Report
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 w-full py-2 text-sm text-civic-muted hover:text-civic-heading transition-colors"
            >
              <Home size={14} />
              Return to Home Dashboard
            </Link>

            {/* Impact Notification */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="section-label text-amber-700 mb-1">Impact Notification</p>
              <p className="text-xs text-amber-800">
                Your report has been flagged for inclusion in the upcoming Infrastructure Planning Council review for Zone 4.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Transparency footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-10 pb-6"
        >
          <p className="text-xs text-civic-muted italic max-w-2xl mx-auto mb-5">
            This system is part of the NaradX Transparency Initiative. All data is processed in accordance with the Municipal Data Governance Policy.
          </p>
          <div className="flex items-center justify-center gap-8">
            {[
              { icon: Shield, label: 'ISO 27001 Certified' },
              { icon: CheckCircle, label: 'Verifiable Ledger' },
              { icon: Globe, label: 'W3C Accessible' },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <item.icon size={20} className="text-civic-muted" />
                <p className="text-xs text-civic-muted font-medium uppercase tracking-wide">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-civic-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
          <div>
            <p className="font-bold text-civic-heading mb-2 text-sm">NaradX</p>
            <p className="text-xs text-civic-muted leading-relaxed">Bridging the gap between citizens and government through transparent, data-driven community engagement tools.</p>
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
          <div className="flex gap-3 text-xs text-civic-muted"><span>Compliance</span><span>Accessibility</span><span>English (US)</span></div>
        </div>
      </footer>
    </div>
  );
}
