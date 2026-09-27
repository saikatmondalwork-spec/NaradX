import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Bell, Search, ChevronDown, Globe, Menu, X, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/navigation/Sidebar';

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-civic-bg overflow-hidden">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - desktop */}
      <div className="hidden lg:flex flex-col h-full shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(prev => !prev)}
        />
      </div>

      {/* Sidebar - mobile */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed left-0 top-0 h-full w-60 z-50 lg:hidden"
          >
            <Sidebar collapsed={false} onToggle={() => setMobileSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-civic-border flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg text-civic-muted hover:bg-civic-bg transition-colors lg:hidden"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb / Filters */}
            <div className="hidden sm:flex items-center gap-2">
              <select className="text-sm border border-civic-border rounded-lg px-3 py-1.5 text-civic-body bg-white focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none">
                <option>India</option>
              </select>
              <select className="text-sm border border-civic-border rounded-lg px-3 py-1.5 text-civic-body bg-white focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none">
                <option>All Districts</option>
                <option>Central District</option>
                <option>North District</option>
                <option>South District</option>
                <option>East District</option>
                <option>West District</option>
              </select>
              <select className="text-sm border border-civic-border rounded-lg px-3 py-1.5 text-civic-body bg-white focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>Last 90 Days</option>
                <option>Last Year</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-civic-bg border border-civic-border rounded-lg px-3 py-1.5">
              <Search size={14} className="text-civic-muted" />
              <input
                type="text"
                placeholder="Search reports, areas..."
                className="bg-transparent text-sm text-civic-heading placeholder:text-civic-muted-light outline-none w-48"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-civic-muted hover:bg-civic-bg transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-critical rounded-full" />
            </button>

            {/* Profile */}
            <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-civic-bg transition-colors">
              <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center">
                <span className="text-white text-xs font-bold">PM</span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-civic-heading">Policy Officer</span>
              <ChevronDown size={14} className="text-civic-muted" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto scroll-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
