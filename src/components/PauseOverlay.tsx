import React from 'react';
import { Play, RotateCcw, Settings, Home } from 'lucide-react';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onMainMenu: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({
  onResume,
  onRestart,
  onOpenSettings,
  onMainMenu,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center animate-in fade-in zoom-in duration-200">
        <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-500/30">
          <span className="text-2xl" role="img" aria-label="pause icon">⏸️</span>
        </div>

        <h2 className="text-2xl font-black tracking-wide text-white mb-1">
          GAME PAUSED
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Take a breath! Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Space</kbd> or click below to resume.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-3.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Play className="w-5 h-5 fill-slate-950" /> RESUME
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" /> RESTART
          </button>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={onOpenSettings}
              className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700/80 flex items-center justify-center gap-1.5"
            >
              <Settings className="w-4 h-4 text-slate-400" /> Settings
            </button>

            <button
              onClick={onMainMenu}
              className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700/80 flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4 text-slate-400" /> Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
