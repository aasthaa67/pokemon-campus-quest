import React from 'react';
import { X, Sparkles, Check, Info, Backpack, ShieldAlert } from 'lucide-react';
import { AVAILABLE_POWER_UPS } from '../config/campusConfig';
import { PowerUpType, TrainerProfile } from '../types';
import { playClickSound, playPowerUpSound } from '../utils/audioUtils';

interface PowerUpsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: TrainerProfile | null;
  onUsePowerUp: (type: PowerUpType) => void;
}

export const PowerUpsModal: React.FC<PowerUpsModalProps> = ({
  isOpen,
  onClose,
  trainer,
  onUsePowerUp,
}) => {
  if (!isOpen) return null;

  const powerUps = trainer?.powerUps || {
    HINT_REVEAL: 0,
    SPEED_BOOST: 0,
    SHIELD: 0,
    XP_BOOST: 0,
    TIME_BONUS: 0,
  };

  const totalCount = Object.values(powerUps).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 p-2 flex items-center justify-center text-amber-400">
            <Backpack className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              Trainer Backpack & Items
            </h2>
            <p className="text-xs text-slate-400">
              {totalCount} Power-Ups Available • Earn more by visiting campus checkpoints!
            </p>
          </div>
        </div>

        {/* Multiplier / Active Shield status banner */}
        {(trainer?.activeMultiplier || 1) > 1 && (
          <div className="mb-4 p-3 rounded-xl bg-purple-950/40 border border-purple-500/50 text-xs text-purple-200 flex items-center justify-between">
            <span className="font-bold">⭐ Active Booster: 2x XP Multiplier Loaded!</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/30 font-bold">READY</span>
          </div>
        )}
        {trainer?.hasShield && (
          <div className="mb-4 p-3 rounded-xl bg-blue-950/40 border border-blue-500/50 text-xs text-blue-200 flex items-center justify-between">
            <span className="font-bold">🛡️ Active Shield: Streak Protected!</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/30 font-bold">ACTIVE</span>
          </div>
        )}

        {/* List of Power-Ups */}
        <div className="space-y-3">
          {AVAILABLE_POWER_UPS.map((pu) => {
            const count = powerUps[pu.type] || 0;
            const hasItem = count > 0;

            return (
              <div
                key={pu.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  hasItem
                    ? 'bg-slate-850 border-slate-700 hover:border-slate-600'
                    : 'bg-slate-900/60 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 shrink-0">
                    {pu.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-sm text-white">
                        {pu.name}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          count > 0
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        x{count}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {pu.description}
                    </p>
                  </div>
                </div>

                {/* Use Button */}
                <button
                  disabled={!hasItem}
                  onClick={() => {
                    playPowerUpSound();
                    onUsePowerUp(pu.type);
                  }}
                  className={`shrink-0 py-2 px-3.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    hasItem
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Use Item</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div className="mt-5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[11px] text-slate-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Power-ups drop automatically into your backpack when solving checkpoint riddles or exploring DAVV grounds.
          </span>
        </div>
      </div>
    </div>
  );
};
