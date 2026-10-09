import React from 'react';
import { Volume2, VolumeX, Backpack, Trophy, HelpCircle, Shield, Sparkles, Navigation, RotateCcw, MapPin, Play } from 'lucide-react';
import { CAMPUSES, TEAMS } from '../config/campusConfig';
import { CampusId, TrainerProfile } from '../types';
import { isAudioMuted, setAudioMuted, playClickSound } from '../utils/audioUtils';

interface NavbarProps {
  trainer: TrainerProfile | null;
  currentCampusId: CampusId;
  onSelectCampus: (campusId: CampusId) => void;
  onOpenTrainerSetup: () => void;
  onOpenPowerUps: () => void;
  onOpenLeaderboard: () => void;
  onOpenHowToPlay: () => void;
  onOpenAdmin: () => void;
  onOpenNewGame: () => void;
  onResetAdventure: () => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  gpsActive: boolean;
  gpsAccuracy: number | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  trainer,
  currentCampusId,
  onSelectCampus,
  onOpenTrainerSetup,
  onOpenPowerUps,
  onOpenLeaderboard,
  onOpenHowToPlay,
  onOpenAdmin,
  onOpenNewGame,
  onResetAdventure,
  isDemoMode,
  onToggleDemoMode,
  gpsActive,
  gpsAccuracy,
}) => {
  const [muted, setMuted] = React.useState(isAudioMuted());

  const handleToggleSound = () => {
    const nextState = !muted;
    setMuted(nextState);
    setAudioMuted(nextState);
    if (!nextState) playClickSound();
  };

  const totalPowerUps = trainer
    ? Object.values(trainer.powerUps).reduce((a, b) => a + b, 0)
    : 0;

  const team = trainer ? TEAMS[trainer.team] : null;
  const campus = CAMPUSES[currentCampusId];
  const completedInCampus = trainer?.campusProgress?.[currentCampusId]?.length || 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClickSound();
              onOpenTrainerSetup();
            }}
            className="flex items-center gap-2 text-left group transition"
            title="Trainer Info"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800 border-2 border-red-500/80 flex items-center justify-center p-1 shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <img src="/pokeball.svg" alt="Poké Ball" className="w-full h-full drop-shadow" />
              {trainer && (
                <span className="absolute -bottom-1 -right-1 text-xs px-1 rounded-full bg-amber-500 text-slate-950 font-bold border border-slate-900">
                  {completedInCampus}/5
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm sm:text-base tracking-wide text-white group-hover:text-amber-400 transition-colors">
                  POKÉMON QUEST
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/40 uppercase">
                  DAVV
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden xs:block">
                {trainer
                  ? `${trainer.name}${trainer.rollNumber ? ` (#${trainer.rollNumber})` : ''} • ${team?.name}`
                  : 'Orientation Quest'}
              </p>
            </div>
          </button>
        </div>

        {/* Campus Switcher Pill (Center) */}
        <div className="flex items-center bg-slate-950/90 p-0.5 sm:p-1 rounded-xl border border-slate-700/80 shadow-inner">
          <button
            onClick={() => {
              playClickSound();
              onSelectCampus('TAKSHASHILA');
            }}
            className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              currentCampusId === 'TAKSHASHILA'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to Takshashila Main Campus"
          >
            <span>🏛️</span>
            <span className="hidden xs:inline">Takshashila</span>
            <span className="xs:hidden">Takshila</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              onSelectCampus('IET_DAVV');
            }}
            className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              currentCampusId === 'IET_DAVV'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to IET DAVV Engineering Campus"
          >
            <span>⚙️</span>
            <span>IET DAVV</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* New Game Button */}
          {trainer && (
            <button
              onClick={() => {
                playClickSound();
                onOpenNewGame();
              }}
              className="py-1 px-2.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-bold text-xs flex items-center gap-1 transition shadow-sm"
              title="Start a New Game or Replay Campus"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Game</span>
            </button>
          )}

          {/* Quick Demo Mode Toggle */}
          <button
            onClick={() => {
              playClickSound();
              onToggleDemoMode();
            }}
            className={`text-xs px-2 sm:px-2.5 py-1 rounded-full border transition flex items-center gap-1 font-semibold ${
              isDemoMode
                ? 'bg-purple-600/40 text-purple-200 border-purple-400 shadow-sm shadow-purple-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-purple-400 hover:text-purple-300'
            }`}
            title="Toggle Demo Mode for simulation and presentations"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">{isDemoMode ? 'Demo Active' : 'Demo'}</span>
          </button>

          {/* Trainer Backpack / Power-ups */}
          {trainer && (
            <button
              onClick={() => {
                playClickSound();
                onOpenPowerUps();
              }}
              className="relative p-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-amber-400 transition"
              title="Trainer Bag & Power-Ups"
            >
              <Backpack className="w-4 h-4" />
              {totalPowerUps > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {totalPowerUps}
                </span>
              )}
            </button>
          )}

          {/* Leaderboard button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenLeaderboard();
            }}
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-yellow-400 text-slate-200 hover:text-yellow-400 transition"
            title="Campus Leaderboard"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* How to Play */}
          <button
            onClick={() => {
              playClickSound();
              onOpenHowToPlay();
            }}
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-cyan-400 transition"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition"
            title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Admin / Organizer Controls */}
          <button
            onClick={() => {
              playClickSound();
              onOpenAdmin();
            }}
            className="py-1 px-2.5 rounded-full bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-500/60 hover:border-indigo-400 text-indigo-300 font-bold text-xs flex items-center gap-1.5 transition shadow-sm hover:scale-105"
            title="Organizer Controls • Add & Edit Checkpoints"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xs:inline">Organizer</span>
          </button>
        </div>
      </div>
    </header>
  );
};
