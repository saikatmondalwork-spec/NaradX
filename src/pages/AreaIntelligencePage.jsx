import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Download, GitCompare, MapPin, Users, AlertTriangle, 
  TrendingUp, BarChart2, FileText, Brain, Database, Layers, 
  ChevronRight, CheckCircle, Clock, DollarSign
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, XAxis, YAxis, 
  CartesianGrid, Tooltip 
} from 'recharts';
import MapView from '../components/map/MapView';
import StatCard from '../components/common/StatCard';
import { 
  SectionHeader, StatusBadge, PriorityBar, AIDisclaimer, 
  ConfidenceBadge, CategoryDot 
} from '../components/common/UIElements';
import { hotspots, areaDetails } from '../data/mockData';

export default function AreaIntelligencePage() {
  const { id } = useParams();
  const hotspot = hotspots.find(h => h.id === id) || hotspots[0];
  const details = areaDetails[id] || areaDetails['HS-001'];

  const radarData = [
    { factor: 'Citizen Demand', value: details.citizenDemandScore || 89 },
    { factor: 'Infra Gap', value: details.infrastructureGap || 78 },
    { factor: 'Population', value: Math.round((details.populationImpacted / details.totalPopulation) * 100) || 87 },
    { factor: 'Severity', value: details.severityScore || 91 },
    { factor: 'Urgency', value: details.urgencyScore || 87 },
    { factor: 'Invest. Gap', value: details.investmentGap || 62 },
  ];

  const monthlyData = (details.monthlyReports || [14,18,22,19,24,28,31,27,35,38,41,44]).map((v, i) => ({
    month: ['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'][i],
    reports: v,
  }));

  const singleHotspot = [hotspot];

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <Link to="/dashboard/hotspots" className="btn-ghost px-2 py-2 mt-0.5">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <CategoryDot category={hotspot.primaryCategory} />
              <span className="text-xs text-civic-muted">{hotspot.district} · {hotspot.state || 'Delhi'}, India</span>
            </div>
            <h1 className="text-xl font-bold text-civic-heading">{hotspot.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={hotspot.severity} />
              <span className="text-xs text-civic-muted">Priority Score:</span>
              <span className="text-sm font-black text-status-critical">{hotspot.priorityScore}/100</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-xs px-3 py-2">
            <GitCompare size={14} />
            Compare Area
          </button>
          <button className="btn-secondary text-xs px-3 py-2">
            <Download size={14} />
            Export
          </button>
          <Link to={`/dashboard/areas/${id}/explain`} className="btn-primary text-xs px-3 py-2">
            <Brain size={14} />
            AI Explanation
          </Link>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Priority Assessment"
          value={`${hotspot.priorityScore}/100`}
          changeType="up"
          change="Critical threshold"
          icon={AlertTriangle}
          iconColor="red"
        />
        <StatCard
          title="Citizen Reports"
          value={hotspot.reportCount.toLocaleString()}
          change="+22 this week"
          changeType="up"
          icon={FileText}
          iconColor="blue"
        />
        <StatCard
          title="Population Impact"
          value={`${(hotspot.populationImpacted/1000).toFixed(0)}K`}
          subtitle="residents directly affected"
          icon={Users}
          iconColor="cyan"
        />
        <StatCard
          title="Infrastructure Gap"
          value={`${hotspot.infrastructureGap}%`}
          subtitle="gap index"
          icon={BarChart2}
          iconColor="amber"
        />
      </div>

      {/* Map + Radar */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card p-4">
          <SectionHeader title="Geographic Analysis" description={hotspot.name} />
          <MapView
            hotspots={singleHotspot}
            selectedId={hotspot.id}
            height="320px"
            center={hotspot.coordinates}
            zoom={14}
          />
        </div>
        <div className="card p-4">
          <SectionHeader title="Priority Breakdown" />
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#9CA3AF' }} />
              <Radar name="Score" dataKey="value" stroke="#1A56DB" fill="#1A56DB" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="space-y-1.5">
            {radarData.map(d => (
              <div key={d.factor} className="flex items-center gap-2">
                <span className="text-xs text-civic-muted w-24 shrink-0">{d.factor}</span>
                <div className="flex-1 h-1.5 bg-civic-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-blue"
                    style={{ width: `${d.value}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-civic-heading w-8 text-right">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend + Demographics */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Monthly trend */}
        <div className="card p-4">
          <SectionHeader title="Citizen Demand Trend" description="Monthly report volume" />
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
              <Line type="monotone" dataKey="reports" stroke="#1A56DB" strokeWidth={2.5} dot={{ r: 3, fill: '#1A56DB' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Demographics */}
        <div className="card p-4">
          <SectionHeader title="Demographic Indicators" description="Aggregated ward-level data" />
          <div className="space-y-3">
            {[
              { label: 'Population below poverty line', value: `${Math.round(details.demographics?.belowPovertyLine * 100)}%`, color: '#DC2626' },
              { label: 'Literacy rate', value: `${Math.round(details.demographics?.literacyRate * 100)}%`, color: '#1A56DB' },
              { label: 'Female population', value: `${Math.round(details.demographics?.femalePopulation * 100)}%`, color: '#8B5CF6' },
              { label: 'Children (0-14)', value: `${Math.round(details.demographics?.childPopulation * 100)}%`, color: '#F59E0B' },
              { label: 'Senior citizens (60+)', value: `${Math.round(details.demographics?.seniorPopulation * 100)}%`, color: '#06B6D4' },
            ].map(d => (
              <div key={d.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-civic-body">{d.label}</span>
                  <span className="text-xs font-bold text-civic-heading">{d.value}</span>
                </div>
                <div className="h-1.5 bg-civic-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: d.value, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Existing Projects */}
      <div className="card p-4">
        <SectionHeader
          title="Public Investment"
          description={`₹${((details.totalInvestment || 0) / 1000000).toFixed(1)}M allocated of ₹${((details.requiredInvestment || 18000000) / 1000000).toFixed(0)}M required`}
          action={
            <span className="text-xs text-status-critical font-bold">
              {Math.round(((details.requiredInvestment || 18000000) - (details.totalInvestment || 0)) / 1000000)}M deficit
            </span>
          }
        />
        {(details.existingProjects || []).length > 0 ? (
          <div className="space-y-3">
            {details.existingProjects.map(proj => (
              <div key={proj.name} className="flex items-start justify-between gap-4 p-3 bg-civic-bg rounded-xl">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-civic-heading mb-0.5">{proj.name}</p>
                  <p className="text-xs text-civic-muted">Budget: ₹{(proj.budget / 1000000).toFixed(1)}M</p>
                  <div className="mt-2 h-1.5 bg-civic-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-blue"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-civic-muted mt-0.5">{proj.progress}% complete</p>
                </div>
                <StatusBadge status={proj.status} size="xs" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-civic-muted">No existing investment projects found for this area.</p>
        )}
      </div>

      {/* NaradX Intelligence */}
      <div className="card p-5 bg-gradient-to-br from-navy-50 to-blue-50 border-navy-100">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center shrink-0">
            <Brain size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-civic-heading">NaradX Intelligence</h3>
              <ConfidenceBadge confidence={0.91} />
            </div>
            <p className="text-sm text-civic-body leading-relaxed mb-3">
              {hotspot.name} exhibits a compound infrastructure crisis pattern. The {hotspot.priorityScore}/100 priority score 
              reflects {hotspot.reportCount} citizen reports, an {hotspot.infrastructureGap}% infrastructure gap, and 
              {(hotspot.populationImpacted/1000).toFixed(0)}K residents directly impacted. 
              Investment deficit of ₹{((details.requiredInvestment - details.totalInvestment) / 1000000).toFixed(1)}M represents 
              the primary barrier to resolution. Immediate intervention in {hotspot.primaryCategory.toLowerCase()} infrastructure 
              is recommended based on highest report density and severity clustering.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Link to="/dashboard/recommendations" className="btn-primary text-xs px-3 py-1.5">
                View Recommendations
                <ArrowLeft size={12} className="rotate-180" />
              </Link>
              <Link to={`/dashboard/areas/${id}/explain`} className="btn-secondary text-xs px-3 py-1.5">
                Full AI Explanation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="card p-4">
        <SectionHeader title="Data Sources" />
        <div className="flex flex-wrap gap-2">
          {['Citizen Reports Database', 'Infrastructure Survey 2024', 'Census Demographics', 'Budget Records'].map(src => (
            <span key={src} className="badge-blue">
              <Database size={10} />
              {src}
            </span>
          ))}
        </div>
      </div>

      <AIDisclaimer />
    </div>
  );
}
