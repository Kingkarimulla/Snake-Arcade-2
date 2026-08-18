import {
  GameSettings,
  HighScoreRecord,
  UserProfile,
  LeaderboardEntry,
  GameMode,
  DailyQuest,
  Achievement,
} from '../types';

const SETTINGS_KEY = 'snake_game_settings_v2';
const HIGH_SCORES_KEY = 'snake_game_high_scores_v2';
const USER_PROFILE_KEY = 'snake_game_user_profile_v2';
const LEADERBOARD_KEY = 'snake_game_leaderboard_v2';
const QUESTS_KEY = 'snake_game_quests_v2';
const ACHIEVEMENTS_KEY = 'snake_game_achievements_v2';

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: false,
  soundVolume: 0.85,
  musicVolume: 0.8,
  selectedTrackId: 'cyber_viper',
  vibrationEnabled: true,
  wallWrap: true,
  difficulty: 'DYNAMIC',
  boardSize: 20,
  theme: 'CLASSIC',
  hat: 'NONE',
  gameMode: 'CLASSIC',
};

export const DEFAULT_HIGH_SCORES: HighScoreRecord = {
  classic: 0,
  wallWrap: 0,
  timeAttack: 0,
  obstacles: 0,
};

export const DEFAULT_PROFILE: UserProfile = {
  id: 'guest_' + Math.random().toString(36).substring(2, 9),
  name: 'Retro Viper',
  email: '',
  avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80',
  isGoogleUser: false,
  level: 1,
  xp: 0,
  totalApples: 0,
  totalGames: 0,
  title: 'Snake Cadet',
  createdAt: Date.now(),
};

const SEED_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lb_1',
    userId: 'user_apex',
    userName: 'ApexPredator',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    isGoogleUser: true,
    score: 840,
    length: 84,
    mode: 'CLASSIC',
    difficulty: 'DYNAMIC',
    timestamp: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: 'lb_2',
    userId: 'user_serpent',
    userName: 'CyberSerpent',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    isGoogleUser: true,
    score: 720,
    length: 72,
    mode: 'CLASSIC',
    difficulty: 'HARD',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'lb_3',
    userId: 'user_pixel',
    userName: 'PixelCobra_99',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    isGoogleUser: true,
    score: 610,
    length: 61,
    mode: 'CLASSIC',
    difficulty: 'DYNAMIC',
    timestamp: Date.now() - 1000 * 60 * 60 * 36,
  },
  {
    id: 'lb_4',
    userId: 'user_wrap',
    userName: 'PortalMaster',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    isGoogleUser: true,
    score: 950,
    length: 95,
    mode: 'WALL_WRAP',
    difficulty: 'DYNAMIC',
    timestamp: Date.now() - 1000 * 60 * 60 * 18,
  },
  {
    id: 'lb_5',
    userId: 'user_speedy',
    userName: 'FlashTail',
    userAvatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=120&auto=format&fit=crop&q=80',
    isGoogleUser: true,
    score: 480,
    length: 48,
    mode: 'TIME_ATTACK',
    difficulty: 'HARD',
    timestamp: Date.now() - 1000 * 60 * 60 * 8,
  },
  {
    id: 'lb_6',
    userId: 'user_hazard',
    userName: 'HazardDodger',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    isGoogleUser: true,
    score: 530,
    length: 53,
    mode: 'OBSTACLES',
    difficulty: 'DYNAMIC',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
  },
];

export const DEFAULT_QUESTS: DailyQuest[] = [
  {
    id: 'quest_1',
    title: 'Apple Feaster',
    desc: 'Eat 25 apples across any game mode',
    target: 25,
    current: 0,
    completed: false,
    claimed: false,
    rewardXp: 150,
  },
  {
    id: 'quest_2',
    title: 'Century Score',
    desc: 'Achieve a score of 100 or higher in Classic mode',
    target: 100,
    current: 0,
    completed: false,
    claimed: false,
    rewardXp: 200,
  },
  {
    id: 'quest_3',
    title: 'Golden Gourmet',
    desc: 'Collect 3 rare Golden Apples in one run',
    target: 3,
    current: 0,
    completed: false,
    claimed: false,
    rewardXp: 250,
  },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_bite',
    title: 'First Bite',
    desc: 'Eat your very first apple',
    icon: '🍎',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'ach_length_20',
    title: 'Long Boa',
    desc: 'Reach a snake length of 20 segments',
    icon: '🐍',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
  },
  {
    id: 'ach_score_300',
    title: 'Arcade Champion',
    desc: 'Reach a score of 300+ in any mode',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 300,
  },
  {
    id: 'ach_golden_5',
    title: 'Midas Touch',
    desc: 'Eat 5 Golden Apples in total',
    icon: '✨',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'ach_time_attack',
    title: 'Speed Demon',
    desc: 'Survive 60 seconds in Time Attack mode',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'ach_google_login',
    title: 'Cloud Master',
    desc: 'Sign in with Google to sync your rank',
    icon: '🌐',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
];

// Helper to determine Title from Level
export function getTitleForLevel(level: number): string {
  if (level >= 20) return 'Snake Grandmaster 👑';
  if (level >= 15) return 'Diamond Cobra 💎';
  if (level >= 10) return 'Emerald Python 🐍';
  if (level >= 5) return 'Viper Striker ⚡';
  return 'Snake Cadet 🎮';
}

// Settings
export function loadSettings(): GameSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        // Default wall wrap to true initially
        wallWrap: parsed.wallWrap !== undefined ? parsed.wallWrap : true,
        // Ensure music volume is audible if it was stored at the old quiet level (< 0.5)
        musicVolume: parsed.musicVolume && parsed.musicVolume >= 0.5 ? parsed.musicVolume : 0.8,
        soundVolume: parsed.soundVolume && parsed.soundVolume >= 0.5 ? parsed.soundVolume : 0.85,
      };
    }
  } catch (e) {
    console.warn('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings', e);
  }
}

// High Scores
export function loadHighScores(): HighScoreRecord {
  try {
    const data = localStorage.getItem(HIGH_SCORES_KEY);
    if (data) {
      return { ...DEFAULT_HIGH_SCORES, ...JSON.parse(data) };
    }
  } catch (e) {
    console.warn('Failed to load high scores', e);
  }
  return DEFAULT_HIGH_SCORES;
}

export function saveHighScoreForMode(modeKey: keyof HighScoreRecord, score: number): HighScoreRecord {
  const current = loadHighScores();
  if (score > (current[modeKey] || 0)) {
    const updated = { ...current, [modeKey]: score };
    try {
      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save high scores', e);
    }
    return updated;
  }
  return current;
}

// User Profile
export function loadUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(USER_PROFILE_KEY);
    if (data) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
    }
  } catch (e) {
    console.warn('Failed to load profile', e);
  }
  return DEFAULT_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save profile', e);
  }
}

// Leaderboard
export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load leaderboard', e);
  }
  return SEED_LEADERBOARD;
}

export function saveLeaderboardEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
  const current = loadLeaderboard();
  // Filter duplicate if same user in same mode with lower score
  const filtered = current.filter(
    (e) => !(e.userId === entry.userId && e.mode === entry.mode && e.score <= entry.score)
  );
  const updated = [...filtered, entry].sort((a, b) => b.score - a.score);
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save leaderboard', e);
  }
  return updated;
}

// Quests
export function loadQuests(): DailyQuest[] {
  try {
    const data = localStorage.getItem(QUESTS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('Failed to load quests', e);
  }
  return DEFAULT_QUESTS;
}

export function saveQuests(quests: DailyQuest[]): void {
  try {
    localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
  } catch (e) {
    console.warn('Failed to save quests', e);
  }
}

// Achievements
export function loadAchievements(): Achievement[] {
  try {
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('Failed to load achievements', e);
  }
  return DEFAULT_ACHIEVEMENTS;
}

export function saveAchievements(achs: Achievement[]): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achs));
  } catch (e) {
    console.warn('Failed to save achievements', e);
  }
}
