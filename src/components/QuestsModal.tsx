import React from 'react';
import { Target, Award, CheckCircle2, Sparkles, X, Gift } from 'lucide-react';
import { DailyQuest, Achievement, UserProfile } from '../types';
import { soundManager } from '../utils/audio';

interface QuestsModalProps {
  quests: DailyQuest[];
  achievements: Achievement[];
  userProfile: UserProfile;
  onClaimQuest: (questId: string) => void;
  onClose: () => void;
}

export const QuestsModal: React.FC<QuestsModalProps> = ({
  quests,
  achievements,
  userProfile,
  onClaimQuest,
  onClose,
}) => {
  const [activeTab, setActiveTab] = React.useState<'QUESTS' | 'ACHIEVEMENTS'>('QUESTS');

  return (
    <div
      id="quests-achievements-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Quests & Trophies</h2>
              <p className="text-xs text-slate-400">Complete missions to earn XP & rank up</p>
            </div>
          </div>

          <button
            id="close-quests-modal-btn"
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-2 pt-3 pb-1">
          <button
            onClick={() => {
              soundManager.playClickSound();
              setActiveTab('QUESTS');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'QUESTS'
                ? 'bg-slate-800 border border-emerald-500/60 text-white shadow-md shadow-emerald-500/10'
                : 'bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:bg-slate-800/40'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-400" /> Daily Quests
          </button>

          <button
            onClick={() => {
              soundManager.playClickSound();
              setActiveTab('ACHIEVEMENTS');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'ACHIEVEMENTS'
                ? 'bg-slate-800 border border-amber-500/60 text-white shadow-md shadow-amber-500/10'
                : 'bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:bg-slate-800/40'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" /> Trophies ({achievements.filter((a) => a.unlocked).length}/{achievements.length})
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 py-3">
          {activeTab === 'QUESTS' ? (
            quests.map((q) => {
              const progressPct = Math.min(100, Math.round((q.current / q.target) * 100));
              return (
                <div
                  key={q.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between gap-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{q.title}</h4>
                      <p className="text-xs text-slate-400">{q.desc}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                      +{q.rewardXp} XP
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400 font-bold">Progress</span>
                      <span className="text-emerald-400 font-bold">
                        {q.current} / {q.target}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Claim Button */}
                  {q.completed && !q.claimed && (
                    <button
                      onClick={() => {
                        soundManager.playAchievementSound();
                        onClaimQuest(q.id);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer animate-pulse"
                    >
                      <Gift className="w-4 h-4" /> Claim +{q.rewardXp} XP!
                    </button>
                  )}

                  {q.claimed && (
                    <div className="py-1 text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Reward Claimed
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            achievements.map((ach) => {
              return (
                <div
                  key={ach.id}
                  className={`border rounded-2xl p-3.5 flex items-center justify-between gap-3 ${
                    ach.unlocked
                      ? 'bg-slate-950/80 border-amber-500/40 shadow-sm shadow-amber-500/5'
                      : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      {ach.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                        {ach.unlocked && (
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{ach.desc}</p>
                    </div>
                  </div>

                  <div>
                    {ach.unlocked ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500">
                        {ach.progress}/{ach.maxProgress}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
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
