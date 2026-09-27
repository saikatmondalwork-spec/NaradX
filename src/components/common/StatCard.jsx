import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', // 'up', 'down', 'neutral'
  subtitle,
  icon: Icon,
  iconColor = 'blue',
  loading = false,
  compact = false,
}) {
  const colorMap = {
    blue: 'bg-navy-50 text-navy-700',
    cyan: 'bg-cyan-50 text-cyan-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  const trendColor = {
    up: 'text-status-critical',
    down: 'text-status-low',
    neutral: 'text-civic-muted',
  };

  const TrendIcon = changeType === 'up' ? TrendingUp : changeType === 'down' ? TrendingDown : Minus;

  if (loading) {
    return (
      <div className={`stat-card ${compact ? 'p-4' : 'p-5'} animate-pulse`}>
        <div className="h-4 bg-civic-bg rounded w-1/2 mb-3" />
        <div className="h-8 bg-civic-bg rounded w-3/4 mb-2" />
        <div className="h-3 bg-civic-bg rounded w-1/3" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`stat-card ${compact ? 'p-4' : 'p-5'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-civic-muted uppercase tracking-wide truncate mb-1">
            {title}
          </p>
          <p className={`font-bold text-civic-heading ${compact ? 'text-xl' : 'text-2xl'}`}>
            {value}
          </p>
          {(change !== undefined || subtitle) && (
            <div className="flex items-center gap-1.5 mt-1.5">
              {change !== undefined && (
                <>
                  <TrendIcon size={12} className={trendColor[changeType]} />
                  <span className={`text-xs font-medium ${trendColor[changeType]}`}>
                    {change}
                  </span>
                </>
              )}
              {subtitle && (
                <span className="text-xs text-civic-muted">{subtitle}</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${colorMap[iconColor]} shrink-0`}>
            <Icon size={compact ? 16 : 18} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
