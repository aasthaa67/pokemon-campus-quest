import React, { useState } from 'react';
import { X, Trophy, Medal, Users, Sparkles, Filter, ShieldCheck } from 'lucide-react';
import { LeaderboardEntry, TeamId } from '../types';
import { TEAMS } from '../config/campusConfig';
import { playClickSound } from '../utils/audioUtils';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<TeamId | 'ALL'>('ALL');

  if (!isOpen) return null;

  const filteredEntries = selectedTeam === 'ALL'
    ? entries
    : entries.filter((e) => e.team === selectedTeam);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl relative">
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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/50 p-2 flex items-center justify-center text-yellow-400 shadow-md">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              DAVV Campus Leaderboard
            </h2>
            <p className="text-xs text-slate-400">
              Fresher Orientation Quest Standings • Real-time Local Sync
            </p>
          </div>
        </div>

        {/* Prototype Banner Notice */}
        <div className="mb-4 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Orientation Demo Data (Mock seniors + your live local score)</span>
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300">
            PROTOTYPE
          </span>
        </div>

        {/* Team Filter Pills */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => {
              playClickSound();
              setSelectedTeam('ALL');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedTeam === 'ALL'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Teams ({entries.length})
          </button>
          <button
            onClick={() => {
              playClickSound();
              setSelectedTeam('FIRE');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              selectedTeam === 'FIRE'
                ? 'bg-red-500 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>🔥</span>
            <span>Team Fire</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              setSelectedTeam('AQUA');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              selectedTeam === 'AQUA'
                ? 'bg-cyan-500 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>💧</span>
            <span>Team Aqua</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              setSelectedTeam('LEAF');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              selectedTeam === 'LEAF'
                ? 'bg-emerald-500 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>🍃</span>
            <span>Team Leaf</span>
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider font-display">
                <th className="py-2.5 px-3 text-center">Rank</th>
                <th className="py-2.5 px-3">Trainer</th>
                <th className="py-2.5 px-3">Campus</th>
                <th className="py-2.5 px-3">Team</th>
                <th className="py-2.5 px-3 text-center">Checkpoints</th>
                <th className="py-2.5 px-3 text-right">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEntries.map((entry, index) => {
                const team = TEAMS[entry.team];
                const isTop1 = index === 0;
                const isTop2 = index === 1;
                const isTop3 = index === 2;

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      entry.isCurrentTrainer
                        ? 'bg-amber-500/15 font-semibold text-white ring-1 ring-amber-400/40'
                        : 'hover:bg-slate-800/40 text-slate-200'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-3 text-center font-display font-black text-sm">
                      {isTop1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-slate-950 shadow">
                          🥇
                        </span>
                      ) : isTop2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-950 shadow">
                          🥈
                        </span>
                      ) : isTop3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white shadow">
                          🥉
                        </span>
                      ) : (
                        <span className="text-slate-400">#{index + 1}</span>
                      )}
                    </td>

                    {/* Trainer & Title */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>{entry.name}</span>
                            {entry.isCurrentTrainer && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black uppercase">
                                YOU
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">{entry.badgeTitle}</p>
                        </div>
                      </div>
                    </td>

                    {/* Campus */}
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        entry.campusId === 'IET_DAVV'
                          ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300'
                          : 'bg-red-950/60 border-red-500/40 text-red-300'
                      }`}>
                        {entry.campusId === 'IET_DAVV' ? '⚙️ IET DAVV' : '🏛️ Takshashila'}
                      </span>
                    </td>

                    {/* Team */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${team?.borderColor}/40 ${team?.bgColor} ${team?.textColor}`}
                      >
                        <span>{team?.badgeIcon}</span>
                        <span>{team?.name}</span>
                      </span>
                    </td>

                    {/* Checkpoints */}
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold text-xs">
                        {entry.checkpointsCompleted}/5
                      </span>
                    </td>

                    {/* XP */}
                    <td className="py-3 px-3 text-right font-display font-black text-amber-400 text-sm">
                      {entry.xp.toLocaleString()} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
          <span>Backend Note: Code structured for zero-effort Firebase Firestore binding.</span>
          <span>DAVV Campus 2026</span>
        </div>
      </div>
    </div>
  );
};
