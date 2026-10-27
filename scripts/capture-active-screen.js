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
  await new Promise(r => setTimeout(r, 600));

  await win.webContents.executeJavaScript(`
    // Click Fajr node
    const n1 = document.querySelectorAll('.prayer-node-unit')[0];
    if (n1) n1.click();

    // Click Dhuhr node
    const n2 = document.querySelectorAll('.prayer-node-unit')[1];
    if (n2) n2.click();

    // Click Asr node
    const n3 = document.querySelectorAll('.prayer-node-unit')[2];
    if (n3) n3.click();

    // Click Read Quran
    const t1 = document.querySelectorAll('.task-row')[0];
    if (t1) t1.click();

    // Click 4th water segment
    const w = document.querySelectorAll('.water-segment')[3];
    if (w) w.click();
  `);

  await new Promise(r => setTimeout(r, 500));

  const image = await win.webContents.capturePage();
  const outPath = path.join(__dirname, '..', 'build', 'screenshot-active.png');
  fs.writeFileSync(outPath, image.toPNG());
  console.log('Saved active screenshot to:', outPath);

  app.quit();
});
