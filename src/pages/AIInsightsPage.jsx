import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Search, Send, MapPin, BarChart2, FileText, Database,
  ChevronRight, AlertCircle, Sparkles, Activity, Zap, Users,
  TrendingUp, X, Clock
} from 'lucide-react';
import { AIDisclaimer, ConfidenceBadge, SectionHeader } from '../components/common/UIElements';
import { getAIInsights } from '../services/api';

const suggestedQueries = [
  'What are the major infrastructure issues in Ward 12?',
  'Which areas have high drainage demand?',
  'Are there existing projects addressing road issues?',
  'What infrastructure gaps are visible in North District?',
  'Which hotspot has the highest population impact?',
  'Compare investment vs demand across all areas',
];

export default function AIInsightsPage() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleQuery = async (q = query) => {
    if (!q.trim()) return;
    setLoading(true);
    setQuery(q);
    try {
      const result = await getAIInsights(q);
      setHistory(prev => [{ ...result.data, query: q }, ...prev]);
      setQuery('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const latest = history[0];

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center shrink-0">
          <Brain size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-civic-heading">NaradX Intelligence</h1>
          <p className="text-sm text-civic-muted">Analytical intelligence assistant — powered by citizen and infrastructure data</p>
        </div>
      </div>

      {/* Query input */}
      <div className="card p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-3.5 text-civic-muted" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuery()}
              placeholder="Ask about an area, infrastructure issue, trend or project..."
              className="input pl-9 pr-4 py-3"
            />
          </div>
          <button
            onClick={() => handleQuery()}
            disabled={!query.trim() || loading}
            className="btn-primary px-4 py-3"
          >
            {loading ? (
              <Activity size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>

        {/* Suggested queries */}
        <div className="mt-3">
          <p className="text-xs font-semibold text-civic-muted mb-2 uppercase tracking-wide">Suggested Queries</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map(q => (
              <button
                key={q}
                onClick={() => handleQuery(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-civic-border text-civic-body hover:border-brand-blue hover:text-brand-blue hover:bg-navy-50 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Latest response */}
      {latest && (
        <AnimatePresence mode="wait">
          <motion.div
            key={latest.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Query bubble */}
            <div className="flex justify-end">
              <div className="bg-brand-blue text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-lg text-sm font-medium">
                {latest.query}
              </div>
            </div>

            {/* Response card */}
            <div className="card p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-brand-blue flex items-center justify-center">
                    <Brain size={13} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-civic-heading">NaradX Intelligence</span>
                  <ConfidenceBadge confidence={latest.confidence} />
                </div>
                <span className="text-xs text-civic-muted flex items-center gap-1">
                  <Clock size={11} />
                  {new Date(latest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Answer */}
              <div className="bg-civic-bg rounded-xl p-4">
                <p className="text-sm text-civic-body leading-relaxed">{latest.answer}</p>
              </div>

              {/* Key Findings */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-brand-amber" />
                  <p className="text-xs font-bold uppercase tracking-wide text-civic-muted">Key Findings</p>
                </div>
                <ul className="space-y-2">
                  {latest.keyFindings.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-civic-body">
                      <ChevronRight size={13} className="text-brand-blue shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Statistics */}
              {latest.statistics && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-civic-muted mb-2">Relevant Statistics</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Reports', value: latest.statistics.reportCount?.toLocaleString(), icon: FileText },
                      { label: 'Population', value: `${(latest.statistics.populationImpacted / 1000).toFixed(0)}K`, icon: Users },
                      { label: 'Priority', value: `${latest.statistics.priorityScore}/100`, icon: Zap },
                      { label: 'Infra Gap', value: `${latest.statistics.infrastructureGap || '-'}%`, icon: BarChart2 },
                    ].map(s => {
                      const Icon = s.icon;
                      return (
                        <div key={s.label} className="bg-civic-bg rounded-xl p-3 text-center">
                          <Icon size={16} className="text-brand-blue mx-auto mb-1" />
                          <p className="font-bold text-civic-heading text-sm">{s.value}</p>
                          <p className="text-xs text-civic-muted">{s.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Data sources */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-civic-muted mb-2">Supporting Evidence</p>
                <div className="flex flex-wrap gap-1.5">
                  {latest.dataSources?.map(src => (
                    <span key={src} className="badge-blue text-xs flex items-center gap-1">
                      <Database size={9} />
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Query history */}
      {history.length > 1 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-civic-muted mb-2">Previous Queries</p>
          <div className="space-y-2">
            {history.slice(1).map((item, i) => (
              <button
                key={`${item.id}-${i}`}
                onClick={() => setHistory(prev => [item, ...prev.filter((_, j) => j !== i + 1)])}
                className="w-full text-left card p-3 hover:border-brand-blue transition-all flex items-center justify-between gap-3"
              >
                <p className="text-sm text-civic-body truncate">{item.query}</p>
                <ChevronRight size={14} className="text-civic-muted shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      <AIDisclaimer />
    </div>
  );
}
