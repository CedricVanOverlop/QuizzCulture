import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { registerHandlers } from '../ipc/handlers';

if (started) app.quit();

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  win.loadFile(
    path.join(__dirname, '..', '..', 'renderer/app/dist/app/browser/index.html')
  );
}

app.whenReady().then(() => {
  registerHandlers();
  createWindow();
});