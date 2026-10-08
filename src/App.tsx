/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  CampusId,
  Checkpoint,
  GeoPosition,
  LeaderboardEntry,
  PowerUpType,
  TeamId,
  TrainerProfile,
} from './types';
import { CAMPUSES, DEFAULT_CHECKPOINTS, TEAMS } from './config/campusConfig';
import {
  calculateHaversineDistance,
  formatDistance,
  isInsideGeofence,
} from './utils/geoUtils';
import {
  loadCheckpointsForCampus,
  generateNewQuestForCampus,
  loadLeaderboard,
  loadTrainerProfile,
  resetCheckpointsForCampus,
  resetTrainerProgress,
  saveCheckpointsForCampus,
  saveTrainerProfile,
} from './utils/storage';
import {
  playCheckpointUnlockSound,
  playClickSound,
  playPowerUpSound,
  playProximityPing,
} from './utils/audioUtils';

// Components
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { CampusMap } from './components/CampusMap';
import { CheckpointCard } from './components/CheckpointCard';
import { TrainerSetupModal } from './components/TrainerSetupModal';
import { PowerUpsModal } from './components/PowerUpsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { AdminPanel } from './components/AdminPanel';
import { DemoToolbar } from './components/DemoToolbar';
import { VictoryModal } from './components/VictoryModal';
import { NewGameModal } from './components/NewGameModal';

import {
  MapPin,
  Trophy,
  Zap,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Play,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // State
  const [trainer, setTrainer] = useState<TrainerProfile | null>(() => loadTrainerProfile());
  const [currentCampusId, setCurrentCampusId] = useState<CampusId>(() => trainer?.currentCampusId || 'TAKSHASHILA');
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(() => loadCheckpointsForCampus(trainer?.currentCampusId || 'TAKSHASHILA'));
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);
  const [playerPos, setPlayerPos] = useState<GeoPosition | null>(null);
  const [gpsActive, setGpsActive] = useState<boolean>(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Modals
  const [isTrainerSetupOpen, setIsTrainerSetupOpen] = useState<boolean>(false);
  const [isPowerUpsOpen, setIsPowerUpsOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isNewGameOpen, setIsNewGameOpen] = useState<boolean>(false);
  const [showGameView, setShowGameView] = useState<boolean>(() => Boolean(trainer?.name));

  // Ref to track already chimed geofences in the current session
  const soundedCheckpointsRef = useRef<Set<number>>(new Set());
  const watchIdRef = useRef<number | null>(null);

  // Set initial selected checkpoint on mount or checkpoints change
  useEffect(() => {
    if (checkpoints.length > 0) {
      if (!selectedCheckpoint || !checkpoints.some(c => c.id === selectedCheckpoint.id)) {
        setSelectedCheckpoint(checkpoints[0]);
      }
    }
  }, [checkpoints]);

  // Persist Trainer changes
  useEffect(() => {
    if (trainer) {
      saveTrainerProfile(trainer);
    }
  }, [trainer]);

  // Campus Switching Handler
  const handleSelectCampus = (campusId: CampusId) => {
    setCurrentCampusId(campusId);
    const loaded = loadCheckpointsForCampus(campusId);
    setCheckpoints(loaded);
    setSelectedCheckpoint(loaded[0] || null);
    soundedCheckpointsRef.current.clear();

    if (trainer) {
      const activeCompleted = trainer.campusProgress?.[campusId] || [];
      const updatedTrainer: TrainerProfile = {
        ...trainer,
        currentCampusId: campusId,
        completedCheckpointIds: activeCompleted,
      };
      setTrainer(updatedTrainer);
    }

    // In demo mode, reposition simulated player near the new campus's first checkpoint
    if (isDemoMode && loaded[0]) {
      setPlayerPos({
        lat: loaded[0].latitude + 0.0005,
        lng: loaded[0].longitude,
        accuracy: 8,
        heading: 180,
        speed: 1.2,
        timestamp: Date.now(),
      });
    }
  };

  // Real Browser GPS Tracking
  useEffect(() => {
    if (isDemoMode) {
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    const handleSuccess = (pos: GeolocationPosition) => {
      setGpsActive(true);
      setGpsAccuracy(pos.coords.accuracy);
      setGpsError(null);
      setPlayerPos({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        heading: pos.coords.heading,
        speed: pos.coords.speed,
        timestamp: pos.timestamp,
      });
    };

    const handleError = (err: GeolocationPositionError) => {
      setGpsActive(false);
      switch (err.code) {
        case err.PERMISSION_DENIED:
          setGpsError('Location permission denied. Please allow location access or try Demo Mode.');
          break;
        case err.POSITION_UNAVAILABLE:
          setGpsError('GPS signal temporarily unavailable. Check if device location is on.');
          break;
        case err.TIMEOUT:
          setGpsError('Location request timed out. Retrying...');
          break;
        default:
          setGpsError('Unable to acquire GPS coordinates.');
      }
    };

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 3000,
    });
    watchIdRef.current = watchId;

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isDemoMode]);

  // Continuous Geofence Detector
  useEffect(() => {
    if (!playerPos || checkpoints.length === 0) return;

    checkpoints.forEach((cp) => {
      const inside = isInsideGeofence(playerPos.lat, playerPos.lng, cp.latitude, cp.longitude, cp.radius);
      if (inside) {
        const isCompleted = trainer?.completedCheckpointIds.includes(cp.id);
        if (!isCompleted && !soundedCheckpointsRef.current.has(cp.id)) {
          soundedCheckpointsRef.current.add(cp.id);
          playProximityPing();

          setSelectedCheckpoint(cp);

          if (trainer && !trainer.unlockedCheckpointIds.includes(cp.id)) {
            setTrainer({
              ...trainer,
              unlockedCheckpointIds: [...trainer.unlockedCheckpointIds, cp.id],
            });
          }
        }
      } else {
        soundedCheckpointsRef.current.delete(cp.id);
      }
    });
  }, [playerPos, checkpoints, trainer]);

  // Compute Nearest Checkpoint & Distance
  const { nearestCheckpoint, distanceToNearest, isInsideNearestGeofence } = useMemo(() => {
    if (!playerPos || checkpoints.length === 0) {
      return {
        nearestCheckpoint: checkpoints[0] || null,
        distanceToNearest: null,
        isInsideNearestGeofence: false,
      };
    }

    let minDistance = Infinity;
    let closest: Checkpoint = checkpoints[0];

    checkpoints.forEach((cp) => {
      const dist = calculateHaversineDistance(playerPos.lat, playerPos.lng, cp.latitude, cp.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        closest = cp;
      }
    });

    const isInside = minDistance <= closest.radius;
    return {
      nearestCheckpoint: closest,
      distanceToNearest: minDistance,
      isInsideNearestGeofence: isInside,
    };
  }, [playerPos, checkpoints]);

  // Handlers
  const handleSaveTrainer = (name: string, team: TeamId) => {
    if (trainer) {
      setTrainer({
        ...trainer,
        name,
        team,
      });
    } else {
      setTrainer({
        name,
        team,
        score: 0,
        xp: 0,
        currentCampusId,
        campusProgress: {
          TAKSHASHILA: [],
          IET_DAVV: [],
        },
        completedCheckpointIds: [],
        unlockedCheckpointIds: [],
        stage1CompletedIds: [],
        powerUps: {
          HINT_REVEAL: 1,
          SPEED_BOOST: 1,
          SHIELD: 0,
          XP_BOOST: 0,
          TIME_BONUS: 0,
        },
        activeMultiplier: 1,
        hasShield: false,
        totalPenaltiesDeducted: 0,
        registeredAt: new Date().toISOString(),
      });
    }
    setShowGameView(true);
  };

  const handleCompleteCheckpoint = (
    checkpointId: number,
    basePoints: number,
    awardedPowerUp?: PowerUpType
  ) => {
    if (!trainer) return;
    if (trainer.completedCheckpointIds.includes(checkpointId)) return;

    const multiplier = trainer.activeMultiplier || 1;
    const finalPoints = basePoints * multiplier;

    const newCompleted = [...trainer.completedCheckpointIds, checkpointId];
    const newUnlocked = Array.from(new Set([...trainer.unlockedCheckpointIds, checkpointId]));

    const currentCampusProgress = trainer.campusProgress || { TAKSHASHILA: [], IET_DAVV: [] };
    const updatedCampusProgress = {
      ...currentCampusProgress,
      [currentCampusId]: Array.from(new Set([...(currentCampusProgress[currentCampusId] || []), checkpointId])),
    };

    // Update power-ups
    const updatedPowerUps = { ...trainer.powerUps };
    if (awardedPowerUp) {
      updatedPowerUps[awardedPowerUp] = (updatedPowerUps[awardedPowerUp] || 0) + 1;
      playPowerUpSound();
    }

    // Check if campus completed (all 5 checkpoints in current campus)
    const isCampusCompleted = newCompleted.length >= checkpoints.length;
    const victoryBonus = isCampusCompleted ? 500 : 0;

    const updatedTrainer: TrainerProfile = {
      ...trainer,
      score: trainer.score + finalPoints + victoryBonus,
      xp: trainer.xp + finalPoints + victoryBonus,
      campusProgress: updatedCampusProgress,
      completedCheckpointIds: newCompleted,
      unlockedCheckpointIds: newUnlocked,
      powerUps: updatedPowerUps,
      activeMultiplier: 1,
    };

    setTrainer(updatedTrainer);

    if (isCampusCompleted) {
      setIsVictoryOpen(true);
    } else {
      const nextIncomplete = checkpoints.find((c) => !newCompleted.includes(c.id));
      if (nextIncomplete) {
        setSelectedCheckpoint(nextIncomplete);
      }
    }
  };

  const handleUsePowerUp = (type: PowerUpType) => {
    if (!trainer) return;
    const currentCount = trainer.powerUps[type] || 0;
    if (currentCount <= 0) return;

    const newPowerUps = {
      ...trainer.powerUps,
      [type]: currentCount - 1,
    };

    let newScore = trainer.score;
    let newMultiplier = trainer.activeMultiplier;
    let newShield = trainer.hasShield;

    if (type === 'SPEED_BOOST') {
      newScore += 150;
      confetti({ particleCount: 30, spread: 45 });
    } else if (type === 'XP_BOOST') {
      newMultiplier = 2;
    } else if (type === 'SHIELD') {
      newShield = true;
    } else if (type === 'TIME_BONUS') {
      newScore += 200;
    }

    setTrainer({
      ...trainer,
      score: newScore,
      powerUps: newPowerUps,
      activeMultiplier: newMultiplier,
      hasShield: newShield,
    });
  };

  const handleDeductPoints = (points: number, _reason: string) => {
    if (!trainer) return;
    setTrainer((prev) => {
      if (!prev) return null;
      const newScore = Math.max(0, prev.score - points);
      const newPenalties = (prev.totalPenaltiesDeducted || 0) + points;
      return {
        ...prev,
        score: newScore,
        totalPenaltiesDeducted: newPenalties,
      };
    });
  };

  const handleBreakShield = () => {
    if (!trainer) return;
    setTrainer((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        hasShield: false,
      };
    });
  };

  const handleUseHintPowerUp = (): boolean => {
    if (!trainer) return false;
    const currentHints = trainer.powerUps.HINT_REVEAL || 0;
    if (currentHints > 0) {
      setTrainer((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          powerUps: {
            ...prev.powerUps,
            HINT_REVEAL: prev.powerUps.HINT_REVEAL - 1,
          },
        };
      });
      return true;
    }
    return false;
  };

  const handleResetAdventure = () => {
    resetTrainerProgress();
    const fresh = generateNewQuestForCampus(currentCampusId);
    setCheckpoints(fresh);
    setTrainer(null);
    setShowGameView(false);
    setSelectedCheckpoint(fresh[0] || null);
    soundedCheckpointsRef.current.clear();
  };

  const handleReplayCampus = () => {
    soundedCheckpointsRef.current.clear();

    // Roll brand new randomized locations from all points of the college, fresh clues, and jumbled options!
    const newFresh = generateNewQuestForCampus(currentCampusId);
    setCheckpoints(newFresh);
    setSelectedCheckpoint(newFresh[0] || null);

    if (trainer) {
      const updatedProgress = {
        ...(trainer.campusProgress || { TAKSHASHILA: [], IET_DAVV: [] }),
        [currentCampusId]: [],
      };
      const updatedTrainer: TrainerProfile = {
        ...trainer,
        campusProgress: updatedProgress,
        completedCheckpointIds: [],
        unlockedCheckpointIds: [],
        stage1CompletedIds: [],
      };
      setTrainer(updatedTrainer);
    }
    confetti({ particleCount: 50, spread: 45 });
  };

  const handleSaveCheckpoints = (updated: Checkpoint[]) => {
    setCheckpoints(updated);
    saveCheckpointsForCampus(currentCampusId, updated);
    if (updated.length > 0 && (!selectedCheckpoint || !updated.some(c => c.id === selectedCheckpoint.id))) {
      setSelectedCheckpoint(updated[0]);
    }
  };

  const handleResetCheckpoints = () => {
    const defaults = resetCheckpointsForCampus(currentCampusId);
    setCheckpoints(defaults);
    setSelectedCheckpoint(defaults[0]);
  };

  // Demo Simulation Actions
  const handleToggleDemoMode = () => {
    const next = !isDemoMode;
    setIsDemoMode(next);
    if (next) {
      const cp1 = checkpoints[0];
      if (cp1) {
        setPlayerPos({
          lat: cp1.latitude + 0.0006, // approx 66m away
          lng: cp1.longitude,
          accuracy: 8,
          heading: 180,
          speed: 1.2,
          timestamp: Date.now(),
        });
      }
      setGpsActive(true);
      setGpsError(null);
    }
  };

  const handleSimulatePosition = (lat: number, lng: number) => {
    setPlayerPos({
      lat,
      lng,
      accuracy: 6,
      heading: 90,
      speed: 1.5,
      timestamp: Date.now(),
    });
    setGpsActive(true);
    setGpsError(null);
  };

  const handleSimulateStepCloser = () => {
    const target = selectedCheckpoint || checkpoints[0];
    if (!target || !playerPos) return;

    const stepLat = playerPos.lat + (target.latitude - playerPos.lat) * 0.35;
    const stepLng = playerPos.lng + (target.longitude - playerPos.lng) * 0.35;

    handleSimulatePosition(stepLat, stepLng);
  };

  const handleSimulateInstantUnlock = () => {
    const target = selectedCheckpoint || checkpoints[0];
    if (!target) return;
    handleSimulatePosition(target.latitude, target.longitude);
  };

  const handleAwardRandomPowerUp = () => {
    if (!trainer) return;
    const pool: PowerUpType[] = ['HINT_REVEAL', 'SPEED_BOOST', 'SHIELD', 'XP_BOOST', 'TIME_BONUS'];
    const randomItem = pool[Math.floor(Math.random() * pool.length)];
    setTrainer({
      ...trainer,
      powerUps: {
        ...trainer.powerUps,
        [randomItem]: (trainer.powerUps[randomItem] || 0) + 1,
      },
    });
  };

  const currentLeaderboard = useMemo(() => {
    return loadLeaderboard(trainer);
  }, [trainer]);

  const activeCampus = CAMPUSES[currentCampusId];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        trainer={trainer}
        currentCampusId={currentCampusId}
        onSelectCampus={handleSelectCampus}
        onOpenTrainerSetup={() => setIsTrainerSetupOpen(true)}
        onOpenPowerUps={() => setIsPowerUpsOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenNewGame={() => setIsNewGameOpen(true)}
        onResetAdventure={handleResetAdventure}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        gpsActive={gpsActive}
        gpsAccuracy={gpsAccuracy}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-5">
        {!showGameView ? (
          <LandingHero
            trainer={trainer}
            currentCampusId={currentCampusId}
            onSelectCampus={handleSelectCampus}
            onStartAdventure={() => {
              if (trainer) {
                setShowGameView(true);
              } else {
                setIsTrainerSetupOpen(true);
              }
            }}
            onJoinTeam={() => setIsTrainerSetupOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onEnableDemoMode={() => {
              setIsDemoMode(true);
              if (!trainer) {
                setTrainer({
                  name: 'Fresher Scout',
                  team: 'FIRE',
                  score: 100,
                  xp: 100,
                  currentCampusId,
                  campusProgress: {
                    TAKSHASHILA: [],
                    IET_DAVV: [],
                  },
                  completedCheckpointIds: [],
                  unlockedCheckpointIds: [],
                  stage1CompletedIds: [],
                  powerUps: {
                    HINT_REVEAL: 2,
                    SPEED_BOOST: 1,
                    SHIELD: 1,
                    XP_BOOST: 1,
                    TIME_BONUS: 0,
                  },
                  activeMultiplier: 1,
                  hasShield: false,
                  totalPenaltiesDeducted: 0,
                  registeredAt: new Date().toISOString(),
                });
              }
              const cp1 = checkpoints[0];
              if (cp1) {
                setPlayerPos({
                  lat: cp1.latitude + 0.0006,
                  lng: cp1.longitude,
                  accuracy: 5,
                  heading: 180,
                  speed: 1.2,
                  timestamp: Date.now(),
                });
              }
              setGpsActive(true);
              setShowGameView(true);
            }}
          />
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* Campus & Trainer HUD Strip */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              {/* Trainer Info */}
              {trainer && (
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl ${
                      TEAMS[trainer.team]?.bgColor
                    } border-2 ${
                      TEAMS[trainer.team]?.borderColor
                    } flex items-center justify-center text-2xl shadow-md cursor-pointer`}
                    onClick={() => setIsTrainerSetupOpen(true)}
                    title="Edit profile"
                  >
                    <span>{TEAMS[trainer.team]?.badgeIcon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display font-extrabold text-base text-white">
                        {trainer.name}
                      </h2>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold border ${
                          TEAMS[trainer.team]?.borderColor
                        }/50 ${TEAMS[trainer.team]?.bgColor} ${
                          TEAMS[trainer.team]?.textColor
                        }`}
                      >
                        {TEAMS[trainer.team]?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-200">
                        {activeCampus.icon} {activeCampus.shortName}:
                      </span>
                      <span>
                        {trainer.completedCheckpointIds.length}/5 Checkpoints
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Campus Selector Quick Switcher */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    playClickSound();
                    handleSelectCampus('TAKSHASHILA');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    currentCampusId === 'TAKSHASHILA'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🏛️</span>
                  <span>Takshashila</span>
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    handleSelectCampus('IET_DAVV');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    currentCampusId === 'IET_DAVV'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>⚙️</span>
                  <span>IET DAVV</span>
                </button>
              </div>

              {/* Score & XP Progress */}
              {trainer && (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      TOTAL XP
                    </p>
                    <p className="font-display font-black text-amber-400 text-lg sm:text-xl leading-tight">
                      {trainer.xp} XP
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-24 sm:w-32">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                      <span>{activeCampus.shortName}</span>
                      <span className="text-emerald-400 font-display">
                        {Math.round((trainer.completedCheckpointIds.length / 5) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-500"
                        style={{
                          width: `${(trainer.completedCheckpointIds.length / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Backpack */}
                  <button
                    onClick={() => {
                      playClickSound();
                      setIsPowerUpsOpen(true);
                    }}
                    className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-amber-400 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <span>🎒 Items</span>
                  </button>

                  {/* Quick New Game / Roll Fresh Places */}
                  <button
                    onClick={() => {
                      playClickSound();
                      setIsNewGameOpen(true);
                    }}
                    className="py-1.5 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                    title="Start a fresh run with new randomized checkpoints selected from all college points"
                  >
                    <span>🎲 New Game (Change Points)</span>
                  </button>
                </div>
              )}
            </div>

            {/* GPS Warning Banner if any */}
            {gpsError && !isDemoMode && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs sm:text-sm flex items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{gpsError}</span>
                </div>
                <button
                  onClick={handleToggleDemoMode}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition"
                >
                  Enable Demo Mode
                </button>
              </div>
            )}

            {/* Live Campus Map Component */}
            <CampusMap
              checkpoints={checkpoints}
              playerPos={playerPos}
              selectedCheckpoint={selectedCheckpoint}
              onSelectCheckpoint={(cp) => setSelectedCheckpoint(cp)}
              trainer={trainer}
              nearestCheckpoint={nearestCheckpoint}
              distanceToNearest={distanceToNearest}
              isInsideNearestGeofence={isInsideNearestGeofence}
              onNavigateToCheckpoint={(cp) => setSelectedCheckpoint(cp)}
              onCenterPlayer={() => {
                if (!gpsActive && !isDemoMode) {
                  handleToggleDemoMode();
                }
              }}
            />

            {/* Active Checkpoint Detail Card */}
            {selectedCheckpoint && (() => {
              const selectedIndex = checkpoints.findIndex((c) => c.id === selectedCheckpoint.id);
              const isLockedInSequence =
                selectedIndex > 0 &&
                !trainer?.completedCheckpointIds.includes(checkpoints[selectedIndex - 1].id);
              const previousCheckpointName =
                selectedIndex > 0 ? checkpoints[selectedIndex - 1].name : undefined;
              const activeCheckpoint =
                checkpoints.find((c) => !trainer?.completedCheckpointIds.includes(c.id)) ||
                checkpoints[0];

              return (
                <CheckpointCard
                  checkpoint={selectedCheckpoint}
                  checkpointNumber={selectedIndex + 1}
                  totalCheckpoints={checkpoints.length}
                  isLockedInSequence={isLockedInSequence}
                  previousCheckpointName={previousCheckpointName}
                  playerPos={playerPos}
                  trainer={trainer}
                  onCompleteCheckpoint={handleCompleteCheckpoint}
                  onDeductPoints={handleDeductPoints}
                  onBreakShield={handleBreakShield}
                  onUseHintPowerUp={handleUseHintPowerUp}
                  onOpenBackpack={() => setIsPowerUpsOpen(true)}
                  onNavigateToActive={() => setSelectedCheckpoint(activeCheckpoint)}
                />
              );
            })()}
          </div>
        )}
      </main>

      {/* Presentation Demo Toolbar */}
      <DemoToolbar
        isOpen={isDemoMode}
        onClose={() => setIsDemoMode(false)}
        checkpoints={checkpoints}
        selectedCheckpoint={selectedCheckpoint}
        onSelectCheckpoint={(cp) => setSelectedCheckpoint(cp)}
        onSimulatePosition={handleSimulatePosition}
        onSimulateStepCloser={handleSimulateStepCloser}
        onSimulateInstantUnlock={handleSimulateInstantUnlock}
        onAwardRandomPowerUp={handleAwardRandomPowerUp}
        onRollNewQuest={handleReplayCampus}
      />

      {/* Floating Demo Launcher when not active */}
      {!isDemoMode && showGameView && (
        <button
          onClick={handleToggleDemoMode}
          className="fixed bottom-4 right-4 z-30 py-2 px-3.5 rounded-full bg-purple-900/90 hover:bg-purple-800 border border-purple-400 text-purple-200 shadow-xl backdrop-blur-sm text-xs font-bold flex items-center gap-1.5 transition hover:scale-105"
          title="Open Demo Testing Controls"
        >
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span>Demo Controls</span>
        </button>
      )}

      {/* Modals */}
      <TrainerSetupModal
        isOpen={isTrainerSetupOpen}
        onClose={() => setIsTrainerSetupOpen(false)}
        currentTrainer={trainer}
        onSaveTrainer={handleSaveTrainer}
      />

      <PowerUpsModal
        isOpen={isPowerUpsOpen}
        onClose={() => setIsPowerUpsOpen(false)}
        trainer={trainer}
        onUsePowerUp={handleUsePowerUp}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={currentLeaderboard}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
        onStartNow={() => {
          if (!trainer) setIsTrainerSetupOpen(true);
          else setShowGameView(true);
        }}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentCampusId={currentCampusId}
        onSelectCampus={handleSelectCampus}
        checkpoints={checkpoints}
        onSaveCheckpoints={handleSaveCheckpoints}
        onResetToDefaults={handleResetCheckpoints}
        playerPos={playerPos}
        trainer={trainer}
        onTeleportPlayer={handleSimulatePosition}
      />

      {trainer && (
        <VictoryModal
          isOpen={isVictoryOpen}
          onClose={() => setIsVictoryOpen(false)}
          trainer={trainer}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onStartNewGame={() => setIsNewGameOpen(true)}
        />
      )}

      {/* New Game / Play Again Modal */}
      <NewGameModal
        isOpen={isNewGameOpen}
        onClose={() => setIsNewGameOpen(false)}
        currentCampusId={currentCampusId}
        trainer={trainer}
        onReplayCampus={handleReplayCampus}
        onSwitchCampus={handleSelectCampus}
        onFullResetTrainer={handleResetAdventure}
      />
    </div>
  );
}
