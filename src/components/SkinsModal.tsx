import React, { useRef, useEffect } from 'react';
import { Palette, Sparkles, X, Check, Crown } from 'lucide-react';
import { GameSettings, SnakeTheme, SnakeHat } from '../types';
import { THEMES } from '../utils/theme';
import { soundManager } from '../utils/audio';

interface SkinsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
}

export const SkinsModal: React.FC<SkinsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const themeOptions: { key: SnakeTheme; label: string; desc: string }[] = [
    { key: 'CLASSIC', label: 'Classic Emerald', desc: 'Standard vibrant retro green' },
    { key: 'NEON', label: 'Cyber Neon', desc: 'Futuristic cyan & neon pink glow' },
    { key: 'SUNSET', label: 'Sunset Blaze', desc: 'Warm gradient orange & magenta' },
    { key: 'GOLDEN', label: 'Midas Gold', desc: 'Luxury golden skin with amber tail' },
    { key: 'OCEAN', label: 'Ocean Sapphire', desc: 'Deep aquatic blue & sky shine' },
    { key: 'DRAGON', label: 'Dragon Scale', desc: 'Fiery crimson & blazing scales' },
    { key: 'COSMIC', label: 'Cosmic Nebula', desc: 'Intergalactic deep purple & star dust' },
  ];

  const hatOptions: { key: SnakeHat; label: string; emoji: string }[] = [
    { key: 'NONE', label: 'No Hat', emoji: '🚫' },
    { key: 'CROWN', label: 'Crown', emoji: '👑' },
    { key: 'CAP', label: 'Cap', emoji: '🧢' },
    { key: 'GLASSES', label: 'Sunglasses', emoji: '🕶️' },
    { key: 'HEADPHONES', label: 'DJ Headset', emoji: '🎧' },
    { key: 'WIZARD', label: 'Wizard Hat', emoji: '🧙' },
  ];

  // Render snake preview on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const themeColors = THEMES[settings.theme] || THEMES.CLASSIC;

    // Draw background
    ctx.fillStyle = themeColors.boardBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid
    ctx.strokeStyle = themeColors.gridLine;
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Snake preview coordinates
    const segments = [
      { x: 140, y: 70 },
      { x: 120, y: 70 },
      { x: 100, y: 70 },
      { x: 80, y: 70 },
      { x: 60, y: 70 },
      { x: 60, y: 90 },
      { x: 60, y: 110 },
      { x: 80, y: 110 },
      { x: 100, y: 110 },
    ];

    // Draw Food
    ctx.fillStyle = themeColors.foodRegular;
    ctx.beginPath();
    ctx.arc(180, 70, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw snake body
    segments.forEach((seg, i) => {
      ctx.save();
      if (i === 0) {
        // Head
        ctx.fillStyle = themeColors.snakeHead;
        ctx.strokeStyle = themeColors.snakeHeadBorder;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(seg.x - 9, seg.y - 9, 18, 18, 6);
        ctx.fill();
        ctx.stroke();

        // Eyes
        ctx.fillStyle = themeColors.snakeEye;
        ctx.beginPath();
        ctx.arc(seg.x + 3, seg.y - 4, 2.5, 0, Math.PI * 2);
        ctx.arc(seg.x + 3, seg.y + 4, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(seg.x + 4, seg.y - 4, 1.2, 0, Math.PI * 2);
        ctx.arc(seg.x + 4, seg.y + 4, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Hat
        if (settings.hat !== 'NONE') {
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          let emoji = '';
          if (settings.hat === 'CROWN') emoji = '👑';
          else if (settings.hat === 'CAP') emoji = '🧢';
          else if (settings.hat === 'GLASSES') emoji = '🕶️';
          else if (settings.hat === 'HEADPHONES') emoji = '🎧';
          else if (settings.hat === 'WIZARD') emoji = '🧙';
          ctx.fillText(emoji, seg.x, seg.y - 10);
        }
      } else {
        // Body segment
        const t = i / segments.length;
        ctx.fillStyle = i % 2 === 0 ? themeColors.snakeBodyStart : themeColors.snakeBodyEnd;
        ctx.beginPath();
        ctx.roundRect(seg.x - 8, seg.y - 8, 16, 16, 4);
        ctx.fill();
      }
      ctx.restore();
    });
  }, [settings.theme, settings.hat]);

  return (
    <div
      id="skins-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Snake Wardrobe & Skins</h2>
              <p className="text-xs text-slate-400">Customize snake visuals & accessories</p>
            </div>
          </div>

          <button
            id="close-skins-modal-btn"
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Preview Stage */}
        <div className="my-3 flex flex-col items-center">
          <div className="w-full max-w-xs h-36 rounded-2xl border border-slate-800 overflow-hidden relative shadow-inner bg-slate-950 flex items-center justify-center">
            <canvas ref={canvasRef} width={240} height={140} className="rounded-xl shadow-md" />
            <div className="absolute top-2 left-3 px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-emerald-400">
              LIVE PREVIEW
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-1">
          {/* Hat / Accessory Selector */}
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 block">
              Head Accessories & Hats
            </label>
            <div className="grid grid-cols-3 gap-2">
              {hatOptions.map((h) => {
                const isSelected = settings.hat === h.key;
                return (
                  <button
                    key={h.key}
                    onClick={() => {
                      soundManager.playClickSound();
                      onUpdateSettings({ hat: h.key });
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-base">{h.emoji}</span>
                    <span className="truncate">{h.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Palette Selector */}
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 block">
              Color Themes & Textures
            </label>
            <div className="space-y-2">
              {themeOptions.map((t) => {
                const isSelected = settings.theme === t.key;
                const colors = THEMES[t.key];
                return (
                  <button
                    key={t.key}
                    onClick={() => {
                      soundManager.playClickSound();
                      onUpdateSettings({ theme: t.key });
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Color dots preview */}
                      <div className="flex -space-x-1.5 shrink-0">
                        <div
                          className="w-5 h-5 rounded-full border border-slate-900 shadow"
                          style={{ backgroundColor: colors.snakeHead }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-slate-900 shadow"
                          style={{ backgroundColor: colors.snakeBodyStart }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-slate-900 shadow"
                          style={{ backgroundColor: colors.foodRegular }}
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{t.label}</span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-tight">{t.desc}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Apply & Slither
          </button>
        </div>
      </div>
    </div>
  );
};
