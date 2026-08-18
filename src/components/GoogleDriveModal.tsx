import React, { useState, useEffect } from 'react';
import {
  X,
  HardDrive,
  CloudUpload,
  CloudDownload,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Trophy,
  ShieldCheck,
  Award,
  LogOut,
  AlertTriangle,
  FolderOpen,
  ArrowRight,
} from 'lucide-react';
import {
  UserProfile,
  HighScoreRecord,
  GameSettings,
  DailyQuest,
  Achievement,
  GoogleDriveBackupFile,
  GameBackupPayload,
} from '../types';
import {
  signInWithGoogleDrive,
  signOutGoogleDrive,
  getDriveAccessToken,
  listDriveBackups,
  uploadSaveToDrive,
  downloadSaveFromDrive,
  deleteDriveFile,
  exportCertificateToDrive,
} from '../utils/googleDrive';
import { soundManager } from '../utils/audio';

interface GoogleDriveModalProps {
  userProfile: UserProfile;
  highScores: HighScoreRecord;
  settings: GameSettings;
  quests: DailyQuest[];
  achievements: Achievement[];
  onClose: () => void;
  onRestoreSave: (payload: GameBackupPayload) => void;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  userProfile,
  highScores,
  settings,
  quests,
  achievements,
  onClose,
  onRestoreSave,
  onUpdateProfile,
}) => {
  const [token, setToken] = useState<string | null>(getDriveAccessToken());
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [files, setFiles] = useState<GoogleDriveBackupFile[]>([]);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Backup custom name input
  const [customBackupName, setCustomBackupName] = useState('');
  const [showCustomNameInput, setShowCustomNameInput] = useState(false);

  // Destructive Delete Confirmation State (Mandatory requirement for Workspace APIs)
  const [fileToDelete, setFileToDelete] = useState<GoogleDriveBackupFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Overwrite Restore Confirmation State
  const [fileToRestore, setFileToRestore] = useState<GoogleDriveBackupFile | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  // Load backups when token is ready
  const loadBackups = async (activeToken: string) => {
    setIsLoading(true);
    try {
      const backupFiles = await listDriveBackups(activeToken);
      setFiles(backupFiles);
      setStatusMessage(null);
    } catch (err: any) {
      console.error('Failed to load Drive files:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Could not fetch files from Google Drive.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentToken = getDriveAccessToken();
    if (currentToken) {
      setToken(currentToken);
      loadBackups(currentToken);
    }
  }, []);

  // Handle Google Drive OAuth Login
  const handleConnectDrive = async () => {
    setIsAuthenticating(true);
    setStatusMessage(null);
    soundManager.playClickSound(settings.soundEnabled);
    try {
      const result = await signInWithGoogleDrive();
      if (result) {
        setToken(result.accessToken);
        // Update user profile if not marked as Google user
        if (!userProfile.isGoogleUser || !userProfile.email) {
          const updated: UserProfile = {
            ...userProfile,
            email: result.user.email || userProfile.email,
            name: userProfile.name === 'Retro Viper' && result.user.displayName ? result.user.displayName : userProfile.name,
            isGoogleUser: true,
            avatarUrl: result.user.photoURL || userProfile.avatarUrl,
            title: 'Google Drive Sync Master',
          };
          onUpdateProfile(updated);
        }
        setStatusMessage({
          type: 'success',
          text: 'Connected to Google Drive! Fetching cloud saves...',
        });
        soundManager.playAchievementSound();
        await loadBackups(result.accessToken);
      } else {
        setStatusMessage({
          type: 'info',
          text: 'Sign-in popup was closed. Tap Authorize to try again.',
        });
      }
    } catch (err: any) {
      console.warn('Drive connection error:', err);
      let userFriendlyMessage = 'Failed to authenticate with Google Drive.';
      if (err?.code === 'auth/popup-blocked') {
        userFriendlyMessage = 'Sign-in popup was blocked by browser. Please allow popups for this site.';
      } else if (err?.code === 'auth/network-request-failed') {
        userFriendlyMessage = 'Network error. Please check your internet connection.';
      } else if (err?.message) {
        userFriendlyMessage = err.message;
      }
      setStatusMessage({
        type: 'error',
        text: userFriendlyMessage,
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle Google Disconnect
  const handleDisconnect = async () => {
    soundManager.playClickSound(settings.soundEnabled);
    await signOutGoogleDrive();
    setToken(null);
    setFiles([]);
    setStatusMessage({
      type: 'info',
      text: 'Disconnected from Google Drive session.',
    });
  };

  // Perform Cloud Save to Drive
  const handleCreateBackup = async () => {
    if (!token) {
      handleConnectDrive();
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    soundManager.playClickSound(settings.soundEnabled);

    try {
      const payload: GameBackupPayload = {
        version: '2.0.0',
        timestamp: Date.now(),
        appName: 'Retro Snake 2026',
        userProfile,
        highScores,
        settings,
        achievements,
        quests,
        notes: `Cloud Save by ${userProfile.name}`,
      };

      const newFile = await uploadSaveToDrive(
        token,
        payload,
        customBackupName.trim() || undefined
      );

      soundManager.playAchievementSound();
      setStatusMessage({
        type: 'success',
        text: `Cloud save "${newFile.name}" created in Google Drive!`,
      });
      setCustomBackupName('');
      setShowCustomNameInput(false);
      await loadBackups(token);
    } catch (err: any) {
      console.error('Backup error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to create cloud backup.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Perform Restore with Confirmation
  const confirmRestore = async () => {
    if (!token || !fileToRestore) return;
    setIsRestoring(true);
    setStatusMessage(null);
    soundManager.playClickSound(settings.soundEnabled);

    try {
      const backupData = await downloadSaveFromDrive(token, fileToRestore.id);
      onRestoreSave(backupData);
      soundManager.playAchievementSound();
      setStatusMessage({
        type: 'success',
        text: `Successfully restored game progress from "${fileToRestore.name}"!`,
      });
      setFileToRestore(null);
    } catch (err: any) {
      console.error('Restore error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to restore game save.',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  // Perform Delete with Explicit User Confirmation (Workspace Safety Rule)
  const confirmDelete = async () => {
    if (!token || !fileToDelete) return;
    setIsDeleting(true);
    soundManager.playClickSound(settings.soundEnabled);

    try {
      await deleteDriveFile(token, fileToDelete.id);
      setStatusMessage({
        type: 'success',
        text: `Deleted "${fileToDelete.name}" from Google Drive.`,
      });
      setFileToDelete(null);
      await loadBackups(token);
    } catch (err: any) {
      console.error('Delete error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to delete file from Google Drive.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Export High Score Trophy Certificate
  const handleExportCertificate = async () => {
    if (!token) {
      handleConnectDrive();
      return;
    }

    setIsLoading(true);
    soundManager.playClickSound(settings.soundEnabled);
    try {
      const scoreValues = Object.values(highScores).map((v) => Number(v) || 0);
      const bestScore = scoreValues.length > 0 ? Math.max(...scoreValues) : 0;
      const certFile = await exportCertificateToDrive(token, {
        playerName: userProfile.name,
        score: bestScore,
        mode: settings.gameMode,
        level: userProfile.level,
        timestamp: Date.now(),
      });

      soundManager.playAchievementSound();
      setStatusMessage({
        type: 'success',
        text: `Trophy certificate "${certFile.name}" saved to your Google Drive!`,
      });
      await loadBackups(token);
    } catch (err: any) {
      console.error('Certificate error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to export trophy certificate.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scoreValues = Object.values(highScores).map((v) => Number(v) || 0);
  const highestScore = scoreValues.length > 0 ? Math.max(...scoreValues) : 0;

  return (
    <div
      id="google-drive-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Background glowing accents */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Google Drive Cloud Saves</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Drive v3
                </span>
              </div>
              <p className="text-xs text-slate-400">Sync, backup & restore your snake career in Google Drive</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClickSound(settings.soundEnabled);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Notification Banner */}
        {statusMessage && (
          <div
            className={`mt-3 p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 animate-in fade-in ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                : 'bg-blue-950/60 border-blue-500/40 text-blue-300'
            }`}
          >
            {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {statusMessage.type === 'info' && <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />}
            <span className="leading-tight">{statusMessage.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="py-3.5 space-y-4 overflow-y-auto pr-1">
          {/* Connection Status & Auth Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 87.3 78">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Google Drive Integration</span>
                  {token ? (
                    <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5" /> Authorized
                    </span>
                  ) : (
                    <span className="px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                      Not Connected
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  {token && userProfile.email
                    ? `Authorized for ${userProfile.email}`
                    : 'Access files with your Google Drive permissions'}
                </p>
              </div>
            </div>

            {token ? (
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => loadBackups(token)}
                  disabled={isLoading}
                  title="Refresh Drive files"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleDisconnect}
                  className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3 h-3" /> Disconnect
                </button>
              </div>
            ) : (
              <button
                id="connect-drive-btn"
                onClick={handleConnectDrive}
                disabled={isAuthenticating}
                className="w-full sm:w-auto py-2 px-3.5 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{isAuthenticating ? 'Connecting...' : 'Authorize Google Drive'}</span>
              </button>
            )}
          </div>

          {/* Quick Stats & Local Save Preview */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Current Local Game Career</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold font-mono">
                Level {userProfile.level} • {userProfile.name}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Best Score</div>
                <div className="text-sm font-black text-amber-300">{highestScore} pts</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Total Apples</div>
                <div className="text-sm font-black text-emerald-300">{userProfile.totalApples}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Games Played</div>
                <div className="text-sm font-black text-cyan-300">{userProfile.totalGames}</div>
              </div>
            </div>

            {/* Backup Action Bar */}
            <div className="pt-2 space-y-2">
              {showCustomNameInput ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customBackupName}
                    onChange={(e) => setCustomBackupName(e.target.value)}
                    placeholder="Custom backup name (optional)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    onClick={handleCreateBackup}
                    disabled={isLoading}
                    className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CloudUpload className="w-3.5 h-3.5" /> Save
                  </button>
                  <button
                    onClick={() => setShowCustomNameInput(false)}
                    className="py-2 px-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    id="drive-backup-now-btn"
                    onClick={handleCreateBackup}
                    disabled={isLoading}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
                  >
                    <CloudUpload className="w-4 h-4" />
                    <span>{token ? 'Backup Current Save to Drive' : 'Sign In & Backup to Drive'}</span>
                  </button>

                  <button
                    onClick={() => setShowCustomNameInput(true)}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                  >
                    Name Save...
                  </button>

                  <button
                    onClick={handleExportCertificate}
                    disabled={isLoading}
                    title="Export verified High-Score Certificate file to Drive"
                    className="py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" /> Trophy File
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Drive Cloud Saves List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Files in Google Drive</span>
                {files.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-md bg-slate-800 text-slate-400 text-[10px]">
                    {files.length}
                  </span>
                )}
              </div>

              {token && (
                <button
                  onClick={() => loadBackups(token)}
                  disabled={isLoading}
                  className="text-[11px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                </button>
              )}
            </div>

            {!token ? (
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2">
                <HardDrive className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-300">Google Drive Not Connected</p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Connect your Google account above to browse, backup, and restore game saves securely in the cloud.
                </p>
              </div>
            ) : isLoading && files.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
                <p className="text-xs font-medium text-slate-400">Loading your Drive files...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-bold text-slate-300">No Cloud Saves Found</p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  You haven't backed up any Snake Game saves yet. Tap "Backup Current Save to Drive" above to create your first cloud snapshot.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-white truncate">{f.name}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 truncate">
                          <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-slate-500" />
                            {new Date(f.modifiedTime).toLocaleDateString()} {new Date(f.modifiedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {f.size && <span>• {(Number(f.size) / 1024).toFixed(1)} KB</span>}
                        </div>
                        {f.description && (
                          <div className="text-[10px] text-slate-400 truncate mt-0.5 max-w-xs">
                            {f.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setFileToRestore(f)}
                        title="Restore this cloud save"
                        className="py-1.5 px-2.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <CloudDownload className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Restore</span>
                      </button>

                      <button
                        onClick={() => setFileToDelete(f)}
                        title="Delete from Google Drive"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px]">Synced with Google Workspace Drive API</span>
          <button
            onClick={() => {
              soundManager.playClickSound(settings.soundEnabled);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* MANDATORY EXPLICIT CONFIRMATION MODAL FOR DELETION  */}
        {/* ---------------------------------------------------- */}
        {fileToDelete && (
          <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-white">Delete from Google Drive?</h3>
                <p className="text-xs text-slate-300">
                  Are you sure you want to permanently delete:
                </p>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-rose-300 truncate">
                  {fileToDelete.name}
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  This action will remove the backup from your Google Drive. This cannot be undone.
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setFileToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-rose-600/30"
                >
                  {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>{isDeleting ? 'Deleting...' : 'Delete File'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* EXPLICIT CONFIRMATION MODAL FOR RESTORE / OVERWRITE */}
        {/* ---------------------------------------------------- */}
        {fileToRestore && (
          <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-sm bg-slate-900 border border-blue-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto">
                <CloudDownload className="w-5 h-5" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-white">Restore Cloud Save?</h3>
                <p className="text-xs text-slate-300">
                  Restore game progress from file:
                </p>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-blue-300 truncate">
                  {fileToRestore.name}
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  This will load high scores, level stats, quest progress, and custom settings from this cloud backup.
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setFileToRestore(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRestore}
                  disabled={isRestoring}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  {isRestoring ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CloudDownload className="w-3.5 h-3.5" />}
                  <span>{isRestoring ? 'Restoring...' : 'Restore Save'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
