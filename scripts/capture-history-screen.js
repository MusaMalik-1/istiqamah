const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Do not disable hardware acceleration as it prevents Chromium offscreen repainting on Windows
// app.disableHardwareAcceleration();

let mockStorage = {
  lastDate: "2026-10-26",
  history: {
    "2026-10-20": { completedTaskIds: ["prayer-fajr"], waterGlasses: 4, allRequiredDone: false },
    "2026-10-21": { completedTaskIds: ["prayer-fajr", "prayer-dhuhr"], waterGlasses: 8, allRequiredDone: false },
    "2026-10-22": { completedTaskIds: Array(29).fill("t"), waterGlasses: 8, allRequiredDone: true },
    "2026-10-23": { completedTaskIds: Array(29).fill("t"), waterGlasses: 8, allRequiredDone: true }
  },
  streaks: { current: 2, best: 4 }
};

ipcMain.handle('storage:load', async () => mockStorage);
ipcMain.handle('storage:save', async (e, data) => { mockStorage = data; return { success: true }; });
ipcMain.handle('storage:get-path', () => path.join(app.getPath('userData'), 'istiqamah-data.json'));

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1080,
    height: 840,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true
    }
  });

  await win.loadFile(path.join(__dirname, '..', 'index.html'));
  await new Promise(r => setTimeout(r, 1200));

  const viewInfo = await win.webContents.executeJavaScript(`
    (() => {
      document.getElementById('navHistory').click();
      return {
        todayClass: document.getElementById('viewToday').className,
        historyClass: document.getElementById('viewHistory').className,
        todayDisplay: getComputedStyle(document.getElementById('viewToday')).display,
        historyDisplay: getComputedStyle(document.getElementById('viewHistory')).display
      };
    })()
  `);
  console.log('Capture view info:', viewInfo);

  await new Promise(r => setTimeout(r, 600));

  const image = await win.webContents.capturePage();
  const outPath = path.join(__dirname, '..', 'build', 'screenshot-history.png');
  fs.writeFileSync(outPath, image.toPNG());
  console.log('Saved history screenshot to:', outPath);

  app.quit();
});
