export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type GameMode = 'CLASSIC' | 'WALL_WRAP' | 'TIME_ATTACK' | 'OBSTACLES';

export type DifficultyPreset = 'EASY' | 'NORMAL' | 'HARD' | 'DYNAMIC';

export type SnakeTheme = 'CLASSIC' | 'NEON' | 'SUNSET' | 'GOLDEN' | 'OCEAN' | 'DRAGON' | 'COSMIC';

export type SnakeHat = 'NONE' | 'CROWN' | 'CAP' | 'GLASSES' | 'HEADPHONES' | 'WIZARD';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export interface Food {
  x: number;
  y: number;
  type: 'REGULAR' | 'GOLDEN';
  points: number;
  spawnTime: number;
}

export interface Obstacle {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  isGoogleUser: boolean;
  level: number;
  xp: number;
  totalApples: number;
  totalGames: number;
  title: string;
  createdAt: number;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isGoogleUser?: boolean;
  score: number;
  length: number;
  mode: GameMode;
  difficulty: string;
  timestamp: number;
  rank?: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  description: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  desc: string;
  target: number;
  current: number;
  completed: boolean;
  claimed: boolean;
  rewardXp: number;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number; // 0.0 to 1.0
  musicVolume: number; // 0.0 to 1.0
  selectedTrackId: string;
  vibrationEnabled: boolean;
  wallWrap: boolean;
  difficulty: DifficultyPreset;
  boardSize: number; // e.g. 20 for 20x20, 25 for 25x25
  theme: SnakeTheme;
  hat: SnakeHat;
  gameMode: GameMode;
}

export interface HighScoreRecord {
  classic: number;
  wallWrap: number;
  timeAttack: number;
  obstacles: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  length: number;
  speedMs: number;
  difficultyLabel: string;
  applesEaten: number;
  goldenEaten: number;
  timeRemaining?: number; // for time attack
}

export interface GoogleDriveBackupFile {
  id: string;
  name: string;
  modifiedTime: string;
  size?: string;
  description?: string;
  createdTime?: string;
}

export interface GameBackupPayload {
  version: string;
  timestamp: number;
  appName: string;
  userProfile: UserProfile;
  highScores: HighScoreRecord;
  settings: GameSettings;
  achievements?: Achievement[];
  quests?: DailyQuest[];
  notes?: string;
}
