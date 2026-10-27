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
  profile: { id: "mock-123", displayName: "Moosa", friendCode: "IST-MOOSA" },
  friendIds: [],
  theme: "purple",
  lastSeenVersion: "1.2.0", // older version so What's New modal automatically pops up
  accountability: {
    "2026-10-27": {
      date: "2026-10-27",
      answers: { q1: 2, q2: 2, q3: 2, q4: 2, q5: 2, q6: 2 },
      score: 100,
      note: "Consistent day Alhamdullilah",
      updatedAt: "2026-10-27T10:00:00Z"
    }
  }
};

ipcMain.handle('storage:load', async () => mockStorage);
ipcMain.handle('storage:save', async (e, d) => {
  mockStorage = { ...mockStorage, ...d };
  return { success: true };
});
ipcMain.handle('storage:get-path', () => 'test-storage');
ipcMain.handle('friends:register-profile', async () => ({ success: true, profile: mockStorage.profile }));
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

  // Wait 1 second for initialization
  await new Promise(r => setTimeout(r, 1000));

  // 1. Capture What's New modal
  const imgWhatsNew = await win.webContents.capturePage();
  fs.writeFileSync(path.join(brainDir, 'v121-whatsnew-modal.png'), imgWhatsNew.toPNG());
  console.log('Saved v121-whatsnew-modal.png');

  // Dismiss What's New modal
  await win.webContents.executeJavaScript(`
    document.getElementById('btnDismissWhatsNew').click();
  `);
  await new Promise(r => setTimeout(r, 400));

  // 2. Navigate to Accountability view & capture quote card
  await win.webContents.executeJavaScript(`
    document.getElementById('navAccountability').click();
  `);
  await new Promise(r => setTimeout(r, 600));

  const imgAccountability = await win.webContents.capturePage();
  fs.writeFileSync(path.join(brainDir, 'v121-accountability-quote.png'), imgAccountability.toPNG());
  console.log('Saved v121-accountability-quote.png');

  // 3. Navigate to Settings & capture theme picker
  await win.webContents.executeJavaScript(`
    document.getElementById('navSettings').click();
  `);
  await new Promise(r => setTimeout(r, 600));

  const imgSettings = await win.webContents.capturePage();
  fs.writeFileSync(path.join(brainDir, 'v121-settings-themes.png'), imgSettings.toPNG());
  console.log('Saved v121-settings-themes.png');

  // 4. Switch to Rose Pink theme & capture
  await win.webContents.executeJavaScript(`
    const pinkBtn = document.querySelector('.theme-choice-btn[data-theme-id="pink"]');
    if (pinkBtn) pinkBtn.click();
    document.getElementById('navToday').click();
  `);
  await new Promise(r => setTimeout(r, 600));

  const imgPinkTheme = await win.webContents.capturePage();
  fs.writeFileSync(path.join(brainDir, 'v121-theme-pink.png'), imgPinkTheme.toPNG());
  console.log('Saved v121-theme-pink.png');

  // 5. Switch to Emerald Green theme & capture
  await win.webContents.executeJavaScript(`
    const greenBtn = document.querySelector('.theme-choice-btn[data-theme-id="green"]');
    if (greenBtn) greenBtn.click();
  `);
  await new Promise(r => setTimeout(r, 600));

  const imgGreenTheme = await win.webContents.capturePage();
  fs.writeFileSync(path.join(brainDir, 'v121-theme-green.png'), imgGreenTheme.toPNG());
  console.log('Saved v121-theme-green.png');

  console.log('All tests completed successfully!');
  app.quit();
});
