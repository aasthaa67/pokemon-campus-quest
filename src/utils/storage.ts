import { CampusId, Checkpoint, LeaderboardEntry, PowerUpType, TrainerProfile } from '../types';
import { CAMPUSES, INITIAL_MOCK_LEADERBOARD, TAKSHASHILA_CHECKPOINTS, IET_DAVV_CHECKPOINTS } from '../config/campusConfig';
import { generateCampusQuest } from './questGenerator';

const STORAGE_KEYS = {
  TRAINER_PROFILE: 'davv_pokemon_trainer_profile',
  CHECKPOINTS_PREFIX: 'davv_pokemon_checkpoints_',
  LEADERBOARD: 'davv_pokemon_leaderboard',
  CURRENT_CAMPUS: 'davv_pokemon_current_campus',
};

export const INITIAL_TRAINER_PROFILE: TrainerProfile = {
  name: '',
  team: 'FIRE',
  score: 0,
  xp: 0,
  currentCampusId: 'TAKSHASHILA',
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
};

/**
 * Load Trainer Profile from localStorage
 */
export function loadTrainerProfile(): TrainerProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRAINER_PROFILE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.name) return null;

    const currentCampusId: CampusId = parsed.currentCampusId || 'TAKSHASHILA';
    const campusProgress: Record<CampusId, number[]> = parsed.campusProgress || {
      TAKSHASHILA: parsed.completedCheckpointIds || [],
      IET_DAVV: [],
    };

    return {
      ...INITIAL_TRAINER_PROFILE,
      ...parsed,
      currentCampusId,
      campusProgress,
      completedCheckpointIds: campusProgress[currentCampusId] || parsed.completedCheckpointIds || [],
    };
  } catch (e) {
    console.error('Failed to parse trainer profile from localStorage:', e);
    return null;
  }
}

/**
 * Save Trainer Profile to localStorage
 */
export function saveTrainerProfile(profile: TrainerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRAINER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save trainer profile:', e);
  }
}

/**
 * Load Checkpoints for a specific campus (from localStorage if custom configured, or defaults)
 */
export function loadCheckpointsForCampus(campusId: CampusId): Checkpoint[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.CHECKPOINTS_PREFIX}${campusId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 5) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(`Failed to load custom checkpoints for ${campusId}:`, e);
  }
  // Generate a dynamic quest with randomized landmark places, clues, and jumbled options
  const fresh = generateCampusQuest(campusId);
  saveCheckpointsForCampus(campusId, fresh);
  return fresh;
}

/**
 * Generates and saves a brand new quest for the campus (places, clues & riddles change!)
 */
export function generateNewQuestForCampus(campusId: CampusId): Checkpoint[] {
  const fresh = generateCampusQuest(campusId);
  saveCheckpointsForCampus(campusId, fresh);
  return fresh;
}

/**
 * Save Checkpoints for a specific campus
 */
export function saveCheckpointsForCampus(campusId: CampusId, checkpoints: Checkpoint[]): void {
  try {
    localStorage.setItem(`${STORAGE_KEYS.CHECKPOINTS_PREFIX}${campusId}`, JSON.stringify(checkpoints));
  } catch (e) {
    console.error(`Failed to save checkpoints for ${campusId}:`, e);
  }
}

/**
 * Reset Checkpoints for a specific campus back to fresh randomized landmarks
 */
export function resetCheckpointsForCampus(campusId: CampusId): Checkpoint[] {
  try {
    localStorage.removeItem(`${STORAGE_KEYS.CHECKPOINTS_PREFIX}${campusId}`);
  } catch (e) {
    console.error(e);
  }
  return generateNewQuestForCampus(campusId);
}

/**
 * Load Leaderboard (initial mock entries + current trainer)
 */
export function loadLeaderboard(currentTrainer?: TrainerProfile | null): LeaderboardEntry[] {
  let list: LeaderboardEntry[] = INITIAL_MOCK_LEADERBOARD;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    }
  } catch (e) {
    console.error('Failed to load leaderboard:', e);
  }

  // If player has a profile, merge or update their standing
  if (currentTrainer && currentTrainer.name) {
    const existingIndex = list.findIndex(e => e.id === 'trainer-me');
    const totalCompleted = Object.values(currentTrainer.campusProgress || {}).reduce(
      (acc, ids) => acc + (ids?.length || 0),
      0
    ) || currentTrainer.completedCheckpointIds.length;

    const myEntry: LeaderboardEntry = {
      id: 'trainer-me',
      name: `${currentTrainer.name} (You)`,
      team: currentTrainer.team,
      campusId: currentTrainer.currentCampusId,
      xp: currentTrainer.xp,
      checkpointsCompleted: totalCompleted,
      badgeTitle: getTrainerTitle(currentTrainer.xp, totalCompleted, currentTrainer.currentCampusId),
      isCurrentTrainer: true,
    };

    if (existingIndex >= 0) {
      list[existingIndex] = myEntry;
    } else {
      list = [...list, myEntry];
    }
  }

  // Sort descending by XP, then by checkpoints completed
  return [...list].sort((a, b) => {
    if (b.xp !== a.xp) return b.xp - a.xp;
    return b.checkpointsCompleted - a.checkpointsCompleted;
  });
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save leaderboard:', e);
  }
}

export function getTrainerTitle(xp: number, completedCount: number, campusId: CampusId = 'TAKSHASHILA'): string {
  if (completedCount >= 10) return '👑 Grand DAVV Dual-Campus Champion';
  if (completedCount >= 5) {
    return campusId === 'IET_DAVV' ? '⚙️ IET Tech Champion' : '🏛️ Takshashila Champion';
  }
  if (xp >= 700) return '🔥 Ace Trainer';
  if (xp >= 300) return '⚡ Gym Challenger';
  return '🌱 Fresher Scout';
}

/**
 * Complete reset of player adventure
 */
export function resetTrainerProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TRAINER_PROFILE);
    const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    if (raw) {
      const parsed: LeaderboardEntry[] = JSON.parse(raw);
      const filtered = parsed.filter(e => e.id !== 'trainer-me');
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(filtered));
    }
  } catch (e) {
    console.error('Failed to reset adventure:', e);
  }
}
