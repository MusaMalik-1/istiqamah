const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

app.disableHardwareAcceleration();

let mockStorage = null;
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

  // Verify DOM state
  const state = await win.webContents.executeJavaScript(`
    ({
      progressPct: document.getElementById('heroRingPercent')?.textContent,
      feedbackTitle: document.getElementById('feedbackTitleText')?.textContent,
      feedbackSub: document.getElementById('feedbackSublineText')?.textContent,
      prayerScore: document.getElementById('prayerScoreText')?.textContent,
      checkedCount: document.querySelectorAll('.task-row.completed').length,
      prayerCompletedNodes: document.querySelectorAll('.prayer-node-unit.completed').length,
      waterSegmentsFilled: document.querySelectorAll('.water-segment.filled').length,
      sidebarCategoryCounts: Array.from(document.querySelectorAll('.cat-count')).map(e => e.textContent),
      hasEmojis: /[\\u{1F300}-\\u{1FAFF}]/u.test(document.body.innerText)
    })
  `);

  console.log('App DOM State Audit:', JSON.stringify(state, null, 2));

  const image = await win.webContents.capturePage();
  const outPath = path.join(__dirname, '..', 'build', 'screenshot-after.png');
  fs.writeFileSync(outPath, image.toPNG());
  console.log('Saved after screenshot to:', outPath);

  app.quit();
});
