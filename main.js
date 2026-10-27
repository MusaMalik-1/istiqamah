// =============================================================================
// Istiqamah - Desktop App Main Process (main.js)
// -----------------------------------------------------------------------------
// This file is the "brain" of the Electron desktop app.
// It creates the application window, sets up the window icon, handles operating
// system events, and securely manages saving and loading data to a local JSON file.
// =============================================================================

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Set Application User Model ID for Windows taskbar icon
if (process.platform === 'win32') {
  app.setAppUserModelId('com.istiqamah.tracker');
}

// Global reference to window object
let mainWindow = null;

// Determine path to local storage JSON file in the user's application data folder
const getUserDataFilePath = () => {
  const userDataDir = app.getPath('userData');
  return path.join(userDataDir, 'istiqamah-data.json');
};

/**
 * Creates the primary application window.
 */
function createWindow() {
  const iconPath = path.join(__dirname, 'build', 'icon.png');

  mainWindow = new BrowserWindow({
    width: 920,
    height: 720,
    minWidth: 640,
    minHeight: 520,
    title: 'Istiqamah',
    center: true,
    backgroundColor: '#0d0d12',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Remove default menu bar for a clean, modern aesthetic
  mainWindow.setMenuBarVisibility(false);

  // Load the main HTML user interface
  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// -----------------------------------------------------------------------------
// IPC (Inter-Process Communication) Handlers
// -----------------------------------------------------------------------------

// Handler: Load saved progress from the local JSON file
ipcMain.handle('storage:load', async () => {
  const filePath = getUserDataFilePath();
  try {
    if (!fs.existsSync(filePath)) {
      return null; // File does not exist yet (first run)
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (!fileContent.trim()) {
      return null;
    }

    const parsedData = JSON.parse(fileContent);
    return parsedData;
  } catch (error) {
    console.error('Warning: Could not read or parse data file. Starting fresh.', error);
    return null;
  }
});

// Handler: Save progress to the local JSON file
ipcMain.handle('storage:save', async (event, data) => {
  const filePath = getUserDataFilePath();
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, jsonString, 'utf8');
    fs.renameSync(tempPath, filePath);
    return { success: true };
  } catch (error) {
    console.error('Error saving data to local storage:', error);
    return { success: false, error: error.message };
  }
});

// Handler: Get the directory path where user data is saved
ipcMain.handle('storage:get-path', () => {
  return getUserDataFilePath();
});

// Friends & Social Synchronization (Supabase)
const supabaseClient = require('./supabase-client');

// Auto-Updater Integration (GitHub Releases)
const { autoUpdater } = require('electron-updater');
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

function setupAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    console.log('[AutoUpdater] Checking for updates on GitHub...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('[AutoUpdater] Update available:', info.version);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:available', info);
    }
  });

  autoUpdater.on('download-progress', (progressObj) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:progress', progressObj);
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('[AutoUpdater] Update downloaded successfully:', info.version);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:downloaded', info);
    }
  });

  autoUpdater.on('error', (err) => {
    console.warn('[AutoUpdater] Error during check/download:', err ? err.message : 'Unknown');
  });

  // Only auto-check when packaged in production
  if (app.isPackaged) {
    setTimeout(() => {
      autoUpdater.checkForUpdates().catch(e => {
        console.warn('[AutoUpdater] Check failed:', e.message);
      });
    }, 3000);
  }
}

ipcMain.handle('updater:check', async () => {
  if (app.isPackaged) {
    try {
      return await autoUpdater.checkForUpdates();
    } catch (e) {
      return { error: e.message };
    }
  }
  return { notPackaged: true };
});

ipcMain.handle('updater:install', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.handle('friends:register-profile', async (event, { existingProfile, displayName }) => {
  return await supabaseClient.registerOrGetProfile(existingProfile, displayName);
});

ipcMain.handle('friends:sync-progress', async (event, { profileId, stats, dateKey }) => {
  return await supabaseClient.syncDailyProgress(profileId, stats, dateKey);
});

ipcMain.handle('friends:lookup-code', async (event, { myProfileId, friendCode }) => {
  return await supabaseClient.lookupFriendByCode(myProfileId, friendCode);
});

ipcMain.handle('friends:fetch-progress', async (event, { friendIds, dateKey }) => {
  return await supabaseClient.fetchFriendsProgress(friendIds, dateKey);
});

// -----------------------------------------------------------------------------
// Electron App Lifecycle Events
// -----------------------------------------------------------------------------

app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
