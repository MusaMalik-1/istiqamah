const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mockStorage = {
  lastDate: "2026-10-26",
  history: {
    "2026-10-25": { completedTaskIds: ["prayer-fajr", "prayer-dhuhr", "quran-read", "health-exercise"], waterGlasses: 6, allRequiredDone: false }
  },
  streaks: { current: 1, best: 3 }
};

ipcMain.handle('storage:load', async () => mockStorage);
ipcMain.handle('storage:save', async (e, d) => { mockStorage = d; return { success: true }; });
ipcMain.handle('storage:get-path', () => 'C:\\Users\\Moosa Malik\\AppData\\Roaming\\Electron\\istiqamah-data.json');

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

  console.log('--- TEST 1: Open Add Habit Modal ---');
  await win.webContents.executeJavaScript(`
    document.getElementById('btnOpenAddHabit').click();
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  `);
  await new Promise(r => setTimeout(r, 400));

  let img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, '..', 'build', 'screenshot-stage3-modal.png'), img.toPNG());
  console.log('Saved screenshot-stage3-modal.png');

  console.log('--- TEST 2: Add Custom Habit & Reorder ---');
  const addResult = await win.webContents.executeJavaScript(`
    (() => {
      document.getElementById('inputTaskTitle').value = 'Read 20 pages of book';
      document.getElementById('selectTaskCategory').value = 'study';
      document.getElementById('checkboxTaskRequired').checked = true;
      document.getElementById('btnSaveTaskModal').click();

      const studyCat = appState.categories.find(c => c.id === 'study');
      return {
        studyTasksCount: studyCat.tasks.length,
        lastTaskTitle: studyCat.tasks[studyCat.tasks.length - 1].title,
        totalTasks: computeAllStats().totalTasks
      };
    })()
  `);
  console.log('Add habit result:', addResult);

  // Switch to study category to view the newly added task
  await win.webContents.executeJavaScript(`
    const btns = Array.from(document.querySelectorAll('.category-nav-btn'));
    const studyBtn = btns[3]; // Study & Work
    if (studyBtn) studyBtn.click();
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  `);
  await new Promise(r => setTimeout(r, 400));

  img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, '..', 'build', 'screenshot-stage3-added.png'), img.toPNG());
  console.log('Saved screenshot-stage3-added.png');

  console.log('--- TEST 3: History View Inspector ---');
  await win.webContents.executeJavaScript(`
    document.getElementById('navHistory').click();
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  `);
  await new Promise(r => setTimeout(r, 400));

  // Click on the 25th day cell
  const histInfo = await win.webContents.executeJavaScript(`
    (() => {
      const cells = Array.from(document.querySelectorAll('.cal-day-cell'));
      const day25 = cells.find(c => c.textContent.trim() === '25');
      if (day25) day25.click();
      new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      return {
        detailsHTML: document.getElementById('historyDayDetails').innerHTML.slice(0, 200)
      };
    })()
  `);
  console.log('History day 25 inspect result:', histInfo);

  await new Promise(r => setTimeout(r, 400));
  img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, '..', 'build', 'screenshot-stage3-history.png'), img.toPNG());
  console.log('Saved screenshot-stage3-history.png');

  console.log('--- TEST 4: Reset Confirmation Modal ---');
  await win.webContents.executeJavaScript(`
    document.getElementById('navSettings').click();
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  `);
  await new Promise(r => setTimeout(r, 400));

  await win.webContents.executeJavaScript(`
    document.getElementById('btnResetToDefaults').click();
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  `);
  await new Promise(r => setTimeout(r, 400));

  img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, '..', 'build', 'screenshot-stage3-reset-modal.png'), img.toPNG());
  console.log('Saved screenshot-stage3-reset-modal.png');

  // Confirm Reset
  const resetResult = await win.webContents.executeJavaScript(`
    (() => {
      document.getElementById('btnConfirmResetModal').click();
      return {
        resetCategoriesCount: appState.categories.length,
        totalTasksAfterReset: computeAllStats().totalTasks,
        streaks: appState.streaks
      };
    })()
  `);
  console.log('Reset result:', resetResult);

  app.quit();
});
