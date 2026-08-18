import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, Sparkles, X, Radio, Disc3, Bell } from 'lucide-react';
import { GameSettings } from '../types';
import { MUSIC_TRACKS, soundManager } from '../utils/audio';

interface JukeboxModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
}

export const JukeboxModal: React.FC<JukeboxModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(soundManager.getIsMusicPlaying());

  useEffect(() => {
    setIsPlaying(soundManager.getIsMusicPlaying());
  }, [settings.musicEnabled, settings.selectedTrackId]);

  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    onUpdateSettings({ musicEnabled: nextState });
    soundManager.setMusic(nextState, settings.selectedTrackId);
  };

  const handleSelectTrack = (trackId: string) => {
    soundManager.playClickSound();
    onUpdateSettings({ selectedTrackId: trackId, musicEnabled: true });
    soundManager.switchTrack(trackId, true);
    setIsPlaying(true);
  };

  const handleMusicVolumeChange = (vol: number) => {
    onUpdateSettings({ musicVolume: vol });
    soundManager.setMusicVolume(vol);
  };

  const handleSoundVolumeChange = (vol: number) => {
    onUpdateSettings({ soundVolume: vol });
    soundManager.setSoundVolume(vol);
  };

  return (
    <div
      id="jukebox-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Disc3 className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Arcade Jukebox & Songs
              </h2>
              <p className="text-xs text-slate-400">Web Audio API 8-bit & synthwave sound tracks</p>
            </div>
          </div>

          <button
            id="close-jukebox-modal-btn"
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Now Playing Visualizer Box */}
        <div className="my-3 p-4 bg-slate-950/90 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-pink-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400">
                {isPlaying ? 'Now Playing' : 'Paused'}
              </span>
              <h3 className="text-sm font-black text-white truncate">
                {MUSIC_TRACKS.find((t) => t.id === settings.selectedTrackId)?.title || 'Cyber Viper'}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {MUSIC_TRACKS.find((t) => t.id === settings.selectedTrackId)?.bpm} BPM •{' '}
                {MUSIC_TRACKS.find((t) => t.id === settings.selectedTrackId)?.genre}
              </p>
            </div>
          </div>

          {/* Animated Equalizer Bars */}
          <div className="flex items-end gap-1 h-8 px-2">
            {[40, 75, 100, 60, 90, 50].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full bg-gradient-to-t from-cyan-500 to-emerald-400 transition-all ${
                  isPlaying ? 'animate-pulse' : 'opacity-30'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (h * (i % 2 === 0 ? 0.9 : 1.2)) % 100)}%` : '20%',
                  animationDuration: `${0.3 + i * 0.15}s`,
                }}
              />
            ))}
          </div>

          {/* Master Play/Pause button */}
          <button
            id="jukebox-master-play-btn"
            onClick={handleTogglePlay}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-lg cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />}
          </button>
        </div>

        {/* Tracks List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 py-1">
          <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block">
            Select Soundtrack
          </label>

          {MUSIC_TRACKS.map((track) => {
            const isSelected = settings.selectedTrackId === track.id;
            return (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(track.id)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/80 ring-1 ring-cyan-500 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{track.title}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-cyan-300">
                        {track.genre}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-tight">{track.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-400">{track.bpm} BPM</span>
                </div>
              </button>
            );
          })}

          {/* Volume Adjustments */}
          <div className="pt-3 space-y-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-cyan-400" /> Music Volume
                  </span>
                  <span className="font-mono text-cyan-400">{Math.round(settings.musicVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.musicVolume}
                  onChange={(e) => handleMusicVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Sound Effects Volume
                  </span>
                  <span className="font-mono text-emerald-400">{Math.round(settings.soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => handleSoundVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>
            </div>

            {/* Sound FX Preview Box */}
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 block">
                Test Sound Effects
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => soundManager.playEatSound(false, true)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300 rounded-xl border border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                >
                  🍎 Apple
                </button>
                <button
                  onClick={() => soundManager.playEatSound(true, true)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-amber-300 rounded-xl border border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                >
                  ✨ Golden
                </button>
                <button
                  onClick={() => soundManager.playAchievementSound(true)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-cyan-300 rounded-xl border border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                >
                  🎖️ Trophy
                </button>
                <button
                  onClick={() => soundManager.playHighScoreSound(true)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-emerald-300 rounded-xl border border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                >
                  🎺 Fanfare
                </button>
              </div>
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
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
