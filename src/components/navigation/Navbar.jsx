import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Search, Bell, Globe, ChevronDown, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = ['English', 'Hindi', 'Bengali', 'Telugu', 'Tamil'];

export default function Navbar({ variant = 'light', onMenuClick }) {
  const location = useLocation();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English (US)');

  const isDark = variant === 'dark';

  const navLinks = [
    { path: '/dashboard', label: 'Intelligence Dashboard' },
    { path: '/dashboard/hotspots', label: 'Hotspots' },
    { path: '/dashboard/recommendations', label: 'Recommendations' },
    { path: '/dashboard/data', label: 'Data Sources' },
  ];

  return (
    <nav className={`sticky top-0 z-50 border-b transition-colors ${isDark
      ? 'bg-navy-900 border-navy-700'
      : 'bg-white border-civic-border'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className={`p-2 rounded-lg transition-colors lg:hidden ${isDark
                  ? 'text-navy-200 hover:bg-navy-800'
                  : 'text-civic-muted hover:bg-civic-bg'
                }`}
              >
                <Menu size={20} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <img
                src="/naradx-logo.png.png"
                alt="NaradX"
                className="h-8 w-auto object-contain"
              />
              <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-navy-900'}`}>
                NaradX
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.path}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isDark
                  ? 'text-navy-200 hover:text-white hover:bg-navy-800'
                  : 'text-civic-muted hover:text-civic-heading hover:bg-civic-bg'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isDark
                  ? 'text-navy-200 hover:bg-navy-800'
                  : 'text-civic-muted hover:bg-civic-bg'
                }`}
              >
                <Globe size={15} />
                <span>English (US)</span>
                <ChevronDown size={13} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 bg-white border border-civic-border rounded-xl shadow-card-lg py-1 min-w-[140px] z-50"
                  >
                    {languages.map(lang => (
                      <button
                        key={lang}
                        onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-civic-body hover:bg-civic-bg transition-colors"
                      >
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sign In */}
            <button className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isDark
              ? 'text-navy-200 hover:bg-navy-800'
              : 'text-civic-muted hover:bg-civic-bg'
            }`}>
              <User size={15} />
              Sign In
            </button>

            {/* Primary CTA */}
            <Link
              to="/report"
              className="btn-primary text-sm px-4 py-2"
            >
              Report an Issue
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
