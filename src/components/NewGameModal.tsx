import React from 'react';
import { RotateCcw, Play, Users, X, Trophy, Sparkles, MapPin } from 'lucide-react';
import { CampusId, TrainerProfile } from '../types';
import { CAMPUSES } from '../config/campusConfig';
import { playClickSound, playPowerUpSound } from '../utils/audioUtils';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCampusId: CampusId;
  trainer: TrainerProfile | null;
  onReplayCampus: () => void;
  onSwitchCampus: (newCampusId: CampusId) => void;
  onFullResetTrainer: () => void;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  isOpen,
  onClose,
  currentCampusId,
  trainer,
  onReplayCampus,
  onSwitchCampus,
  onFullResetTrainer,
}) => {
  if (!isOpen) return null;

  const activeCampus = CAMPUSES[currentCampusId];
  const otherCampusId: CampusId = currentCampusId === 'TAKSHASHILA' ? 'IET_DAVV' : 'TAKSHASHILA';
  const otherCampus = CAMPUSES[otherCampusId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-400/80 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl shadow-amber-500/20 relative">
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
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-2xl shadow-md">
            <span>🎮</span>
          </div>
          <div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white">
              Start a New Quest / Play Again
            </h2>
            <p className="text-xs text-slate-400">
              Ready for another run? Race your batchmates or explore the other campus!
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {/* Option 1: Replay Current Campus */}
          <div
            onClick={() => {
              playPowerUpSound();
              onReplayCampus();
              onClose();
            }}
            className="p-4 rounded-2xl bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/80 cursor-pointer transition flex items-start gap-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 group-hover:scale-105 transition-transform shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                Start Fresh Run (Checkpoints Change Every Game!)
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Rolls 5 brand-new randomized checkpoints chosen from all points of the {activeCampus.shortName} college (academic blocks, science labs, libraries, canteens, sports arenas & hostels), with fresh clues and brain-teasers. Keeps your Trainer profile!
              </p>
            </div>
          </div>

          {/* Option 2: Switch to Other Campus */}
          <div
            onClick={() => {
              playClickSound();
              onSwitchCampus(otherCampusId);
              onClose();
            }}
            className="p-4 rounded-2xl bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-indigo-400/80 cursor-pointer transition flex items-start gap-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 group-hover:scale-105 transition-transform shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">
                Switch to {otherCampus.shortName} Campus
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Take your Trainer over to {otherCampus.name} and crack all 5 engineering/main landmarks!
              </p>
            </div>
          </div>

          {/* Option 3: Full Reset / New Profile */}
          <div
            onClick={() => {
              if (confirm('Start a completely new game with a new Trainer Name and Team?')) {
                playClickSound();
                onFullResetTrainer();
                onClose();
              }
            }}
            className="p-4 rounded-2xl bg-slate-850/60 hover:bg-slate-800 border border-slate-800 hover:border-red-500/60 cursor-pointer transition flex items-start gap-3.5 group"
          >
            <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40 group-hover:scale-105 transition-transform shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-200 text-sm group-hover:text-red-400 transition-colors">
                Full Reset (New Trainer Profile)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Wipe current session to create a completely new Trainer Profile and choose a new faction (Fire / Aqua / Leaf).
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400">
          Tip: Leaderboard preserves your highest XP run!
        </div>
      </div>
    </div>
  );
};
