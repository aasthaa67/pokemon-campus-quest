import React from 'react';
import { Compass, Users, Trophy, BookOpen, Sparkles, MapPin, Play, Award, Zap, ShieldAlert, Building2, Cpu } from 'lucide-react';
import { CAMPUSES, TEAMS } from '../config/campusConfig';
import { CampusId, TrainerProfile } from '../types';
import { playClickSound } from '../utils/audioUtils';

interface LandingHeroProps {
  trainer: TrainerProfile | null;
  currentCampusId: CampusId;
  onSelectCampus: (campusId: CampusId) => void;
  onStartAdventure: () => void;
  onJoinTeam: () => void;
  onOpenLeaderboard: () => void;
  onOpenHowToPlay: () => void;
  onOpenAdmin: () => void;
  onEnableDemoMode: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  trainer,
  currentCampusId,
  onSelectCampus,
  onStartAdventure,
  onJoinTeam,
  onOpenLeaderboard,
  onOpenHowToPlay,
  onOpenAdmin,
  onEnableDemoMode,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 opacity-5 pointer-events-none">
          <img src="/pokeball.svg" alt="" className="w-full h-full rotate-12" />
        </div>
      </div>

      <div className="relative z-10 max-w-3xl w-full text-center flex flex-col items-center">
        {/* Event Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-red-500/40 text-red-300 text-xs sm:text-sm font-semibold mb-5 shadow-sm shadow-red-500/20">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>DAVV FRESHER'S ORIENTATION 2026</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400 font-bold">2 DUAL CAMPUSES</span>
        </div>

        {/* Central Poké Ball Emblem */}
        <div className="relative mb-3 group cursor-pointer" onClick={() => { playClickSound(); onStartAdventure(); }}>
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 p-2 border-2 border-red-500/50 shadow-2xl shadow-red-500/30 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
            <img src="/pokeball.svg" alt="Poké Ball" className="w-full h-full drop-shadow-xl" />
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow whitespace-nowrap">
            ALL COLLEGE POINTS • CHANGES EVERY GAME
          </span>
        </div>

        {/* Main Title */}
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight text-white mb-2 uppercase drop-shadow-sm">
          POKÉMON <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300">CAMPUS QUEST</span>
        </h1>

        {/* Subtitle */}
        <p className="font-display text-lg sm:text-2xl font-bold text-amber-300/95 tracking-wide mb-3">
          Gotta Catch 'Em All – DAVV Edition
        </p>

        {/* Description */}
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
          Embark on a real-world GPS clue hunt across Devi Ahilya Vishwavidyalaya.
          Select your campus ground, walk to secret landmarks, unlock geofenced riddles,
          and become the ultimate Campus Pokémon Champion!
        </p>

        {/* Campus Selection Cards (Two Campuses: Takshashila & IET DAVV) */}
        <div className="w-full max-w-xl mb-6">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2.5 font-display">
            Select Your Quest Campus Ground
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Takshashila Campus Card */}
            <div
              onClick={() => {
                playClickSound();
                onSelectCampus('TAKSHASHILA');
              }}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                currentCampusId === 'TAKSHASHILA'
                  ? 'bg-red-950/40 border-red-500 ring-2 ring-red-500/50 shadow-lg shadow-red-950/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-2xl">🏛️</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentCampusId === 'TAKSHASHILA'
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {currentCampusId === 'TAKSHASHILA' ? 'SELECTED' : 'SELECT'}
                </span>
              </div>
              <h3 className="font-display font-bold text-white text-base">
                Takshashila Campus
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
                Main University Grounds: Admin Foyer, Canteen, Central Library & Sports Arena.
              </p>
              <div className="mt-2 text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                <span>📍 5 Checkpoints • Pikachu & Charmander</span>
              </div>
            </div>

            {/* IET DAVV Campus Card */}
            <div
              onClick={() => {
                playClickSound();
                onSelectCampus('IET_DAVV');
              }}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                currentCampusId === 'IET_DAVV'
                  ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-950/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-2xl">⚙️</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentCampusId === 'IET_DAVV'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {currentCampusId === 'IET_DAVV' ? 'SELECTED' : 'SELECT'}
                </span>
              </div>
              <h3 className="font-display font-bold text-white text-base">
                IET DAVV Campus
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
                Engineering & Tech Grounds: Block A, Central Workshop, M-Block Labs & Incubation.
              </p>
              <div className="mt-2 text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                <span>📍 5 Checkpoints • Jolteon & Mewtwo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mb-6">
          <button
            onClick={() => {
              playClickSound();
              onStartAdventure();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 group transition hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
            <span>{trainer ? `Explore ${CAMPUSES[currentCampusId]?.shortName}` : 'Start Adventure'}</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onJoinTeam();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/80 text-white font-bold text-base shadow-md flex items-center justify-center gap-2 transition hover:-translate-y-0.5 active:translate-y-0"
          >
            <Users className="w-5 h-5 text-amber-400" />
            <span>{trainer ? `Team: ${TEAMS[trainer.team]?.name}` : 'Join Team'}</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onOpenLeaderboard();
            }}
            className="w-full py-3 px-4 rounded-xl bg-slate-850/80 hover:bg-slate-800 border border-slate-700/80 hover:border-yellow-400/60 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>Campus Leaderboard</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onOpenHowToPlay();
            }}
            className="w-full py-3 px-4 rounded-xl bg-slate-850/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400/60 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>How to Play & Rules</span>
          </button>
        </div>

        {/* Quick Demo Simulator CTA */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <button
            onClick={() => {
              playClickSound();
              onEnableDemoMode();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/40 border border-purple-500/50 text-purple-200 hover:bg-purple-800/50 text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Indoor Presentation? Launch Demo Simulation</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onOpenAdmin();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>Admin Coordinates Config</span>
          </button>
        </div>

        {/* Safety & Location Disclaimer */}
        <div className="text-center text-xs text-slate-400 max-w-lg flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>
            Requires browser location to detect geofences on campus. Works on mobile with zero server tracking.
          </span>
        </div>
      </div>
    </div>
  );
};
