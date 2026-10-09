import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CampusId, Checkpoint, GeoPosition, TrainerProfile } from '../types';
import { CAMPUSES, TEAMS } from '../config/campusConfig';
import { calculateBearing, calculateHaversineDistance, formatDistance, getCompassDirection } from '../utils/geoUtils';
import { playClickSound } from '../utils/audioUtils';
import { Navigation2, Target, Crosshair, MapPin, Zap, Layers, Compass, Eye, Info } from 'lucide-react';

interface CampusMapProps {
  currentCampusId?: CampusId;
  checkpoints: Checkpoint[];
  playerPos: GeoPosition | null;
  selectedCheckpoint: Checkpoint | null;
  onSelectCheckpoint: (cp: Checkpoint) => void;
  trainer: TrainerProfile | null;
  nearestCheckpoint: Checkpoint | null;
  distanceToNearest: number | null;
  isInsideNearestGeofence: boolean;
  onNavigateToCheckpoint: (cp: Checkpoint) => void;
  onCenterPlayer: () => void;
}

type MapLayerType = 'STREET' | 'SATELLITE' | 'DARK';

const MAP_TILE_CONFIGS: Record<MapLayerType, { url: string; attribution: string; maxZoom: number }> = {
  STREET: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
  SATELLITE: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP',
    maxZoom: 19,
  },
  DARK: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19,
  },
};

export const CampusMap: React.FC<CampusMapProps> = ({
  currentCampusId = 'TAKSHASHILA',
  checkpoints,
  playerPos,
  selectedCheckpoint,
  onSelectCheckpoint,
  trainer,
  nearestCheckpoint,
  distanceToNearest,
  isInsideNearestGeofence,
  onNavigateToCheckpoint,
  onCenterPlayer,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const playerMarkerRef = useRef<L.Marker | null>(null);
  const playerAccuracyCircleRef = useRef<L.Circle | null>(null);
  const checkpointMarkersRef = useRef<Map<number, { marker: L.Marker; circle: L.Circle }>>(new Map());
  const campusBoundaryPolygonRef = useRef<L.Polygon | null>(null);
  const landmarkPoiMarkersRef = useRef<L.Marker[]>([]);

  // Explorer states
  const [mapLayer, setMapLayer] = useState<MapLayerType>('STREET');
  const [showLandmarkExplorer, setShowLandmarkExplorer] = useState<boolean>(false);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);

  const activeCampus = CAMPUSES[currentCampusId] || CAMPUSES.TAKSHASHILA;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center on campus center
    const initialLat = playerPos?.lat || checkpoints[0]?.latitude || activeCampus.center.lat;
    const initialLng = playerPos?.lng || checkpoints[0]?.longitude || activeCampus.center.lng;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 17,
      zoomControl: false,
      attributionControl: false,
    });

    // Default Street tiles
    const initialTileConfig = MAP_TILE_CONFIGS[mapLayer];
    const tileLayer = L.tileLayer(initialTileConfig.url, {
      maxZoom: initialTileConfig.maxZoom,
      attribution: initialTileConfig.attribution,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Zoom control at bottom right for mobile ergonomics
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when mapLayer changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const config = MAP_TILE_CONFIGS[mapLayer];
    const newTileLayer = L.tileLayer(config.url, {
      maxZoom: config.maxZoom,
      attribution: config.attribution,
    }).addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [mapLayer]);

  // Update Campus Boundary Polygon
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (campusBoundaryPolygonRef.current) {
      campusBoundaryPolygonRef.current.remove();
      campusBoundaryPolygonRef.current = null;
    }

    if (activeCampus.boundary && activeCampus.boundary.length > 0) {
      const boundaryColor = currentCampusId === 'IET_DAVV' ? '#6366f1' : '#ef4444';
      const poly = L.polygon(activeCampus.boundary, {
        color: boundaryColor,
        weight: 3,
        dashArray: '8, 8',
        fillColor: boundaryColor,
        fillOpacity: mapLayer === 'SATELLITE' ? 0.08 : 0.05,
      }).addTo(map);

      poly.bindTooltip(`🏛️ ${activeCampus.name} Campus Perimeter`, {
        sticky: true,
        className: 'bg-slate-900 text-white font-bold text-xs p-1 rounded border border-slate-700',
      });

      campusBoundaryPolygonRef.current = poly;
    }
  }, [currentCampusId, activeCampus, mapLayer]);

  // Toggle Landmark Explorer POI Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old landmark POI markers
    landmarkPoiMarkersRef.current.forEach((m) => m.remove());
    landmarkPoiMarkersRef.current = [];

    if (!showLandmarkExplorer) return;

    const points = activeCampus.landmarkExplorerPoints || [];
    points.forEach((pt) => {
      const iconHtml = `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900/90 border-2 border-amber-400 text-base shadow-lg shadow-amber-500/30 transform hover:scale-125 transition-transform cursor-pointer">
          <span>${pt.icon}</span>
        </div>
      `;

      const markerIcon = L.divIcon({
        className: 'landmark-poi-marker',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([pt.lat, pt.lng], { icon: markerIcon }).addTo(map);
      marker.bindPopup(`
        <div class="p-2 min-w-[200px] text-slate-900 font-sans">
          <div class="flex items-center gap-1.5 font-bold text-sm text-slate-950 mb-1">
            <span>${pt.icon}</span>
            <span>${pt.name}</span>
          </div>
          <span class="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 mb-1.5 uppercase">
            ${pt.category}
          </span>
          <p class="text-xs text-slate-700 leading-snug">${pt.description}</p>
        </div>
      `);

      landmarkPoiMarkersRef.current.push(marker);
    });
  }, [showLandmarkExplorer, currentCampusId, activeCampus]);

  // Update Checkpoint Markers & Geofences
  const prevFirstCpLatRef = useRef<number | null>(null);
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // If campus changed (different checkpoint coordinates), smoothly fit bounds to new campus
    if (checkpoints.length > 0 && prevFirstCpLatRef.current !== checkpoints[0].latitude) {
      prevFirstCpLatRef.current = checkpoints[0].latitude;
      const bounds = L.latLngBounds(checkpoints.map((c) => [c.latitude, c.longitude]));
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 17 });
    }

    // Remove old checkpoint markers
    checkpointMarkersRef.current.forEach(({ marker, circle }) => {
      marker.remove();
      circle.remove();
    });
    checkpointMarkersRef.current.clear();

    // Add each checkpoint
    checkpoints.forEach((cp, index) => {
      const isCompleted = trainer?.completedCheckpointIds.includes(cp.id);
      const isLockedInSequence = index > 0 && !trainer?.completedCheckpointIds.includes(checkpoints[index - 1].id);
      const isSelected = selectedCheckpoint?.id === cp.id;
      const isNearest = nearestCheckpoint?.id === cp.id;

      // Distance from player if known
      const distance = playerPos
        ? calculateHaversineDistance(playerPos.lat, playerPos.lng, cp.latitude, cp.longitude)
        : null;

      const isInside = !isLockedInSequence && distance !== null && distance <= cp.radius;

      // Geofence styling
      const circleColor = isCompleted
        ? '#10b981' // Green for completed
        : isLockedInSequence
        ? '#475569' // Slate/locked in sequence
        : isInside
        ? '#ef4444' // Red alert pulse for unlocked/inside
        : isSelected
        ? '#f59e0b' // Amber for selected
        : '#3b82f6'; // Blue default

      const circle = L.circle([cp.latitude, cp.longitude], {
        radius: cp.radius,
        color: circleColor,
        weight: isSelected ? 3 : 2,
        fillColor: circleColor,
        fillOpacity: isLockedInSequence ? 0.05 : isInside ? 0.28 : 0.12,
        dashArray: isCompleted ? undefined : isLockedInSequence ? '4, 6' : '6, 6',
      }).addTo(map);

      const isStage1Solved = isCompleted || Boolean(trainer?.stage1CompletedIds?.includes(cp.id));

      // Poké Ball HTML Marker Icon
      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${
            isInside
              ? `<div class="pulse-ring bg-red-500/40 w-12 h-12 rounded-full absolute"></div>`
              : ''
          }
          <div class="relative w-10 h-10 rounded-full bg-slate-900 border-2 ${
            isCompleted
              ? 'border-emerald-400 shadow-lg shadow-emerald-500/40'
              : isLockedInSequence
              ? 'border-slate-600 opacity-70 grayscale'
              : isInside
              ? 'border-amber-400 shadow-lg shadow-amber-500/50 scale-110'
              : isSelected
              ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/30'
              : 'border-slate-400'
          } p-1 flex items-center justify-center transition-transform hover:scale-115">
            <img src="/pokeball.svg" alt="Poké Ball" class="w-full h-full drop-shadow" />
            ${
              isCompleted
                ? `<div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold border border-slate-900">✓</div>`
                : isLockedInSequence
                ? `<div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[9px] font-bold border border-slate-900">🔒</div>`
                : `<div class="absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                    isInside ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-200'
                  } flex items-center justify-center text-[10px] font-bold border border-slate-900">${cp.id}</div>`
            }
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-950/90 text-slate-200 text-[10px] font-bold border border-slate-700/80 shadow">
            ${
              isCompleted
                ? `✓ ${cp.name.split(' ')[0]}`
                : isStage1Solved
                ? cp.name.split(' ')[0]
                : isLockedInSequence
                ? `🔒 #${cp.id}`
                : `${cp.pokemonName}`
            }
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'pokeball-marker',
        html: iconHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([cp.latitude, cp.longitude], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        playClickSound();
        onSelectCheckpoint(cp);
      });

      checkpointMarkersRef.current.set(cp.id, { marker, circle });
    });
  }, [checkpoints, selectedCheckpoint, nearestCheckpoint, playerPos, trainer]);

  // Update Player Marker and Accuracy Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !playerPos) return;

    const team = trainer ? TEAMS[trainer.team] : TEAMS.FIRE;

    // Player Avatar Marker
    const playerIconHtml = `
      <div class="relative flex items-center justify-center">
        <!-- Pulsing radar ring -->
        <div class="player-radar absolute w-14 h-14 rounded-full bg-cyan-400/30"></div>
        <div class="relative w-8 h-8 rounded-full ${team.bgColor} border-2 border-white shadow-lg flex items-center justify-center text-sm font-bold bg-slate-900 text-white">
          <span class="text-base">${team.badgeIcon}</span>
        </div>
        <div class="absolute -bottom-4 whitespace-nowrap bg-red-600 text-white font-extrabold text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow">
          YOU
        </div>
      </div>
    `;

    const playerIcon = L.divIcon({
      className: 'player-marker',
      html: playerIconHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (playerMarkerRef.current) {
      playerMarkerRef.current.setLatLng([playerPos.lat, playerPos.lng]);
    } else {
      playerMarkerRef.current = L.marker([playerPos.lat, playerPos.lng], {
        icon: playerIcon,
        zIndexOffset: 1000,
      }).addTo(map);
    }

    // Accuracy Circle
    if (playerPos.accuracy && playerPos.accuracy < 150) {
      if (playerAccuracyCircleRef.current) {
        playerAccuracyCircleRef.current.setLatLng([playerPos.lat, playerPos.lng]);
        playerAccuracyCircleRef.current.setRadius(playerPos.accuracy);
      } else {
        playerAccuracyCircleRef.current = L.circle([playerPos.lat, playerPos.lng], {
          radius: playerPos.accuracy,
          color: '#38bdf8',
          weight: 1,
          fillColor: '#38bdf8',
          fillOpacity: 0.08,
        }).addTo(map);
      }
    }
  }, [playerPos, trainer]);

  // Handle "Fit All" (Full Campus View)
  const handleFitAll = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    playClickSound();

    const bounds = L.latLngBounds([]);
    if (checkpoints.length > 0) {
      checkpoints.forEach((c) => bounds.extend([c.latitude, c.longitude]));
    }
    if (activeCampus.boundary) {
      activeCampus.boundary.forEach(([lat, lng]) => bounds.extend([lat, lng]));
    }
    if (playerPos) {
      bounds.extend([playerPos.lat, playerPos.lng]);
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 17 });
    }
  };

  // Target checkpoint for HUD navigation info
  const targetCp = selectedCheckpoint || nearestCheckpoint || checkpoints[0];
  const targetDistance =
    playerPos && targetCp
      ? calculateHaversineDistance(playerPos.lat, playerPos.lng, targetCp.latitude, targetCp.longitude)
      : null;

  const targetBearing =
    playerPos && targetCp
      ? calculateBearing(playerPos.lat, playerPos.lng, targetCp.latitude, targetCp.longitude)
      : 0;

  const cardinalDir = getCompassDirection(targetBearing);

  const isTargetInside = targetDistance !== null && targetDistance <= (targetCp?.radius || 50);

  return (
    <div className="relative w-full h-[58vh] sm:h-[68vh] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Campus Watermark / Title Badge (Top Center-Right) */}
      <div className="absolute top-3 right-16 z-20 hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-lg text-xs font-bold text-white">
        <span>{activeCampus.icon}</span>
        <span>{activeCampus.name}</span>
        <span className="text-[10px] text-amber-400 font-mono">({currentCampusId === 'IET_DAVV' ? 'Khandwa Rd' : 'Main Hub'})</span>
      </div>

      {/* Map Control Buttons (Floating Top Right) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        {/* Recenter on Player */}
        <button
          onClick={() => {
            playClickSound();
            if (playerPos && mapInstanceRef.current) {
              mapInstanceRef.current.setView([playerPos.lat, playerPos.lng], 18, { animate: true });
            } else {
              onCenterPlayer();
            }
          }}
          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-cyan-400 hover:text-white shadow-lg backdrop-blur-sm transition"
          title="Recenter on My Location"
        >
          <Crosshair className="w-5 h-5" />
        </button>

        {/* Fit Full Campus Bounds */}
        <button
          onClick={handleFitAll}
          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-amber-400 hover:text-white shadow-lg backdrop-blur-sm transition"
          title="Explore Full College Campus Perimeter & Checkpoints"
        >
          <Target className="w-5 h-5" />
        </button>

        {/* Toggle College Landmark POIs */}
        <button
          onClick={() => {
            playClickSound();
            setShowLandmarkExplorer(!showLandmarkExplorer);
          }}
          className={`p-2.5 rounded-xl border shadow-lg backdrop-blur-sm transition ${
            showLandmarkExplorer
              ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/50'
              : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-amber-400'
          }`}
          title={showLandmarkExplorer ? 'Hide College Landmark Points' : 'Explore All Points of the College'}
        >
          <Compass className="w-5 h-5" />
        </button>

        {/* Map Layer Switcher Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              playClickSound();
              setShowLayerMenu(!showLayerMenu);
            }}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-indigo-400 hover:text-white shadow-lg backdrop-blur-sm transition"
            title="Switch Map Tiles (Street, Satellite, Dark)"
          >
            <Layers className="w-5 h-5" />
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 top-12 w-36 bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl p-1.5 flex flex-col gap-1 z-30 backdrop-blur-md animate-fade-in">
              <button
                onClick={() => {
                  playClickSound();
                  setMapLayer('STREET');
                  setShowLayerMenu(false);
                }}
                className={`w-full py-1.5 px-2.5 rounded-xl text-left text-xs font-bold transition flex items-center justify-between ${
                  mapLayer === 'STREET' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🗺️ Streets</span>
                {mapLayer === 'STREET' && <span>✓</span>}
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setMapLayer('SATELLITE');
                  setShowLayerMenu(false);
                }}
                className={`w-full py-1.5 px-2.5 rounded-xl text-left text-xs font-bold transition flex items-center justify-between ${
                  mapLayer === 'SATELLITE' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🛰️ Satellite</span>
                {mapLayer === 'SATELLITE' && <span>✓</span>}
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setMapLayer('DARK');
                  setShowLayerMenu(false);
                }}
                className={`w-full py-1.5 px-2.5 rounded-xl text-left text-xs font-bold transition flex items-center justify-between ${
                  mapLayer === 'DARK' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🌙 Dark Tactical</span>
                {mapLayer === 'DARK' && <span>✓</span>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Checkpoint Selector Carousel (Top Left) */}
      <div className="absolute top-3 left-3 right-16 z-20 overflow-x-auto no-scrollbar flex items-center gap-1.5 py-1">
        {checkpoints.map((cp) => {
          const isDone = trainer?.completedCheckpointIds.includes(cp.id);
          const isSelected = selectedCheckpoint?.id === cp.id;
          return (
            <button
              key={cp.id}
              onClick={() => {
                playClickSound();
                onSelectCheckpoint(cp);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.setView([cp.latitude, cp.longitude], 18, { animate: true });
                }
              }}
              className={`shrink-0 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-md shadow-md ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/50'
                  : isDone
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              <span>{isDone ? '✓' : `#${cp.id}`}</span>
              <span className="truncate max-w-[90px]">
                {isDone || trainer?.stage1CompletedIds?.includes(cp.id)
                  ? cp.name
                  : `${cp.pokemonName} Outpost`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Geofence & Navigation HUD Banner (Floating Bottom) */}
      {targetCp && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-md z-20">
          <div
            className={`p-3 sm:p-3.5 rounded-2xl border backdrop-blur-md shadow-2xl transition-all ${
              isTargetInside
                ? 'bg-emerald-950/90 border-emerald-400/80 ring-2 ring-emerald-500/40 text-emerald-100'
                : 'bg-slate-900/90 border-slate-700/80 text-slate-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isTargetInside
                      ? 'bg-emerald-500 text-white animate-bounce'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm leading-tight text-white">
                    {trainer?.completedCheckpointIds.includes(targetCp.id) ||
                    trainer?.stage1CompletedIds?.includes(targetCp.id)
                      ? targetCp.name
                      : `${targetCp.pokemonName} Mystery Outpost`}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Radius: {targetCp.radius}m • {targetCp.pokemonName} Point
                  </p>
                </div>
              </div>

              {/* Distance Meter Badge */}
              <div className="text-right shrink-0">
                <span
                  className={`inline-block font-display font-extrabold text-sm sm:text-base px-2 py-0.5 rounded-lg ${
                    isTargetInside
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'bg-slate-800 text-amber-400 border border-slate-700'
                  }`}
                >
                  {targetDistance !== null ? formatDistance(targetDistance) : 'Detecting GPS'}
                </span>
                {targetDistance !== null && (
                  <p className="text-[10px] text-slate-400">
                    Heading: {cardinalDir} ({Math.round(targetBearing)}°)
                  </p>
                )}
              </div>
            </div>

            {/* Geofence Alert Status Message */}
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <p className="text-xs font-medium leading-snug">
                {isTargetInside ? (
                  <span className="text-emerald-300 font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    Unlocked! You are inside the geofence radius!
                  </span>
                ) : (
                  <span className="text-amber-300 flex items-center gap-1">
                    ⚡ You're {targetDistance !== null ? `${Math.round(targetDistance)}m away` : 'close'}, Trainer! Move closer to unlock this checkpoint.
                  </span>
                )}
              </p>

              <button
                onClick={() => {
                  playClickSound();
                  onNavigateToCheckpoint(targetCp);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([targetCp.latitude, targetCp.longitude], 18, {
                      animate: true,
                    });
                  }
                }}
                className="shrink-0 px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 shadow-md transition"
                title="Center and Navigate to this Checkpoint"
              >
                <Navigation2 className="w-3.5 h-3.5 fill-white" />
                <span>Navigate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
