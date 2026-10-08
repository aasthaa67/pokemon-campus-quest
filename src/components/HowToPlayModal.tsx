import React from 'react';
import { X, BookOpen, MapPin, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, Navigation } from 'lucide-react';
import { playClickSound } from '../utils/audioUtils';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartNow: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  onStartNow,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'Choose Trainer Name & Team',
      desc: 'Pick your identity and align with Team Fire 🔥, Team Aqua 💧, or Team Leaf 🍃.',
    },
    {
      num: 2,
      title: 'Allow Browser Location Permission',
      desc: 'Grant GPS access when prompted. This lets the app measure your distance to campus landmarks in real time.',
    },
    {
      num: 3,
      title: 'Open the Campus Map',
      desc: 'Inspect the 5 Poké Ball markers placed across DAVV Takshashila campus.',
    },
    {
      num: 4,
      title: 'Walk Toward a Checkpoint',
      desc: 'Follow the distance counter and compass guidance pointing to the nearest landmark.',
    },
    {
      num: 5,
      title: 'Enter the 50m Geofence',
      desc: 'Step within the 50-meter circular perimeter around the landmark.',
    },
    {
      num: 6,
      title: 'Type Your Answer First (Options Locked)',
      desc: 'Clues do not spoon-feed options! You must type your answer. Multiple-choice options are locked and will only unlock after 3 answer attempts as a lifeline.',
    },
    {
      num: 7,
      title: 'Solve Clue & Enter 50m Geofence',
      desc: 'Both a correct answer and verified physical presence within the 50-meter circle are required to conquer the checkpoint and earn XP!',
    },
    {
      num: 8,
      title: 'Visit All 5 Checkpoints',
      desc: 'Conquer Pikachu Point, Charmander Camp, Squirtle Station, Bulbasaur Base, and Poké Ball Arena.',
    },
    {
      num: 9,
      title: 'Become Campus Pokémon Champion!',
      desc: 'Achieve the highest XP score, top the orientation leaderboard, and earn the DAVV Champion badge!',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl relative">
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
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/50 p-2 flex items-center justify-center text-cyan-400 shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              Trainer Field Manual
            </h2>
            <p className="text-xs text-slate-400">
              How to Play • Rules of Engagement • Safety Protocol
            </p>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3 mb-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/50 text-red-400 font-display font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {step.num}
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-sm">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Safety & Campus Conduct Reminders */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2 mb-6">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider font-display">
            <AlertTriangle className="w-4 h-4" />
            <span>Campus Safety & Etiquette</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
            <li>Keep your eyes on the road and surroundings when walking across campus.</li>
            <li>Do not enter restricted faculty rooms, labs, or off-limit construction zones.</li>
            <li>All checkpoints are located in open, safe student-accessible common areas.</li>
            <li>Drink water and team up with your fresher peers!</li>
          </ul>
        </div>

        {/* Location Privacy Guarantee */}
        <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/40 flex items-start gap-2.5 text-xs text-blue-200 mb-6">
          <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-blue-300">Privacy & GPS Usage Guarantee</p>
            <p className="mt-0.5 text-slate-300">
              Your location is processed entirely inside your phone's browser using client-side JavaScript. No tracking cookies or remote GPS logs are stored.
            </p>
          </div>
        </div>

        {/* Start Action */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
            onStartNow();
          }}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition"
        >
          <Sparkles className="w-5 h-5" />
          <span>I'm Ready! Let's Go</span>
        </button>
      </div>
    </div>
  );
};
