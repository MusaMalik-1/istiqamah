const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mockStorage = {
  lastDate: "2026-10-27",
  history: {},
  streaks: { current: 1, best: 3 },
  profile: { id: "mock-123", displayName: "Moosa", friendCode: "IST-MOOSA" },
  friendIds: ["mock-friend-1", "mock-friend-2"]
};

ipcMain.handle('storage:load', async () => mockStorage);
ipcMain.handle('storage:save', async (e, d) => ({ success: true }));
ipcMain.handle('storage:get-path', () => 'test');

ipcMain.handle('friends:register-profile', async () => ({
  success: true,
  profile: mockStorage.profile
}));

ipcMain.handle('friends:sync-progress', async () => ({ success: true }));
ipcMain.handle('friends:lookup-code', async () => ({
  success: true,
  friend: { id: "mock-friend-3", friendCode: "IST-ZAYN", displayName: "Zayn" }
}));

ipcMain.handle('friends:fetch-progress', async () => ({
  success: true,
  friends: [
    {
      id: "mock-friend-1",
      displayName: "Hamza",
      friendCode: "IST-HMZ7",
      percentage: 82,
      prayersCompleted: 4,
      currentStreak: 5
    },
    {
      id: "mock-friend-2",
      displayName: "Bilal",
      friendCode: "IST-BIL2",
      percentage: 65,
      prayersCompleted: 3,
      currentStreak: 2
    }
  ]
}));

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

  win.webContents.on('console-message', (e, lvl, msg) => console.log('RENDERER:', msg));

  await win.loadFile(path.join(__dirname, '..', 'index.html'));
  await new Promise(r => setTimeout(r, 1200));

  const clickRes = await win.webContents.executeJavaScript(`
    (() => {
      const btn = document.getElementById('navFriends');
      if (!btn) return { error: 'navFriends button not found' };
      btn.click();
      return {
        viewFriendsClass: document.getElementById('viewFriends')?.className,
        viewTodayClass: document.getElementById('viewToday')?.className,
        activeView: appState.currentView,
        navFriendsActive: btn.classList.contains('active'),
        userDisplayName: document.getElementById('userDisplayNameText')?.textContent,
        friendCode: document.getElementById('userFriendCodeText')?.textContent,
        friendsListHTML: document.getElementById('friendsListContainer')?.innerHTML
      };
    })()
  `);
  console.log('Click result:', clickRes);

  // Wait for friend rows to render
  await win.webContents.executeJavaScript(`
    new Promise(resolve => {
      const check = () => {
        if (document.querySelectorAll('.friend-row-card').length > 0) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    })
  `);

  await win.webContents.executeJavaScript(`
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  `);
  await new Promise(r => setTimeout(r, 400));

  const img = await win.webContents.capturePage();
  const outPath = path.join(__dirname, '..', 'build', 'screenshot-friends.png');
  fs.writeFileSync(outPath, img.toPNG());
  console.log('Saved screenshot-friends.png');

  app.quit();
});
