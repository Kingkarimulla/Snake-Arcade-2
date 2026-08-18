import React, { useState } from 'react';
import { Trophy, Medal, Crown, X, Zap, Shield, Clock, AlertTriangle, Sparkles, UploadCloud, ShieldCheck } from 'lucide-react';
import { GameMode, LeaderboardEntry, UserProfile, HighScoreRecord } from '../types';
import { soundManager } from '../utils/audio';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  userProfile: UserProfile;
  highScores: HighScoreRecord;
  currentMode: GameMode;
  onClose: () => void;
  onSubmitScore: (mode: GameMode, score: number) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  entries,
  userProfile,
  highScores,
  currentMode,
  onClose,
  onSubmitScore,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(currentMode);
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'WEEKLY' | 'TODAY'>('ALL');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const modes: { key: GameMode; label: string; icon: React.ReactNode; highScoreKey: keyof HighScoreRecord }[] = [
    { key: 'CLASSIC', label: 'Classic', icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />, highScoreKey: 'classic' },
    { key: 'WALL_WRAP', label: 'Wall Wrap', icon: <Shield className="w-3.5 h-3.5 text-indigo-400" />, highScoreKey: 'wallWrap' },
    { key: 'TIME_ATTACK', label: 'Time Attack', icon: <Clock className="w-3.5 h-3.5 text-rose-400" />, highScoreKey: 'timeAttack' },
    { key: 'OBSTACLES', label: 'Obstacles', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />, highScoreKey: 'obstacles' },
  ];

  // Filter and sort entries
  const filteredEntries = entries
    .filter((e) => e.mode === selectedMode)
    .sort((a, b) => b.score - a.score);

  const top1 = filteredEntries[0];
  const top2 = filteredEntries[1];
  const top3 = filteredEntries[2];
  const restEntries = filteredEntries.slice(3);

  const activeModeConfig = modes.find((m) => m.key === selectedMode)!;
  const userBestInMode = highScores[activeModeConfig.highScoreKey] || 0;

  // Check if current user is already top ranked
  const userRankIndex = filteredEntries.findIndex((e) => e.userId === userProfile.id || e.userName === userProfile.name);

  const handleSubmitCurrentScore = () => {
    if (userBestInMode > 0) {
      onSubmitScore(selectedMode, userBestInMode);
      soundManager.playHighScoreSound();
      setHasSubmitted(true);
      setTimeout(() => setHasSubmitted(false), 3000);
    }
  };

  return (
    <div
      id="leaderboard-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow BG */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                Global Arcade Leaderboard
              </h2>
              <p className="text-xs text-slate-400">Real-time player rankings & high scores</p>
            </div>
          </div>

          <button
            id="close-leaderboard-modal-btn"
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-4 gap-1.5 pt-3 pb-2">
          {modes.map((m) => {
            const isSelected = selectedMode === m.key;
            return (
              <button
                key={m.key}
                onClick={() => {
                  soundManager.playClickSound();
                  setSelectedMode(m.key);
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border border-emerald-500/60 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                {m.icon}
                <span className="truncate">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-2">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-3 gap-2 pt-2 items-end">
            {/* Rank 2 - Silver */}
            <div className="bg-slate-950/80 border border-slate-700/60 rounded-2xl p-2.5 flex flex-col items-center text-center relative pt-4">
              <div className="absolute -top-3 w-6 h-6 rounded-full bg-slate-400 text-slate-950 font-black text-xs flex items-center justify-center border-2 border-slate-900 shadow">
                2
              </div>
              <img
                src={top2?.userAvatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80'}
                alt={top2?.userName || 'Player 2'}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-slate-400/50 mb-1"
              />
              <span className="text-xs font-bold text-slate-200 truncate w-full">
                {top2?.userName || 'Challenger'}
              </span>
              <span className="text-xs font-mono font-black text-slate-300">
                {top2 ? `${top2.score} pts` : '--'}
              </span>
            </div>

            {/* Rank 1 - Gold */}
            <div className="bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-2xl p-3 flex flex-col items-center text-center relative pt-5 shadow-lg shadow-amber-500/10">
              <div className="absolute -top-4 w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black text-sm flex items-center justify-center border-2 border-slate-900 shadow-md">
                <Crown className="w-4 h-4 text-slate-950" />
              </div>
              <img
                src={top1?.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                alt={top1?.userName || 'Champion'}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shadow mb-1.5"
              />
              <div className="flex items-center gap-1 max-w-full">
                <span className="text-xs sm:text-sm font-black text-amber-300 truncate">
                  {top1?.userName || 'Champion'}
                </span>
                {top1?.isGoogleUser && <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
              </div>
              <span className="text-sm font-mono font-black text-amber-400">
                {top1 ? `${top1.score} pts` : '--'}
              </span>
            </div>

            {/* Rank 3 - Bronze */}
            <div className="bg-slate-950/80 border border-amber-700/50 rounded-2xl p-2.5 flex flex-col items-center text-center relative pt-4">
              <div className="absolute -top-3 w-6 h-6 rounded-full bg-amber-700 text-slate-100 font-black text-xs flex items-center justify-center border-2 border-slate-900 shadow">
                3
              </div>
              <img
                src={top3?.userAvatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80'}
                alt={top3?.userName || 'Player 3'}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-amber-700/50 mb-1"
              />
              <span className="text-xs font-bold text-slate-200 truncate w-full">
                {top3?.userName || 'Challenger'}
              </span>
              <span className="text-xs font-mono font-black text-amber-500">
                {top3 ? `${top3.score} pts` : '--'}
              </span>
            </div>
          </div>

          {/* List of remaining ranks */}
          <div className="space-y-1.5">
            {restEntries.map((item, idx) => {
              const rank = idx + 4;
              const isCurrentUser = item.userId === userProfile.id || item.userName === userProfile.name;
              return (
                <div
                  key={item.id || idx}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    isCurrentUser
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white font-bold'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 text-center font-mono font-bold text-slate-500 text-[11px]">
                      #{rank}
                    </span>
                    <img
                      src={item.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                      alt={item.userName}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                    <span className="font-semibold truncate max-w-[120px] sm:max-w-[180px]">
                      {item.userName}
                    </span>
                    {item.isGoogleUser && (
                      <ShieldCheck className="w-3 h-3 text-blue-400 shrink-0" title="Google Verified" />
                    )}
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400 text-[11px]">Len {item.length}</span>
                    <span className="font-bold text-emerald-400">{item.score} pts</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* User's own standing summary */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-xl object-cover border border-emerald-500/50"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate max-w-[130px]">{userProfile.name}</span>
                  {userProfile.isGoogleUser && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                </div>
                <p className="text-[11px] text-slate-400">
                  Your Best in {activeModeConfig.label}:{' '}
                  <span className="text-amber-400 font-mono font-bold">{userBestInMode} pts</span>
                </p>
              </div>
            </div>

            {userBestInMode > 0 ? (
              <button
                id="submit-leaderboard-score-btn"
                onClick={handleSubmitCurrentScore}
                disabled={hasSubmitted}
                className="py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                {hasSubmitted ? 'Submitted!' : 'Sync Score'}
              </button>
            ) : (
              <span className="text-[11px] text-slate-500 font-mono">No score yet</span>
            )}
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
            Close Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};
