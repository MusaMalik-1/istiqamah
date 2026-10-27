const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

app.disableHardwareAcceleration();

let mockStorage = null;
ipcMain.handle('storage:load', async () => mockStorage);
ipcMain.handle('storage:save', async (e, data) => { mockStorage = data; return { success: true }; });
ipcMain.handle('storage:get-path', () => path.join(app.getPath('userData'), 'istiqamah-data.json'));

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 980,
    height: 740,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true
    }
  });

  await win.loadFile(path.join(__dirname, '..', 'index.html'));
  await new Promise(r => setTimeout(r, 600));

  const evaluation = await win.webContents.executeJavaScript(`
    (() => {
      // 1. Dismiss onboarding
      const btn = document.getElementById('btnCompleteOnboarding');
      if (btn) btn.click();

      // 2. Switch to all habits tab
      const allTab = document.querySelector('.tab-pill[data-tab="all"]');
      if (allTab) allTab.click();

      // 3. Find first optional habit and click its required toggle
      const optionalBtn = document.querySelector('.req-toggle-btn.optional');
      if (optionalBtn) optionalBtn.click();

      // 4. Check priority list in overview
      const overviewTab = document.querySelector('.tab-pill[data-tab="overview"]');
      if (overviewTab) overviewTab.click();

      const priorityRows = document.querySelectorAll('#priorityTasksList .task-row-card').length;
      const ringText = document.getElementById('ringPercentText')?.textContent;

      return {
        priorityCount: priorityRows,
        ringPercent: ringText,
        feedbackQuote: document.getElementById('feedbackQuote')?.textContent,
        streakBadgeStatus: document.getElementById('streakStatusBadge')?.textContent
      };
    })()
  `);

  console.log('Deep Verification Results:', JSON.stringify(evaluation, null, 2));
  app.quit();
});
