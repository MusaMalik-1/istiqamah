const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mockStorage = {
  lastDate: "2026-10-27",
  history: {},
  streaks: { current: 3, best: 7 },
  profile: { id: "mock-user-1", displayName: "Moosa", friendCode: "IST-WPU4" },
  friendIds: ["mock-friend-1", "mock-friend-2"],
  lastSeenVersion: "1.2.3",
  accountability: {},
  quiz: {
    history: {},
    streak: 2,
    bestScore: 680,
    totalPoints: 1350
  }
};

ipcMain.handle('storage:load', async () => mockStorage);
ipcMain.handle('storage:save', async (e, d) => {
  mockStorage = d;
  return { success: true };
});
ipcMain.handle('storage:get-path', () => 'test-quiz');

ipcMain.handle('friends:register-profile', async () => ({ success: true, profile: mockStorage.profile }));
ipcMain.handle('friends:sync-progress', async () => ({ success: true }));
ipcMain.handle('friends:lookup-code', async () => ({ success: true }));
ipcMain.handle('friends:fetch-progress', async () => ({
  success: true,
  friends: [
    {
      id: "mock-friend-1",
      displayName: "Hamza",
      friendCode: "IST-HMZ7",
      percentage: 85,
      prayersCompleted: 5,
      currentStreak: 6,
      quizScore: 680
    },
    {
      id: "mock-friend-2",
      displayName: "Bilal",
      friendCode: "IST-BIL2",
      percentage: 60,
      prayersCompleted: 3,
      currentStreak: 2,
      quizScore: 540
    }
  ]
}));

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    show: false,
    width: 1100,
    height: 920,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true
    }
  });

  win.webContents.on('console-message', (e, lvl, msg) => console.log('RENDERER:', msg));

  await win.loadFile(path.join(__dirname, '..', 'index.html'));
  await new Promise(r => setTimeout(r, 1200));

  const buildDir = path.join(__dirname, '..', 'build');
  if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });

  // 1. Navigate to Quiz View
  const navRes = await win.webContents.executeJavaScript(`
    (() => {
      const modal = document.getElementById('modalWhatsNewOverlay');
      if (modal) modal.style.display = 'none';
      const btn = document.getElementById('navQuiz');
      if (!btn) return { error: 'navQuiz button not found' };
      btn.click();
      return {
        activeView: appState.currentView,
        navQuizActive: btn.classList.contains('active'),
        viewQuizClass: document.getElementById('viewQuiz')?.className,
        streakText: document.getElementById('quizStreakText')?.textContent,
        standingsRows: document.querySelectorAll('.standings-row').length
      };
    })()
  `);
  console.log('Quiz Navigation Result:', navRes);

  await win.webContents.executeJavaScript(`
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  `);
  await new Promise(r => setTimeout(r, 400));

  // Screenshot: Quiz Lobby
  const imgLobby = await win.webContents.capturePage();
  fs.writeFileSync(path.join(buildDir, 'screenshot-quiz-lobby.png'), imgLobby.toPNG());
  console.log('Saved screenshot-quiz-lobby.png');

  // 2. Start Daily Challenge
  const startRes = await win.webContents.executeJavaScript(`
    (() => {
      document.getElementById('btnStartDailyQuiz')?.click();
      return {
        arenaVisible: document.getElementById('quizArenaView')?.style.display,
        qNum: document.getElementById('arenaQNumber')?.textContent,
        qText: document.getElementById('arenaQuestionText')?.textContent,
        optionsCount: document.querySelectorAll('.arena-option-btn').length,
        timerText: document.getElementById('arenaTimerSeconds')?.textContent
      };
    })()
  `);
  console.log('Start Quiz Result:', startRes);

  // Wait a moment to show timer in progress
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot: Active Quiz Arena with Timer
  const imgActive = await win.webContents.capturePage();
  fs.writeFileSync(path.join(buildDir, 'screenshot-quiz-active.png'), imgActive.toPNG());
  console.log('Saved screenshot-quiz-active.png');

  // 3. Play through the 5 questions
  for (let q = 0; q < 5; q++) {
    const stepRes = await win.webContents.executeJavaScript(`
      (() => {
        // Choose option A (index 0)
        const opts = document.querySelectorAll('.arena-option-btn');
        if (opts.length > 0) opts[0].click();

        return {
          wisdomVisible: document.getElementById('arenaWisdomCard')?.style.display,
          outcome: document.getElementById('wisdomOutcomeText')?.textContent,
          score: document.getElementById('arenaLiveScore')?.textContent
        };
      })()
    `);
    console.log(`Q${q + 1} Answered:`, stepRes);

    await new Promise(r => setTimeout(r, 200));

    // Click next question or finish
    await win.webContents.executeJavaScript(`
      document.getElementById('btnNextQuestion')?.click();
    `);
    await new Promise(r => setTimeout(r, 200));
  }

  // Check Results Screen
  const resultsRes = await win.webContents.executeJavaScript(`
    (() => {
      // Toggle review
      document.getElementById('btnToggleReview')?.click();

      return {
        resultsVisible: document.getElementById('quizResultsView')?.style.display,
        finalScore: document.getElementById('resultsScoreVal')?.textContent,
        accuracy: document.getElementById('resultsAccuracyVal')?.textContent,
        streak: document.getElementById('resultsStreakVal')?.textContent,
        reviewItemsCount: document.querySelectorAll('.review-q-item').length
      };
    })()
  `);
  console.log('Quiz Results Screen:', resultsRes);

  await win.webContents.executeJavaScript(`
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  `);
  await new Promise(r => setTimeout(r, 300));

  // Screenshot: Quiz Results
  const imgResults = await win.webContents.capturePage();
  fs.writeFileSync(path.join(buildDir, 'screenshot-quiz-results.png'), imgResults.toPNG());
  console.log('Saved screenshot-quiz-results.png');

  // 4. Navigate to Friends Tab to verify Quiz Score is displayed on friends cards
  const friendsRes = await win.webContents.executeJavaScript(`
    (() => {
      document.getElementById('navFriends')?.click();
      return {
        activeView: appState.currentView,
        friendsCount: document.querySelectorAll('.friend-row-card').length,
        friendQuizPills: document.querySelectorAll('.friend-quiz-pill').length
      };
    })()
  `);
  console.log('Friends View Check:', friendsRes);

  await win.webContents.executeJavaScript(`
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  `);
  await new Promise(r => setTimeout(r, 400));

  // Screenshot: Friends with Quiz scores
  const imgFriends = await win.webContents.capturePage();
  fs.writeFileSync(path.join(buildDir, 'screenshot-friends-quiz.png'), imgFriends.toPNG());
  console.log('Saved screenshot-friends-quiz.png');

  app.quit();
});
