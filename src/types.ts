/**
 * Pokémon Campus Quest – Type Definitions
 * Designed for clean maintainability and easy understanding for college freshers.
 */

export type CampusId = 'TAKSHASHILA' | 'IET_DAVV';

export interface CampusLandmarkPoint {
  name: string;
  category: string;
  icon: string;
  lat: number;
  lng: number;
  description: string;
}

export interface CampusConfig {
  id: CampusId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: string;
  center: {
    lat: number;
    lng: number;
    zoom: number;
  };
  boundary?: [number, number][];
  landmarkExplorerPoints?: CampusLandmarkPoint[];
  checkpoints: Checkpoint[];
}

export type TeamId = 'FIRE' | 'AQUA' | 'LEAF';

export interface TeamInfo {
  id: TeamId;
  name: string;
  motto: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeIcon: string;
  starterPokemon: string;
  starterSprite: string;
  description: string;
}

export interface Stage1LocationRiddle {
  riddleTitle: string;
  riddlePoem: string; // Tough, rhyming / witty clue
  question: string; // Verification question to crack the location
  options: string[]; // 4 options (unlocked after 3 attempts)
  answer: string;
  acceptedAnswers?: string[]; // Flexible synonyms/aliases for typed answers
  landmarkRevealed: string;
}

export interface Stage2PopCultureRiddle {
  category: 'BOLLYWOOD' | 'MUSIC' | 'POKEMON_CLASSIC' | 'BRAIN_TEASER' | 'STUDENT_RIDDLE';
  categoryLabel: string;
  badgeEmoji: string;
  difficulty: 'MEDIUM' | 'HARD';
  riddleText: string; // Tough & witty challenge riddle
  options: string[]; // 4 tricky options (unlocked after 3 attempts)
  answer: string;
  acceptedAnswers?: string[]; // Flexible synonyms/aliases for typed answers
  explanation: string;
}

export interface Checkpoint {
  id: number;
  campusId?: CampusId;
  name: string;
  pokemonName: string;
  pokemonType: 'Electric' | 'Fire' | 'Water' | 'Grass' | 'Normal' | 'Psychic';
  latitude: number;
  longitude: number;
  radius: number; // in meters (default 50)
  points: number; // base points
  
  // Mandatory 2-Stage Challenge
  stage1: Stage1LocationRiddle;
  stage2: Stage2PopCultureRiddle;
  lockedScoutHint: string; // Locked behind point deduction or 5 failed attempts!
  campusLocationDescription: string;
  
  // Legacy compatibility fallbacks if needed
  clue?: string;
  scoutHint?: string;
  directHint?: string;
  difficulty?: 'EASY' | 'MEDIUM';
}

export type PowerUpType = 
  | 'HINT_REVEAL'
  | 'SPEED_BOOST'
  | 'SHIELD'
  | 'XP_BOOST'
  | 'TIME_BONUS';

export interface PowerUp {
  id: string;
  type: PowerUpType;
  name: string;
  description: string;
  icon: string;
  color: string;
  count: number;
}

export interface TrainerPrivacySettings {
  hideRollNumberOnLeaderboard: boolean;
  shareTeamAffiliation: boolean;
}

export interface TrainerProfile {
  name: string;
  rollNumber: string; // Mandatory student enrollment / roll number for campus quest privacy & participation
  privacySettings?: TrainerPrivacySettings;
  team: TeamId;
  score: number;
  xp: number;
  currentCampusId: CampusId;
  campusProgress: Record<CampusId, number[]>; // checkpoint IDs completed per campus
  completedCheckpointIds: number[]; // active campus completed checkpoints
  unlockedCheckpointIds: number[]; // reached geofence but maybe hasn't finished riddle
  stage1CompletedIds: number[]; // checkpoint IDs where Stage 1 (location) is solved
  powerUps: Record<PowerUpType, number>;
  activeMultiplier: number; // e.g. 2x if XP boost active
  hasShield: boolean;
  totalPenaltiesDeducted: number;
  registeredAt: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  rollNumber?: string;
  hideRollNumber?: boolean;
  team: TeamId;
  xp: number;
  campusId?: CampusId;
  checkpointsCompleted: number;
  badgeTitle: string;
  isCurrentTrainer?: boolean;
}

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy?: number;
  heading?: number | null;
  speed?: number | null;
  timestamp: number;
}
