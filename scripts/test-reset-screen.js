const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

ipcMain.handle('storage:load', async () => null);
ipcMain.handle('storage:save', async () => ({ success: true }));
ipcMain.handle('storage:get-path', () => 'C:\\test\\path.json');

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
  await new Promise(r => setTimeout(r, 1000));

  const state = await win.webContents.executeJavaScript(`
    (() => {
      document.getElementById('navSettings').click();
      document.getElementById('btnResetToDefaults').click();
      const card = document.getElementById('modalResetCard');
      const overlay = document.getElementById('modalResetOverlay');
      return {
        cardRect: card.getBoundingClientRect(),
        cardDisplay: getComputedStyle(card).display,
        cardVisibility: getComputedStyle(card).visibility,
        cardOpacity: getComputedStyle(card).opacity,
        overlayDisplay: overlay.style.display,
        overlayRect: overlay.getBoundingClientRect()
      };
    })()
  `);
  console.log('Reset modal state:', state);

  await new Promise(r => setTimeout(r, 400));
  const img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, '..', 'build', 'screenshot-stage3-reset-modal.png'), img.toPNG());
  console.log('Saved screenshot-stage3-reset-modal.png');

  app.quit();
});
