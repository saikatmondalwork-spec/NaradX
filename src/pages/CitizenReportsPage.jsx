import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Eye, ChevronDown, ChevronRight, Download,
  FileText, Globe, MapPin, AlertTriangle, Calendar, CheckCircle,
  X, Copy, ExternalLink
} from 'lucide-react';
import { StatusBadge, SectionHeader, CategoryDot, EmptyState } from '../components/common/UIElements';
import { categories, priorities, statuses, languages } from '../data/mockData';
import { useAppStore } from '../store/appStore';
import { useToast } from '../components/common/Toast';
import { getCitizenReports } from '../services/api';

export default function CitizenReportsPage() {
  const citizenReports = useAppStore(s => s.citizenReports);
  const setCitizenReports = useAppStore(s => s.setCitizenReports);
  
  useEffect(() => {
    getCitizenReports().then(res => {
      if (res.success) {
        setCitizenReports(res.data || []);
      }
    });
  }, [setCitizenReports]);
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const filtered = citizenReports.filter(r => {
    if (filterCategory && r.category !== filterCategory) return false;
    if (filterSeverity && r.severity !== filterSeverity) return false;
    if (filterStatus && r.status !== filterStatus) return false;
    if (filterLanguage && r.language !== filterLanguage) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.issue.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.location.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-civic-heading">Citizen Reports Explorer</h1>
          <p className="text-sm text-civic-muted">{filtered.length} of {citizenReports.length} reports</p>
        </div>
        <button
          className="btn-secondary text-xs px-3 py-2"
          onClick={() => {
            const headers = ['ID', 'Issue', 'Category', 'Location', 'Severity', 'Status', 'Date', 'Language'];
            const rows = filtered.map(r => [r.id, `"${r.issue}"`, r.category, `"${r.location}"`, r.severity, r.status, r.date, r.language]);
            const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `naradx_reports_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            URL.revokeObjectURL(link.href);
            toast.success(`Exported ${filtered.length} reports as CSV`);
          }}
        >
          <Download size={14} />
          Export
        </button>
      </div>

      {/* Filters bar */}
      <div className="card p-3 flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 bg-civic-bg border border-civic-border rounded-lg px-3 py-2 min-w-[220px] flex-1">
          <Search size={14} className="text-civic-muted shrink-0" />
          <input
            type="text"
            placeholder="Search by ID, issue, location..."
            className="bg-transparent text-sm placeholder:text-civic-muted-light outline-none w-full"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {[
          { label: 'Category', value: filterCategory, setter: setFilterCategory, options: ['', ...categories] },
          { label: 'Severity', value: filterSeverity, setter: setFilterSeverity, options: ['', ...priorities] },
          { label: 'Status', value: filterStatus, setter: setFilterStatus, options: ['', ...statuses] },
          { label: 'Language', value: filterLanguage, setter: setFilterLanguage, options: ['', ...languages] },
        ].map(f => (
          <select
            key={f.label}
            className="text-sm border border-civic-border rounded-lg px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-brand-blue"
            value={f.value}
            onChange={e => f.setter(e.target.value)}
          >
            <option value="">{f.label}</option>
            {f.options.filter(Boolean).map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
        {(search || filterCategory || filterSeverity || filterStatus || filterLanguage) && (
          <button
            onClick={() => { setSearch(''); setFilterCategory(''); setFilterSeverity(''); setFilterStatus(''); setFilterLanguage(''); }}
            className="btn-ghost text-xs px-2 py-2"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Table */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-civic-border bg-civic-bg">
                    {['ID', 'Issue', 'Category', 'Location', 'Severity', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-civic-muted whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-civic-border">
                  {filtered.map(report => (
                    <tr
                      key={report.id}
                      onClick={() => setSelectedReport(report.id === selectedReport?.id ? null : report)}
                      className={`cursor-pointer transition-colors hover:bg-civic-bg ${
                        selectedReport?.id === report.id ? 'bg-navy-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-bold text-brand-blue whitespace-nowrap">
                        {report.id}
                      </td>
                      <td className="px-4 py-3 max-w-[180px]">
                        <p className="text-xs text-civic-body truncate">{report.issue}</p>
                        <p className="text-xs text-civic-muted">{report.date}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <CategoryDot category={report.category} />
                          <span className="text-xs text-civic-body">{report.category}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-[140px]">
                        <p className="text-xs text-civic-muted truncate">{report.location}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={report.severity} size="xs" />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={report.status} size="xs" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm text-civic-muted">No reports match your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-5 sticky top-4 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs font-bold text-brand-blue mb-1">{selectedReport.id}</p>
                  <div className="flex gap-1.5">
                    <StatusBadge status={selectedReport.severity} size="xs" />
                    <StatusBadge status={selectedReport.status} size="xs" />
                  </div>
                </div>
                <button onClick={() => setSelectedReport(null)} className="btn-ghost p-1.5">
                  <X size={14} />
                </button>
              </div>

              {/* Original */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-civic-muted mb-1">Original Report</p>
                <p className="text-sm text-civic-body leading-relaxed bg-civic-bg rounded-xl p-3">
                  {selectedReport.description}
                </p>
              </div>

              {/* Translation */}
              {selectedReport.translatedText && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-civic-muted mb-1">
                    AI Translation ({selectedReport.language} → English)
                  </p>
                  <p className="text-sm text-civic-body leading-relaxed bg-blue-50 rounded-xl p-3">
                    {selectedReport.translatedText}
                  </p>
                </div>
              )}

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Category', value: selectedReport.category },
                  { label: 'Language', value: selectedReport.language },
                  { label: 'Date', value: selectedReport.date },
                  { label: 'Location Confidence', value: `${Math.round(selectedReport.locationConfidence * 100)}%` },
                ].map(m => (
                  <div key={m.label} className="bg-civic-bg rounded-lg p-2.5">
                    <p className="text-civic-muted mb-0.5">{m.label}</p>
                    <p className="font-semibold text-civic-heading">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* AI Classification */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-civic-muted mb-1">AI Classification</p>
                <span className="badge-blue">{selectedReport.aiClassification}</span>
              </div>

              {/* Duplicate match */}
              <div className="flex items-center gap-2">
                {selectedReport.duplicateMatch ? (
                  <span className="badge-medium flex items-center gap-1">
                    <Copy size={9} />
                    Duplicate cluster ({selectedReport.similarReports?.length} matches)
                  </span>
                ) : (
                  <span className="badge-low flex items-center gap-1">
                    <CheckCircle size={9} />
                    Unique Report
                  </span>
                )}
              </div>

              {/* Location */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-civic-muted mb-1">Location</p>
                <p className="text-sm text-civic-body flex items-center gap-1.5">
                  <MapPin size={13} className="text-brand-blue" />
                  {selectedReport.location}
                </p>
              </div>

              {/* Attachments */}
              {selectedReport.attachments?.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-civic-muted mb-1">Attachments</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedReport.attachments.map(a => (
                      <span key={a} className="badge-blue flex items-center gap-1 text-xs">
                        <FileText size={9} />
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="card p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-civic-bg flex items-center justify-center mx-auto mb-3">
                <FileText size={22} className="text-civic-muted" />
              </div>
              <p className="font-semibold text-civic-heading text-sm mb-1">Select a Report</p>
              <p className="text-xs text-civic-muted">Click any row to view full report details including AI classification and translation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
