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
ipcMain.handle('storage:get-path', () => 'test');

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

  win.webContents.on('console-message', (e, lvl, msg) => console.log('RENDERER:', msg));

  await win.loadFile(path.join(__dirname, '..', 'index.html'));
  await new Promise(r => setTimeout(r, 1200));

  const res = await win.webContents.executeJavaScript(`
    (() => {
      const btn = document.getElementById('navHistory');
      if (!btn) return { error: 'navHistory not found' };
      btn.click();
      return {
        activeView: appState.currentView,
        todayDisplay: getComputedStyle(document.getElementById('viewToday')).display,
        historyDisplay: getComputedStyle(document.getElementById('viewHistory')).display,
        calendarDays: document.querySelectorAll('.cal-day-cell').length,
        todayRect: document.getElementById('viewToday').getBoundingClientRect(),
        historyRect: document.getElementById('viewHistory').getBoundingClientRect(),
        historyText: document.getElementById('viewHistory').innerText.slice(0, 100)
      };
    })()
  `);

  console.log('Result:', res);

  // Trigger repaint
  await win.webContents.executeJavaScript(`
    new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  `);
  await new Promise(r => setTimeout(r, 600));

  const img = await win.webContents.capturePage();
  const outPath = path.join(__dirname, '..', 'build', 'screenshot-history.png');
  fs.writeFileSync(outPath, img.toPNG());
  console.log('Wrote to', outPath);

  app.quit();
});
