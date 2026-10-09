import React, { useState, useEffect } from 'react';
import { Checkpoint, GeoPosition, PowerUpType, Stage2PopCultureRiddle, TrainerProfile } from '../types';
import { calculateHaversineDistance, formatDistance } from '../utils/geoUtils';
import {
  playCheckpointUnlockSound,
  playClickSound,
  playPenaltyBuzzerSound,
  playPowerUpSound,
} from '../utils/audioUtils';
import {
  generateChallengingRiddle,
  jumbleOptions,
  validateRiddleAnswer,
} from '../utils/riddleGenerator';
import {
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  MapPin,
  Zap,
  Award,
  Compass,
  AlertTriangle,
  Flame,
  Film,
  Music,
  Check,
  ChevronRight,
  Shield,
  HelpCircle,
  AlertOctagon,
  ArrowRight,
  Shuffle,
  Navigation,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  HINT_UNLOCK_PENALTY_POINTS,
  MIN_ATTEMPTS_BEFORE_HINT,
  MIN_ATTEMPTS_BEFORE_OPTIONS,
  WRONG_ANSWER_PENALTY_POINTS,
} from '../config/campusConfig';

interface CheckpointCardProps {
  checkpoint: Checkpoint;
  checkpointNumber: number;
  totalCheckpoints: number;
  isLockedInSequence: boolean;
  previousCheckpointName?: string;
  playerPos: GeoPosition | null;
  trainer: TrainerProfile | null;
  onCompleteCheckpoint: (checkpointId: number, bonusPoints: number, awardedPowerUp?: PowerUpType) => void;
  onDeductPoints: (points: number, reason: string) => void;
  onBreakShield: () => void;
  onUseHintPowerUp: () => boolean; // returns true if consumed
  onOpenBackpack: () => void;
  onNavigateToActive?: () => void;
}

export const CheckpointCard: React.FC<CheckpointCardProps> = ({
  checkpoint,
  checkpointNumber,
  totalCheckpoints,
  isLockedInSequence,
  previousCheckpointName,
  playerPos,
  trainer,
  onCompleteCheckpoint,
  onDeductPoints,
  onBreakShield,
  onUseHintPowerUp,
  onOpenBackpack,
  onNavigateToActive,
}) => {
  // Local Stage Progress (Stage 1 = Location Riddle, Stage 2 = Pop Culture / Brain Teaser Riddle)
  const isCompleted = trainer?.completedCheckpointIds.includes(checkpoint.id);
  const [stage1Passed, setStage1Passed] = useState<boolean>(() =>
    Boolean(isCompleted || trainer?.stage1CompletedIds?.includes(checkpoint.id))
  );

  // Free-text input states
  const [stage1Input, setStage1Input] = useState<string>('');
  const [stage2Input, setStage2Input] = useState<string>('');

  // Attempts counts for Stage 1 and Stage 2
  const [stage1Attempts, setStage1Attempts] = useState<number>(0);
  const [stage2Attempts, setStage2Attempts] = useState<number>(0);

  const [selectedStage1Option, setSelectedStage1Option] = useState<string | null>(null);
  const [selectedStage2Option, setSelectedStage2Option] = useState<string | null>(null);

  // Active Stage 2 riddle (allows pulling from challenging riddle bank & jumbled options)
  const [activeStage2, setActiveStage2] = useState<Stage2PopCultureRiddle>(() => ({
    ...checkpoint.stage2,
    options: jumbleOptions(checkpoint.stage2.options, checkpoint.stage2.answer),
  }));

  // Dual-Requirement state: Riddle Answered + Location Verified
  const [riddleSolvedPendingLocation, setRiddleSolvedPendingLocation] = useState<boolean>(false);

  // Locked hint & attempts state
  const [isHintUnlocked, setIsHintUnlocked] = useState<boolean>(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ msg: string; isError: boolean } | null>(null);
  const [shakeCard, setShakeCard] = useState<boolean>(false);

  // Reset local state when switching checkpoints
  useEffect(() => {
    const completed = trainer?.completedCheckpointIds.includes(checkpoint.id);
    const s1Done = Boolean(completed || trainer?.stage1CompletedIds?.includes(checkpoint.id));
    setStage1Passed(s1Done);
    setStage1Input('');
    setStage2Input('');
    setStage1Attempts(0);
    setStage2Attempts(0);
    setSelectedStage1Option(null);
    setSelectedStage2Option(null);
    setActiveStage2({
      ...checkpoint.stage2,
      options: jumbleOptions(checkpoint.stage2.options, checkpoint.stage2.answer),
    });
    setRiddleSolvedPendingLocation(false);
    setIsHintUnlocked(false);
    setFailedAttempts(0);
    setFeedback(null);
  }, [checkpoint.id, trainer?.completedCheckpointIds]);

  const distance = playerPos
    ? calculateHaversineDistance(playerPos.lat, playerPos.lng, checkpoint.latitude, checkpoint.longitude)
    : null;

  const isInside = distance !== null && distance <= checkpoint.radius;
  const stage1 = checkpoint.stage1;

  // Auto-complete if riddle was already answered and user now enters the geofence
  useEffect(() => {
    if (riddleSolvedPendingLocation && isInside && !isCompleted) {
      finalizeConquest();
    }
  }, [isInside, riddleSolvedPendingLocation, isCompleted]);

  const finalizeConquest = () => {
    playCheckpointUnlockSound();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.65 },
      colors: ['#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#38bdf8'],
    });

    const powerUpPool: PowerUpType[] = ['SPEED_BOOST', 'XP_BOOST', 'SHIELD', 'HINT_REVEAL', 'TIME_BONUS'];
    const droppedPowerUp = powerUpPool[Math.floor(Math.random() * powerUpPool.length)];

    setFeedback({
      msg: `👑 CHECKPOINT CONQUERED! Location verified inside ${checkpoint.radius}m perimeter + correct riddle answer! +${checkpoint.points} XP Awarded! Next clue unlocked!`,
      isError: false,
    });

    setRiddleSolvedPendingLocation(false);
    onCompleteCheckpoint(checkpoint.id, checkpoint.points, droppedPowerUp);
  };

  // Trigger 1 Wrong Answer Penalty (Immediate Whole Team Points Deduction)
  const triggerPenalty = (stageName: string, selectedChoice: string, currentStageAttempts: number) => {
    playPenaltyBuzzerSound();
    const newTotalAttempts = failedAttempts + 1;
    setFailedAttempts(newTotalAttempts);

    // Trigger visual shake
    setShakeCard(true);
    setTimeout(() => setShakeCard(false), 600);

    const attemptsRemainingForOptions = Math.max(0, MIN_ATTEMPTS_BEFORE_OPTIONS - currentStageAttempts);

    let optionUnlockMsg = '';
    if (!stageName.includes('Stage 1')) {
      if (currentStageAttempts >= MIN_ATTEMPTS_BEFORE_OPTIONS) {
        optionUnlockMsg = ' 💡 Multiple-choice options are UNLOCKED below!';
      } else {
        optionUnlockMsg = ` (Options unlock in ${attemptsRemainingForOptions} more attempt${attemptsRemainingForOptions === 1 ? '' : 's'})`;
      }
    }

    if (trainer?.hasShield) {
      onBreakShield();
      setFeedback({
        msg: `🛡️ SHIELD BROKE! Penalty shield absorbed the -${WRONG_ANSWER_PENALTY_POINTS} pts deduction!${optionUnlockMsg}`,
        isError: true,
      });
    } else {
      onDeductPoints(WRONG_ANSWER_PENALTY_POINTS, `Wrong Answer on ${stageName}`);
      setFeedback({
        msg: `❌ WRONG GUESS ("${selectedChoice}")! -${WRONG_ANSWER_PENALTY_POINTS} TEAM POINTS DEDUCTED! Attempt #${currentStageAttempts}.${optionUnlockMsg}`,
        isError: true,
      });
    }
  };

  // Stage 1 Submit Handler (works for typed answer or unlocked option click)
  const handleStage1AnswerSubmit = (submittedText: string) => {
    const trimmed = submittedText.trim();
    if (!trimmed) return;

    playClickSound();
    setSelectedStage1Option(trimmed);

    const stage1Accepted = [
      ...(stage1.acceptedAnswers || []),
      stage1.landmarkRevealed,
      checkpoint.name,
      checkpoint.campusLocationDescription,
    ].filter(Boolean) as string[];

    if (validateRiddleAnswer(trimmed, stage1.answer, stage1Accepted)) {
      playPowerUpSound();
      setStage1Passed(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
      });
      setFeedback({
        msg: `🎯 Stage 1 Cracked! Landmark verified: ${stage1.landmarkRevealed}. Now solve the Stage 2 Challenge Riddle!`,
        isError: false,
      });
    } else {
      const nextAttempts = stage1Attempts + 1;
      setStage1Attempts(nextAttempts);
      triggerPenalty('Stage 1 Location Clue', trimmed, nextAttempts);
    }
  };

  // Stage 2 Submit Handler (works for typed answer or unlocked option click)
  const handleStage2AnswerSubmit = (submittedText: string) => {
    const trimmed = submittedText.trim();
    if (!trimmed) return;

    playClickSound();
    setSelectedStage2Option(trimmed);

    const stage2Accepted = [
      ...(activeStage2.acceptedAnswers || []),
      checkpoint.pokemonName,
    ].filter(Boolean) as string[];

    const isCorrect = validateRiddleAnswer(trimmed, activeStage2.answer, stage2Accepted, true);

    if (!isCorrect) {
      const nextAttempts = stage2Attempts + 1;
      setStage2Attempts(nextAttempts);
      triggerPenalty('Stage 2 Challenge Riddle', trimmed, nextAttempts);
      return;
    }

    // Riddle Answer is CORRECT! Now enforce location check:
    if (!isInside) {
      setRiddleSolvedPendingLocation(true);
      playClickSound();
      setFeedback({
        msg: `🎯 RIDDLE ANSWER CORRECT ("${trimmed}")! Under strict quest rules, LOCATION CHECK IS REQUIRED: Move inside the ${checkpoint.radius}m perimeter of ${checkpoint.name} (Current: ${distance !== null ? formatDistance(distance) : 'Outside'}). Walk inside or simulate location to finalize conquest!`,
        isError: false,
      });
      return;
    }

    // Both Riddle Answer AND Location Check are satisfied!
    finalizeConquest();
  };

  // Explicit Location Verification Trigger
  const handleVerifyLocationCheck = () => {
    playClickSound();
    if (!riddleSolvedPendingLocation) {
      setFeedback({
        msg: `Please solve the Stage 2 riddle question first!`,
        isError: true,
      });
      return;
    }

    if (isInside) {
      finalizeConquest();
    } else {
      playPenaltyBuzzerSound();
      setFeedback({
        msg: `📍 Location Check Failed: You are currently ${distance !== null ? formatDistance(distance) : 'outside the geofence'}. You must be within ${checkpoint.radius}m to conquer this checkpoint!`,
        isError: true,
      });
    }
  };

  // Draw Alternate Riddle from Utility
  const handleDrawAlternateRiddle = () => {
    playClickSound();
    const freshRiddle = generateChallengingRiddle(activeStage2.category);
    setActiveStage2(freshRiddle);
    setSelectedStage2Option(null);
    setStage2Input('');
    setStage2Attempts(0);
    setRiddleSolvedPendingLocation(false);
    setFeedback({
      msg: `🎲 Alternate ${freshRiddle.categoryLabel} challenge riddle drawn! Test your team's wits.`,
      isError: false,
    });
  };

  // Unlock Hint with Mandatory Points Deduction (only after MIN_ATTEMPTS_BEFORE_HINT attempts!)
  const handleUnlockHint = () => {
    if (isHintUnlocked) return;

    if (failedAttempts < MIN_ATTEMPTS_BEFORE_HINT) {
      playPenaltyBuzzerSound();
      setFeedback({
        msg: `🔒 SCOUT HINT LOCKED: Under strict quest rules, your team must make at least ${MIN_ATTEMPTS_BEFORE_HINT} answer attempts before requesting a Scout Hint! (Current: ${failedAttempts}/${MIN_ATTEMPTS_BEFORE_HINT})`,
        isError: true,
      });
      return;
    }

    const currentScore = trainer?.score || 0;
    const confirmMsg = `⚠️ DEDUCT ${HINT_UNLOCK_PENALTY_POINTS} TEAM POINTS to reveal the Scout Hint?\n\nCurrent Team Score: ${currentScore} Points\nScore after deduction: ${Math.max(
      0,
      currentScore - HINT_UNLOCK_PENALTY_POINTS
    )} Points.`;

    if (confirm(confirmMsg)) {
      onDeductPoints(HINT_UNLOCK_PENALTY_POINTS, 'Scout Hint Unlock');
      setIsHintUnlocked(true);
      playClickSound();
      setFeedback({
        msg: `🔍 Scout Hint Unlocked! -${HINT_UNLOCK_PENALTY_POINTS} Team Points deducted from total score.`,
        isError: true,
      });
    }
  };

  const getCategoryIcon = () => {
    if (activeStage2.category === 'MUSIC') return <Music className="w-4 h-4 text-purple-400" />;
    if (activeStage2.category === 'POKEMON_CLASSIC') return <Zap className="w-4 h-4 text-yellow-400" />;
    if (activeStage2.category === 'BRAIN_TEASER') return <Sparkles className="w-4 h-4 text-amber-400" />;
    return <Film className="w-4 h-4 text-rose-400" />;
  };

  // 1. SEQUENCE LOCK BANNER: "CLUE AND QUESTION BOTH SHOULD BE ANSWERED OR ELSE NEXT CLUE WILL NOT BE SHOWN"
  if (isLockedInSequence) {
    return (
      <div className="rounded-3xl border border-red-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/40 p-5 sm:p-7 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500/60 text-rose-300">
                LOCKED IN SEQUENCE
              </span>
              <span className="text-xs text-slate-400 font-bold">
                Checkpoint {checkpointNumber} of {totalCheckpoints}
              </span>
            </div>
            <h3 className="font-display font-extrabold text-xl text-white mt-0.5">
              {checkpoint.pokemonName} Mystery Checkpoint
            </h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/50 text-rose-200 text-xs sm:text-sm leading-relaxed mb-4">
          <p className="font-bold flex items-center gap-2 text-rose-300 text-sm mb-1.5">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>CLUE & TRIALS ARE ENCRYPTED!</span>
          </p>
          <p>
            Under campus quest rules, you must fully conquer Checkpoint {checkpointNumber - 1}{' '}
            {previousCheckpointName ? `("${previousCheckpointName}")` : ''} first!{' '}
            <strong>Both the Location Clue and the Pop-Culture Question must be answered correctly</strong>{' '}
            before this next checkpoint clue and coordinates are revealed!
          </p>
        </div>

        {onNavigateToActive && (
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onNavigateToActive();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
          >
            <span>Navigate to Current Active Checkpoint</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl border transition-all p-4 sm:p-6 shadow-xl ${
        shakeCard ? 'animate-shake' : ''
      } ${
        isCompleted
          ? 'bg-slate-900/95 border-emerald-500/50 shadow-emerald-950/20'
          : isInside
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/40 border-amber-400 ring-2 ring-amber-400/40'
          : 'bg-slate-900/90 border-slate-800'
      }`}
    >
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center p-1.5 shadow-md ${
              isCompleted
                ? 'bg-emerald-500/20 border border-emerald-500/60 text-emerald-400'
                : isInside
                ? 'bg-amber-500/20 border border-amber-400 text-amber-300 animate-pulse'
                : 'bg-slate-800 border border-slate-700 text-slate-400'
            }`}
          >
            <img src="/pokeball.svg" alt="Poké Ball" className="w-full h-full drop-shadow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/30">
                Checkpoint {checkpointNumber} of {totalCheckpoints}
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-950 border border-red-500 text-red-300 animate-pulse">
                HIGH STAKES
              </span>
            </div>
            <h3 className="font-display font-extrabold text-lg sm:text-xl text-white mt-0.5">
              {stage1Passed ? checkpoint.name : `${checkpoint.pokemonName} Mystery Outpost`}
            </h3>
          </div>
        </div>

        {/* Status Pill */}
        <div>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Conquered</span>
            </span>
          ) : isInside ? (
            <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 border border-amber-300 shadow">
              <Unlock className="w-3.5 h-3.5" />
              <span>Geofence Unlocked</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Locked ({distance !== null ? formatDistance(distance) : `${checkpoint.radius}m`})</span>
            </span>
          )}
        </div>
      </div>

      {/* Geofence & Location Dual-Requirement Guide */}
      {!isCompleted && (
        <div
          className={`mb-4 p-3.5 rounded-2xl border text-xs sm:text-sm flex items-start gap-2.5 ${
            isInside
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
          }`}
        >
          {isInside ? (
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
          )}
          <div className="flex-1">
            <p className="font-bold flex items-center justify-between">
              <span>
                {isInside
                  ? '✅ Location Check Passed: Within Geofence!'
                  : `⚡ Location Check: Move within ${checkpoint.radius}m perimeter`}
              </span>
              <span className="font-mono text-xs text-slate-300">
                {distance !== null ? `Distance: ${formatDistance(distance)}` : ''}
              </span>
            </p>
            <p className="text-slate-300 mt-1 leading-relaxed">
              <strong>Requirement:</strong> Both a <em>correct riddle answer</em> and a <em>verified physical location inside the {checkpoint.radius}m circle</em> are required to complete this checkpoint!
            </p>
          </div>
        </div>
      )}

      {/* High-Stakes Penalty Notice */}
      <div className="mb-4 p-3 rounded-2xl bg-red-950/40 border border-red-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-red-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
          <span>
            <strong>HIGH STAKES PENALTY:</strong> 1 Wrong Answer ={' '}
            <strong className="text-red-300 font-mono">-{WRONG_ANSWER_PENALTY_POINTS} TEAM POINTS!</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-slate-300">
            Attempts: <strong className="text-amber-300">{failedAttempts}</strong> / {MIN_ATTEMPTS_BEFORE_HINT}
          </span>
          {trainer?.hasShield && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/30 border border-blue-400 text-blue-300 flex items-center gap-1">
              <Shield className="w-3 h-3 text-blue-400" />
              <span>Shield Active</span>
            </span>
          )}
        </div>
      </div>

      {/* STAGE 1: CAMPUS GEOLOCATION CLUE (Must Solve First!) */}
      <div
        className={`p-4 rounded-2xl border mb-4 transition-all ${
          stage1Passed
            ? 'bg-emerald-950/20 border-emerald-500/40'
            : 'bg-slate-850 border-slate-700/80'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                stage1Passed ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {stage1Passed ? '✓' : '1'}
            </div>
            <h4 className="font-display font-bold text-sm text-white">
              Stage 1: {stage1.riddleTitle}
            </h4>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {stage1Passed ? 'PASSED' : 'REQUIRED FIRST'}
          </span>
        </div>

        {/* Location Poem / Riddle */}
        <blockquote className="italic text-slate-200 font-medium text-xs sm:text-sm border-l-2 border-red-500 pl-3 py-1 my-2 leading-relaxed">
          "{stage1.riddlePoem}"
        </blockquote>

        {/* Stage 1 Question & Typed Answer / Unlocked Options */}
        {!stage1Passed && (
          <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-3 animate-fade-in">
            <p className="text-xs font-bold text-amber-300">
              {stage1.question}
            </p>

            {/* Free-text typed answer input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleStage1AnswerSubmit(stage1Input);
              }}
              className="space-y-1.5"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={stage1Input}
                  onChange={(e) => setStage1Input(e.target.value)}
                  placeholder="Type your campus landmark guess..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shrink-0 shadow transition active:scale-95"
                >
                  <span>Submit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stage 1 Passed Badge */}
        {stage1Passed && (
          <div className="mt-2 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Landmark Solved: {stage1.landmarkRevealed}</span>
          </div>
        )}
      </div>

      {/* STAGE 2: DESI POP-CULTURE & BRAIN TEASER CHALLENGE */}
      <div
        className={`p-4 rounded-2xl border mb-4 transition-all ${
          !stage1Passed
            ? 'bg-slate-900/50 border-slate-800/80 opacity-60'
            : isCompleted
            ? 'bg-emerald-950/20 border-emerald-500/40'
            : 'bg-gradient-to-b from-slate-850 to-indigo-950/40 border-indigo-500/50 shadow-inner'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                isCompleted
                  ? 'bg-emerald-500 text-white'
                  : stage1Passed
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {isCompleted ? '✓' : '2'}
            </div>
            <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
              <span>{activeStage2.badgeEmoji}</span>
              <span>Stage 2: {activeStage2.categoryLabel}</span>
            </h4>
          </div>

          <div className="flex items-center gap-1.5">
            {!isCompleted && stage1Passed && (
              <button
                type="button"
                onClick={handleDrawAlternateRiddle}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition"
                title="Draw another challenging riddle from the bank"
              >
                <Shuffle className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Alternate Riddle</span>
              </button>
            )}
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
              {activeStage2.difficulty} • +{checkpoint.points} XP
            </span>
          </div>
        </div>

        {!stage1Passed ? (
          <p className="text-xs text-slate-400 italic py-2">
            🔒 Locked! You must solve Stage 1 (Location Clue) first before Stage 2 is unlocked.
          </p>
        ) : !isCompleted ? (
          <div className="space-y-3 pt-1 animate-fade-in">
            {/* Pop culture / Brain teaser riddle text */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-medium text-xs sm:text-sm leading-relaxed">
              "{activeStage2.riddleText}"
            </div>

            {/* Free-text typed answer input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleStage2AnswerSubmit(stage2Input);
              }}
              className="space-y-1.5"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={stage2Input}
                  onChange={(e) => setStage2Input(e.target.value)}
                  placeholder="Type your riddle answer..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-400 transition"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shrink-0 shadow transition active:scale-95"
                >
                  <span>Submit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-indigo-300/80 italic flex items-center gap-1 px-1">
                <span>✨ Tip: A 1-word answer matching the answer's words (or 2+ matching words) is accepted!</span>
              </p>
            </form>

            {/* Options lock status vs Unlocked 4 options */}
            {stage2Attempts < MIN_ATTEMPTS_BEFORE_OPTIONS ? (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>
                    Multiple-Choice Options locked: Available only after 3 answer attempts.
                  </span>
                </span>
                <span className="text-[11px] font-mono font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded-md shrink-0">
                  Attempts: {stage2Attempts} / {MIN_ATTEMPTS_BEFORE_OPTIONS}
                </span>
              </div>
            ) : (
              <div className="space-y-2 pt-1 animate-fade-in">
                <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>💡 Lifeline Active (3 attempts reached): Select from the 4 options below or type above:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeStage2.options.map((opt, idx) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleStage2AnswerSubmit(opt)}
                      className="p-3 rounded-xl border bg-slate-900/90 hover:bg-slate-800 border-slate-700 hover:border-amber-400 text-left text-xs sm:text-sm font-semibold text-slate-200 transition flex items-center gap-2.5 active:scale-98"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center border border-slate-700 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* If Riddle is Cracked but Location Check is still pending */}
            {riddleSolvedPendingLocation && !isInside && (
              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-400 text-amber-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 animate-pulse">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Riddle Answer Cracked!</strong> Location check pending: Move within {checkpoint.radius}m of {checkpoint.name} ({distance !== null ? formatDistance(distance) : 'Outside'}).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleVerifyLocationCheck}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 shadow"
                >
                  Re-Check Location
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-emerald-300 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Correct! {activeStage2.answer}</span>
            </p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <strong>Trivia Fact: </strong>
              {activeStage2.explanation}
            </p>
          </div>
        )}
      </div>

      {/* LOCKED SCOUT HINT (Available ONLY after 5 answer attempts & deducting points!) */}
      <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-bold">Scout Landmark Hint:</span>
          </div>

          {!isHintUnlocked ? (
            <div className="flex items-center gap-2">
              {failedAttempts < MIN_ATTEMPTS_BEFORE_HINT ? (
                <button
                  type="button"
                  onClick={handleUnlockHint}
                  className="py-1 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-400 text-xs font-bold flex items-center gap-1.5 transition cursor-not-allowed"
                  title={`Need at least ${MIN_ATTEMPTS_BEFORE_HINT} attempts before hint can be unlocked`}
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Locked (Need {failedAttempts}/{MIN_ATTEMPTS_BEFORE_HINT} Attempts)
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleUnlockHint}
                  className="py-1 px-3 rounded-lg bg-red-600 hover:bg-red-500 border border-red-400 text-white font-bold text-xs flex items-center gap-1.5 transition animate-pulse shadow-md"
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Unlock Scout Hint (-{HINT_UNLOCK_PENALTY_POINTS} Pts)</span>
                </button>
              )}
            </div>
          ) : (
            <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
              HINT UNLOCKED (-{HINT_UNLOCK_PENALTY_POINTS} PTS DEDUCTED)
            </span>
          )}
        </div>

        {isHintUnlocked ? (
          <div className="mt-2.5 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs text-cyan-200 animate-fade-in leading-relaxed">
            <strong>📍 Scout Landmark Guidance: </strong>
            {checkpoint.lockedScoutHint}
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 mt-1.5 italic">
            {failedAttempts < MIN_ATTEMPTS_BEFORE_HINT ? (
              <>
                🔒 Hint locked: Your team must make at least{' '}
                <strong className="text-amber-300">{MIN_ATTEMPTS_BEFORE_HINT} answer attempts</strong>{' '}
                before requesting a hint (Attempts made: {failedAttempts}/{MIN_ATTEMPTS_BEFORE_HINT}).
              </>
            ) : (
              <>
                ⚠️ 5 attempts reached! You may now reveal the Scout Hint by deducting{' '}
                <strong className="text-red-300 font-mono">
                  {HINT_UNLOCK_PENALTY_POINTS} Team Points
                </strong>
                .
              </>
            )}
          </p>
        )}
      </div>

      {/* Real-time Feedback & Penalty Alert Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-bold mb-3 animate-fade-in leading-relaxed ${
            feedback.isError
              ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-lg shadow-rose-950/40'
              : 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-950/40'
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {/* Completed Success Summary */}
      {isCompleted && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Dual Trials Conquered! Location & Riddle Verified!</span>
          </span>
          <span className="font-mono text-emerald-400 font-black">+{checkpoint.points} XP</span>
        </div>
      )}
    </div>
  );
};
