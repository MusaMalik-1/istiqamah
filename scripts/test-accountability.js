const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mockStorage = {
  lastDate: "2026-10-27",
  history: {},
  streaks: { current: 1, best: 3 },
  profile: { id: "mock-123", displayName: "Moosa", friendCode: "IST-WPU4" },
  friendIds: [],
  accountability: {
    "2026-10-26": {
      date: "2026-10-26",
      answers: { q1: 2, q2: 2, q3: 1, q4: 2, q5: 2, q6: 2 },
      score: 92,
      note: "Managed to finish reading surah Al-Mulk. Kept phone away during work.",
      updatedAt: "2026-10-26T21:00:00.000Z"
    },
    "2026-10-25": {
      date: "2026-10-25",
      answers: { q1: 2, q2: 1, q3: 0, q4: 2, q5: 1, q6: 1 },
      score: 58,
      note: "Lost too much time on social media before Maghrib. Need better discipline.",
      updatedAt: "2026-10-25T21:30:00.000Z"
    }
  }
};

ipcMain.handle('storage:load', async () => mockStorage);
ipcMain.handle('storage:save', async (e, d) => {
  mockStorage = d;
  return { success: true };
});
ipcMain.handle('storage:get-path', () => 'test-accountability');

ipcMain.handle('friends:register-profile', async () => ({ success: true, profile: mockStorage.profile }));
ipcMain.handle('friends:sync-progress', async () => ({ success: true }));
ipcMain.handle('friends:lookup-code', async () => ({ success: true }));
ipcMain.handle('friends:fetch-progress', async () => ({ success: true, friends: [] }));

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    show: false,
    width: 1080,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true
    }
  });

  win.webContents.on('console-message', (e, lvl, msg) => console.log('RENDERER:', msg));

  await win.loadFile(path.join(__dirname, '..', 'index.html'));
  await new Promise(r => setTimeout(r, 1200));

  // 1. Click Accountability Navigation Tab
  const navRes = await win.webContents.executeJavaScript(`
    (() => {
      const btn = document.getElementById('navAccountability');
      if (!btn) return { error: 'navAccountability button not found' };
      btn.click();
      return {
        activeView: appState.currentView,
        navAccountabilityActive: btn.classList.contains('active'),
        viewAccountabilityClass: document.getElementById('viewAccountability')?.className,
        questionsCount: document.querySelectorAll('.audit-question-card').length
      };
    })()
  `);
  console.log('Navigation Result:', navRes);

  // 2. Select answers for Today's audit (simulate user answering questions)
  const answerRes = await win.webContents.executeJavaScript(`
    (() => {
      // Answer Q1 with High (index 0)
      const qCards = document.querySelectorAll('.audit-question-card');
      if (qCards.length >= 6) {
        qCards[0].querySelectorAll('.audit-option-pill')[0]?.click(); // Sincere & Mindful
        qCards[1].querySelectorAll('.audit-option-pill')[0]?.click(); // Clean Speech
        qCards[2].querySelectorAll('.audit-option-pill')[1]?.click(); // Some Wasted Time
        qCards[3].querySelectorAll('.audit-option-pill')[0]?.click(); // Patient & Kind
        qCards[4].querySelectorAll('.audit-option-pill')[0]?.click(); // Grateful & Content
        qCards[5].querySelectorAll('.audit-option-pill')[0]?.click(); // Made Sincere Istighfar
      }

      const noteInput = document.getElementById('inputAuditNote');
      if (noteInput) {
        noteInput.value = "Great focus on speech and prayers today. Tomorrow I will cut evening phone use by 30 mins.";
        noteInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      document.getElementById('btnSaveAudit')?.click();

      return {
        scoreVal: document.getElementById('auditScoreVal')?.textContent,
        scoreStatus: document.getElementById('auditScoreStatus')?.textContent,
        noteValue: noteInput?.value
      };
    })()
  `);
  console.log('Answer Result:', answerRes);

  await win.webContents.executeJavaScript(`
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  `);
  await new Promise(r => setTimeout(r, 300));

  // Capture Daily Audit Screenshot
  const imgDaily = await win.webContents.capturePage();
  const buildDir = path.join(__dirname, '..', 'build');
  if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });
  fs.writeFileSync(path.join(buildDir, 'screenshot-accountability-daily.png'), imgDaily.toPNG());
  console.log('Saved screenshot-accountability-daily.png');

  // 3. Switch to Monthly Report Tab
  const monthlyRes = await win.webContents.executeJavaScript(`
    (() => {
      const tab = document.getElementById('tabMonthlyReport');
      if (!tab) return { error: 'tabMonthlyReport not found' };
      tab.click();
      return {
        title: document.getElementById('monthlyReportTitle')?.textContent,
        daysAudited: document.getElementById('kpiDaysAudited')?.textContent,
        avgScore: document.getElementById('kpiAvgScore')?.textContent,
        topCat: document.getElementById('kpiTopCategory')?.textContent,
        growthCat: document.getElementById('kpiGrowthCategory')?.textContent,
        breakdownCount: document.querySelectorAll('.breakdown-row').length,
        reflectionsCount: document.querySelectorAll('.reflection-item').length
      };
    })()
  `);
  console.log('Monthly Report Result:', monthlyRes);

  await win.webContents.executeJavaScript(`
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  `);
  await new Promise(r => setTimeout(r, 300));

  // Capture Monthly Report Screenshot
  const imgMonthly = await win.webContents.capturePage();
  fs.writeFileSync(path.join(buildDir, 'screenshot-accountability-monthly.png'), imgMonthly.toPNG());
  console.log('Saved screenshot-accountability-monthly.png');

  app.quit();
});
