// =============================================================================
// Istiqamah - Secure Preload Bridge (preload.js)
// -----------------------------------------------------------------------------
// This script acts as a secure bridge between the Electron main process (main.js)
// and the user interface running in the browser window (renderer.js).
// It exposes only safe, specific functions to `window.istiqamahAPI`.
// =============================================================================

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('istiqamahAPI', {
  /**
   * Loads the saved habit tracking data from the user data JSON file.
   * @returns {Promise<Object|null>} Saved data object or null if none exists.
   */
  loadData: () => ipcRenderer.invoke('storage:load'),

  /**
   * Saves current habit tracking data to the user data JSON file.
   * @param {Object} data - The data object to persist.
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  saveData: (data) => ipcRenderer.invoke('storage:save', data),

  /**
   * Gets the file system path where data is saved on the user's computer.
   * @returns {Promise<string>}
   */
  getDataFilePath: () => ipcRenderer.invoke('storage:get-path')
});

contextBridge.exposeInMainWorld('friendsAPI', {
  registerProfile: (opts) => ipcRenderer.invoke('friends:register-profile', opts),
  syncProgress: (opts) => ipcRenderer.invoke('friends:sync-progress', opts),
  lookupFriendCode: (opts) => ipcRenderer.invoke('friends:lookup-code', opts),
  fetchFriendsProgress: (opts) => ipcRenderer.invoke('friends:fetch-progress', opts)
});

contextBridge.exposeInMainWorld('updaterAPI', {
  checkForUpdates: () => ipcRenderer.invoke('updater:check'),
  installUpdate: () => ipcRenderer.invoke('updater:install'),
  onUpdateAvailable: (cb) => ipcRenderer.on('updater:available', (e, info) => cb(info)),
  onUpdateDownloaded: (cb) => ipcRenderer.on('updater:downloaded', (e, info) => cb(info)),
  onDownloadProgress: (cb) => ipcRenderer.on('updater:progress', (e, progress) => cb(progress)),
  onUpdateError: (cb) => ipcRenderer.on('updater:error', (e, err) => cb(err))
});
