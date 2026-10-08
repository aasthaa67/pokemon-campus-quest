import React, { useState } from 'react';
import { X, ShieldCheck, Flame, Droplets, Leaf, Sparkles, User, Award } from 'lucide-react';
import { TEAMS } from '../config/campusConfig';
import { TeamId, TrainerProfile } from '../types';
import { playClickSound, playPowerUpSound } from '../utils/audioUtils';

interface TrainerSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrainer: TrainerProfile | null;
  onSaveTrainer: (name: string, team: TeamId) => void;
}

export const TrainerSetupModal: React.FC<TrainerSetupModalProps> = ({
  isOpen,
  onClose,
  currentTrainer,
  onSaveTrainer,
}) => {
  const [name, setName] = useState(currentTrainer?.name || '');
  const [selectedTeam, setSelectedTeam] = useState<TeamId>(currentTrainer?.team || 'FIRE');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your Trainer Name to start the adventure!');
      return;
    }
    if (trimmed.length < 2) {
      setError('Trainer name must be at least 2 characters.');
      return;
    }
    playPowerUpSound();
    onSaveTrainer(trimmed, selectedTeam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl shadow-red-950/40 relative">
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 p-2 flex items-center justify-center shadow-lg shadow-red-500/30">
            <img src="/pokeball.svg" alt="Poké Ball" className="w-full h-full" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              {currentTrainer ? 'Trainer ID Card' : 'Create Trainer Profile'}
            </h2>
            <p className="text-xs text-slate-400">
              Devi Ahilya Vishwavidyalaya • Fresher Quest 2026
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Trainer Name Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-display">
              Trainer Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Ash, Aryan, Priya, Sneha..."
                maxLength={24}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl text-white placeholder-slate-500 text-sm font-medium transition"
              />
            </div>
            {error && <p className="text-xs text-rose-400 mt-1.5 font-medium">{error}</p>}
          </div>

          {/* Team Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-display">
              Choose Your Orientation Team
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {/* Team Fire */}
              <div
                onClick={() => {
                  playClickSound();
                  setSelectedTeam('FIRE');
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedTeam === 'FIRE'
                    ? 'border-red-500 bg-red-950/40 ring-2 ring-red-500/50'
                    : 'border-slate-800 bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center justify-center text-xl">
                    <Flame className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-white text-sm">
                        Team Fire
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-semibold">
                        Charmander
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Blaze of Passion & Speed • Aggressive clue hunting
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedTeam === 'FIRE' ? 'border-red-500 bg-red-500' : 'border-slate-600'
                }`}>
                  {selectedTeam === 'FIRE' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {/* Team Aqua */}
              <div
                onClick={() => {
                  playClickSound();
                  setSelectedTeam('AQUA');
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedTeam === 'AQUA'
                    ? 'border-cyan-500 bg-cyan-950/40 ring-2 ring-cyan-500/50'
                    : 'border-slate-800 bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-xl">
                    <Droplets className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-white text-sm">
                        Team Aqua
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold">
                        Squirtle
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Torrent of Wisdom & Flow • Analytical pathfinder
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedTeam === 'AQUA' ? 'border-cyan-500 bg-cyan-500' : 'border-slate-600'
                }`}>
                  {selectedTeam === 'AQUA' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {/* Team Leaf */}
              <div
                onClick={() => {
                  playClickSound();
                  setSelectedTeam('LEAF');
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedTeam === 'LEAF'
                    ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/50'
                    : 'border-slate-800 bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-xl">
                    <Leaf className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-white text-sm">
                        Team Leaf
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                        Bulbasaur
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Bloom of Harmony & Resilience • Consistent endurance
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedTeam === 'LEAF' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600'
                }`}>
                  {selectedTeam === 'LEAF' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>
          </div>

          {/* Current Stats (if editing) */}
          {currentTrainer && (
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 grid grid-cols-3 text-center">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Score / XP</p>
                <p className="font-display font-bold text-amber-400 text-sm">
                  {currentTrainer.score} XP
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Checkpoints</p>
                <p className="font-display font-bold text-emerald-400 text-sm">
                  {currentTrainer.completedCheckpointIds.length}/5
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Power-ups</p>
                <p className="font-display font-bold text-cyan-400 text-sm">
                  {Object.values(currentTrainer.powerUps).reduce((a, b) => a + b, 0)} items
                </p>
              </div>
            </div>
          )}

          {/* Safety & Location Notice */}
          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/50 flex items-start gap-2 text-xs text-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p>
              <strong>Privacy Assurance:</strong> GPS coordinates are calculated in your browser to check if you are within 50m of campus checkpoints. No location history is uploaded or shared.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-5 h-5" />
            <span>{currentTrainer ? 'Save Profile & Continue' : 'Start Campus Quest'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
