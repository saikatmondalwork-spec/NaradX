import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, MapPin, Map, Target, Brain, 
  Database, Settings, ChevronLeft, ChevronRight, BarChart2,
  Zap, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
  LayoutDashboard, FileText, MapPin, Map, Target, Brain, 
  Database, Settings, BarChart2, Zap, TrendingUp,
};

const sidebarItems = [
  { path: '/dashboard', label: 'Overview', icon: 'LayoutDashboard', end: true },
  { path: '/dashboard/reports', label: 'Citizen Reports', icon: 'FileText' },
  { path: '/dashboard/hotspots', label: 'Hotspots', icon: 'MapPin' },
  { path: '/dashboard/areas/HS-001', label: 'Area Intelligence', icon: 'Map' },
  { path: '/dashboard/recommendations', label: 'Recommendations', icon: 'Target' },
  { path: '/dashboard/ai', label: 'AI Insights', icon: 'Brain' },
  { path: '/dashboard/data', label: 'Data Sources', icon: 'Database' },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="bg-navy-900 flex flex-col h-full relative overflow-hidden shrink-0"
    >
      {/* Logo area */}
      <div className={`flex items-center h-14 border-b border-navy-700 shrink-0 ${collapsed ? 'justify-center px-3' : 'px-4 gap-3'}`}>
        <img
          src="/naradx-logo.png.png"
          alt="NaradX"
          className="h-7 w-7 object-contain shrink-0"
        />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="text-white font-bold text-base tracking-tight whitespace-nowrap"
            >
              NaradX
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <div className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto scroll-thin">
        {!collapsed && (
          <div className="px-3 pb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-navy-500">
              Intelligence
            </span>
          </div>
        )}

        {sidebarItems.map(item => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-brand-blue text-white shadow-navy'
                    : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className="shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        className="whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!collapsed && isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80"
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Collapse toggle */}
      <div className="border-t border-navy-700 p-2">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg text-navy-400 hover:bg-navy-800 hover:text-white transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : (
            <div className="flex items-center gap-2 text-xs font-medium">
              <ChevronLeft size={16} />
              <span>Collapse</span>
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
