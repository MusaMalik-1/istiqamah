const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

app.disableHardwareAcceleration();
ipcMain.handle('storage:load', async () => null);
ipcMain.handle('storage:save', async () => ({ success: true }));
ipcMain.handle('storage:get-path', () => 'test');

app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, width: 1080, height: 840, webPreferences: { preload: path.join(__dirname, '..', 'preload.js'), contextIsolation: true } });
  await win.loadFile(path.join(__dirname, '..', 'index.html'));
  await new Promise(r => setTimeout(r, 600));

  const bounds = await win.webContents.executeJavaScript(`
    (() => {
      const list = document.getElementById('sidebarCategoriesList');
      const rect = list.getBoundingClientRect();
      const firstChild = list.firstElementChild ? list.firstElementChild.getBoundingClientRect() : null;
      return { listRect: rect, firstChild: firstChild, count: list.children.length };
    })()
  `);

  console.log('Sidebar list bounds:', bounds);
  app.quit();
});
