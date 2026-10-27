const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const brainDir = path.resolve('C:/Users/Moosa Malik/.gemini/antigravity/brain/09c18d9c-c589-469d-9f87-24ffe08bc3ba/screenshots');

let mockStorage = {
  lastDate: "2026-10-27",
  history: {},
  streaks: { current: 3, best: 7 },
  profile: { id: "mock-123", displayName: "Moosa", friendCode: "IST-WPU4" },
  friendIds: [],
  theme: "purple",
  lastSeenVersion: "1.2.2"
};

ipcMain.handle('storage:load', async () => mockStorage);
ipcMain.handle('storage:save', async () => ({ success: true }));
ipcMain.handle('storage:get-path', () => 'test-storage');
ipcMain.handle('friends:register-profile', async () => ({ success: true, profile: mockStorage.profile }));
ipcMain.handle('friends:sync-progress', async () => ({ success: true }));
ipcMain.handle('friends:lookup-code', async () => ({ success: false }));
ipcMain.handle('friends:fetch-progress', async () => ({ success: true, friends: [] }));

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 850,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  await win.loadFile(path.join(__dirname, '..', 'index.html'));
  await new Promise(r => setTimeout(r, 1500));

  // Dismiss What's New modal if open
  await win.webContents.executeJavaScript(`
    const dismiss = document.getElementById('btnDismissWhatsNew');
    if (dismiss) dismiss.click();
  `);
  await new Promise(r => setTimeout(r, 300));

  // Verify multiple sets of questions generated
  const testResults = await win.webContents.executeJavaScript(`
    const results = [];
    for (let round = 0; round < 10; round++) {
      const qSet = getRandomQuizSet(5);
      const indices = qSet.map(q => q.correctIndex);
      const valid = qSet.every(q => {
        // verify options has 4 items
        if (q.options.length !== 4) return false;
        // verify correctIndex is within 0..3
        if (q.correctIndex < 0 || q.correctIndex > 3) return false;
        return true;
      });
      results.push({ round, indices, valid });
    }
    results;
  `);

  console.log('Random distribution test across 10 rounds of 5 questions:');
  const allIndices = [];
  testResults.forEach(r => {
    console.log('Round ' + r.round + ' correct indices:', r.indices.join(', '));
    allIndices.push(...r.indices);
  });

  const count0 = allIndices.filter(x => x === 0).length;
  const count1 = allIndices.filter(x => x === 1).length;
  const count2 = allIndices.filter(x => x === 2).length;
  const count3 = allIndices.filter(x => x === 3).length;

  console.log('Distribution across 50 questions:');
  console.log('Option A (index 0):', count0);
  console.log('Option B (index 1):', count1);
  console.log('Option C (index 2):', count2);
  console.log('Option D (index 3):', count3);

  // Now start a real quiz session and take a screenshot of question 1
  await win.webContents.executeJavaScript(`
    switchView('quiz');
    startQuiz('daily');
  `);
  await new Promise(r => setTimeout(r, 600));

  const q1Info = await win.webContents.executeJavaScript(`
    ({
      question: document.getElementById('arenaQuestionText').textContent,
      options: Array.from(document.querySelectorAll('.arena-option-btn .opt-text')).map(el => el.textContent),
      activeQuestion: activeQuizSession.questions[activeQuizSession.currentIndex]
    })
  `);

  console.log('Question 1 Prompt:', q1Info.question);
  console.log('Options on screen:', q1Info.options);
  console.log('Correct Index:', q1Info.activeQuestion.correctIndex, '->', q1Info.options[q1Info.activeQuestion.correctIndex]);

  const imgQ1 = await win.webContents.capturePage();
  fs.writeFileSync(path.join(brainDir, 'v123-quiz-random-q1.png'), imgQ1.toPNG());
  console.log('Saved v123-quiz-random-q1.png');

  // Answer the question by clicking option index 1
  await win.webContents.executeJavaScript(`
    handleQuizAnswer(1);
  `);
  await new Promise(r => setTimeout(r, 500));

  const imgAnswered = await win.webContents.capturePage();
  fs.writeFileSync(path.join(brainDir, 'v123-quiz-random-answered.png'), imgAnswered.toPNG());
  console.log('Saved v123-quiz-random-answered.png');

  app.quit();
});
