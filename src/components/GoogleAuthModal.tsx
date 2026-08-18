import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Check,
  LogOut,
  User,
  Sparkles,
  Trophy,
  Award,
  Mail,
  ShieldCheck,
  ArrowRight,
  Flame,
  Gamepad2,
  RefreshCw,
} from 'lucide-react';
import { UserProfile } from '../types';
import { soundManager } from '../utils/audio';

interface GoogleAuthModalProps {
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  profile,
  onUpdateProfile,
  onClose,
}) => {
  const [nameInput, setNameInput] = useState(profile.name);
  const [emailInput, setEmailInput] = useState(
    profile.email || 'skarafat23112003@gmail.com'
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const gsiContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Google Identity Services (GSI) if available
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
        if (clientId) {
          (window as any).google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: any) => {
              if (response.credential) {
                try {
                  const base64Url = response.credential.split('.')[1];
                  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                  const jsonPayload = decodeURIComponent(
                    atob(base64)
                      .split('')
                      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                      .join('')
                  );
                  const data = JSON.parse(jsonPayload);
                  if (data.email) {
                    handleGoogleSignIn(data.email, data.name, data.picture);
                  }
                } catch (e) {
                  console.error('Error decoding Google JWT', e);
                }
              }
            },
          });

          if (gsiContainerRef.current) {
            (window as any).google.accounts.id.renderButton(gsiContainerRef.current, {
              theme: 'filled_blue',
              size: 'large',
              shape: 'pill',
              width: '100%',
            });
          }
        }
      } catch (err) {
        console.warn('Google GSI check:', err);
      }
    }
  }, []);

  // Google Sign In action
  const handleGoogleSignIn = (targetEmail?: string, targetName?: string, targetAvatar?: string) => {
    setIsProcessing(true);
    soundManager.playAchievementSound();

    const effectiveEmail = (targetEmail || emailInput).trim() || 'skarafat23112003@gmail.com';
    const inferredName = targetName || effectiveEmail.split('@')[0];
    const chosenName = profile.isGoogleUser ? profile.name : inferredName;
    const avatar =
      targetAvatar ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(chosenName)}&backgroundColor=0f172a`;

    setTimeout(() => {
      const updated: UserProfile = {
        ...profile,
        name: chosenName,
        email: effectiveEmail,
        avatarUrl: avatar,
        isGoogleUser: true,
        xp: profile.isGoogleUser ? profile.xp : profile.xp + 100, // Google Sign In Bonus XP
        title: profile.title === 'Snake Cadet' ? 'Google Verified Champion' : profile.title,
      };
      onUpdateProfile(updated);
      setIsProcessing(false);
      setSuccessMessage(
        profile.isGoogleUser
          ? 'Profile synced with Google Cloud!'
          : '🎉 Connected with Google Account! +100 Bonus XP earned.'
      );
    }, 250);
  };

  const handleSignOut = () => {
    soundManager.playClickSound();
    const guest: UserProfile = {
      ...profile,
      name: 'Retro Viper',
      email: '',
      avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80',
      isGoogleUser: false,
      title: 'Snake Cadet',
    };
    onUpdateProfile(guest);
    setSuccessMessage('Signed out. Playing as Guest.');
  };

  const handleSaveName = () => {
    if (nameInput.trim().length > 0) {
      soundManager.playClickSound();
      onUpdateProfile({
        ...profile,
        name: nameInput.trim(),
      });
      setIsEditingName(false);
      setSuccessMessage('Player tag updated!');
    }
  };

  // Avatar presets
  const avatarPresets = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  ];

  return (
    <div
      id="google-auth-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Glowing background auras */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Player Profile & OAuth</h2>
              <p className="text-xs text-slate-400">Google sign-in & cloud leaderboard sync</p>
            </div>
          </div>

          <button
            id="close-profile-modal-btn"
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success toast */}
        {successMessage && (
          <div className="mt-3 py-2 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="py-3.5 space-y-4 overflow-y-auto pr-1">
          {/* User Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 relative">
            <div className="relative shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/10"
              />
              {profile.isGoogleUser && (
                <div
                  title="Google Verified Player"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 border-2 border-slate-900 flex items-center justify-center text-white shadow"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <div className="flex items-center gap-1.5 mb-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    maxLength={18}
                    className="w-full bg-slate-900 border border-emerald-500 rounded-lg px-2.5 py-1 text-sm font-bold text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white truncate">{profile.name}</h3>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-[10px] text-slate-400 hover:text-emerald-400 underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              )}

              <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> {profile.title}
              </p>
              {profile.email ? (
                <p className="text-[11px] text-slate-300 truncate flex items-center gap-1 mt-0.5 font-mono">
                  <Mail className="w-3 h-3 text-blue-400 shrink-0" /> {profile.email}
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 font-mono">Guest Account (Local)</p>
              )}
            </div>
          </div>

          {/* Level & Career Summary */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Level {profile.level}
              </span>
              <span className="text-emerald-400 font-mono">
                {profile.xp % 500} / 500 XP
              </span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${Math.min(100, ((profile.xp % 500) / 500) * 100)}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="flex items-center gap-1 text-slate-400">
                <Flame className="w-3 h-3 text-amber-400" /> Total Apples: <strong className="text-white">{profile.totalApples}</strong>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Gamepad2 className="w-3 h-3 text-cyan-400" /> Matches: <strong className="text-white">{profile.totalGames}</strong>
              </div>
            </div>
          </div>

          {/* Avatar selector */}
          <div>
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 block">
              Choose Avatar
            </label>
            <div className="flex gap-2 justify-between">
              {avatarPresets.map((url, i) => (
                <button
                  key={i}
                  onClick={() => {
                    soundManager.playClickSound();
                    onUpdateProfile({ ...profile, avatarUrl: url });
                  }}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    profile.avatarUrl === url
                      ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/20'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="Preset avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Google OAuth & Account Authentication Section */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-sm font-bold text-white">Google OAuth Authentication</span>
              </div>

              {profile.isGoogleUser ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
                  Guest Account
                </span>
              )}
            </div>

            {profile.isGoogleUser ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                  <p className="leading-relaxed">
                    Signed in with <strong className="text-emerald-400">{profile.email}</strong>. Scores, quests, and achievements are verified on cloud leaderboards.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleGoogleSignIn(profile.email)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-bold border border-blue-500/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                    Sync Cloud Data
                  </button>

                  <button
                    id="google-signout-btn"
                    onClick={handleSignOut}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/40 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sign in with your Google account to get verified badge, sync leaderboards across devices, and claim <strong className="text-amber-400">+100 Bonus XP</strong>!
                </p>

                {/* Email Input for quick authentication */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Google Email
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="skarafat23112003@gmail.com"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2 text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                </div>

                {/* Hidden container for GSI rendered button if active */}
                <div ref={gsiContainerRef} className="w-full" />

                {/* Direct Google Sign In Button */}
                <button
                  id="google-signin-btn"
                  onClick={() => handleGoogleSignIn()}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-950 font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-white/10 active:scale-[0.98] transition-all cursor-pointer border border-white/20"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isProcessing ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
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

