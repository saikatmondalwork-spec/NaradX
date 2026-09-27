import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Globe, Map, BarChart2, Shield, Users, 
  CheckCircle, Zap, MapPin, FileText, TrendingUp,
  ChevronRight, Star, Activity, Play, LayoutDashboard
} from 'lucide-react';
import { impactStats, featureHighlights } from '../data/mockData';

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } }
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const IconMap = { Globe, Map, BarChart2, Shield, Users, Zap, MapPin, FileText, TrendingUp, Activity, LayoutDashboard };

const howItWorks = [
  {
    number: '01',
    title: 'Citizen Request',
    desc: 'Community members report infrastructure needs via multilingual inputs and feedback in real-time.',
    icon: Users,
    color: 'bg-navy-50 text-navy-700',
  },
  {
    number: '02',
    title: 'AI Understanding',
    desc: 'Natural language processing classifies categories, habitats, and geographic features in real-time.',
    icon: Zap,
    color: 'bg-blue-50 text-brand-blue',
  },
  {
    number: '03',
    title: 'Demand Detection',
    desc: 'Geospatial analysis clusters data to identify hotspots of infrastructure demand.',
    icon: MapPin,
    color: 'bg-cyan-50 text-brand-cyan',
  },
  {
    number: '04',
    title: 'Smart Action',
    desc: 'Actionable intelligence is delivered to policy makers for evidence-based budgeting.',
    icon: TrendingUp,
    color: 'bg-amber-50 text-brand-amber',
  },
];

const capabilities = [
  { title: 'Citizen Intelligence', points: ['Multilingual feedback (20+ languages)', 'Mobile-first, low-bandwidth interface', 'Automated duplicate detection & clustering', 'Verifies evidence uploads (Photo/GPS)'] },
  { title: 'Infrastructure Intelligence', points: ['Geospatial demand hotspot visualization', 'Predictive maintenance recommendation engine', 'Resource allocation optimization models', 'Cross-departmental collaborative tasking'] },
  { title: 'Policy Intelligence', points: ['Automated executive summary generation', 'ROI projection for infrastructure investments', 'Transparency & public accountability dashboards', 'Open Data API for secondary innovation'] },
];

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        {/* Subtle background grid with pointer-events-none */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#1A56DB_1px,transparent_1px),linear-gradient(to_right,#1A56DB_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-20 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="max-w-xl relative z-20"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-navy-50 border border-navy-100 text-navy-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-status-low animate-pulse" />
                NEW: REAL-TIME CITIZEN FEEDBACK ANALYTICS
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-navy-900 leading-tight mb-4">
                Turn Citizen Feedback Into{' '}
                <span className="text-gradient">Infrastructure Intelligence</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-civic-muted leading-relaxed mb-8">
                NaradX bridges the gap between community needs and government planning. 
                Leverage AI-driven insights to build smarter, more responsive cities.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 relative z-30">
                <Link 
                  to="/report" 
                  className="btn-primary px-6 py-3 text-base inline-flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all active:scale-95"
                  id="hero-report-btn"
                >
                  <span>Report an Issue</span>
                  <ArrowRight size={16} />
                </Link>
                <Link 
                  to="/dashboard" 
                  className="btn-secondary px-6 py-3 text-base inline-flex items-center gap-2 cursor-pointer border-navy-200 hover:border-brand-blue hover:text-brand-blue shadow-sm hover:shadow-md transition-all active:scale-95"
                  id="hero-dashboard-btn"
                >
                  <LayoutDashboard size={18} className="text-brand-blue shrink-0" />
                  <span>Explore Intelligence Dashboard</span>
                </Link>
              </motion.div>

              {/* Quick features */}
              <motion.div variants={fadeUp} className="mt-10 grid grid-cols-2 gap-3">
                {[
                  { icon: Globe, label: 'Multilingual Support' },
                  { icon: Zap, label: 'AI-Powered Analysis' },
                  { icon: Map, label: 'Geospatial Intelligence' },
                  { icon: Shield, label: 'Evidence-Based Recommendations' },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-2">
                    <f.icon size={15} className="text-brand-blue shrink-0" />
                    <span className="text-xs font-medium text-civic-muted">{f.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-20"
            >
              {/* Dashboard preview card - Clickable to open Dashboard */}
              <Link
                to="/dashboard"
                className="group block relative rounded-2xl bg-navy-900 p-5 shadow-navy-lg overflow-hidden border border-navy-700/60 hover:border-brand-blue/60 transition-all duration-300 hover:shadow-2xl cursor-pointer"
                title="Click to explore the Intelligence Dashboard"
                id="hero-dashboard-preview-card"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 opacity-80 pointer-events-none" />
                <div className="relative">
                  {/* Fake toolbar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      <div className="w-28 bg-navy-700 rounded ml-2 h-4 opacity-60" />
                    </div>
                    <span className="text-[11px] font-medium text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded-full group-hover:bg-brand-cyan/20 transition-colors flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                      Live Dashboard →
                    </span>
                  </div>
                  {/* Fake dashboard content */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: 'Reports', value: '12,847' },
                      { label: 'Hotspots', value: '89' },
                      { label: 'Areas', value: '18' },
                      { label: 'Impacted', value: '4.2M' },
                    ].map(s => (
                      <div key={s.label} className="bg-navy-800/80 rounded-lg p-2.5 text-center group-hover:bg-navy-800 transition-colors">
                        <p className="text-white font-bold text-sm">{s.value}</p>
                        <p className="text-navy-400 text-xs mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-navy-800/70 group-hover:bg-navy-800/90 rounded-xl aspect-video flex items-center justify-center border border-navy-700/50 group-hover:border-brand-blue/50 transition-all">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-brand-blue/20 group-hover:bg-brand-blue/30 flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110">
                        <Map size={24} className="text-brand-blue" />
                      </div>
                      <p className="text-navy-200 text-xs font-semibold">Geospatial Intelligence Map</p>
                      <p className="text-navy-400 text-[10px] mt-1 group-hover:text-brand-cyan transition-colors">
                        Click to explore interactive dashboard
                      </p>
                    </div>
                  </div>
                  {/* Hotspot indicators */}
                  <div className="mt-3 flex gap-2">
                    {[
                      { label: 'Critical Hotspots', value: '12', color: 'bg-red-500' },
                      { label: 'High Priority', value: '31', color: 'bg-orange-500' },
                      { label: 'Under Review', value: '46', color: 'bg-yellow-500' },
                    ].map(h => (
                      <div key={h.label} className="flex-1 bg-navy-800/60 rounded-lg p-2">
                        <div className={`w-2 h-2 rounded-full ${h.color} mb-1`} />
                        <p className="text-white font-bold text-xs">{h.value}</p>
                        <p className="text-navy-400 text-xs">{h.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>

              {/* Floating card */}
              <Link to="/dashboard/hotspots" className="block" title="View Live Hotspots">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-5 -left-5 bg-white rounded-xl border border-civic-border shadow-card-lg p-3 w-48 hover:border-brand-blue hover:shadow-xl transition-all cursor-pointer z-30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-status-critical-bg flex items-center justify-center">
                      <Activity size={12} className="text-status-critical" />
                    </div>
                    <span className="text-xs font-bold text-civic-heading">Live Hotspot</span>
                  </div>
                  <p className="text-xs text-civic-muted">Ward 12 — 84/100 priority</p>
                  <div className="mt-1.5 h-1.5 bg-civic-border rounded-full overflow-hidden">
                    <div className="h-full bg-status-critical rounded-full" style={{ width: '84%' }} />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-civic-bg border-t border-civic-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-civic-heading mb-3">How It Works</h2>
            <p className="text-civic-muted max-w-xl mx-auto">
              A seamless pipeline from the moment a citizen speaks to the moment infrastructure is optimised.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 relative"
              >
                <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon size={20} />
                </div>
                <span className="text-3xl font-black text-civic-border absolute top-5 right-5">{step.number}</span>
                <h3 className="font-bold text-civic-heading mb-2">{step.title}</h3>
                <p className="text-sm text-civic-muted leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-white border-t border-civic-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="section-label mb-2">Real-World Impact</p>
              <h2 className="text-3xl font-bold text-civic-heading mb-4">
                Real-World Community Impact
              </h2>
              <p className="text-civic-muted mb-6 leading-relaxed">
                We measure success by the lives touched and the responsiveness of public administration. 
                Join the movement toward transparent, data-driven governance.
              </p>
              <div className="flex gap-6">
                <div>
                  <p className="text-2xl font-black text-brand-blue">94%</p>
                  <p className="text-xs text-civic-muted">Citizen Satisfaction</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-status-low">-40%</p>
                  <p className="text-xs text-civic-muted">Response Time</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {impactStats.map((stat, i) => {
                const Icon = IconMap[stat.icon] || Users;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="card p-5 text-center"
                  >
                    <Icon size={22} className="text-brand-blue mx-auto mb-2" />
                    <p className="text-2xl font-black text-civic-heading">{stat.value}</p>
                    <p className="text-xs text-civic-muted">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 bg-civic-bg border-t border-civic-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-civic-heading mb-3">Comprehensive Intelligence Suite</h2>
            <p className="text-civic-muted">Specialised tools designed for every stakeholder in the civic ecosystem.</p>
          </motion.div>

          <div className="space-y-8">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 lg:p-8"
              >
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                    <span className="section-label mb-2 block">Intelligence Layer</span>
                    <h3 className="text-xl font-bold text-civic-heading mb-3">{cap.title}</h3>
                    <ul className="space-y-2">
                      {cap.points.map(p => (
                        <li key={p} className="flex items-start gap-2 text-sm text-civic-muted">
                          <CheckCircle size={14} className="text-status-low shrink-0 mt-0.5" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`bg-navy-50 rounded-xl h-40 flex items-center justify-center ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="text-center text-navy-400">
                      <Map size={32} className="mx-auto mb-2 text-brand-blue" />
                      <p className="text-xs font-medium text-navy-600 uppercase tracking-wide">{cap.title.toUpperCase()} INTERFACE</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Make Public Infrastructure More Responsive
            </h2>
            <p className="text-navy-300 mb-8 text-lg">
              Join thousands of administrators and millions of citizens building the future of civic technology today.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/report" className="btn-primary px-8 py-3 text-base">
                Start a Report
                <ArrowRight size={16} />
              </Link>
              <Link to="/dashboard" className="btn-outline px-8 py-3 text-base border-navy-400 text-white hover:bg-white hover:text-navy-900">
                Schedule a Platform Demo
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-navy-400">
              <span className="flex items-center gap-1.5"><Shield size={12} /> GDPR & ISO Compliant</span>
              <span>Open Source Core</span>
              <span>24/7 Priority Support</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-civic-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/naradx-logo.png.png" alt="NaradX" className="h-7 w-auto" />
                <span className="font-bold text-navy-900">NaradX</span>
              </div>
              <p className="text-sm text-civic-muted leading-relaxed">
                Bridging the gap between citizens and government through transparent, data-driven community engagement tools for a smarter, more connected society.
              </p>
            </div>
            {[
              { heading: 'Platform', links: ['Features', 'Impact Stories', 'Policy Dashboard', 'Civic Tools', 'API Access'] },
              { heading: 'Resources', links: ['Help Center', 'Terms of Service', 'Privacy Policy', 'Cookie Settings', 'Security'] },
              { heading: 'Connect', links: ['Municipal Hub, Tech District, City', 'contact@naradx.gov', '+1 (555) 123-4567'] },
            ].map(col => (
              <div key={col.heading}>
                <h4 className="font-semibold text-civic-heading mb-3 text-sm">{col.heading}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}>
                      <span className="text-sm text-civic-muted hover:text-civic-heading cursor-pointer transition-colors">
                        {l}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-civic-border pt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-civic-muted">© 2026 NaradX Systems. All rights reserved.</p>
            <div className="flex gap-4">
              {['Compliance', 'Accessibility', 'English (US)'].map(l => (
                <span key={l} className="text-xs text-civic-muted hover:text-civic-heading cursor-pointer">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
