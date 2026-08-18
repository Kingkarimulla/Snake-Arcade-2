import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { GameBackupPayload, GoogleDriveBackupFile } from '../types';

// Initialize Firebase App instance
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Configure Google Auth Provider with Google Drive Scopes
export const DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.activity',
];

const provider = new GoogleAuthProvider();
DRIVE_SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'select_account',
});

// Flag to track interactive sign-in flow
let isSigningIn = false;
// Cache the access token strictly in-memory (per workspace-integration security requirements)
let cachedAccessToken: string | null = null;

/**
 * Initialize auth listener to keep session state in sync
 */
export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // User logged in via Firebase session, but needs interactive Drive token
        if (onAuthSuccess) onAuthSuccess(user, null);
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Interactive Google Sign-In with Drive Scopes
 */
export const signInWithGoogleDrive = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Could not obtain Google Drive OAuth access token');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request'
    ) {
      // User closed or dismissed the popup window before finishing sign-in
      return null;
    }
    console.error('Google Drive OAuth sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Get current in-memory access token
 */
export const getDriveAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Set in-memory access token manually (e.g. from popup callback)
 */
export const setDriveAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

/**
 * Sign out from Google Auth and clear in-memory token
 */
export const signOutGoogleDrive = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

// ==========================================
// GOOGLE DRIVE REST API v3 METHODS
// ==========================================

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3';

/**
 * List snake game cloud save backups from Google Drive
 */
export const listDriveBackups = async (
  accessToken: string
): Promise<GoogleDriveBackupFile[]> => {
  try {
    // Query for JSON files or files containing 'SnakeGame' in the name
    const q = "trashed = false and (name contains 'SnakeGame' or mimeType = 'application/json')";
    const url = `${DRIVE_API_URL}/files?q=${encodeURIComponent(
      q
    )}&fields=files(id,name,mimeType,modifiedTime,size,description,createdTime)&orderBy=modifiedTime desc&pageSize=20`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Google Drive API error (${res.status})`);
    }

    const data = await res.json();
    return (data.files || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      modifiedTime: f.modifiedTime,
      size: f.size,
      description: f.description,
      createdTime: f.createdTime,
    }));
  } catch (err: any) {
    console.error('Error fetching Google Drive backups:', err);
    throw err;
  }
};

/**
 * Upload or Create a New Cloud Save Backup in Google Drive
 */
export const uploadSaveToDrive = async (
  accessToken: string,
  backupData: GameBackupPayload,
  customName?: string
): Promise<GoogleDriveBackupFile> => {
  try {
    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const fileName =
      customName && customName.trim().length > 0
        ? (customName.endsWith('.json') ? customName : `${customName}.json`)
        : `SnakeGame_CloudSave_${timestampStr}.json`;

    const highScoresList = Object.values(backupData.highScores).map((v) => Number(v) || 0);
    const maxScore = highScoresList.length > 0 ? Math.max(...highScoresList) : 0;

    const metadata = {
      name: fileName,
      mimeType: 'application/json',
      description: `Retro Snake Game Cloud Save - High Score: ${maxScore} pts | Level ${backupData.userProfile.level} | ${backupData.userProfile.name}`,
    };

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(backupData, null, 2) +
      closeDelimiter;

    const res = await fetch(`${DRIVE_UPLOAD_URL}/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,size,description,createdTime`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Failed to upload to Google Drive (${res.status})`);
    }

    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      modifiedTime: data.modifiedTime,
      size: data.size,
      description: data.description,
      createdTime: data.createdTime,
    };
  } catch (err: any) {
    console.error('Error uploading save to Google Drive:', err);
    throw err;
  }
};

/**
 * Download and parse a game save file from Google Drive
 */
export const downloadSaveFromDrive = async (
  accessToken: string,
  fileId: string
): Promise<GameBackupPayload> => {
  try {
    const res = await fetch(`${DRIVE_API_URL}/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Failed to download file from Google Drive (${res.status})`);
    }

    const data = await res.json();
    if (!data.highScores || !data.userProfile || !data.settings) {
      throw new Error('Invalid game save format. The selected file does not appear to be a Snake Game cloud save.');
    }
    return data as GameBackupPayload;
  } catch (err: any) {
    console.error('Error downloading save from Google Drive:', err);
    throw err;
  }
};

/**
 * Delete a file from Google Drive
 * NOTE: User confirmation MUST be handled in the UI before calling this!
 */
export const deleteDriveFile = async (
  accessToken: string,
  fileId: string
): Promise<void> => {
  try {
    const res = await fetch(`${DRIVE_API_URL}/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok && res.status !== 204) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Failed to delete file from Google Drive (${res.status})`);
    }
  } catch (err: any) {
    console.error('Error deleting file from Google Drive:', err);
    throw err;
  }
};

/**
 * Export high-score trophy certificate file directly to Google Drive
 */
export const exportCertificateToDrive = async (
  accessToken: string,
  certificate: {
    playerName: string;
    score: number;
    mode: string;
    level: number;
    timestamp: number;
  }
): Promise<GoogleDriveBackupFile> => {
  const content = `=====================================================
          RETRO SNAKE 2026 - OFFICIAL TROPHY
=====================================================
Champion Player : ${certificate.playerName}
Score Achieved  : ${certificate.score} PTS
Game Mode       : ${certificate.mode}
Player Level    : Level ${certificate.level}
Date Verified   : ${new Date(certificate.timestamp).toLocaleString()}
Certificate ID  : SNK-${Math.random().toString(36).substring(2, 10).toUpperCase()}

Google Drive Cloud Verified Save Certificate.
=====================================================`;

  const fileName = `Snake_Trophy_${certificate.playerName}_${certificate.score}pts.txt`;
  const metadata = {
    name: fileName,
    mimeType: 'text/plain',
    description: `Snake Arcade High Score Trophy Certificate for ${certificate.playerName}`,
  };

  const boundary = '-------cert314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/plain\r\n\r\n' +
    content +
    closeDelimiter;

  const res = await fetch(`${DRIVE_UPLOAD_URL}/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,size,description,createdTime`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || `Failed to export trophy certificate (${res.status})`);
  }

  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    modifiedTime: data.modifiedTime,
    size: data.size,
    description: data.description,
    createdTime: data.createdTime,
  };
};
