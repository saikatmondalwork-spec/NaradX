import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target, Filter, Search, ChevronRight, ArrowRight, Brain,
  Users, FileText, Zap, Map, AlertTriangle, DollarSign, Clock,
  CheckCircle, Eye, GitCompare
} from 'lucide-react';
import { StatusBadge, PriorityBar, SectionHeader, AIDisclaimer, CategoryDot } from '../components/common/UIElements';
import { categories } from '../data/mockData';
import { getRecommendations } from '../services/api';

export default function RecommendationsPage() {
  const [filterCategory, setFilterCategory] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    getRecommendations().then(res => {
      if (res.success) setRecommendations(res.data || []);
    });
  }, []);

  const filtered = recommendations.filter(r => {
    if (filterCategory && r.category !== filterCategory) return false;
    if (filterUrgency && r.urgency !== filterUrgency) return false;
    if (search && !r.area.toLowerCase().includes(search.toLowerCase()) && !r.intervention.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selected = recommendations.find(r => r.id === selectedId) || null;

  const urgencyColors = {
    Immediate: 'bg-status-critical-bg text-status-critical border-red-200',
    High: 'bg-status-high-bg text-status-high border-orange-200',
    Medium: 'bg-status-medium-bg text-status-medium border-yellow-200',
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-civic-heading">Infrastructure Recommendations</h1>
          <p className="text-sm text-civic-muted">{filtered.length} evidence-grounded intervention candidates</p>
        </div>
        <button className="btn-secondary text-xs px-3 py-2">
          Export All
        </button>
      </div>

      {/* Filters */}
      <div className="card p-3 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-civic-bg border border-civic-border rounded-lg px-3 py-2 flex-1 min-w-[180px]">
          <Search size={14} className="text-civic-muted" />
          <input
            type="text"
            placeholder="Search recommendations..."
            className="bg-transparent text-sm placeholder:text-civic-muted-light outline-none w-full"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="text-sm border border-civic-border rounded-lg px-3 py-2 bg-white outline-none"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          className="text-sm border border-civic-border rounded-lg px-3 py-2 bg-white outline-none"
          value={filterUrgency}
          onChange={e => setFilterUrgency(e.target.value)}
        >
          <option value="">All Urgency</option>
          <option>Immediate</option>
          <option>High</option>
          <option>Medium</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Cards */}
        <div className="lg:col-span-3 space-y-4">
          {filtered.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelectedId(rec.id === selectedId ? null : rec.id)}
              className={`card p-5 cursor-pointer transition-all ${
                rec.id === selectedId ? 'border-brand-blue shadow-navy' : 'hover:border-navy-200'
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryDot category={rec.category} />
                    <span className="text-xs text-civic-muted font-medium">{rec.category} · {rec.district}</span>
                    <span className="text-xs text-civic-muted">{rec.id}</span>
                  </div>
                  <h3 className="font-bold text-civic-heading mb-0.5">{rec.intervention}</h3>
                  <p className="text-sm text-civic-muted">{rec.area}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <StatusBadge status={rec.status} size="xs" />
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${urgencyColors[rec.urgency] || ''}`}>
                    {rec.urgency}
                  </span>
                </div>
              </div>

              {/* Priority score */}
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-civic-muted uppercase tracking-wide">Priority Score</span>
                </div>
                <PriorityBar score={rec.priorityScore} />
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                  { label: 'Reports', value: rec.citizenDemand },
                  { label: 'Gap', value: `${rec.infrastructureGap}%` },
                  { label: 'Population', value: `${(rec.populationBenefit/1000).toFixed(0)}K` },
                  { label: 'Evidence', value: rec.evidenceCount },
                ].map(s => (
                  <div key={s.label} className="text-center bg-civic-bg rounded-lg p-1.5">
                    <p className="text-xs font-bold text-civic-heading">{s.value}</p>
                    <p className="text-xs text-civic-muted">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Cost */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-civic-muted">
                  <DollarSign size={12} />
                  <span>Est. ₹{(rec.estimatedCost / 1000000).toFixed(1)}M · {rec.timeline}</span>
                </div>
                <div className="flex gap-2">
                  <button className="btn-ghost text-xs px-2 py-1" onClick={e => { e.stopPropagation(); }}>
                    <Eye size={12} />
                    Evidence
                  </button>
                  <Link
                    to={`/dashboard/areas/${rec.hotspotId}`}
                    className="btn-primary text-xs px-2 py-1"
                    onClick={e => e.stopPropagation()}
                  >
                    View Details
                    <ChevronRight size={11} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="card p-5 sticky top-4 space-y-4">
              <div>
                <p className="section-label mb-1">{selected.id}</p>
                <h2 className="font-bold text-civic-heading text-base mb-0.5">{selected.intervention}</h2>
                <p className="text-xs text-civic-muted">{selected.area}</p>
              </div>

              {/* Reasoning */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-civic-muted mb-1.5">NaradX Reasoning</p>
                <p className="text-sm text-civic-body leading-relaxed bg-navy-50 rounded-xl p-3">
                  {selected.reasoning}
                </p>
              </div>

              {/* Evidence */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-civic-muted mb-2">Supporting Evidence</p>
                <div className="space-y-1.5">
                  {selected.supportingEvidence.map(ev => (
                    <div key={ev} className="flex items-center gap-2 text-xs">
                      <CheckCircle size={11} className="text-status-low shrink-0" />
                      <span className="text-civic-body capitalize">{ev.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-civic-bg rounded-xl p-3">
                  <p className="text-xs text-civic-muted mb-0.5">Existing Investment</p>
                  <p className="font-bold text-civic-heading text-sm">₹{(selected.existingInvestment/1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-status-critical-bg rounded-xl p-3">
                  <p className="text-xs text-status-critical mb-0.5">Funding Gap</p>
                  <p className="font-bold text-status-critical text-sm">₹{(selected.investmentGap/1000000).toFixed(1)}M</p>
                </div>
              </div>

              <Link to={`/dashboard/areas/${selected.hotspotId}`} className="btn-primary w-full justify-center">
                Full Area Analysis
                <ArrowRight size={15} />
              </Link>

              <AIDisclaimer />
            </div>
          ) : (
            <div className="card p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-civic-bg flex items-center justify-center mx-auto mb-3">
                <Target size={22} className="text-civic-muted" />
              </div>
              <p className="font-semibold text-civic-heading text-sm mb-1">Select a Recommendation</p>
              <p className="text-xs text-civic-muted">Click any recommendation to see detailed reasoning, evidence, and investment analysis.</p>
            </div>
          )}
        </div>
      </div>

      <AIDisclaimer />
    </div>
  );
}
