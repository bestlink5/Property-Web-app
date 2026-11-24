import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { usePropertyContext } from '../../context/PropertyContext';
import { LatLng, Property } from '../../types/property';
import {
  PAKISTAN_CITY_COORDS,
  formatCompactPricePin,
  getPropertyCoordinates,
  isPropertyInGeofence,
} from '../../utils/geo';
import { formatArea, formatPKR } from '../../utils/formatters';
import {
  Circle as CircleIcon,
  Pentagon,
  MousePointer,
  Trash2,
  Scan,
  MapPin,
  Undo2,
  Check,
  X,
  ArrowRight,
  Compass,
  Building,
  Maximize2,
} from 'lucide-react';

type DrawMode = 'browse' | 'circle' | 'polygon';

export const PropertyMapView: React.FC = () => {
  const {
    preGeofenceProperties,
    filteredProperties,
    filters,
    updateFilter,
    navigateToProperty,
    addToast,
  } = usePropertyContext();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const geofenceLayerRef = useRef<L.LayerGroup | null>(null);
  const markerByIdRef = useRef<Map<string, L.Marker>>(new Map());

  const [drawMode, setDrawMode] = useState<DrawMode>('browse');
  const [circleRadiusKm, setCircleRadiusKm] = useState<number>(
    filters.geofence?.type === 'circle' ? filters.geofence.radiusKm : 8
  );
  const [draftPolygon, setDraftPolygon] = useState<LatLng[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [jumpCity, setJumpCity] = useState<string>(filters.city || '');

  // Keep latest drawMode and circleRadiusKm accessible inside Leaflet map click handler
  const drawModeRef = useRef<DrawMode>(drawMode);
  const circleRadiusRef = useRef<number>(circleRadiusKm);
  drawModeRef.current = drawMode;
  circleRadiusRef.current = circleRadiusKm;

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [31.8, 72.3],
      zoom: 6,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const geofenceLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    mapRef.current = map;
    geofenceLayerRef.current = geofenceLayer;
    markersLayerRef.current = markersLayer;

    // Fit initial pins cleanly if properties exist
    if (preGeofenceProperties.length > 0) {
      const bounds = L.latLngBounds(
        preGeofenceProperties.map((p) => {
          const c = getPropertyCoordinates(p);
          return [c.lat, c.lng] as [number, number];
        })
      );
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 13 });
    }

    // Handle map click for Circle & Polygon geofence drawing
    map.on('click', (e: L.LeafletMouseEvent) => {
      const clicked: LatLng = {
        lat: Number(e.latlng.lat.toFixed(5)),
        lng: Number(e.latlng.lng.toFixed(5)),
      };

      if (drawModeRef.current === 'circle') {
        updateFilter('geofence', {
          type: 'circle',
          center: clicked,
          radiusKm: circleRadiusRef.current,
          label: `${circleRadiusRef.current} km radius`,
        });
      } else if (drawModeRef.current === 'polygon') {
        setDraftPolygon((prev) => [...prev, clicked]);
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
      geofenceLayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fly to selected city filter when filters.city changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (filters.city && PAKISTAN_CITY_COORDS[filters.city]) {
      const target = PAKISTAN_CITY_COORDS[filters.city];
      setJumpCity(filters.city);
      map.flyTo([target.lat, target.lng], target.zoom, { duration: 0.7 });
    }
  }, [filters.city]);

  // Render active geofence & draft polygon layers
  useEffect(() => {
    const layer = geofenceLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    if (filters.geofence?.type === 'circle') {
      const { center, radiusKm } = filters.geofence;
      L.circle([center.lat, center.lng], {
        radius: radiusKm * 1000,
        color: '#047857',
        weight: 2.5,
        fillColor: '#10b981',
        fillOpacity: 0.14,
        dashArray: '6 4',
      }).addTo(layer);

      // Center pin indicator
      L.circleMarker([center.lat, center.lng], {
        radius: 6,
        color: '#065f46',
        weight: 2,
        fillColor: '#ffffff',
        fillOpacity: 1,
      }).addTo(layer);
    } else if (filters.geofence?.type === 'polygon' && filters.geofence.points.length >= 3) {
      L.polygon(
        filters.geofence.points.map((pt) => [pt.lat, pt.lng] as [number, number]),
        {
          color: '#047857',
          weight: 2.5,
          fillColor: '#10b981',
          fillOpacity: 0.14,
        }
      ).addTo(layer);
    }

    // Draft polygon preview while drawing
    if (draftPolygon.length > 0) {
      if (draftPolygon.length >= 3) {
        L.polygon(
          draftPolygon.map((pt) => [pt.lat, pt.lng] as [number, number]),
          {
            color: '#d97706',
            weight: 2,
            fillColor: '#f59e0b',
            fillOpacity: 0.12,
            dashArray: '5 5',
          }
        ).addTo(layer);
      } else if (draftPolygon.length === 2) {
        L.polyline(
          draftPolygon.map((pt) => [pt.lat, pt.lng] as [number, number]),
          {
            color: '#d97706',
            weight: 2.5,
            dashArray: '5 5',
          }
        ).addTo(layer);
      }

      draftPolygon.forEach((pt, idx) => {
        L.circleMarker([pt.lat, pt.lng], {
          radius: idx === 0 ? 7 : 5,
          color: '#b45309',
          weight: 2,
          fillColor: idx === 0 ? '#fef3c7' : '#ffffff',
          fillOpacity: 1,
        }).addTo(layer);
      });
    }
  }, [filters.geofence, draftPolygon]);

  // Render property markers
  useEffect(() => {
    const layer = markersLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    markerByIdRef.current.clear();

    preGeofenceProperties.forEach((prop) => {
      const coords = getPropertyCoordinates(prop);
      const inside = isPropertyInGeofence(prop, filters.geofence);
      const isSelected = prop.id === selectedPropertyId;
      const priceLabel = formatCompactPricePin(prop.price);

      const bgClass = !inside
        ? 'background:#e2e8f0;color:#64748b;border:1px solid #cbd5e1;opacity:0.75;'
        : isSelected
        ? 'background:#0f172a;color:#ffffff;border:2px solid #34d399;transform:scale(1.08);'
        : prop.purpose === 'rent'
        ? 'background:#0369a1;color:#ffffff;border:1.5px solid #ffffff;'
        : 'background:#047857;color:#ffffff;border:1.5px solid #ffffff;';

      const icon = L.divIcon({
        className: 'pm-map-pin',
        html: `<div style="${bgClass}padding:3px 8px;border-radius:9999px;font-family:var(--font-mono,monospace);font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(15,23,42,0.28);display:inline-flex;align-items:center;gap:4px;cursor:pointer;">${priceLabel}</div>`,
        iconSize: [0, 0],
        iconAnchor: [28, 14],
      });

      const marker = L.marker([coords.lat, coords.lng], {
        icon,
        zIndexOffset: isSelected ? 500 : inside ? 100 : 0,
      });

      // Safely build DOM popup content (no raw HTML interpolation)
      const popupRoot = document.createElement('div');
      popupRoot.style.width = '220px';
      popupRoot.style.fontFamily = 'inherit';

      if (prop.images?.[0]) {
        const img = document.createElement('img');
        img.src = prop.images[0];
        img.alt = prop.title;
        img.style.width = '100%';
        img.style.height = '105px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        img.style.marginBottom = '8px';
        popupRoot.appendChild(img);
      }

      const priceEl = document.createElement('div');
      priceEl.textContent =
        formatPKR(prop.price) + (prop.purpose === 'rent' ? ' / mo' : '');
      priceEl.style.fontWeight = '800';
      priceEl.style.fontSize = '14px';
      priceEl.style.color = '#065f46';
      popupRoot.appendChild(priceEl);

      const titleEl = document.createElement('div');
      titleEl.textContent = prop.title;
      titleEl.style.fontWeight = '700';
      titleEl.style.fontSize = '12px';
      titleEl.style.color = '#0f172a';
      titleEl.style.marginTop = '2px';
      titleEl.style.lineHeight = '1.3';
      popupRoot.appendChild(titleEl);

      const metaEl = document.createElement('div');
      metaEl.textContent = `${prop.location} · ${formatArea(prop.areaValue, prop.areaUnit)}`;
      metaEl.style.fontSize = '11px';
      metaEl.style.color = '#475569';
      metaEl.style.marginTop = '4px';
      popupRoot.appendChild(metaEl);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'View Property Details';
      btn.style.marginTop = '8px';
      btn.style.width = '100%';
      btn.style.padding = '6px 10px';
      btn.style.borderRadius = '6px';
      btn.style.border = 'none';
      btn.style.background = '#0f172a';
      btn.style.color = '#ffffff';
      btn.style.fontSize = '11px';
      btn.style.fontWeight = '700';
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', () => navigateToProperty(prop.id));
      popupRoot.appendChild(btn);

      marker.bindPopup(popupRoot, { maxWidth: 240, closeButton: true });
      marker.on('click', () => {
        setSelectedPropertyId(prop.id);
      });

      marker.addTo(layer);
      markerByIdRef.current.set(prop.id, marker);
    });
  }, [preGeofenceProperties, filters.geofence, selectedPropertyId, navigateToProperty]);

  const handleCityJump = (cityName: string) => {
    setJumpCity(cityName);
    const map = mapRef.current;
    if (!map) return;

    if (!cityName) {
      if (preGeofenceProperties.length > 0) {
        const bounds = L.latLngBounds(
          preGeofenceProperties.map((p) => {
            const c = getPropertyCoordinates(p);
            return [c.lat, c.lng] as [number, number];
          })
        );
        map.flyToBounds(bounds, { padding: [45, 45], maxZoom: 12, duration: 0.7 });
      } else {
        map.flyTo([30.3753, 69.3451], 6, { duration: 0.7 });
      }
      return;
    }

    const coords = PAKISTAN_CITY_COORDS[cityName];
    if (coords) {
      map.flyTo([coords.lat, coords.lng], coords.zoom, { duration: 0.7 });
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setCircleRadiusKm(newRadius);
    if (filters.geofence?.type === 'circle') {
      updateFilter('geofence', {
        ...filters.geofence,
        radiusKm: newRadius,
        label: `${newRadius} km radius`,
      });
    }
  };

  const handleActivateCircleMode = () => {
    setDraftPolygon([]);
    setDrawMode('circle');
    // Immediately place circle at current map center if none exists yet so user gets instant visual feedback
    if (!filters.geofence && mapRef.current) {
      const c = mapRef.current.getCenter();
      updateFilter('geofence', {
        type: 'circle',
        center: { lat: Number(c.lat.toFixed(5)), lng: Number(c.lng.toFixed(5)) },
        radiusKm: circleRadiusKm,
        label: `${circleRadiusKm} km radius`,
      });
      addToast('Circle geofence placed! Click anywhere on the map to move it or drag the radius slider.', 'info');
    }
  };

  const handleActivatePolygonMode = () => {
    setDraftPolygon([]);
    setDrawMode('polygon');
    addToast('Click 3 or more points on the map to outline your custom search area.', 'info');
  };

  const handleApplyPolygon = () => {
    if (draftPolygon.length < 3) {
      addToast('Please click at least 3 points on the map to form a polygon area.', 'error');
      return;
    }
    updateFilter('geofence', {
      type: 'polygon',
      points: draftPolygon,
      label: `Custom Zone (${draftPolygon.length} pts)`,
    });
    setDraftPolygon([]);
    setDrawMode('browse');
    addToast('Custom polygon geofence applied!', 'success');
  };

  const handleGeofenceFromViewport = () => {
    const map = mapRef.current;
    if (!map) return;
    const b = map.getBounds();
    const polygonPoints: LatLng[] = [
      { lat: b.getNorthWest().lat, lng: b.getNorthWest().lng },
      { lat: b.getNorthEast().lat, lng: b.getNorthEast().lng },
      { lat: b.getSouthEast().lat, lng: b.getSouthEast().lng },
      { lat: b.getSouthWest().lat, lng: b.getSouthWest().lng },
    ];
    setDraftPolygon([]);
    setDrawMode('browse');
    updateFilter('geofence', {
      type: 'polygon',
      points: polygonPoints,
      label: 'Visible Map Area',
    });
    addToast('Filtered properties to current visible map area.', 'success');
  };

  const handleClearGeofence = () => {
    updateFilter('geofence', null);
    setDraftPolygon([]);
    setDrawMode('browse');
    addToast('Geofence filter cleared.', 'info');
  };

  const focusPropertyOnMap = (prop: Property) => {
    const map = mapRef.current;
    if (!map) return;
    setSelectedPropertyId(prop.id);
    const coords = getPropertyCoordinates(prop);
    map.flyTo([coords.lat, coords.lng], Math.max(map.getZoom(), 14), { duration: 0.6 });
    const marker = markerByIdRef.current.get(prop.id);
    if (marker) {
      setTimeout(() => marker.openPopup(), 350);
    }
  };

  const outsideCount = preGeofenceProperties.length - filteredProperties.length;

  return (
    <div className="w-full min-w-0 space-y-4">
      {/* Geofence & Map Controls Bar */}
      <div className="w-full min-w-0 bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Drawing Mode Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setDrawMode('browse');
                setDraftPolygon([]);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                drawMode === 'browse'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" />
              <span>Browse Map</span>
            </button>

            <button
              type="button"
              onClick={handleActivateCircleMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                drawMode === 'circle'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CircleIcon className="w-3.5 h-3.5" />
              <span>Circle Geofence</span>
            </button>

            <button
              type="button"
              onClick={handleActivatePolygonMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                drawMode === 'polygon'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Pentagon className="w-3.5 h-3.5" />
              <span>Draw Custom Area</span>
            </button>

            <button
              type="button"
              onClick={handleGeofenceFromViewport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Filter results to properties currently visible inside this map frame"
            >
              <Scan className="w-3.5 h-3.5 text-emerald-700" />
              <span>Search This Map View</span>
            </button>

            {filters.geofence && (
              <button
                type="button"
                onClick={handleClearGeofence}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Geofence</span>
              </button>
            )}
          </div>

          {/* Quick Jump City */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={jumpCity}
              onChange={(e) => handleCityJump(e.target.value)}
              aria-label="Jump map to city"
              className="w-full sm:w-auto px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="">Fit All Properties</option>
              {Object.keys(PAKISTAN_CITY_COORDS).map((cityName) => (
                <option key={cityName} value={cityName}>
                  Fly to {cityName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contextual Controls: Radius Slider OR Polygon Draft Bar */}
        {(drawMode === 'circle' || filters.geofence?.type === 'circle') && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-3 flex-1">
              <span className="font-bold text-emerald-900 whitespace-nowrap">
                Geofence Radius: {circleRadiusKm} km
              </span>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={circleRadiusKm}
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
                className="w-full max-w-xs accent-emerald-700 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 hidden md:inline font-mono">
                (~{Math.round(Math.PI * circleRadiusKm * circleRadiusKm).toLocaleString()} km²)
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              {drawMode === 'circle'
                ? 'Click anywhere on the map to reposition the circle center.'
                : 'Switch to Circle Geofence to move center on click.'}
            </span>
          </div>
        )}

        {drawMode === 'polygon' && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-amber-100 bg-amber-50/60 -mx-3.5 -mb-3.5 px-3.5 py-2.5 rounded-b-xl text-xs">
            <span className="text-amber-950 font-medium">
              Click on the map to add boundary points ({draftPolygon.length} placed
              {draftPolygon.length < 3 ? `, need ${3 - draftPolygon.length} more` : ', ready to apply'}).
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setDraftPolygon((prev) => prev.slice(0, -1))}
                disabled={draftPolygon.length === 0}
                className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
              >
                <Undo2 className="w-3 h-3" />
                <span>Undo</span>
              </button>
              <button
                type="button"
                onClick={handleApplyPolygon}
                disabled={draftPolygon.length < 3}
                className="flex items-center gap-1 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded text-xs font-bold cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Geofence</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftPolygon([]);
                  setDrawMode('browse');
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Split View: Interactive Leaflet Map + Synchronized Side List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch w-full min-w-0">
        {/* Leaflet Map Container */}
        <div className="lg:col-span-2 min-w-0 w-full relative z-0 isolate bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div
            ref={mapContainerRef}
            className={`w-full h-[380px] sm:h-[500px] lg:h-[580px] ${
              drawMode !== 'browse' ? 'cursor-crosshair' : ''
            }`}
          />

          {/* Floating Legend */}
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-[400] bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg px-3 py-2 shadow-sm text-[11px] flex flex-wrap items-center gap-x-3 gap-y-1 pointer-events-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block"></span>
              <span className="font-semibold text-slate-700">For Sale</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-700 inline-block"></span>
              <span className="font-semibold text-slate-700">For Rent</span>
            </div>
            {filters.geofence && outsideCount > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400 inline-block"></span>
                <span className="text-slate-500">Outside Geofence ({outsideCount})</span>
              </div>
            )}
          </div>
        </div>

        {/* Synchronized Side Property List */}
        <div className="min-w-0 w-full bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col max-h-[580px] overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {filters.geofence ? 'Inside Geofence Area' : 'Mapped Properties'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'listing' : 'listings'} matched
                {filters.geofence?.label ? ` · ${filters.geofence.label}` : ''}
              </p>
            </div>
            {filters.geofence && (
              <button
                type="button"
                onClick={handleClearGeofence}
                className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredProperties.length === 0 ? (
              <div className="p-6 text-center space-y-3">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-800">
                  No properties inside this geofence
                </p>
                <p className="text-[11px] text-slate-500">
                  {filters.geofence?.type === 'circle'
                    ? 'Try increasing the radius slider or clicking a city hub on the map.'
                    : 'Clear or redraw your geofence area to include nearby listings.'}
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  {filters.geofence?.type === 'circle' && circleRadiusKm < 50 && (
                    <button
                      type="button"
                      onClick={() => handleRadiusChange(Math.min(50, circleRadiusKm + 10))}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Expand Radius (+10 km)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleClearGeofence}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Clear Geofence
                  </button>
                </div>
              </div>
            ) : (
              filteredProperties.map((prop) => {
                const isSelected = prop.id === selectedPropertyId;
                return (
                  <div
                    key={prop.id}
                    onClick={() => focusPropertyOnMap(prop)}
                    className={`p-3.5 transition-colors cursor-pointer flex gap-3 ${
                      isSelected ? 'bg-emerald-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {prop.images?.[0] ? (
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Building className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-emerald-800 font-mono truncate">
                          {formatPKR(prop.price)}
                          {prop.purpose === 'rent' ? '/mo' : ''}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 shrink-0">
                          {prop.type}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {prop.title}
                      </h4>

                      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                        <span className="truncate flex items-center gap-1">
                          <Maximize2 className="w-3 h-3 shrink-0" />
                          {formatArea(prop.areaValue, prop.areaUnit)} · {prop.city}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToProperty(prop.id);
                          }}
                          className="text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-0.5 shrink-0 cursor-pointer"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
