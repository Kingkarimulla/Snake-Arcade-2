import React from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, Trophy, Zap, Shield, HelpCircle, Music } from 'lucide-react';
import { GameStats, GameSettings, GameState } from '../types';

interface HUDProps {
  stats: GameStats;
  settings: GameSettings;
  gameState: GameState;
  onPauseToggle: () => void;
  onSoundToggle: () => void;
  onMusicToggle?: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  settings,
  gameState,
  onPauseToggle,
  onSoundToggle,
  onMusicToggle,
  onOpenSettings,
  onOpenHelp,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-3 flex flex-col gap-2 select-none">
      {/* Top Header Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2.5 shadow-xl flex items-center justify-between text-white">
        {/* Title & Mode */}
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="snake">🐍</span>
          <div>
            <h1 className="font-bold text-lg tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent leading-none">
              SNAKE
            </h1>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-widest">
              {settings.gameMode.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Scores */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-400/90 tracking-wider">
              SCORE
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-white leading-tight">
              {stats.score}
            </div>
          </div>

          <div className="h-7 w-[1px] bg-slate-800" />

          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider flex items-center gap-1 justify-center">
              <Trophy className="w-3 h-3 text-amber-400 inline" /> HIGH
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-300 leading-tight">
              {stats.highScore}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {gameState === 'PLAYING' || gameState === 'PAUSED' ? (
            <button
              onClick={onPauseToggle}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700"
              title={gameState === 'PLAYING' ? 'Pause Game (Space)' : 'Resume Game (Space)'}
              aria-label={gameState === 'PLAYING' ? 'Pause' : 'Resume'}
            >
              {gameState === 'PLAYING' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
          ) : null}

          <button
            onClick={onSoundToggle}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700"
            title={settings.soundEnabled ? 'Mute Sound FX' : 'Unmute Sound FX'}
            aria-label="Sound Toggle"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {onMusicToggle && (
            <button
              onClick={onMusicToggle}
              className={`p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border ${
                settings.musicEnabled ? 'border-cyan-500/50 text-cyan-400 bg-cyan-950/40' : 'border-slate-700 text-slate-500'
              }`}
              title={settings.musicEnabled ? 'Mute Synth Music' : 'Enable Synth Music'}
              aria-label="Music Toggle"
            >
              <Music className={`w-4 h-4 ${settings.musicEnabled ? 'animate-pulse' : ''}`} />
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHelp}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700"
            title="How to Play"
            aria-label="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Secondary Stats Row (Length, Speed, Difficulty, Time Remaining) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium">Length:</span>
            <span className="font-bold text-white">{stats.length}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-400 text-[11px] font-medium">Speed:</span>
            <span className="font-bold text-cyan-300">{stats.speedMs}ms</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium">Difficulty:</span>
            <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide uppercase ${
              stats.difficultyLabel === 'Extreme'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : stats.difficultyLabel === 'Very Fast' || stats.difficultyLabel === 'Fast'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {stats.difficultyLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {settings.wallWrap && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
              <Shield className="w-3 h-3 inline" /> Wrap ON
            </span>
          )}

          {settings.gameMode === 'TIME_ATTACK' && stats.timeRemaining !== undefined && (
            <div className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/30 px-2.5 py-0.5 rounded-md font-mono font-bold text-rose-300 text-xs">
              ⏱️ {stats.timeRemaining}s
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
