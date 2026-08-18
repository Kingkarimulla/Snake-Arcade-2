import React, { useState, useEffect } from 'react';
import { Sparkles, Play, ShieldAlert } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('BOOTING SNAKE ARCADE CORE...');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const steps = [
      { at: 15, text: 'LOADING SYNTH AUDIO ENGINE...' },
      { at: 40, text: 'INITIALIZING 8-BIT SOUNDTRACKS...' },
      { at: 65, text: 'PREPARING GLOBAL LEADERBOARDS...' },
      { at: 88, text: 'CALIBRATING GRID PHYSICS...' },
      { at: 100, text: 'SYSTEM READY!' },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next >= 100) {
          clearInterval(interval);
          setStatusText('SYSTEM READY!');
          setIsReady(true);
          soundManager.playIntroSound();
          return 100;
        }

        const match = steps.find((s) => s.at <= next && s.at > prev);
        if (match) {
          setStatusText(match.text);
        }
        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    soundManager.playClickSound(true);
    onComplete();
  };

  return (
    <div
      id="loading-splash-screen"
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
    >
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Logo Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Animated Snake Logo Icon */}
        <div className="relative mb-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border-2 border-teal-500/60 shadow-[0_0_50px_rgba(20,184,166,0.35)] flex items-center justify-center relative overflow-hidden group">
            {/* Inner Glow Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:12px_12px] opacity-30" />

            {/* Snake SVG Icon with Pulse */}
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.9)] animate-pulse"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Snake body curve */}
              <path
                d="M 12 48 C 12 36, 24 36, 24 24 C 24 16, 32 12, 40 12 C 48 12, 52 18, 52 26 C 52 34, 44 40, 36 40 C 28 40, 28 52, 44 52"
                stroke="url(#snakeGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Snake Head */}
              <circle cx="12" cy="48" r="6" fill="#34d399" />
              {/* Snake Eye */}
              <circle cx="10" cy="46" r="1.8" fill="#0f172a" />
              {/* Glowing Tongue */}
              <path d="M 6 48 L 2 48 M 2 48 L 0 46 M 2 48 L 0 50" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="snakeGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#34d399" />
                  <stop offset="0.5" stopColor="#14b8a6" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Glowing Corner Accents */}
            <div className="absolute top-1 left-1 w-2 h-2 bg-emerald-400 rounded-full" />
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-cyan-400 rounded-full" />
          </div>

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-teal-400/50 text-[10px] font-mono font-black text-teal-300 uppercase tracking-widest shadow-md">
            v2.0 PRO
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-1 flex items-center justify-center gap-2">
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 via-cyan-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(52,211,153,0.35)]">
            SNAKE ARCADE
          </span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-medium tracking-wide mb-8">
          Classic Gameplay • Retro Synthesizer • Cloud Leaderboards
        </p>

        {/* Progress Bar & Status */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl mb-6">
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            <span className="text-teal-400 flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" /> {statusText}
            </span>
            <span className="text-slate-300 font-bold">{progress}%</span>
          </div>

          {/* Bar track */}
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-150 shadow-[0_0_15px_rgba(20,184,166,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Enter Button or Auto Continue */}
        {isReady ? (
          <button
            id="loading-enter-button"
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:via-teal-300 hover:to-cyan-300 text-slate-950 font-black text-base sm:text-lg tracking-wider uppercase shadow-[0_0_30px_rgba(20,184,166,0.35)] hover:shadow-[0_0_45px_rgba(20,184,166,0.55)] active:scale-95 transition-all flex items-center justify-center gap-2 animate-bounce cursor-pointer border border-teal-200/30"
          >
            <Play className="w-5 h-5 fill-slate-950" /> ENTER ARCADE
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4 transition-colors font-mono cursor-pointer"
          >
            Skip loading →
          </button>
        )}
      </div>

      {/* Footer credits */}
      <div className="absolute bottom-4 text-center text-[11px] font-mono text-slate-500">
        POWERED BY WEB AUDIO SYNTH & CANVAS 2D
      </div>
    </div>
  );
};
