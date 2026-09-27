// StatusBadge component
export function StatusBadge({ status, size = 'sm' }) {
  const config = {
    'Critical': 'badge-critical',
    'High': 'badge-high',
    'Medium': 'badge-medium',
    'Low': 'badge-low',
    'Submitted': 'badge-blue',
    'AI Analysis': 'badge-info',
    'Geographic Analysis': 'badge-info',
    'Policy Intelligence': 'badge-low',
    'Under Analysis': 'badge-info',
    'Recommended': 'badge-low',
    'Under Review': 'badge-medium',
    'Approved': 'badge-low',
    'Rejected': 'badge-critical',
    'Immediate': 'badge-critical',
    'Stalled': 'badge-high',
    'Planned': 'badge-blue',
    'Active': 'badge-low',
  };

  const cls = config[status] || 'badge bg-gray-100 text-gray-600';
  return (
    <span className={`${cls} ${size === 'xs' ? 'text-xs px-2 py-0.5' : ''}`}>
      {status}
    </span>
  );
}

// PriorityBar component
export function PriorityBar({ score, showLabel = true, size = 'md' }) {
  const color = score >= 80 ? 'bg-status-critical'
    : score >= 60 ? 'bg-status-high'
    : score >= 40 ? 'bg-status-medium'
    : 'bg-status-low';

  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-2.5' };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-civic-border rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${heights[size]} ${color} rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      {showLabel && (
        <span className={`font-bold text-civic-heading ${size === 'sm' ? 'text-xs' : 'text-sm'} shrink-0 w-8 text-right`}>
          {score}
        </span>
      )}
    </div>
  );
}

// CategoryIcon component
export function CategoryDot({ category }) {
  const colors = {
    Roads: 'bg-brand-blue',
    Water: 'bg-brand-cyan',
    Drainage: 'bg-purple-500',
    Electricity: 'bg-brand-amber',
    Connectivity: 'bg-green-500',
    Other: 'bg-gray-400',
  };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[category] || 'bg-gray-400'}`} />;
}

// EmptyState
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-civic-bg flex items-center justify-center mb-4">
          <Icon size={24} className="text-civic-muted" />
        </div>
      )}
      <h3 className="text-base font-semibold text-civic-heading mb-1">{title}</h3>
      {description && <p className="text-sm text-civic-muted max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// LoadingState
export function LoadingState({ rows = 3 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-civic-bg rounded-xl" />
      ))}
    </div>
  );
}

// SectionHeader
export function SectionHeader({ label, title, description, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        {label && <p className="section-label mb-1">{label}</p>}
        <h2 className="text-xl font-bold text-civic-heading">{title}</h2>
        {description && <p className="text-sm text-civic-muted mt-0.5">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// AIDisclaimer
export function AIDisclaimer() {
  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <div className="w-5 h-5 rounded-full bg-brand-amber flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-white text-xs font-bold">i</span>
      </div>
      <p className="text-xs text-amber-800 leading-relaxed">
        <strong>AI-assisted analysis:</strong> AI-generated analysis is intended to support human decision-making. 
        Final policy and investment decisions remain with authorized decision-makers.
      </p>
    </div>
  );
}

// ConfidenceBadge
export function ConfidenceBadge({ confidence }) {
  const pct = Math.round(confidence * 100);
  const color = pct >= 85 ? 'text-status-low' : pct >= 70 ? 'text-status-medium' : 'text-status-high';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${pct >= 85 ? 'bg-status-low' : pct >= 70 ? 'bg-status-medium' : 'bg-status-high'}`} />
      {pct}% confidence
    </span>
  );
}
