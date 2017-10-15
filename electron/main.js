/**
 * Starts the app and creates a browser window to render HTML.
 * This is the app's main process.
 */

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to control main process
const ipcMain = electron.ipcMain;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// TODO: consider using npm package 'electron-is-dev'?
// const isDevelopment = process.env.NODE_ENV !== 'production';
const isDevelopment = require('electron-is-dev');
console.log('electron main process::isDevelopment:', isDevelopment);

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1024, height: 768 });

  // and load the index.html of the app.
  const prodUrl = url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  // const startUrl = process.env.ELECTRON_START_URL || prodUrl;

  // and set url for window.
  // points to `webpack-dev-server` in development
  // points to `index.html` in production
  const startUrl = isDevelopment
  ? `http://localhost:${process.env.PORT || 3000}`
  : prodUrl;
  console.log('electron main process::startUrl:', startUrl);

  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('ping', (event, title) => {
  console.log('pong::title', title);
});

ipcMain.on('show-about-window-event', () =>
  console.log('showing window event...')
);
