import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, MapPin, Users, AlertTriangle, TrendingUp, 
  ArrowRight, BarChart2, Brain, ChevronRight, Filter,
  Activity, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import StatCard from '../components/common/StatCard';
import MapView from '../components/map/MapView';
import { SectionHeader, StatusBadge, PriorityBar, AIDisclaimer } from '../components/common/UIElements';
import { getDashboardStats, getHotspots, getChartData } from '../services/api';
import { useAppStore } from '../store/appStore';

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotspotsData, setHotspotsData] = useState([]);
  const [chartDataState, setChartDataState] = useState({ reportsByCategory: [], demandTrend: [], investmentVsDemand: [], infrastructureGap: [] });
  const liveStats = useAppStore(s => s.dashboardStats);
  const setDashboardStats = useAppStore(s => s.setDashboardStats);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [statsRes, hotspotsRes, chartRes] = await Promise.all([
          getDashboardStats(),
          getHotspots(),
          getChartData(),
        ]);
        if (statsRes.success && statsRes.data) {
          // Update Zustand store so KPI cards reflect real numbers
          if (setDashboardStats) setDashboardStats(statsRes.data);
        }
        if (hotspotsRes.success) setHotspotsData(hotspotsRes.data || []);
        if (chartRes.success) setChartDataState(chartRes.data || {});
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stats = [
    {
      title: 'Total Reports',
      value: liveStats.totalReports.toLocaleString(),
      change: '+18.4% vs last month',
      changeType: 'up',
      icon: FileText,
      iconColor: 'blue',
    },
    {
      title: 'High-Priority Reports',
      value: liveStats.highPriorityReports.toLocaleString(),
      change: '+12.1% vs last month',
      changeType: 'up',
      icon: AlertTriangle,
      iconColor: 'red',
    },
    {
      title: 'Demand Hotspots',
      value: String(liveStats.demandHotspots),
      change: '+6 new this month',
      changeType: 'up',
      icon: MapPin,
      iconColor: 'amber',
    },
    {
      title: 'Population Impacted',
      value: `${(liveStats.populationImpacted / 1000000).toFixed(1)}M`,
      change: `across ${liveStats.totalAreas} areas`,
      changeType: 'neutral',
      icon: Users,
      iconColor: 'cyan',
    },
  ];

  const topHotspots = hotspotsData.slice(0, 5);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-full">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-civic-heading">Intelligence Overview</h1>
          <p className="text-sm text-civic-muted mt-0.5">Real-time infrastructure demand analytics</p>
        </div>
        <div className="flex gap-2">
          <Link to="/report" className="btn-secondary text-xs px-3 py-2">
            <FileText size={14} />
            New Report
          </Link>
          <Link to="/dashboard/recommendations" className="btn-primary text-xs px-3 py-2">
            View Recommendations
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map(s => (
          <motion.div key={s.title} variants={fadeUp}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </motion.div>

      {/* Map + Priority Hotspots */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-civic-heading">Demand Hotspot Map</h2>
              <div className="flex gap-1">
                <button className="btn-ghost text-xs px-2 py-1">
                  <Filter size={12} />
                  Filter
                </button>
                <Link to="/dashboard/hotspots" className="btn-ghost text-xs px-2 py-1">
                  Full Map
                  <ChevronRight size={12} />
                </Link>
              </div>
            </div>
            <MapView
              hotspots={hotspotsData}
              selectedId={selectedHotspot?.id}
              onHotspotClick={setSelectedHotspot}
              height="380px"
              fitBounds={true}
            />
          </div>
        </div>

        {/* Priority Hotspots list */}
        <div className="card p-4">
          <SectionHeader
            label="Priority"
            title="Top Hotspots"
            action={
              <Link to="/dashboard/hotspots" className="text-xs text-brand-blue font-semibold hover:underline">
                View All
              </Link>
            }
          />
          <div className="space-y-3">
            {topHotspots.map(h => (
              <Link
                key={h.id}
                to={`/dashboard/areas/${h.id}`}
                className="block p-3 rounded-xl hover:bg-civic-bg border border-transparent hover:border-civic-border transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <p className="text-sm font-semibold text-civic-heading line-clamp-1">{h.name}</p>
                    <p className="text-xs text-civic-muted">{h.district} · {h.reportCount} reports</p>
                  </div>
                  <StatusBadge status={h.severity} size="xs" />
                </div>
                <PriorityBar score={h.priorityScore} size="sm" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Demand Trend */}
        <div className="lg:col-span-2 card p-4">
          <SectionHeader title="Demand Trend" description="Reports submitted vs resolved over time" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartDataState.demandTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="reportsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A56DB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1A56DB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="reports" name="Reports" stroke="#1A56DB" strokeWidth={2} fill="url(#reportsGrad)" />
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#16A34A" strokeWidth={2} fill="url(#resolvedGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="card p-4">
          <SectionHeader title="Reports by Category" />
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={chartDataState.reportsByCategory}
                cx="50%"
                cy="50%"
                outerRadius={60}
                innerRadius={30}
                dataKey="value"
                paddingAngle={2}
              >
                {(chartDataState.reportsByCategory || []).map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [v.toLocaleString(), 'Reports']} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {(chartDataState.reportsByCategory || []).slice(0, 4).map(cat => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-civic-body">{cat.name}</span>
                </div>
                <span className="text-xs font-semibold text-civic-heading">{cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investment vs Demand + Infrastructure Gap */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-4">
          <SectionHeader title="Investment vs. Demand" description="Gap analysis by area" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartDataState.investmentVsDemand} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="area" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
              <Bar dataKey="demand" name="Demand Score" fill="#1A56DB" radius={[3, 3, 0, 0]} />
              <Bar dataKey="investment" name="Investment %" fill="#06B6D4" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Infrastructure Gap */}
        <div className="card p-4">
          <SectionHeader title="Infrastructure Gap Index" description="Current coverage vs requirement" />
          <div className="space-y-3 mt-2">
            {(chartDataState.infrastructureGap || []).map(item => (
              <div key={item.category}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-civic-body">{item.category}</span>
                  <span className="text-xs text-civic-muted">{item.current}% covered</span>
                </div>
                <div className="h-2 bg-civic-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.current}%`,
                      backgroundColor: item.current < 30 ? '#DC2626' : item.current < 50 ? '#EA580C' : '#1A56DB',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NaradX Intelligence panel */}
      <div className="card p-5 bg-gradient-to-br from-navy-900 to-navy-800 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center shrink-0">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white mb-1">NaradX Intelligence Summary</p>
              <p className="text-sm text-navy-300 mb-3">
                Analysis of 12,847 reports across 18 monitored areas reveals 3 critical hotspots requiring immediate intervention. 
                Road infrastructure accounts for 33% of all complaints, with the Nehru Road cluster (Ward 12) showing an 84/100 priority score. 
                Budget gap of ₹63.2M identified against required infrastructure investment.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="badge bg-navy-700 text-navy-200">3 Critical Areas</span>
                <span className="badge bg-navy-700 text-navy-200">₹63.2M Budget Gap</span>
                <span className="badge bg-navy-700 text-navy-200">89 Active Hotspots</span>
              </div>
            </div>
          </div>
          <Link to="/dashboard/ai" className="btn-outline border-navy-500 text-navy-200 hover:bg-white hover:text-navy-900 whitespace-nowrap text-xs">
            Deep Analysis
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      <AIDisclaimer />
    </div>
  );
}
