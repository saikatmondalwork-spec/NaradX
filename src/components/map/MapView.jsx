import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

// Fix default marker icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Color mapping for severity
const severityColors = {
  Critical: { fill: '#DC2626', stroke: '#991B1B', pulse: 'rgba(220,38,38,0.3)' },
  High: { fill: '#EA580C', stroke: '#9A3412', pulse: 'rgba(234,88,12,0.25)' },
  Medium: { fill: '#CA8A04', stroke: '#92400E', pulse: 'rgba(202,138,4,0.2)' },
  Low: { fill: '#16A34A', stroke: '#14532D', pulse: 'rgba(22,163,74,0.2)' },
};

const categoryColors = {
  Roads: '#1A56DB',
  Water: '#06B6D4',
  Drainage: '#8B5CF6',
  Electricity: '#F59E0B',
  Connectivity: '#10B981',
  Other: '#6B7280',
};

function MapBoundsController({ hotspots }) {
  const map = useMap();
  useEffect(() => {
    if (hotspots && hotspots.length > 0) {
      const bounds = hotspots.map(h => h.coordinates);
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [hotspots, map]);
  return null;
}

export default function MapView({
  hotspots = [],
  reports = [],
  selectedId = null,
  onHotspotClick,
  height = '500px',
  showReports = false,
  center = [28.6139, 77.2090],
  zoom = 12,
  fitBounds = false,
}) {
  const navigate = useNavigate();

  const handleHotspotClick = (hotspot) => {
    if (onHotspotClick) {
      onHotspotClick(hotspot);
    } else {
      navigate(`/dashboard/areas/${hotspot.id}`);
    }
  };

  return (
    <div style={{ height }} className="relative rounded-xl overflow-hidden border border-civic-border">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        className="z-10"
      >
        {/* Tile Layer - OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {fitBounds && hotspots.length > 0 && (
          <MapBoundsController hotspots={hotspots} />
        )}

        {/* Hotspot circles */}
        {hotspots.map(hotspot => {
          const colors = severityColors[hotspot.severity] || severityColors.Medium;
          const isSelected = hotspot.id === selectedId;
          const radius = Math.max(20, (hotspot.radius || 1) * 18);

          return (
            <CircleMarker
              key={hotspot.id}
              center={hotspot.coordinates}
              radius={isSelected ? radius + 8 : radius}
              pathOptions={{
                color: colors.stroke,
                weight: isSelected ? 3 : 2,
                opacity: 0.9,
                fillColor: colors.fill,
                fillOpacity: isSelected ? 0.55 : 0.38,
              }}
              eventHandlers={{
                click: () => handleHotspotClick(hotspot),
              }}
            >
              <Popup>
                <div className="min-w-[220px]">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: colors.fill }}
                    >
                      {hotspot.severity} Priority
                    </span>
                    <span className="text-xs text-gray-500">{hotspot.id}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{hotspot.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{hotspot.district}</p>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <div>
                      <span className="text-gray-400">Reports</span>
                      <p className="font-bold text-gray-800">{hotspot.reportCount}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Priority</span>
                      <p className="font-bold text-gray-800">{hotspot.priorityScore}/100</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Population</span>
                      <p className="font-bold text-gray-800">{(hotspot.populationImpacted / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Category</span>
                      <p className="font-bold" style={{ color: categoryColors[hotspot.primaryCategory] }}>
                        {hotspot.primaryCategory}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleHotspotClick(hotspot)}
                    className="mt-3 w-full bg-blue-600 text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Area Intelligence →
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Individual report markers */}
        {showReports && reports.map(report => (
          <CircleMarker
            key={report.id}
            center={report.coordinates}
            radius={6}
            pathOptions={{
              color: categoryColors[report.category],
              weight: 1.5,
              fillColor: categoryColors[report.category],
              fillOpacity: 0.7,
            }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <p className="font-bold text-gray-900 text-sm mb-1">{report.id}</p>
                <p className="text-xs text-gray-600 mb-1">{report.issue}</p>
                <p className="text-xs text-gray-400">{report.location}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-white rounded-xl border border-civic-border shadow-card-md p-3">
        <p className="text-xs font-bold text-civic-heading mb-2 uppercase tracking-wide">Priority Level</p>
        <div className="space-y-1.5">
          {Object.entries(severityColors).map(([key, colors]) => (
            <div key={key} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border-2"
                style={{ backgroundColor: colors.fill, borderColor: colors.stroke }}
              />
              <span className="text-xs text-civic-body">{key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
