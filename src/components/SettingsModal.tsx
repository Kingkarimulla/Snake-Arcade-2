import React from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Music,
  Shield,
  Zap,
  RotateCcw,
  Smartphone,
  Palette,
  Grid,
  LogOut,
  Sparkles,
  Check,
  Crown,
} from 'lucide-react';
import { GameSettings, DifficultyPreset, SnakeTheme } from '../types';
import { MUSIC_TRACKS, soundManager } from '../utils/audio';
import { THEMES } from '../utils/theme';
import { HardDrive } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetSettings: () => void;
  onClose: () => void;
  onOpenJukebox?: () => void;
  onOpenSkins?: () => void;
  onOpenGoogleDrive?: () => void;
  onExitGame?: () => void;
  isInGame?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings,
  onClose,
  onOpenJukebox,
  onOpenSkins,
  onOpenGoogleDrive,
  onExitGame,
  isInGame = false,
}) => {
  const difficulties: { key: DifficultyPreset; label: string }[] = [
    { key: 'DYNAMIC', label: 'Dynamic' },
    { key: 'EASY', label: 'Easy' },
    { key: 'NORMAL', label: 'Normal' },
    { key: 'HARD', label: 'Hard' },
  ];

  const themeOptions: { key: SnakeTheme; label: string; desc: string }[] = [
    { key: 'CLASSIC', label: 'Classic Emerald', desc: 'Retro green & neon apple' },
    { key: 'NEON', label: 'Cyber Neon', desc: 'Cyan glow & pink tail' },
    { key: 'SUNSET', label: 'Sunset Blaze', desc: 'Blazing orange & magenta' },
    { key: 'GOLDEN', label: 'Midas Gold', desc: 'Luxury gold & blue sparkle' },
    { key: 'OCEAN', label: 'Ocean Sapphire', desc: 'Deep blue & azure sheen' },
    { key: 'DRAGON', label: 'Dragon Scale', desc: 'Fiery crimson & amber' },
    { key: 'COSMIC', label: 'Cosmic Nebula', desc: 'Intergalactic purple & cyan' },
  ];

  return (
    <div
      id="settings-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none overflow-y-auto"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <span className="text-xl leading-none">⚙️</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-white">GAME SETTINGS</h2>
              <p className="text-xs text-slate-400">Audio, controls, themes & preferences</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isInGame && onExitGame && (
              <button
                id="settings-exit-game-header-btn"
                onClick={() => {
                  soundManager.playClickSound();
                  onExitGame();
                }}
                title="Exit to Main Menu"
                className="py-1.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Game</span>
              </button>
            )}

            <button
              onClick={() => {
                soundManager.playClickSound();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close settings"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-3.5 text-sm text-slate-200 max-h-[62vh] overflow-y-auto pr-1">
          {/* Visual Theme Selector in Settings */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-white text-xs">
                <Palette className="w-4 h-4 text-emerald-400" />
                <span>Game Theme & Color Palette</span>
              </div>

              {onOpenSkins && (
                <button
                  onClick={() => {
                    soundManager.playClickSound();
                    onOpenSkins();
                  }}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>Wardrobe & Hats</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
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
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 shadow-sm shadow-emerald-500/10 ring-1 ring-emerald-500'
                        : 'bg-slate-900 border-slate-800/90 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Color swatches */}
                      <div className="flex -space-x-1 shrink-0">
                        <div
                          className="w-4 h-4 rounded-full border border-slate-900 shadow"
                          style={{ backgroundColor: colors.snakeHead }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-slate-900 shadow"
                          style={{ backgroundColor: colors.snakeBodyStart }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-slate-900 shadow"
                          style={{ backgroundColor: colors.foodRegular }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-white truncate">{t.label}</div>
                        <div className="text-[10px] text-slate-400 truncate">{t.desc}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 ml-1">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound FX Toggle & Volume */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-500" />
                )}
                <div>
                  <div className="font-bold text-white">Sound Effects</div>
                  <div className="text-xs text-slate-400">Audio for eating, score, and game over</div>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                  settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
                aria-label="Toggle Sound Effects"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {settings.soundEnabled && (
              <div className="pt-1">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>SFX Volume</span>
                  <span className="font-mono text-emerald-400">{Math.round(settings.soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    onUpdateSettings({ soundVolume: vol });
                    soundManager.setSoundVolume(vol);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>
            )}
          </div>

          {/* Music Toggle & Track Info */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music
                  className={`w-5 h-5 ${settings.musicEnabled ? 'text-cyan-400' : 'text-slate-500'}`}
                />
                <div>
                  <div className="font-bold text-white">Retro Synth Music</div>
                  <div className="text-xs text-slate-400">
                    Track: {MUSIC_TRACKS.find((t) => t.id === settings.selectedTrackId)?.title || 'Cyber Viper'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  const next = !settings.musicEnabled;
                  onUpdateSettings({ musicEnabled: next });
                  soundManager.setMusic(next, settings.selectedTrackId);
                }}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                  settings.musicEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
                aria-label="Toggle Retro Synth Music"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {settings.musicEnabled && (
              <div className="pt-1">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Music Volume</span>
                  <span className="font-mono text-cyan-400">{Math.round(settings.musicVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.musicVolume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    onUpdateSettings({ musicVolume: vol });
                    soundManager.setMusicVolume(vol);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            )}
          </div>

          {/* Vibration Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Smartphone
                className={`w-5 h-5 ${settings.vibrationEnabled ? 'text-amber-400' : 'text-slate-500'}`}
              />
              <div>
                <div className="font-bold text-white">Haptic Vibration</div>
                <div className="text-xs text-slate-400">Mobile touch feedback on controls</div>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ vibrationEnabled: !settings.vibrationEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                settings.vibrationEnabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
              aria-label="Toggle Haptic Vibration"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Wall Wrap Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Shield className={`w-5 h-5 ${settings.wallWrap ? 'text-indigo-400' : 'text-slate-500'}`} />
              <div>
                <div className="font-bold text-white">Wall Wrap Mode</div>
                <div className="text-xs text-slate-400">Teleport across board boundaries</div>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ wallWrap: !settings.wallWrap })}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                settings.wallWrap ? 'bg-indigo-500' : 'bg-slate-700'
              }`}
              aria-label="Toggle Wall Wrap Mode"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.wallWrap ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Difficulty Preset */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <Zap className="w-4 h-4 text-emerald-400" /> Movement Speed & Difficulty
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {difficulties.map((d) => (
                <button
                  key={d.key}
                  onClick={() => onUpdateSettings({ difficulty: d.key })}
                  className={`py-2 px-3 rounded-xl font-semibold text-xs border text-center transition-all cursor-pointer ${
                    settings.difficulty === d.key
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Board Size */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <Grid className="w-4 h-4 text-cyan-400" /> Grid Size
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onUpdateSettings({ boardSize: 20 })}
                className={`py-2 px-3 rounded-xl font-semibold text-xs border text-center transition-all cursor-pointer ${
                  settings.boardSize === 20
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Standard (20 × 20)
              </button>
              <button
                onClick={() => onUpdateSettings({ boardSize: 25 })}
                className={`py-2 px-3 rounded-xl font-semibold text-xs border text-center transition-all cursor-pointer ${
                  settings.boardSize === 25
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Large (25 × 25)
              </button>
            </div>
          </div>

          {/* Google Drive Cloud Saves & Sync */}
          {onOpenGoogleDrive && (
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span>Google Drive Cloud Saves</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-mono">
                      Cloud Sync
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Backup high scores, career XP & settings to Google Drive
                  </div>
                </div>
              </div>

              <button
                id="settings-open-drive-btn"
                onClick={() => {
                  soundManager.playClickSound();
                  onOpenGoogleDrive();
                }}
                className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-md shadow-emerald-500/10"
              >
                <span>Manage</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-800 mt-4 gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onResetSettings}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>

            {onExitGame && (
              <button
                id="settings-exit-game-footer-btn"
                onClick={() => {
                  soundManager.playClickSound();
                  onExitGame();
                }}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Exit Game
              </button>
            )}
          </div>

          <button
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

