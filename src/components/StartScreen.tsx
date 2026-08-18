import React from 'react';
import {
  Play,
  HelpCircle,
  Settings,
  Trophy,
  Shield,
  Clock,
  AlertTriangle,
  Zap,
  Music,
  Palette,
  Target,
  BarChart3,
  Sparkles,
  Volume2,
  VolumeX,
  ShieldCheck,
  Disc3,
  User,
  HardDrive,
} from 'lucide-react';
import { GameMode, GameSettings, HighScoreRecord, UserProfile, DailyQuest } from '../types';
import { MUSIC_TRACKS, soundManager } from '../utils/audio';
import { THEME_UI_STYLES } from '../utils/theme';

interface StartScreenProps {
  settings: GameSettings;
  highScores: HighScoreRecord;
  userProfile: UserProfile;
  quests: DailyQuest[];
  onStartGame: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onOpenLeaderboard: () => void;
  onOpenJukebox: () => void;
  onOpenSkins: () => void;
  onOpenQuests: () => void;
  onOpenStats: () => void;
  onOpenAuth: () => void;
  onOpenDrive: () => void;
  onModeChange: (mode: GameMode) => void;
  onToggleSound: () => void;
  onToggleMusic?: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  settings,
  highScores,
  userProfile,
  quests,
  onStartGame,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenLeaderboard,
  onOpenJukebox,
  onOpenSkins,
  onOpenQuests,
  onOpenStats,
  onOpenAuth,
  onOpenDrive,
  onModeChange,
  onToggleSound,
  onToggleMusic,
}) => {
  const currentTrack = MUSIC_TRACKS.find((t) => t.id === settings.selectedTrackId) || MUSIC_TRACKS[0];
  const pendingQuests = quests.filter((q) => q.completed && !q.claimed).length;
  const themeStyle = THEME_UI_STYLES[settings.theme] || THEME_UI_STYLES.CLASSIC;

  const modes: {
    key: GameMode;
    label: string;
    desc: string;
    icon: React.ReactNode;
    highScoreKey: keyof HighScoreRecord;
    badgeColor: string;
    activeBorder: string;
    tagColor: string;
  }[] = [
    {
      key: 'CLASSIC',
      label: 'Classic',
      desc: 'Authentic Snake with borders',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      highScoreKey: 'classic',
      badgeColor: 'border-emerald-500/40 text-emerald-400',
      activeBorder: 'border-emerald-400 ring-emerald-400/40 bg-emerald-950/60 shadow-emerald-500/20',
      tagColor: 'text-emerald-400',
    },
    {
      key: 'WALL_WRAP',
      label: 'Wall Wrap',
      desc: 'Seamless edge wrapping',
      icon: <Shield className="w-4 h-4 text-cyan-400" />,
      highScoreKey: 'wallWrap',
      badgeColor: 'border-cyan-500/40 text-cyan-400',
      activeBorder: 'border-cyan-400 ring-cyan-400/40 bg-cyan-950/60 shadow-cyan-500/20',
      tagColor: 'text-cyan-400',
    },
    {
      key: 'TIME_ATTACK',
      label: 'Time Attack',
      desc: '60s adrenaline rush',
      icon: <Clock className="w-4 h-4 text-rose-400" />,
      highScoreKey: 'timeAttack',
      badgeColor: 'border-rose-400/40 text-rose-300',
      activeBorder: 'border-rose-400 ring-rose-400/40 bg-rose-950/60 shadow-rose-500/20',
      tagColor: 'text-rose-400',
    },
    {
      key: 'OBSTACLES',
      label: 'Obstacles',
      desc: 'Avoid evolving hazards',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      highScoreKey: 'obstacles',
      badgeColor: 'border-amber-400/40 text-amber-300',
      activeBorder: 'border-amber-400 ring-amber-400/40 bg-amber-950/60 shadow-amber-500/20',
      tagColor: 'text-amber-400',
    },
  ];

  return (
    <div
      id="arcade-home-screen"
      className="w-full max-w-xl mx-auto my-auto p-2 sm:p-4 flex flex-col items-center text-center select-none"
    >
      {/* Top Bar: User Profile & Music / Audio Controls */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 px-1">
        {/* User Profile Pill */}
        <button
          id="home-profile-pill-btn"
          onClick={() => {
            soundManager.playClickSound(settings.soundEnabled);
            onOpenAuth();
          }}
          className="flex items-center gap-2.5 py-1.5 px-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-800/90 transition-all text-left shadow-lg cursor-pointer group"
        >
          <div className="relative">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-xl object-cover border-2 border-emerald-400"
            />
            {userProfile.isGoogleUser && (
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-500 border border-slate-950 flex items-center justify-center">
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-slate-100 group-hover:text-emerald-300 transition-colors truncate max-w-[90px] sm:max-w-[120px]">
                {userProfile.name}
              </span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold font-mono">
                Lv.{userProfile.level}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 leading-none font-medium">
              {userProfile.isGoogleUser ? 'Google Sync' : 'Tap to Sign In'}
            </span>
          </div>
        </button>

        {/* Music Jukebox & Sound FX Bar */}
        <div className="flex items-center gap-1.5">
          {/* Google Drive Quick Button */}
          <button
            id="home-drive-btn"
            onClick={() => {
              soundManager.playClickSound(settings.soundEnabled);
              onOpenDrive();
            }}
            title="Google Drive Cloud Saves & Sync"
            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-400 hover:bg-slate-800/90 transition-all text-xs font-bold text-slate-200 shadow-lg cursor-pointer group"
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-[11px] text-emerald-300">Drive Cloud</span>
          </button>

          {/* Jukebox Quick Widget */}
          <button
            id="home-jukebox-pill-btn"
            onClick={() => {
              soundManager.playClickSound(settings.soundEnabled);
              onOpenJukebox();
            }}
            className="flex items-center gap-2 py-1.5 px-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400 hover:bg-slate-800/90 transition-all text-xs font-bold text-slate-200 shadow-lg cursor-pointer group"
          >
            <Disc3
              className={`w-4 h-4 text-cyan-400 ${
                settings.musicEnabled ? 'animate-spin' : 'opacity-70'
              }`}
            />
            <span className="truncate max-w-[80px] sm:max-w-[110px] text-left text-xs font-medium text-slate-200 group-hover:text-cyan-300">
              {currentTrack.title}
            </span>
          </button>

          {/* Direct Music Play/Mute Button */}
          {onToggleMusic && (
            <button
              id="home-music-toggle-btn"
              onClick={() => {
                soundManager.playClickSound(settings.soundEnabled);
                onToggleMusic();
              }}
              title={settings.musicEnabled ? 'Pause Synth Music' : 'Play Synth Music'}
              className={`w-8 h-8 rounded-2xl border flex items-center justify-center transition-all shadow-md cursor-pointer ${
                settings.musicEnabled
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900/90 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              <Music className={`w-4 h-4 ${settings.musicEnabled ? 'animate-pulse' : ''}`} />
            </button>
          )}

          {/* Quick Sound Mute Toggle */}
          <button
            id="home-sound-toggle-btn"
            onClick={onToggleSound}
            title={settings.soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className="w-8 h-8 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400 text-slate-300 hover:text-amber-300 flex items-center justify-center transition-all shadow-md cursor-pointer"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Main Hero Card with Dynamic Theme-Adaptive Multi-Color Glow */}
      <div className="w-full bg-slate-900/95 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Dynamic Glowing Multi-Color Aura Backdrops based on active theme */}
        <div className={`absolute -top-24 -left-24 w-64 h-64 ${themeStyle.aura1} rounded-full blur-3xl pointer-events-none transition-all duration-500`} />
        <div className={`absolute -bottom-24 -right-24 w-64 h-64 ${themeStyle.aura2} rounded-full blur-3xl pointer-events-none transition-all duration-500`} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Hero Title & Animated Logo */}
        <div className="flex flex-col items-center mb-5 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${themeStyle.logoGradient} p-0.5 shadow-lg transition-all duration-500`}>
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center border border-slate-800">
                <span className="text-2xl animate-bounce" role="img" aria-label="snake icon">
                  🐍
                </span>
              </div>
            </div>

            <h1 className={`text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r ${themeStyle.homeTitleGradient} bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500`}>
              SNAKE ARCADE
            </h1>
          </div>

          <p className="text-slate-400 text-xs sm:text-sm font-medium">
            Eat food • Grow longer • Climb global leaderboard
          </p>
        </div>

        {/* Primary Start Game CTA - Theme-reactive Radiant Electric Arcade Button */}
        <div className="mb-5 relative z-10">
          <button
            id="start-game-main-btn"
            onClick={onStartGame}
            className={`w-full py-4 sm:py-4.5 px-6 rounded-2xl bg-gradient-to-r ${themeStyle.playBtnGradient} ${themeStyle.playBtnHover} ${themeStyle.playBtnText} font-black text-lg sm:text-xl tracking-widest uppercase ${themeStyle.playBtnShadow} ${themeStyle.playBtnBorder} border active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer group`}
          >
            <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
            PLAY NOW
          </button>
        </div>

        {/* Game Mode Selector Grid */}
        <div className="mb-5 text-left relative z-10">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
              Select Game Mode
            </label>
            <span className="text-[10px] font-mono text-teal-400 font-bold">
              Active: {modes.find((m) => m.key === settings.gameMode)?.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {modes.map((m) => {
              const isSelected = settings.gameMode === m.key;
              const modeScore = highScores[m.highScoreKey] || 0;
              return (
                <button
                  key={m.key}
                  onClick={() => {
                    soundManager.playClickSound(settings.soundEnabled);
                    onModeChange(m.key);
                  }}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? `${m.activeBorder} shadow-lg ring-1`
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-100">
                      {m.icon} {m.label}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.9)]" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight mb-2">{m.desc}</p>
                  <div className={`text-[10px] ${m.tagColor} font-mono font-bold flex items-center gap-1`}>
                    <Trophy className="w-3 h-3" /> Best: {modeScore} pts
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Hub / More Options Tiles */}
        <div className="text-left relative z-10">
          <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2 block">
            Arcade Hub & Features
          </label>

          <div className="grid grid-cols-3 gap-2">
            {/* Leaderboard Button - Amber/Gold */}
            <button
              id="open-leaderboard-btn"
              onClick={() => {
                soundManager.playClickSound(settings.soundEnabled);
                onOpenLeaderboard();
              }}
              className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-400/80 hover:shadow-[0_0_15px_rgba(251,191,36,0.25)] flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                Leaderboard
              </span>
            </button>

            {/* Jukebox / Song selector Button - Cyan */}
            <button
              id="open-jukebox-btn"
              onClick={() => {
                soundManager.playClickSound(settings.soundEnabled);
                onOpenJukebox();
              }}
              className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-400/80 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Music className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                Songs & Synth
              </span>
            </button>

            {/* Skins Wardrobe Button - Emerald */}
            <button
              id="open-skins-btn"
              onClick={() => {
                soundManager.playClickSound(settings.soundEnabled);
                onOpenSkins();
              }}
              className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-400/80 hover:shadow-[0_0_15px_rgba(52,211,153,0.25)] flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Palette className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">
                Skins & Hats
              </span>
            </button>

            {/* Quests & Achievements Button - Purple */}
            <button
              id="open-quests-btn"
              onClick={() => {
                soundManager.playClickSound(settings.soundEnabled);
                onOpenQuests();
              }}
              className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-400/80 hover:shadow-[0_0_15px_rgba(192,132,252,0.25)] flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer group relative"
            >
              {pendingQuests > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-purple-300">
                Quests & XP
              </span>
            </button>

            {/* Career Stats Button - Indigo */}
            <button
              id="open-stats-btn"
              onClick={() => {
                soundManager.playClickSound(settings.soundEnabled);
                onOpenStats();
              }}
              className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-400/80 hover:shadow-[0_0_15px_rgba(129,140,248,0.25)] flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">
                Career Stats
              </span>
            </button>

            {/* Settings Button - Slate / Silver */}
            <button
              id="open-settings-btn"
              onClick={() => {
                soundManager.playClickSound(settings.soundEnabled);
                onOpenSettings();
              }}
              className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.2)] flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                Settings
              </span>
            </button>
          </div>
        </div>

        {/* How to Play link */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 relative z-10">
          <button
            onClick={() => {
              soundManager.playClickSound(settings.soundEnabled);
              onOpenHowToPlay();
            }}
            className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> How to Play & Controls
          </button>

          <button
            onClick={() => {
              soundManager.playClickSound(settings.soundEnabled);
              onOpenAuth();
            }}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            {userProfile.isGoogleUser ? 'Google Sync Active' : 'Connect Google'}
          </button>
        </div>
      </div>
    </div>
  );
};
