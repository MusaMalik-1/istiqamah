const { app, BrowserWindow } = require('electron');
const path = require('path');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 920,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true
    }
  });

  win.webContents.on('did-fail-load', (e, code, desc) => console.log('FAIL LOAD:', code, desc));
  win.webContents.on('render-process-gone', (e, details) => console.log('RENDER GONE:', details));
  win.webContents.on('console-message', (e, level, msg) => console.log('RENDER MSG:', msg));

  await win.loadFile(path.join(__dirname, '..', 'index.html'));
  console.log('LOAD COMPLETED');

  setTimeout(() => {
    app.quit();
  }, 2000);
});
