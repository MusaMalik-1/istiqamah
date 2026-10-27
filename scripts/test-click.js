const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

app.disableHardwareAcceleration();

ipcMain.handle('storage:load', async () => null);
ipcMain.handle('storage:save', async () => ({ success: true }));
ipcMain.handle('storage:get-path', () => 'test');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true
    }
  });

  win.webContents.on('console-message', (e, lvl, msg) => console.log('[Renderer]', msg));

  await win.loadFile(path.join(__dirname, '..', 'index.html'));
  await new Promise(r => setTimeout(r, 600));

  const res = await win.webContents.executeJavaScript(`
    const firstPrayer = document.querySelector('.prayer-node-unit');
    console.log('firstPrayer element:', !!firstPrayer);
    if (firstPrayer) firstPrayer.click();

    const firstTask = document.querySelector('.task-row');
    console.log('firstTask element:', !!firstTask);
    if (firstTask) firstTask.click();

    ({
      completedPrayers: document.querySelectorAll('.prayer-node-unit.completed').length,
      prayerScore: document.getElementById('prayerScoreText')?.textContent,
      ringPercent: document.getElementById('heroRingPercent')?.textContent,
      completedRows: document.querySelectorAll('.task-row.completed').length
    })
  `);

  console.log('Test Click Output:', res);
  app.quit();
});
