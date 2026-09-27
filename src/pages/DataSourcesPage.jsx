import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, Globe, Users, FileText, Map, TrendingUp, 
  CheckCircle, ExternalLink, Calendar, ChevronRight, ArrowRight
} from 'lucide-react';
import { SectionHeader } from '../components/common/UIElements';
import { dataSources } from '../data/mockData';

const categoryIcons = {
  'Citizen Feedback': FileText,
  'Infrastructure Data': TrendingUp,
  'Demographic Data': Users,
  'Public Investment Data': Database,
  'Geographic Data': Map,
};

const categoryColors = {
  'Citizen Feedback': 'bg-blue-50 text-brand-blue border-blue-100',
  'Infrastructure Data': 'bg-purple-50 text-purple-600 border-purple-100',
  'Demographic Data': 'bg-cyan-50 text-brand-cyan border-cyan-100',
  'Public Investment Data': 'bg-amber-50 text-brand-amber border-amber-100',
  'Geographic Data': 'bg-green-50 text-status-low border-green-100',
};

const processingFlow = [
  { step: 'Source Data', desc: 'Raw data ingested from government and civic APIs' },
  { step: 'Validation', desc: 'Schema verification and integrity checks' },
  { step: 'Normalization', desc: 'Standardized formats, deduplication, encoding fixes' },
  { step: 'Geospatial Processing', desc: 'Coordinate mapping, ward boundary assignment' },
  { step: 'AI Analysis', desc: 'Classification, clustering, priority scoring' },
  { step: 'NaradX Intelligence', desc: 'Policy-ready insights and recommendations' },
];

export default function DataSourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['', ...new Set(dataSources.map(d => d.category))];
  const filtered = selectedCategory ? dataSources.filter(d => d.category === selectedCategory) : dataSources;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-civic-heading mb-1">Data Sources & Transparency</h1>
        <p className="text-sm text-civic-muted">
          All datasets powering NaradX Intelligence — openly documented for accountability and reproducibility.
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat || 'all'}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-brand-blue text-white shadow-navy'
                : 'bg-white border border-civic-border text-civic-muted hover:border-brand-blue hover:text-brand-blue'
            }`}
          >
            {cat || 'All Sources'}
          </button>
        ))}
      </div>

      {/* Data source cards */}
      <div className="space-y-4">
        {filtered.map((ds, i) => {
          const Icon = categoryIcons[ds.category] || Database;
          const colorCls = categoryColors[ds.category] || 'bg-gray-50 text-gray-600 border-gray-100';

          return (
            <motion.div
              key={ds.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorCls}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
                      <div>
                        <h3 className="font-bold text-civic-heading">{ds.name}</h3>
                        <p className="text-xs text-civic-muted">{ds.source} · {ds.scope}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {ds.verified && (
                          <span className="badge-low flex items-center gap-1 text-xs">
                            <CheckCircle size={10} />
                            Verified
                          </span>
                        )}
                        <span className={`badge text-xs ${colorCls}`}>{ds.category}</span>
                      </div>
                    </div>
                    <p className="text-sm text-civic-body leading-relaxed mb-3">{ds.description}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Last Updated', value: ds.lastUpdated, icon: Calendar },
                        { label: 'Records', value: ds.recordCount?.toLocaleString(), icon: Database },
                        { label: 'Format', value: ds.format, icon: FileText },
                        { label: 'License', value: ds.license, icon: Globe },
                      ].map(m => {
                        const MIcon = m.icon;
                        return (
                          <div key={m.label} className="bg-civic-bg rounded-lg p-2.5">
                            <div className="flex items-center gap-1 mb-0.5">
                              <MIcon size={10} className="text-civic-muted" />
                              <p className="text-xs text-civic-muted">{m.label}</p>
                            </div>
                            <p className="text-xs font-semibold text-civic-heading truncate">{m.value}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Processing pipeline */}
      <div className="card p-5">
        <SectionHeader
          label="Methodology"
          title="Data Processing Pipeline"
          description="How raw data becomes NaradX Intelligence"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {processingFlow.map((step, i) => (
            <div key={step.step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-brand-blue flex items-center justify-center shrink-0 text-white text-xs font-bold">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-civic-heading text-sm">{step.step}</p>
                <p className="text-xs text-civic-muted mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-civic-border">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'AI Model', value: 'NaradX Classification Engine v2.1' },
              { label: 'Processing Method', value: 'Federated Learning + Edge Analysis' },
              { label: 'Verification Status', value: 'ISO 27001 Certified · W3C Compliant' },
            ].map(m => (
              <div key={m.label}>
                <p className="text-xs font-semibold uppercase tracking-wide text-civic-muted mb-0.5">{m.label}</p>
                <p className="text-sm font-semibold text-civic-heading">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transparency statement */}
      <div className="card p-5 bg-navy-50 border-navy-100">
        <div className="flex items-start gap-3">
          <Globe size={18} className="text-brand-blue shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-civic-heading mb-1">Transparency Commitment</h3>
            <p className="text-sm text-civic-body leading-relaxed">
              NaradX is committed to full transparency in data sourcing, processing, and AI decision-making. 
              All datasets used in generating recommendations are documented here. 
              Citizens and policymakers can request full dataset documentation through the Open Data API. 
              AI model weights and training methodology are available for independent audit.
            </p>
            <div className="flex gap-2 mt-3">
              <button className="btn-secondary text-xs px-3 py-2">
                Access Open Data API
                <ArrowRight size={12} />
              </button>
              <button className="btn-secondary text-xs px-3 py-2">
                Request Audit
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
