const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mockStorage = {
  lastDate: "2026-10-26",
  history: {
    "2026-10-25": { completedTaskIds: ["prayer-fajr"], waterGlasses: 4, allRequiredDone: false }
  },
  streaks: { current: 1, best: 3 }
};

ipcMain.handle('storage:load', async () => mockStorage);
ipcMain.handle('storage:save', async (e, d) => ({ success: true }));
ipcMain.handle('storage:get-path', () => path.join(app.getPath('userData'), 'istiqamah-data.json'));

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    show: false,
    width: 1080,
    height: 840,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true
    }
  });

  await win.loadFile(path.join(__dirname, '..', 'index.html'));
  await new Promise(r => setTimeout(r, 1200));

  // 1. Capture Settings
  await win.webContents.executeJavaScript(`
    document.getElementById('navSettings').click();
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  `);
  await new Promise(r => setTimeout(r, 400));
  let img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, '..', 'build', 'screenshot-settings.png'), img.toPNG());
  console.log('Saved screenshot-settings.png');

  // 2. Capture Health Category Filtered
  await win.webContents.executeJavaScript(`
    document.getElementById('navToday').click();
    const btns = Array.from(document.querySelectorAll('.category-nav-btn'));
    const healthBtn = btns[2]; // Health
    if (healthBtn) healthBtn.click();
    // Fill 5 glasses of water
    const segs = document.querySelectorAll('.water-segment');
    if (segs[4]) segs[4].click();
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  `);
  await new Promise(r => setTimeout(r, 400));
  img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, '..', 'build', 'screenshot-health.png'), img.toPNG());
  console.log('Saved screenshot-health.png');

  app.quit();
});
