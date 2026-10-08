import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Checkpoint, GeoPosition, TrainerProfile } from '../types';
import { TEAMS } from '../config/campusConfig';
import { calculateBearing, calculateHaversineDistance, formatDistance, getCompassDirection } from '../utils/geoUtils';
import { playClickSound } from '../utils/audioUtils';
import { Navigation2, Target, Crosshair, MapPin, Zap } from 'lucide-react';

interface CampusMapProps {
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

export const CampusMap: React.FC<CampusMapProps> = ({
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
  const playerMarkerRef = useRef<L.Marker | null>(null);
  const playerAccuracyCircleRef = useRef<L.Circle | null>(null);
  const checkpointMarkersRef = useRef<Map<number, { marker: L.Marker; circle: L.Circle }>>(new Map());

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center on first checkpoint or DAVV center (22.6896, 75.8753)
    const initialLat = playerPos?.lat || checkpoints[0]?.latitude || 22.6896;
    const initialLng = playerPos?.lng || checkpoints[0]?.longitude || 75.8753;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 17,
      zoomControl: false,
      attributionControl: false,
    });

    // Clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Zoom control at bottom right for mobile ergonomics
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

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
            ${isLockedInSequence ? `🔒 ${cp.name.split(' ')[0]}` : cp.name.split(' ')[0]}
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

  // Handle "Fit All"
  const handleFitAll = () => {
    const map = mapInstanceRef.current;
    if (!map || checkpoints.length === 0) return;
    playClickSound();

    const bounds = L.latLngBounds(checkpoints.map((c) => [c.latitude, c.longitude]));
    if (playerPos) {
      bounds.extend([playerPos.lat, playerPos.lng]);
    }
    map.fitBounds(bounds, { padding: [50, 50] });
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
    <div className="relative w-full h-[55vh] sm:h-[65vh] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

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

        {/* Fit Bounds */}
        <button
          onClick={handleFitAll}
          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-amber-400 hover:text-white shadow-lg backdrop-blur-sm transition"
          title="Show Entire Campus Checkpoints"
        >
          <Target className="w-5 h-5" />
        </button>
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
              <span className="truncate max-w-[90px]">{cp.name}</span>
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
                    {targetCp.name}
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
