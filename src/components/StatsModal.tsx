import React from 'react';
import { BarChart3, Trophy, Flame, Zap, Apple, Sparkles, X, Clock, Shield } from 'lucide-react';
import { HighScoreRecord, UserProfile } from '../types';
import { soundManager } from '../utils/audio';

interface StatsModalProps {
  highScores: HighScoreRecord;
  profile: UserProfile;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  highScores,
  profile,
  onClose,
}) => {
  const totalScoreAllModes =
    highScores.classic + highScores.wallWrap + highScores.timeAttack + highScores.obstacles;

  return (
    <div
      id="stats-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Career & Stats</h2>
              <p className="text-xs text-slate-400">Lifetime performance records</p>
            </div>
          </div>

          <button
            id="close-stats-modal-btn"
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 py-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Apple className="w-3.5 h-3.5 text-rose-400" /> Total Apples
              </span>
              <span className="text-2xl font-black font-mono text-white mt-1">
                {profile.totalApples}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Games Played
              </span>
              <span className="text-2xl font-black font-mono text-amber-400 mt-1">
                {profile.totalGames}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Total XP Earned
              </span>
              <span className="text-2xl font-black font-mono text-cyan-400 mt-1">
                {profile.xp} XP
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" /> Total Mode Best
              </span>
              <span className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {totalScoreAllModes}
              </span>
            </div>
          </div>

          {/* High Scores per Mode */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Personal High Scores
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 px-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="flex items-center gap-2 font-bold text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" /> Classic Mode
                </span>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  {highScores.classic} pts
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 px-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="flex items-center gap-2 font-bold text-slate-300">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" /> Wall Wrap
                </span>
                <span className="font-mono font-black text-indigo-400 text-sm">
                  {highScores.wallWrap} pts
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 px-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="flex items-center gap-2 font-bold text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-rose-400" /> Time Attack
                </span>
                <span className="font-mono font-black text-rose-400 text-sm">
                  {highScores.timeAttack} pts
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 px-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="flex items-center gap-2 font-bold text-slate-300">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Obstacles
                </span>
                <span className="font-mono font-black text-amber-400 text-sm">
                  {highScores.obstacles} pts
                </span>
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
            Close Stats
          </button>
        </div>
      </div>
    </div>
  );
};
