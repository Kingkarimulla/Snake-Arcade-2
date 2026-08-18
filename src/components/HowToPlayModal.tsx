import React from 'react';
import { X, Keyboard, Smartphone, Trophy, Shield, Clock, AlertTriangle, Zap } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative my-auto my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="help icon">📖</span>
            <h2 className="text-xl font-black text-white">HOW TO PLAY</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Close how to play"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
          {/* Objective */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <h3 className="font-bold text-emerald-400 text-sm mb-1 flex items-center gap-1.5">
              🎯 Objective
            </h3>
            <p className="leading-relaxed text-slate-300">
              Guide the snake to eat food items on the board. Each food piece grows the snake&apos;s length and increases your score. Avoid colliding with walls or your own tail!
            </p>
          </div>

          {/* Controls */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
            <h3 className="font-bold text-cyan-400 text-sm flex items-center gap-1.5">
              <Keyboard className="w-4 h-4" /> Keyboard Controls
            </h3>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/80">
                <div className="font-semibold text-white mb-0.5">Move Direction</div>
                <div className="text-[11px] font-mono text-emerald-300">Arrow Keys or W, A, S, D</div>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/80">
                <div className="font-semibold text-white mb-0.5">Pause / Resume</div>
                <div className="text-[11px] font-mono text-cyan-300">Spacebar</div>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/80 col-span-2">
                <div className="font-semibold text-white mb-0.5">Start / Restart</div>
                <div className="text-[11px] font-mono text-amber-300">Enter</div>
              </div>
            </div>
          </div>

          {/* Mobile & Touch Controls */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-1.5">
            <h3 className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" /> Mobile & Touch
            </h3>
            <p className="leading-relaxed text-slate-300">
              Use the on-screen directional pad buttons or swipe across the game board in any direction (Up, Down, Left, Right).
            </p>
          </div>

          {/* Game Modes */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
            <h3 className="font-bold text-purple-400 text-sm flex items-center gap-1.5">
              <Trophy className="w-4 h-4" /> Game Modes
            </h3>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div><strong className="text-white">Classic:</strong> Standard gameplay where walls are deadly.</div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <div><strong className="text-white">Wall Wrap:</strong> Snake wraps seamlessly around screen borders.</div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <div><strong className="text-white">Time Attack:</strong> 60s limit! Eat food & golden apples (+30 pts) for highest score.</div>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div><strong className="text-white">Obstacles:</strong> Avoid static blocks spawning on the board.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 mt-4 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
