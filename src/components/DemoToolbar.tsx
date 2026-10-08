import React from 'react';
import { Sparkles, MapPin, Navigation, Zap, Gift, CheckCircle, ChevronRight, X } from 'lucide-react';
import { Checkpoint, GeoPosition, PowerUpType } from '../types';
import { playClickSound, playPowerUpSound } from '../utils/audioUtils';

interface DemoToolbarProps {
  isOpen: boolean;
  onClose: () => void;
  checkpoints: Checkpoint[];
  selectedCheckpoint: Checkpoint | null;
  onSelectCheckpoint: (cp: Checkpoint) => void;
  onSimulatePosition: (lat: number, lng: number) => void;
  onSimulateStepCloser: () => void;
  onSimulateInstantUnlock: () => void;
  onAwardRandomPowerUp: () => void;
  onRollNewQuest?: () => void;
}

export const DemoToolbar: React.FC<DemoToolbarProps> = ({
  isOpen,
  onClose,
  checkpoints,
  selectedCheckpoint,
  onSelectCheckpoint,
  onSimulatePosition,
  onSimulateStepCloser,
  onSimulateInstantUnlock,
  onAwardRandomPowerUp,
  onRollNewQuest,
}) => {
  if (!isOpen) return null;

  const targetCp = selectedCheckpoint || checkpoints[0];

  // Helper to place coordinates at approx offset in meters
  // 1 degree latitude ≈ 111,000 meters
  const moveNearTarget = (meters: number) => {
    if (!targetCp) return;
    playClickSound();
    const latOffset = meters / 111000;
    onSimulatePosition(targetCp.latitude + latOffset, targetCp.longitude);
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-40 animate-slide-up">
      <div className="p-4 rounded-2xl bg-slate-900/95 border-2 border-purple-500/80 shadow-2xl shadow-purple-950/60 backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
            <span className="font-display font-black text-xs uppercase tracking-wider text-purple-300">
              🎮 PRESENTATION DEMO SIMULATOR
            </span>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Selector */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Target Checkpoint for Simulation:</span>
            <span className="text-amber-400 font-bold">{targetCp?.name}</span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {checkpoints.map((cp) => (
              <button
                key={cp.id}
                onClick={() => {
                  playClickSound();
                  onSelectCheckpoint(cp);
                }}
                className={`py-1 rounded text-xs font-bold transition ${
                  targetCp?.id === cp.id
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                #{cp.id}
              </button>
            ))}
          </div>
        </div>

        {/* Simulation Action Buttons */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Teleport outside geofence */}
          <button
            onClick={() => moveNearTarget(68)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-amber-300 font-bold flex items-center justify-center gap-1.5 transition text-left"
            title="Move 68 meters away (Outside 50m radius)"
          >
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Near (68m Away)</span>
          </button>

          {/* Teleport inside geofence */}
          <button
            onClick={() => moveNearTarget(18)}
            className="p-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/60 text-emerald-200 font-bold flex items-center justify-center gap-1.5 transition text-left shadow-sm"
            title="Move 18 meters away (Inside 50m radius)"
          >
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Enter Radius (18m)</span>
          </button>

          {/* Walk step closer */}
          <button
            onClick={() => {
              playClickSound();
              onSimulateStepCloser();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-cyan-300 font-bold flex items-center justify-center gap-1.5 transition text-left"
            title="Walk 10 meters closer"
          >
            <Navigation className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Walk 10m Closer</span>
          </button>

          {/* Give power-up */}
          <button
            onClick={() => {
              playPowerUpSound();
              onAwardRandomPowerUp();
            }}
            className="p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 border border-purple-500/60 text-purple-200 font-bold flex items-center justify-center gap-1.5 transition text-left"
            title="Award a mystery power-up to player bag"
          >
            <Gift className="w-4 h-4 text-purple-400 shrink-0" />
            <span>+Power-Up Drop</span>
          </button>

          {/* Roll New Checkpoints */}
          {onRollNewQuest && (
            <button
              onClick={() => {
                playPowerUpSound();
                onRollNewQuest();
              }}
              className="col-span-2 p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-300 font-bold flex items-center justify-center gap-1.5 transition shadow"
              title="Change checkpoints immediately by choosing 5 random locations from all college points"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>🎲 Change Game Checkpoints (From All College Points)</span>
            </button>
          )}
        </div>

        {/* Footer info */}
        <p className="mt-2 text-[10px] text-slate-400 text-center">
          Tap <strong>Enter Radius</strong> to immediately test the geofence unlock chime and riddle!
        </p>
      </div>
    </div>
  );
};
