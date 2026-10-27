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

  win.webContents.on('console-message', (e, lvl, msg) => console.log('RENDERER MSG:', msg));

  await win.loadFile(path.join(__dirname, '..', 'index.html'));
  await new Promise(r => setTimeout(r, 600));

  const result = await win.webContents.executeJavaScript(`
    (() => {
      const btns = Array.from(document.querySelectorAll('.category-nav-btn'));
      btns[2].click();
      return {
        sidebarListHTML: document.getElementById('sidebarCategoriesList')?.innerHTML,
        prayerNodesHTML: document.getElementById('prayerNodesRow')?.innerHTML,
        categoriesContainerHTML: document.getElementById('categoriesCardsContainer')?.innerHTML
      };
    })()
  `);

  console.log('Sidebar list HTML length:', result.sidebarListHTML.length);
  console.log('Prayer nodes HTML length:', result.prayerNodesHTML.length);
  console.log('Categories container HTML length:', result.categoriesContainerHTML.length);
  console.log('Categories container HTML:', result.categoriesContainerHTML);
  app.quit();
});
