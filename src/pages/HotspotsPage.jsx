import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Filter, Search, ArrowRight, ChevronRight,
  Users, AlertTriangle, Activity, TrendingUp, Map
} from 'lucide-react';
import MapView from '../components/map/MapView';
import { StatusBadge, PriorityBar, SectionHeader, CategoryDot } from '../components/common/UIElements';
import { hotspots, categories } from '../data/mockData';

export default function HotspotsPage() {
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [search, setSearch] = useState('');

  const filtered = hotspots.filter(h => {
    if (filterSeverity && h.severity !== filterSeverity) return false;
    if (filterCategory && h.primaryCategory !== filterCategory) return false;
    if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.district.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-civic-heading">Demand Hotspots</h1>
          <p className="text-sm text-civic-muted">{filtered.length} active hotspots detected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-3 mb-5 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-civic-bg border border-civic-border rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <Search size={14} className="text-civic-muted" />
          <input
            type="text"
            placeholder="Search hotspots..."
            className="bg-transparent text-sm text-civic-heading placeholder:text-civic-muted-light outline-none w-full"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="text-sm border border-civic-border rounded-lg px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-brand-blue"
          value={filterSeverity}
          onChange={e => setFilterSeverity(e.target.value)}
        >
          <option value="">All Severities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
        </select>
        <select
          className="text-sm border border-civic-border rounded-lg px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-brand-blue"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Map */}
        <div className="lg:col-span-3">
          <div className="card p-4">
            <h2 className="font-bold text-civic-heading mb-3 flex items-center gap-2">
              <Map size={16} className="text-brand-blue" />
              Geographic Distribution
            </h2>
            <MapView
              hotspots={filtered}
              selectedId={selectedHotspot?.id}
              onHotspotClick={setSelectedHotspot}
              height="450px"
              fitBounds={true}
            />
          </div>
        </div>

        {/* Hotspot list */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedHotspot(h)}
              className={`card p-4 cursor-pointer transition-all ${
                selectedHotspot?.id === h.id ? 'border-brand-blue shadow-navy' : 'hover:border-navy-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <CategoryDot category={h.primaryCategory} />
                    <span className="text-xs text-civic-muted">{h.primaryCategory}</span>
                  </div>
                  <h3 className="font-semibold text-civic-heading text-sm">{h.name}</h3>
                  <p className="text-xs text-civic-muted">{h.district}</p>
                </div>
                <StatusBadge status={h.severity} size="xs" />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <div className="bg-civic-bg rounded-lg p-1.5">
                  <p className="text-xs font-bold text-civic-heading">{h.reportCount}</p>
                  <p className="text-xs text-civic-muted">Reports</p>
                </div>
                <div className="bg-civic-bg rounded-lg p-1.5">
                  <p className="text-xs font-bold text-civic-heading">{(h.populationImpacted/1000).toFixed(0)}K</p>
                  <p className="text-xs text-civic-muted">Population</p>
                </div>
                <div className="bg-civic-bg rounded-lg p-1.5">
                  <p className="text-xs font-bold text-civic-heading">{h.infrastructureGap}%</p>
                  <p className="text-xs text-civic-muted">Gap</p>
                </div>
              </div>
              <PriorityBar score={h.priorityScore} size="sm" />
              <Link
                to={`/dashboard/areas/${h.id}`}
                className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline"
              >
                View Area Intelligence
                <ArrowRight size={11} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
