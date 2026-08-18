import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Direction } from '../types';

interface MobileDPadProps {
  currentDirection: Direction;
  onDirectionChange: (dir: Direction) => void;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export const MobileDPad: React.FC<MobileDPadProps> = ({
  currentDirection,
  onDirectionChange,
}) => {
  const lastPressTimeRef = React.useRef<number>(0);

  const handleDirectionPress = (
    e: React.PointerEvent | React.MouseEvent | React.TouchEvent,
    dir: Direction
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const now = Date.now();
    // Debounce rapid double event triggers from touch + click within 60ms
    if (now - lastPressTimeRef.current < 60) return;
    lastPressTimeRef.current = now;

    onDirectionChange(dir);
  };

  return (
    <div className="w-full max-w-xs mx-auto my-3 flex flex-col items-center justify-center select-none touch-none">
      <div className="grid grid-cols-3 gap-2 p-2 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl shadow-xl">
        {/* Top Row: Empty, Up, Empty */}
        <div />
        <button
          onPointerDown={(e) => handleDirectionPress(e, 'UP')}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-all active:scale-90 border shadow-lg ${
            currentDirection === 'UP'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-emerald-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
          aria-label="Move Up"
        >
          <ArrowUp className="w-7 h-7 stroke-[2.5]" />
        </button>
        <div />

        {/* Middle/Bottom Row: Left, Down, Right */}
        <button
          onPointerDown={(e) => handleDirectionPress(e, 'LEFT')}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-all active:scale-90 border shadow-lg ${
            currentDirection === 'LEFT'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-emerald-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
          aria-label="Move Left"
        >
          <ArrowLeft className="w-7 h-7 stroke-[2.5]" />
        </button>

        <button
          onPointerDown={(e) => handleDirectionPress(e, 'DOWN')}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-all active:scale-90 border shadow-lg ${
            currentDirection === 'DOWN'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-emerald-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
          aria-label="Move Down"
        >
          <ArrowDown className="w-7 h-7 stroke-[2.5]" />
        </button>

        <button
          onPointerDown={(e) => handleDirectionPress(e, 'RIGHT')}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-all active:scale-90 border shadow-lg ${
            currentDirection === 'RIGHT'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-emerald-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
          aria-label="Move Right"
        >
          <ArrowRight className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
