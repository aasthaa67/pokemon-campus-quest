import React, { useEffect } from 'react';
import { Trophy, Award, Sparkles, X, RotateCcw, Share2, Flame, Droplets, Leaf, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TrainerProfile } from '../types';
import { CAMPUSES, TEAMS } from '../config/campusConfig';
import { playGrandVictoryFanfare, playClickSound } from '../utils/audioUtils';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: TrainerProfile;
  onOpenLeaderboard: () => void;
  onStartNewGame: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onClose,
  trainer,
  onOpenLeaderboard,
  onStartNewGame,
}) => {
  useEffect(() => {
    if (isOpen) {
      playGrandVictoryFanfare();
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'];

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const team = TEAMS[trainer.team];
  const activeCampus = CAMPUSES[trainer.currentCampusId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-amber-500/30 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

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

        {/* Crown & Trophy Emblem */}
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 mx-auto shadow-xl shadow-amber-500/40 flex items-center justify-center">
            <Trophy className="w-14 h-14 text-slate-950 drop-shadow" />
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950 border border-amber-400 text-amber-300 text-[11px] font-black uppercase tracking-wider">
            CAMPUS CHAMPION
          </span>
        </div>

        {/* Title */}
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-1 uppercase tracking-tight">
          CONGRATULATIONS, {trainer.name}!
        </h2>
        <p className="font-display text-amber-300 font-bold text-base mb-3">
          All 5 {activeCampus.shortName} Checkpoints Conquered!
        </p>

        {/* Description */}
        <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto mb-5 leading-relaxed">
          You conquered every geofenced landmark, solved the Season 1 & Desi Hinglish riddles,
          and brought victory to <strong>{team?.name}</strong>!
        </p>

        {/* Trainer Stats Card */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 mb-6 grid grid-cols-3 gap-2">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Total Score</p>
            <p className="font-display font-black text-amber-400 text-lg sm:text-xl">
              {trainer.score} XP
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Team</p>
            <p className="font-display font-bold text-white text-sm sm:text-base flex items-center justify-center gap-1">
              <span>{team?.badgeIcon}</span>
              <span className="truncate">{team?.name.replace('Team ', '')}</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Badges</p>
            <p className="font-display font-black text-emerald-400 text-lg sm:text-xl">
              5 / 5 🌟
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              playClickSound();
              onOpenLeaderboard();
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
          >
            <Award className="w-4 h-4 text-yellow-400" />
            <span>Leaderboard Rank</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onClose();
              onStartNewGame();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Start New Game / Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
