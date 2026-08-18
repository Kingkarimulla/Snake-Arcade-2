import React from 'react';
import { RotateCcw, Home, Trophy, Settings, Sparkles, UploadCloud } from 'lucide-react';
import { SnakeTheme } from '../types';
import { soundManager } from '../utils/audio';
import { THEME_UI_STYLES } from '../utils/theme';

interface GameOverOverlayProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  applesEaten: number;
  goldenEaten: number;
  xpEarned: number;
  theme?: SnakeTheme;
  onPlayAgain: () => void;
  onMainMenu: () => void;
  onOpenSettings: () => void;
  onOpenLeaderboard: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  score,
  highScore,
  isNewHighScore,
  applesEaten,
  goldenEaten,
  xpEarned,
  theme = 'CLASSIC',
  onPlayAgain,
  onMainMenu,
  onOpenSettings,
  onOpenLeaderboard,
}) => {
  const themeStyle = THEME_UI_STYLES[theme] || THEME_UI_STYLES.CLASSIC;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden">
        {/* Glow effect */}
        {isNewHighScore && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="text-4xl mb-2" role="img" aria-label="skull or snake">
          {isNewHighScore ? '🏆' : '💀'}
        </div>

        <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-rose-400 via-amber-300 to-rose-500 bg-clip-text text-transparent mb-1">
          GAME OVER
        </h2>

        {isNewHighScore && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 font-bold text-xs uppercase tracking-wider my-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-400" /> NEW HIGH SCORE!
          </div>
        )}

        {/* Stats card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 my-3.5 grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              SCORE
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {score}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> HIGH
            </div>
            <div className="text-2xl font-black font-mono text-amber-300">
              {highScore}
            </div>
          </div>

          <div className="col-span-2 pt-2 border-t border-slate-800/80 flex justify-around text-xs text-slate-400">
            <span>🍎 Apples: <strong className="text-slate-200">{applesEaten}</strong></span>
            {goldenEaten > 0 && <span>⭐ Golden: <strong className="text-amber-300">{goldenEaten}</strong></span>}
            <span className="text-cyan-400 font-bold font-mono">+{xpEarned} XP</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              soundManager.playClickSound();
              onPlayAgain();
            }}
            className={`w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r ${themeStyle.playBtnGradient} ${themeStyle.playBtnHover} ${themeStyle.playBtnText} font-black text-sm uppercase tracking-wider ${themeStyle.playBtnShadow} ${themeStyle.playBtnBorder} border flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer`}
          >
            <RotateCcw className="w-5 h-5 fill-current" /> PLAY AGAIN
          </button>

          <button
            onClick={() => {
              soundManager.playClickSound();
              onOpenLeaderboard();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" /> View Leaderboard Rankings
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundManager.playClickSound();
                onMainMenu();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-cyan-400" /> MAIN MENU
            </button>

            <button
              onClick={() => {
                soundManager.playClickSound();
                onOpenSettings();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-emerald-400" /> SETTINGS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
