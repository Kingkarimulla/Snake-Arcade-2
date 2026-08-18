import { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameState,
  GameMode,
  Direction,
  Position,
  Food,
  Obstacle,
  Particle,
  FloatingText,
  GameSettings,
  GameStats,
  HighScoreRecord,
  UserProfile,
  LeaderboardEntry,
  DailyQuest,
  Achievement,
} from './types';
import {
  loadSettings,
  saveSettings,
  loadHighScores,
  saveHighScoreForMode,
  loadUserProfile,
  saveUserProfile,
  loadLeaderboard,
  saveLeaderboardEntry,
  loadQuests,
  saveQuests,
  loadAchievements,
  saveAchievements,
  getTitleForLevel,
  DEFAULT_SETTINGS,
} from './utils/storage';
import { soundManager } from './utils/audio';

// Components
import { LoadingScreen } from './components/LoadingScreen';
import { HUD } from './components/HUD';
import { GameBoard } from './components/GameBoard';
import { MobileDPad } from './components/MobileDPad';
import { StartScreen } from './components/StartScreen';
import { PauseOverlay } from './components/PauseOverlay';
import { GameOverOverlay } from './components/GameOverOverlay';
import { SettingsModal } from './components/SettingsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { JukeboxModal } from './components/JukeboxModal';
import { SkinsModal } from './components/SkinsModal';
import { QuestsModal } from './components/QuestsModal';
import { StatsModal } from './components/StatsModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { GameBackupPayload } from './types';

export default function App() {
  // App Boot & Loading
  const [isLoading, setIsLoading] = useState(true);

  // User Profile & Persistent Data
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(loadLeaderboard);
  const [quests, setQuests] = useState<DailyQuest[]>(loadQuests);
  const [achievements, setAchievements] = useState<Achievement[]>(loadAchievements);

  // Game Settings & High Scores
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [highScores, setHighScores] = useState<HighScoreRecord>(loadHighScores);

  // Modals & Navigation Screens
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [showGoogleAuthModal, setShowGoogleAuthModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showJukeboxModal, setShowJukeboxModal] = useState(false);
  const [showSkinsModal, setShowSkinsModal] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showGoogleDriveModal, setShowGoogleDriveModal] = useState(false);

  // Game Engine State
  const [snake, setSnake] = useState<Position[]>([]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [food, setFood] = useState<Food | null>(null);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [applesEaten, setApplesEaten] = useState(0);
  const [goldenEaten, setGoldenEaten] = useState(0);
  const [lastXpEarned, setLastXpEarned] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [hasStartedMoving, setHasStartedMoving] = useState(false);

  // FX state
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Refs for stable loop callbacks
  const snakeRef = useRef<Position[]>([]);
  const foodRef = useRef<Food | null>(null);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const scoreRef = useRef<number>(0);
  const applesEatenRef = useRef<number>(0);
  const goldenEatenRef = useRef<number>(0);
  const timeRemainingRef = useRef<number>(60);
  const gameStateRef = useRef<GameState>('MENU');
  const hasStartedMovingRef = useRef<boolean>(false);
  const settingsRef = useRef<GameSettings>(settings);

  const inputQueueRef = useRef<Direction[]>([]);
  const currentDirectionRef = useRef<Direction>('RIGHT');
  const lastMovedDirectionRef = useRef<Direction>('RIGHT');
  const gameLoopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeAttackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep refs synchronized
  snakeRef.current = snake;
  foodRef.current = food;
  obstaclesRef.current = obstacles;
  scoreRef.current = score;
  applesEatenRef.current = applesEaten;
  goldenEatenRef.current = goldenEaten;
  timeRemainingRef.current = timeRemaining;
  gameStateRef.current = gameState;
  hasStartedMovingRef.current = hasStartedMoving;
  settingsRef.current = settings;

  // Sync background music state
  useEffect(() => {
    soundManager.setMusicVolume(settings.musicVolume);
    soundManager.setSoundVolume(settings.soundVolume);
    soundManager.setMusic(settings.musicEnabled, settings.selectedTrackId);
    return () => soundManager.stopMusic();
  }, [settings.musicEnabled, settings.selectedTrackId, settings.musicVolume, settings.soundVolume]);

  // Handle settings update
  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  };

  // Profile Updates
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    saveUserProfile(newProfile);

    // If signed in with Google, unlock achievement
    if (newProfile.isGoogleUser) {
      unlockAchievement('ach_google_login');
    }
  };

  // Restore Cloud Save from Google Drive
  const handleRestoreSave = (payload: GameBackupPayload) => {
    if (payload.userProfile) {
      setUserProfile(payload.userProfile);
      saveUserProfile(payload.userProfile);
    }
    if (payload.highScores) {
      setHighScores(payload.highScores);
      try {
        localStorage.setItem('retro_snake_highscores_v2', JSON.stringify(payload.highScores));
      } catch (e) {
        console.error(e);
      }
    }
    if (payload.settings) {
      setSettings(payload.settings);
      saveSettings(payload.settings);
    }
    if (payload.achievements) {
      setAchievements(payload.achievements);
      saveAchievements(payload.achievements);
    }
    if (payload.quests) {
      setQuests(payload.quests);
      saveQuests(payload.quests);
    }
  };

  // Opposites map
  const isOpposite = (d1: Direction, d2: Direction): boolean => {
    return (
      (d1 === 'UP' && d2 === 'DOWN') ||
      (d1 === 'DOWN' && d2 === 'UP') ||
      (d1 === 'LEFT' && d2 === 'RIGHT') ||
      (d1 === 'RIGHT' && d2 === 'LEFT')
    );
  };

  // Queue direction input with intelligent redirect and auto-start
  const queueDirection = useCallback((newDir: Direction) => {
    // If snake hasn't started moving, start moving now!
    if (!hasStartedMovingRef.current) {
      setHasStartedMoving(true);
      hasStartedMovingRef.current = true;
    }

    const queue = inputQueueRef.current;
    const referenceDir = queue.length > 0 ? queue[queue.length - 1] : lastMovedDirectionRef.current;

    let target = newDir;
    // If player inputs 180° into current direction, safely redirect perpendicularly instead of ignoring or dying
    if (isOpposite(target, referenceDir)) {
      if (referenceDir === 'LEFT' || referenceDir === 'RIGHT') {
        target = 'UP';
      } else {
        target = 'RIGHT';
      }
    }

    if (target !== referenceDir) {
      if (queue.length < 2) {
        inputQueueRef.current.push(target);
      }
    }
  }, []);

  // Mode Key Helper
  const getModeKey = (mode: GameMode): keyof HighScoreRecord => {
    switch (mode) {
      case 'WALL_WRAP':
        return 'wallWrap';
      case 'TIME_ATTACK':
        return 'timeAttack';
      case 'OBSTACLES':
        return 'obstacles';
      case 'CLASSIC':
      default:
        return 'classic';
    }
  };

  // Calculate Speed & Difficulty (balanced for comfortable initial reaction & high-speed endgame)
  const getDifficultyStats = useCallback(() => {
    if (settings.difficulty === 'EASY') return { speedMs: 185, label: 'Easy' };
    if (settings.difficulty === 'NORMAL') return { speedMs: 140, label: 'Normal' };
    if (settings.difficulty === 'HARD') return { speedMs: 95, label: 'Hard' };

    // DYNAMIC (Starts at comfortable pace, adapts gradually with score)
    const dynamicSpeed = Math.max(90, 180 - Math.floor(score / 30) * 15);
    return { speedMs: dynamicSpeed, label: 'Dynamic' };
  }, [settings.difficulty, score]);

  // Spawn Food Item
  const spawnFoodItem = useCallback(
    (currentSnake: Position[], currentObstacles: Obstacle[]): Food => {
      const gSize = settings.boardSize;
      let x: number, y: number;
      let valid = false;
      let attempts = 0;

      do {
        x = Math.floor(Math.random() * gSize);
        y = Math.floor(Math.random() * gSize);

        const inSnake = currentSnake.some((s) => s.x === x && s.y === y);
        const inObstacle = currentObstacles.some((o) => o.x === x && o.y === y);

        valid = !inSnake && !inObstacle;
        attempts++;
      } while (!valid && attempts < 500);

      const isGolden = Math.random() < 0.15;
      return {
        x,
        y,
        type: isGolden ? 'GOLDEN' : 'REGULAR',
        points: isGolden ? 30 : 10,
        spawnTime: Date.now(),
      };
    },
    [settings.boardSize]
  );

  // Spawn Obstacle with Guaranteed Safe Zone Around Snake
  const spawnObstacleItem = (
    currentSnake: Position[],
    currentFood: Food | null,
    currentObstacles: Obstacle[]
  ): Obstacle | null => {
    const gSize = settings.boardSize;
    let attempts = 0;
    const head = currentSnake[0];

    while (attempts < 300) {
      const x = Math.floor(Math.random() * gSize);
      const y = Math.floor(Math.random() * gSize);

      // Safe buffer zone around entire snake (at least 3 cells away)
      const isTooCloseToSnake = currentSnake.some((s) => Math.abs(s.x - x) <= 2 && Math.abs(s.y - y) <= 2);
      // Safe runway in front of the head
      const isAheadOfHead = head ? x >= head.x && x <= head.x + 4 && Math.abs(y - head.y) <= 1 : false;
      const inFood = currentFood ? currentFood.x === x && currentFood.y === y : false;
      const inObstacles = currentObstacles.some((o) => o.x === x && o.y === y);

      if (!isTooCloseToSnake && !isAheadOfHead && !inFood && !inObstacles) {
        return { x, y };
      }
      attempts++;
    }
    return null;
  };

  // Particle Explosions
  const spawnFoodParticles = (fx: number, fy: number, isGolden: boolean) => {
    const cellSize = 20;
    const px = (fx + 0.5) * cellSize;
    const py = (fy + 0.5) * cellSize;
    const count = isGolden ? 16 : 10;
    const colors = isGolden
      ? ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff']
      : ['#ef4444', '#f87171', '#fca5a5', '#ffffff'];

    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      newParticles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 3,
        alpha: 1,
        life: 0,
        maxLife: 20 + Math.random() * 15,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  const spawnFloatingText = (fx: number, fy: number, text: string, color: string) => {
    const cellSize = 20;
    const px = (fx + 0.5) * cellSize;
    const py = (fy + 0.5) * cellSize;
    setFloatingTexts((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        x: px,
        y: py,
        text,
        color,
        alpha: 1,
        scale: 1.2,
      },
    ]);
  };

  // Achievements unlocking helper
  const unlockAchievement = (achId: string) => {
    setAchievements((prev) => {
      const updated = prev.map((a) => {
        if (a.id === achId && !a.unlocked) {
          soundManager.playAchievementSound();
          return { ...a, unlocked: true, progress: a.maxProgress, unlockedAt: Date.now() };
        }
        return a;
      });
      saveAchievements(updated);
      return updated;
    });
  };

  // Daily quest progress updater
  const updateQuestProgress = (questId: string, delta: number) => {
    setQuests((prev) => {
      const updated = prev.map((q) => {
        if (q.id === questId && !q.completed) {
          const nextVal = q.current + delta;
          const isDone = nextVal >= q.target;
          return { ...q, current: nextVal, completed: isDone };
        }
        return q;
      });
      saveQuests(updated);
      return updated;
    });
  };

  // Claim Quest Reward
  const handleClaimQuest = (questId: string) => {
    const q = quests.find((item) => item.id === questId);
    if (!q || q.claimed || !q.completed) return;

    const newQuests = quests.map((item) => (item.id === questId ? { ...item, claimed: true } : item));
    setQuests(newQuests);
    saveQuests(newQuests);

    // Award XP
    awardXp(q.rewardXp);
  };

  // Award XP and handle Level Up
  const awardXp = (amount: number) => {
    setUserProfile((prev) => {
      const nextXp = prev.xp + amount;
      const nextLevel = Math.floor(nextXp / 500) + 1;
      const nextTitle = getTitleForLevel(nextLevel);
      const updated = {
        ...prev,
        xp: nextXp,
        level: nextLevel,
        title: nextTitle,
      };
      saveUserProfile(updated);
      return updated;
    });
  };

  // Submit Score to Leaderboard
  const handleSubmitLeaderboardScore = (mode: GameMode, scoreVal: number, snakeLen?: number) => {
    const entry: LeaderboardEntry = {
      id: `lb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: userProfile.id,
      userName: userProfile.name,
      userAvatar: userProfile.avatarUrl,
      isGoogleUser: userProfile.isGoogleUser,
      score: scoreVal,
      length: snakeLen || Math.max(3, Math.floor(scoreVal / 10)),
      mode: mode,
      difficulty: settings.difficulty,
      timestamp: Date.now(),
    };
    const updated = saveLeaderboardEntry(entry);
    setLeaderboard(updated);
  };

  // Start / Restart Game
  const startGame = useCallback(() => {
    soundManager.unlockAudio();
    soundManager.playClickSound(settings.soundEnabled);
    if (settings.musicEnabled) {
      soundManager.setMusic(true, settings.selectedTrackId);
    }

    if (gameLoopTimerRef.current) clearInterval(gameLoopTimerRef.current);
    if (timeAttackTimerRef.current) clearInterval(timeAttackTimerRef.current);

    const gSize = settings.boardSize;
    const startX = Math.floor(gSize / 2);
    const startY = Math.floor(gSize / 2);

    const initialSnake: Position[] = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];

    setSnake(initialSnake);
    snakeRef.current = initialSnake;

    setDirection('RIGHT');
    currentDirectionRef.current = 'RIGHT';
    lastMovedDirectionRef.current = 'RIGHT';
    inputQueueRef.current = [];

    const initialObstacles: Obstacle[] = [];
    if (settings.gameMode === 'OBSTACLES') {
      for (let i = 0; i < 3; i++) {
        const obs = spawnObstacleItem(initialSnake, null, initialObstacles);
        if (obs) initialObstacles.push(obs);
      }
    }
    setObstacles(initialObstacles);
    obstaclesRef.current = initialObstacles;

    // Guaranteed accessible first food directly in path (4 units right)
    const initialFood: Food = {
      x: (startX + 4) % gSize,
      y: startY,
      type: 'REGULAR',
      points: 10,
      spawnTime: Date.now(),
    };
    setFood(initialFood);
    foodRef.current = initialFood;

    setScore(0);
    scoreRef.current = 0;
    setApplesEaten(0);
    applesEatenRef.current = 0;
    setGoldenEaten(0);
    goldenEatenRef.current = 0;
    setTimeRemaining(60);
    timeRemainingRef.current = 60;
    setIsNewHighScore(false);
    setParticles([]);
    setFloatingTexts([]);

    setHasStartedMoving(false);
    hasStartedMovingRef.current = false;
    setGameState('PLAYING');
    gameStateRef.current = 'PLAYING';
  }, [settings, spawnObstacleItem]);

  // Trigger Game Over
  const handleGameOver = useCallback(() => {
    if (gameStateRef.current === 'GAME_OVER') return;

    if (gameLoopTimerRef.current) clearInterval(gameLoopTimerRef.current);
    if (timeAttackTimerRef.current) clearInterval(timeAttackTimerRef.current);

    soundManager.playGameOverSound(settings.soundEnabled);
    soundManager.triggerVibration(settings.vibrationEnabled, 150);

    const modeKey = getModeKey(settings.gameMode);
    const currentBest = highScores[modeKey] || 0;
    const finalScore = scoreRef.current;
    const finalApples = applesEatenRef.current;
    const finalGolden = goldenEatenRef.current;
    const currentSnakeLen = snakeRef.current.length;
    const newRecord = finalScore > currentBest;

    // Calculate XP earned from run (1 XP per score point + bonus)
    const earnedXp = finalScore + finalApples * 5 + finalGolden * 15;
    setLastXpEarned(earnedXp);
    awardXp(earnedXp);

    // Update career stats
    setUserProfile((prev) => {
      const updated = {
        ...prev,
        totalApples: prev.totalApples + finalApples + finalGolden,
        totalGames: prev.totalGames + 1,
      };
      saveUserProfile(updated);
      return updated;
    });

    if (newRecord) {
      const updatedScores = saveHighScoreForMode(modeKey, finalScore);
      setHighScores(updatedScores);
      setIsNewHighScore(true);
      soundManager.playHighScoreSound(settings.soundEnabled);
    }

    // Auto submit to leaderboard if score > 0
    if (finalScore > 0) {
      handleSubmitLeaderboardScore(settings.gameMode, finalScore, currentSnakeLen);
    }

    // Check Achievements & Quests
    if (finalScore >= 300) unlockAchievement('ach_score_300');
    if (currentSnakeLen >= 20) unlockAchievement('ach_length_20');
    if (settings.gameMode === 'TIME_ATTACK' && timeRemainingRef.current <= 0) unlockAchievement('ach_time_attack');

    updateQuestProgress('quest_1', finalApples + finalGolden);
    if (settings.gameMode === 'CLASSIC' && finalScore >= 100) updateQuestProgress('quest_2', 100);
    if (finalGolden >= 3) updateQuestProgress('quest_3', 3);

    setGameState('GAME_OVER');
    gameStateRef.current = 'GAME_OVER';
  }, [highScores, settings]);

  // Exit from in-game to main menu
  const handleExitToMenu = useCallback(() => {
    if (gameLoopTimerRef.current) clearInterval(gameLoopTimerRef.current);
    if (timeAttackTimerRef.current) clearInterval(timeAttackTimerRef.current);
    setGameState('MENU');
    gameStateRef.current = 'MENU';
    setShowSettingsModal(false);
    setHasStartedMoving(false);
    hasStartedMovingRef.current = false;
  }, []);

  // Main Game Tick Step
  const gameStep = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING') return;
    if (!hasStartedMovingRef.current) return; // Wait until player makes first input

    const currentSnake = snakeRef.current;
    if (currentSnake.length === 0) return;

    let targetDir = lastMovedDirectionRef.current;

    // Process queued direction
    while (inputQueueRef.current.length > 0) {
      const nextDir = inputQueueRef.current.shift()!;
      if (!isOpposite(nextDir, lastMovedDirectionRef.current)) {
        targetDir = nextDir;
        break;
      }
    }

    const head = currentSnake[0];
    let newHead: Position = { x: head.x, y: head.y };

    switch (targetDir) {
      case 'UP':
        newHead.y -= 1;
        break;
      case 'DOWN':
        newHead.y += 1;
        break;
      case 'LEFT':
        newHead.x -= 1;
        break;
      case 'RIGHT':
        newHead.x += 1;
        break;
    }

    // Physical 180° anti-suicide safeguard:
    // If candidate newHead lands directly on the second segment (neck), ignore illegal reversal!
    if (currentSnake.length > 1 && newHead.x === currentSnake[1].x && newHead.y === currentSnake[1].y) {
      targetDir = lastMovedDirectionRef.current;
      newHead = { x: head.x, y: head.y };
      switch (targetDir) {
        case 'UP':
          newHead.y -= 1;
          break;
        case 'DOWN':
          newHead.y += 1;
          break;
        case 'LEFT':
          newHead.x -= 1;
          break;
        case 'RIGHT':
          newHead.x += 1;
          break;
      }
    }

    currentDirectionRef.current = targetDir;
    lastMovedDirectionRef.current = targetDir;
    setDirection(targetDir);

    const gSize = settings.boardSize;
    const isWrap = settings.wallWrap || settings.gameMode === 'WALL_WRAP';

    // Wall Collision Check
    if (isWrap) {
      newHead.x = (newHead.x + gSize) % gSize;
      newHead.y = (newHead.y + gSize) % gSize;
    } else {
      if (newHead.x < 0 || newHead.x >= gSize || newHead.y < 0 || newHead.y >= gSize) {
        handleGameOver();
        return;
      }
    }

    // Obstacle Collision Check
    const currentObstacles = obstaclesRef.current;
    const obstacleCollide = currentObstacles.some((o) => o.x === newHead.x && o.y === newHead.y);
    if (obstacleCollide) {
      handleGameOver();
      return;
    }

    // Food Collision Check
    const currentFood = foodRef.current;
    const isEating = currentFood && newHead.x === currentFood.x && newHead.y === currentFood.y;

    // Self Collision Check (ignore tail if moving forward without eating)
    const checkSegments = isEating ? currentSnake : currentSnake.slice(0, currentSnake.length - 1);
    const selfCollide = checkSegments.some((s) => s.x === newHead.x && s.y === newHead.y);
    if (selfCollide) {
      handleGameOver();
      return;
    }

    // Advance Snake
    const updatedSnake = [newHead, ...currentSnake];
    if (!isEating) {
      updatedSnake.pop();
    } else {
      // Snake ate food!
      const isGolden = currentFood.type === 'GOLDEN';
      const points = currentFood.points;

      const nextScore = scoreRef.current + points;
      setScore(nextScore);
      scoreRef.current = nextScore;

      if (isGolden) {
        setGoldenEaten((prev) => {
          const nextVal = prev + 1;
          goldenEatenRef.current = nextVal;
          return nextVal;
        });
        unlockAchievement('ach_golden_5');
      } else {
        setApplesEaten((prev) => {
          const nextVal = prev + 1;
          applesEatenRef.current = nextVal;
          return nextVal;
        });
        unlockAchievement('ach_first_bite');
      }

      soundManager.playEatSound(isGolden, settings.soundEnabled);
      soundManager.triggerVibration(settings.vibrationEnabled, 30);
      spawnFoodParticles(currentFood.x, currentFood.y, isGolden);
      spawnFloatingText(currentFood.x, currentFood.y, `+${points}`, isGolden ? '#f59e0b' : '#10b981');

      // Spawn next food
      const nextFood = spawnFoodItem(updatedSnake, currentObstacles);
      setFood(nextFood);
      foodRef.current = nextFood;

      // In OBSTACLES mode, spawn dynamic hazards
      if (settings.gameMode === 'OBSTACLES') {
        setObstacles((prevObs) => {
          if (prevObs.length < 12 && nextScore % 30 === 0) {
            const newObs = spawnObstacleItem(updatedSnake, nextFood, prevObs);
            if (newObs) {
              const updatedObs = [...prevObs, newObs];
              obstaclesRef.current = updatedObs;
              return updatedObs;
            }
          }
          return prevObs;
        });
      }
    }

    setSnake(updatedSnake);
    snakeRef.current = updatedSnake;

    // Update Particles & Floating Text Animations
    setParticles((prev) =>
      prev
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          alpha: 1 - p.life / p.maxLife,
          life: p.life + 1,
        }))
        .filter((p) => p.life < p.maxLife)
    );

    setFloatingTexts((prev) =>
      prev
        .map((ft) => ({
          ...ft,
          y: ft.y - 0.8,
          alpha: ft.alpha - 0.03,
        }))
        .filter((ft) => ft.alpha > 0)
    );
  }, [settings, handleGameOver, spawnFoodItem]);

  // Main Game Loop Timer
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (gameLoopTimerRef.current) clearInterval(gameLoopTimerRef.current);
      return;
    }

    const { speedMs } = getDifficultyStats();
    gameLoopTimerRef.current = setInterval(gameStep, speedMs);

    return () => {
      if (gameLoopTimerRef.current) clearInterval(gameLoopTimerRef.current);
    };
  }, [gameState, gameStep, getDifficultyStats]);

  // Time Attack Countdown Timer Loop
  useEffect(() => {
    if (gameState !== 'PLAYING' || settings.gameMode !== 'TIME_ATTACK') {
      if (timeAttackTimerRef.current) clearInterval(timeAttackTimerRef.current);
      return;
    }

    timeAttackTimerRef.current = setInterval(() => {
      if (!hasStartedMovingRef.current) return; // Only count down when player is actively playing
      setTimeRemaining((prev) => {
        const next = prev - 1;
        timeRemainingRef.current = next;
        if (next <= 0) {
          handleGameOver();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timeAttackTimerRef.current) clearInterval(timeAttackTimerRef.current);
    };
  }, [gameState, settings.gameMode, handleGameOver]);

  // Keyboard Event Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          queueDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          queueDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          queueDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          queueDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          if (gameState === 'PLAYING') {
            soundManager.playClickSound(settings.soundEnabled);
            setGameState('PAUSED');
          } else if (gameState === 'PAUSED') {
            soundManager.playClickSound(settings.soundEnabled);
            setGameState('PLAYING');
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (gameState === 'MENU' || gameState === 'GAME_OVER') {
            startGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, queueDirection, startGame, settings.soundEnabled]);

  // Window blur auto-pause
  useEffect(() => {
    const handleBlur = () => {
      if (gameState === 'PLAYING') {
        setGameState('PAUSED');
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [gameState]);

  const modeKey = getModeKey(settings.gameMode);
  const currentHighScore = highScores[modeKey] || 0;
  const { speedMs, label: difficultyLabel } = getDifficultyStats();

  const stats: GameStats = {
    score,
    highScore: Math.max(score, currentHighScore),
    length: snake.length,
    speedMs,
    difficultyLabel,
    applesEaten,
    goldenEaten,
    timeRemaining: settings.gameMode === 'TIME_ATTACK' ? timeRemaining : undefined,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center p-2 sm:p-4 font-sans overflow-x-hidden select-none">
      {/* Initial Animated Loading Screen with Retro Logo */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Upgraded Start Screen / Homepage */}
      {gameState === 'MENU' && !isLoading && (
        <StartScreen
          settings={settings}
          highScores={highScores}
          userProfile={userProfile}
          quests={quests}
          onStartGame={startGame}
          onOpenHowToPlay={() => setShowHowToPlayModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
          onOpenJukebox={() => setShowJukeboxModal(true)}
          onOpenSkins={() => setShowSkinsModal(true)}
          onOpenQuests={() => setShowQuestsModal(true)}
          onOpenStats={() => setShowStatsModal(true)}
          onOpenAuth={() => setShowGoogleAuthModal(true)}
          onOpenDrive={() => setShowGoogleDriveModal(true)}
          onModeChange={(mode) => handleUpdateSettings({ gameMode: mode })}
          onToggleSound={() => handleUpdateSettings({ soundEnabled: !settings.soundEnabled })}
          onToggleMusic={() => {
            const next = !settings.musicEnabled;
            handleUpdateSettings({ musicEnabled: next });
            soundManager.setMusic(next, settings.selectedTrackId);
          }}
        />
      )}

      {/* Main Game In-Play Layout */}
      {(gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'GAME_OVER') && !isLoading && (
        <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-between flex-1">
          {/* Top HUD */}
          <HUD
            stats={stats}
            settings={settings}
            gameState={gameState}
            onPauseToggle={() => setGameState(gameState === 'PLAYING' ? 'PAUSED' : 'PLAYING')}
            onSoundToggle={() => handleUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            onMusicToggle={() => {
              const next = !settings.musicEnabled;
              handleUpdateSettings({ musicEnabled: next });
              soundManager.setMusic(next, settings.selectedTrackId);
            }}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenHelp={() => setShowHowToPlayModal(true)}
          />

          {/* Game Canvas Board */}
          <GameBoard
            gridSize={settings.boardSize}
            snake={snake}
            food={food}
            obstacles={obstacles}
            particles={particles}
            floatingTexts={floatingTexts}
            direction={direction}
            settings={settings}
            onSwipe={queueDirection}
            isPaused={gameState === 'PAUSED'}
            hasStartedMoving={hasStartedMoving}
          />

          {/* Mobile Directional D-Pad */}
          <MobileDPad
            currentDirection={direction}
            onDirectionChange={queueDirection}
            soundEnabled={settings.soundEnabled}
            vibrationEnabled={settings.vibrationEnabled}
          />
        </div>
      )}

      {/* Modals & Overlays */}
      {gameState === 'PAUSED' && (
        <PauseOverlay
          onResume={() => setGameState('PLAYING')}
          onRestart={startGame}
          onOpenSettings={() => setShowSettingsModal(true)}
          onMainMenu={() => setGameState('MENU')}
        />
      )}

      {gameState === 'GAME_OVER' && (
        <GameOverOverlay
          score={score}
          highScore={stats.highScore}
          isNewHighScore={isNewHighScore}
          applesEaten={applesEaten}
          goldenEaten={goldenEaten}
          xpEarned={lastXpEarned}
          theme={settings.theme}
          onPlayAgain={startGame}
          onMainMenu={() => setGameState('MENU')}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
        />
      )}

      {/* Google Auth & Profile Modal */}
      {showGoogleAuthModal && (
        <GoogleAuthModal
          profile={userProfile}
          onUpdateProfile={handleUpdateProfile}
          onClose={() => setShowGoogleAuthModal(false)}
        />
      )}

      {/* Global Leaderboard Modal */}
      {showLeaderboardModal && (
        <LeaderboardModal
          entries={leaderboard}
          userProfile={userProfile}
          highScores={highScores}
          currentMode={settings.gameMode}
          onClose={() => setShowLeaderboardModal(false)}
          onSubmitScore={(mode, scoreVal) => handleSubmitLeaderboardScore(mode, scoreVal)}
        />
      )}

      {/* Jukebox & Songs Modal */}
      {showJukeboxModal && (
        <JukeboxModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowJukeboxModal(false)}
        />
      )}

      {/* Skins & Wardrobe Modal */}
      {showSkinsModal && (
        <SkinsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowSkinsModal(false)}
        />
      )}

      {/* Daily Quests & Trophies Modal */}
      {showQuestsModal && (
        <QuestsModal
          quests={quests}
          achievements={achievements}
          userProfile={userProfile}
          onClaimQuest={handleClaimQuest}
          onClose={() => setShowQuestsModal(false)}
        />
      )}

      {/* Career Stats Modal */}
      {showStatsModal && (
        <StatsModal
          highScores={highScores}
          profile={userProfile}
          onClose={() => setShowStatsModal(false)}
        />
      )}

      {/* Google Drive Cloud Saves Modal */}
      {showGoogleDriveModal && (
        <GoogleDriveModal
          userProfile={userProfile}
          highScores={highScores}
          settings={settings}
          quests={quests}
          achievements={achievements}
          onClose={() => setShowGoogleDriveModal(false)}
          onRestoreSave={handleRestoreSave}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetSettings={handleResetSettings}
          onClose={() => setShowSettingsModal(false)}
          onOpenJukebox={() => {
            setShowSettingsModal(false);
            setShowJukeboxModal(true);
          }}
          onOpenSkins={() => {
            setShowSettingsModal(false);
            setShowSkinsModal(true);
          }}
          onOpenGoogleDrive={() => {
            setShowSettingsModal(false);
            setShowGoogleDriveModal(true);
          }}
          onExitGame={handleExitToMenu}
          isInGame={gameState !== 'MENU'}
        />
      )}

      {/* How to Play Modal */}
      {showHowToPlayModal && <HowToPlayModal onClose={() => setShowHowToPlayModal(false)} />}
    </div>
  );
}
