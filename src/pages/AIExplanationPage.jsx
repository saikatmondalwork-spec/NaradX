import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Brain, FileText, Database, Users, MapPin, 
  AlertTriangle, Zap, TrendingUp, Activity, Shield, ChevronRight
} from 'lucide-react';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer 
} from 'recharts';
import { AIDisclaimer, ConfidenceBadge, StatusBadge } from '../components/common/UIElements';
import { hotspots } from '../data/mockData';

const factors = [
  {
    id: 'citizen_demand',
    label: 'Citizen Demand',
    value: 89,
    weight: 0.30,
    icon: Users,
    color: '#1A56DB',
    explanation: '127 citizen reports filed in the last 90 days. Report density 3.4× higher than city average. Consistent month-on-month increase of 18% indicates growing infrastructure deterioration.',
  },
  {
    id: 'infra_gap',
    label: 'Infrastructure Gap',
    value: 78,
    weight: 0.25,
    icon: Activity,
    color: '#8B5CF6',
    explanation: 'Road network quality index of 22/100 against city standard of 65/100. Primary drainage connectivity at 36% coverage. 3 water distribution nodes offline.',
  },
  {
    id: 'population_impact',
    label: 'Population Impact',
    value: 87,
    weight: 0.20,
    icon: Users,
    color: '#06B6D4',
    explanation: '45,000 residents directly impacted. 31% below poverty line index indicates high vulnerability. Proximity to 2 primary schools and 1 health center amplifies urgency.',
  },
  {
    id: 'severity',
    label: 'Severity',
    value: 91,
    weight: 0.15,
    icon: AlertTriangle,
    color: '#DC2626',
    explanation: '8 accident incidents correlated with road conditions in 30 days. Structural road failure risk rated High by infrastructure survey. Drainage blockage creating secondary health hazard.',
  },
  {
    id: 'urgency',
    label: 'Urgency',
    value: 87,
    weight: 0.05,
    icon: Zap,
    color: '#F59E0B',
    explanation: 'Monsoon season 4 weeks away — unresolved drainage blockages project 340% complaint spike. Phase 1 project stalled at 35% completion for 8 months.',
  },
  {
    id: 'investment_gap',
    label: 'Investment Gap',
    value: 62,
    weight: 0.05,
    icon: TrendingUp,
    color: '#EA580C',
    explanation: 'Existing allocation of ₹4.5M covers only 37% of ₹12M estimated requirement. No supplementary budget identified. Investment gap of ₹7.5M unaddressed.',
  },
];



const evidence = [
  { source: 'Citizen Reports Database', count: 127, icon: FileText, color: 'bg-blue-50 text-brand-blue' },
  { source: 'Infrastructure Survey 2024', count: 1, icon: Database, color: 'bg-purple-50 text-purple-600' },
  { source: 'Demographic Dataset', count: 1, icon: Users, color: 'bg-cyan-50 text-brand-cyan' },
  { source: 'Public Investment Records', count: 2, icon: TrendingUp, color: 'bg-amber-50 text-brand-amber' },
];

export default function AIExplanationPage() {
  const { id } = useParams();
  const hotspot = hotspots.find(h => h.id === id) || hotspots[0];

  const radarData = factors.map(f => ({ factor: f.label, value: f.value }));

  const priorityScore = 84;
  const scoreColor = priorityScore >= 80 ? '#DC2626' : priorityScore >= 60 ? '#EA580C' : '#CA8A04';

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to={`/dashboard/areas/${id || 'HS-001'}`} className="btn-ghost px-2 py-2">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Brain size={16} className="text-brand-blue" />
            <span className="section-label">NaradX AI Explanation</span>
          </div>
          <h1 className="text-xl font-bold text-civic-heading">Why Was This Area Flagged?</h1>
          <p className="text-sm text-civic-muted">{hotspot?.name}</p>
        </div>
      </div>

      {/* Priority score card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-6 text-center"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-civic-muted mb-3">Priority Assessment</p>
        <div className="relative inline-block mb-4">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#F3F4F6" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke={scoreColor}
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 52 * (priorityScore / 100)} ${2 * Math.PI * 52}`}
              strokeDashoffset={2 * Math.PI * 52 * 0.25}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="58" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="900" fill={scoreColor}>
              {priorityScore}
            </text>
            <text x="60" y="80" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#6B7280">
              / 100
            </text>
          </svg>
        </div>
        <StatusBadge status="Critical" />
        <div className="flex items-center justify-center gap-2 mt-2">
          <ConfidenceBadge confidence={0.91} />
          <span className="text-xs text-civic-muted">· Analysis by NaradX AI v2.1</span>
        </div>
      </motion.div>

      {/* Factor breakdown */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Radar */}
        <div className="card p-4">
          <h2 className="font-bold text-civic-heading mb-3">Factor Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10, fill: '#6B7280' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="value" stroke="#1A56DB" fill="#1A56DB" fillOpacity={0.18} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Factor list */}
        <div className="card p-4">
          <h2 className="font-bold text-civic-heading mb-3">Scoring Factors</h2>
          <div className="space-y-3">
            {factors.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon size={13} style={{ color: f.color }} />
                      <span className="text-sm font-medium text-civic-body">{f.label}</span>
                      <span className="text-xs text-civic-muted">({Math.round(f.weight * 100)}%)</span>
                    </div>
                    <span className="text-sm font-bold text-civic-heading">{f.value}</span>
                  </div>
                  <div className="h-2 bg-civic-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${f.value}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: f.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed explanations */}
      <div className="space-y-3">
        <h2 className="font-bold text-civic-heading">Factor Explanations</h2>
        {factors.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${f.color}15` }}
                >
                  <Icon size={16} style={{ color: f.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-civic-heading text-sm">{f.label}</h3>
                    <span className="text-sm font-black" style={{ color: f.color }}>{f.value}/100</span>
                  </div>
                  <p className="text-sm text-civic-muted leading-relaxed">{f.explanation}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Summary */}
      <div className="card p-5 bg-gradient-to-br from-navy-50 to-blue-50 border-navy-100">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center shrink-0">
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-civic-heading mb-2">AI Summary</h3>
            <p className="text-sm text-civic-body leading-relaxed">
              Ward 12 - Nehru Road Cluster has been assigned a priority score of <strong>84/100 (Critical)</strong> based on 
              a weighted analysis of six evidence-grounded factors. The dominant drivers are Severity (91/100) reflecting 
              documented accident incidents, Citizen Demand (89/100) from 127 sustained reports, and Population Impact (87/100) 
              affecting 45,000 residents with elevated vulnerability indicators. The stalled Phase 1 resurfacing project 
              (35% complete, 8 months delayed) and approaching monsoon season create a compound urgency condition. 
              The ₹7.5M investment gap represents the primary structural barrier to resolution. 
              NaradX recommends emergency allocation as the highest-priority intervention in the current budget cycle.
            </p>
          </div>
        </div>
      </div>

      {/* Evidence */}
      <div className="card p-4">
        <h2 className="font-bold text-civic-heading mb-3">Supporting Evidence</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {evidence.map(ev => {
            const Icon = ev.icon;
            return (
              <div key={ev.source} className={`flex items-center gap-3 p-3 rounded-xl ${ev.color.split(' ')[0]} border border-transparent`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ev.color}`}>
                  <Icon size={15} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-civic-heading">{ev.source}</p>
                  <p className="text-xs text-civic-muted">{ev.count} dataset(s) referenced</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AIDisclaimer />
    </div>
  );
}
