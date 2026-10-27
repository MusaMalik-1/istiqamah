const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const brainDir = path.resolve('C:/Users/Moosa Malik/.gemini/antigravity/brain/09c18d9c-c589-469d-9f87-24ffe08bc3ba/screenshots');
if (!fs.existsSync(brainDir)) {
  fs.mkdirSync(brainDir, { recursive: true });
}

let mockStorage = {
  lastDate: "2026-10-27",
  history: {},
  streaks: { current: 3, best: 7 },
  profile: { id: "mock-123", displayName: "You", friendCode: "IST-WPU4" },
  friendIds: [],
  theme: "purple",
  lastSeenVersion: "1.2.1"
};

ipcMain.handle('storage:load', async () => mockStorage);
ipcMain.handle('storage:save', async (e, d) => {
  mockStorage = { ...mockStorage, ...d };
  return { success: true };
});
ipcMain.handle('storage:get-path', () => 'test-storage');
ipcMain.handle('friends:register-profile', async (e, { existingProfile, displayName }) => {
  mockStorage.profile.displayName = displayName;
  return { success: true, profile: { ...mockStorage.profile, displayName } };
});
ipcMain.handle('friends:sync-progress', async () => ({ success: true }));
ipcMain.handle('friends:lookup-code', async () => ({ success: false, error: 'Not found' }));
ipcMain.handle('friends:fetch-progress', async () => ({ success: true, friends: [] }));

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 850,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  await win.loadFile(path.join(__dirname, '..', 'index.html'));
  await new Promise(r => setTimeout(r, 600));

  // 1. Navigate to Friends view
  await win.webContents.executeJavaScript(`
    document.getElementById('navFriends').click();
  `);
  await new Promise(r => setTimeout(r, 400));

  // 2. Click "Edit Name" button
  await win.webContents.executeJavaScript(`
    document.getElementById('btnEditDisplayName').click();
  `);
  await new Promise(r => setTimeout(r, 400));

  // Capture modal screenshot
  const imgModal = await win.webContents.capturePage();
  fs.writeFileSync(path.join(brainDir, 'v122-edit-name-modal.png'), imgModal.toPNG());
  console.log('Saved v122-edit-name-modal.png');

  // 3. Type new name and click Save
  const saveResult = await win.webContents.executeJavaScript(`
    document.getElementById('inputEditDisplayName').value = 'Moosa Malik';
    document.getElementById('btnSaveDisplayNameSubmit').click();
  `);
  await new Promise(r => setTimeout(r, 600));

  // 4. Check updated text
  const updatedName = await win.webContents.executeJavaScript(`
    document.getElementById('userDisplayNameText').textContent;
  `);
  console.log('Updated display name text in UI:', updatedName);

  // Capture updated view screenshot
  const imgUpdated = await win.webContents.capturePage();
  fs.writeFileSync(path.join(brainDir, 'v122-edit-name-saved.png'), imgUpdated.toPNG());
  console.log('Saved v122-edit-name-saved.png');

  app.quit();
});
