const { app, BrowserWindow } = require('electron');
const path = require('path');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 920,
    height: 720,
    title: 'Istiqamah - Debug',
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, '..', 'index.html'));

  console.log('DEBUG: isVisible:', win.isVisible());
  console.log('DEBUG: isMinimized:', win.isMinimized());
  console.log('DEBUG: getBounds:', win.getBounds());
  console.log('DEBUG: isFocused:', win.isFocused());

  setTimeout(() => {
    console.log('DEBUG 2s later: isVisible:', win.isVisible(), 'title:', win.getTitle());
    app.quit();
  }, 2000);
});
