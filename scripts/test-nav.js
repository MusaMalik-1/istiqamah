const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

app.disableHardwareAcceleration();
ipcMain.handle('storage:load', async () => null);
ipcMain.handle('storage:save', async () => ({ success: true }));
ipcMain.handle('storage:get-path', () => 'test');

app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, webPreferences: { preload: path.join(__dirname, '..', 'preload.js'), contextIsolation: true } });
  win.webContents.on('console-message', (e, lvl, msg) => console.log('LOG:', msg));
  await win.loadFile(path.join(__dirname, '..', 'index.html'));
  await new Promise(r => setTimeout(r, 600));

  const res = await win.webContents.executeJavaScript(`
    const btns = Array.from(document.querySelectorAll('.category-nav-btn'));
    console.log('Category buttons:', btns.map(b => b.innerText.trim()));
    const healthBtn = btns[2];
    console.log('Clicking healthBtn:', healthBtn.innerText);
    healthBtn.click();
    ({
      activeBanner: document.getElementById('activeCategoryBanner')?.innerText,
      categoriesShowing: Array.from(document.querySelectorAll('.category-kicker-title')).map(e => e.innerText)
    })
  `);

  console.log('Health click test result:', res);
  app.quit();
});
