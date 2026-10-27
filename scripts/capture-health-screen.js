const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

app.disableHardwareAcceleration();

ipcMain.handle('storage:load', async () => null);
ipcMain.handle('storage:save', async () => ({ success: true }));
ipcMain.handle('storage:get-path', () => 'test');

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

  const check = await win.webContents.executeJavaScript(`
    const btns = Array.from(document.querySelectorAll('.category-nav-btn'));
    const healthBtn = btns[2];
    healthBtn.click();

    // Click 4th water segment
    const segs = document.querySelectorAll('.water-segment');
    if (segs[3]) segs[3].click();

    ({
      activeBanner: document.getElementById('activeCategoryBanner')?.innerText,
      categoriesShowing: Array.from(document.querySelectorAll('.category-kicker-title')).map(e => e.innerText),
      prayerCardDisplay: document.getElementById('prayerSignatureCard')?.style.display
    })
  `);

  console.log('DOM check in test:', check);
  await new Promise(r => setTimeout(r, 300));

  const image = await win.webContents.capturePage();
  const outPath = path.join(__dirname, '..', 'build', 'screenshot-health.png');
  fs.writeFileSync(outPath, image.toPNG());
  console.log('Saved screenshot-health.png');
  app.quit();
});
