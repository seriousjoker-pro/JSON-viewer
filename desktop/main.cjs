const path = require("node:path");
const { readFile } = require("node:fs/promises");
const { app, BrowserWindow } = require("electron");

let mainWindow;
let rendererReady = false;
const pendingFiles = [];

function findJsonFile(args) {
  return args.find((arg) => path.extname(arg).toLowerCase() === ".json");
}

function queueFile(filePath) {
  if (path.extname(filePath).toLowerCase() !== ".json") return;
  pendingFiles.push(filePath);
  void flushPendingFiles();
}

async function flushPendingFiles() {
  if (!mainWindow || mainWindow.isDestroyed() || !rendererReady) return;

  while (pendingFiles.length) {
    const filePath = pendingFiles.shift();
    try {
      const content = await readFile(filePath, "utf8");
      mainWindow.webContents.send("open-json-file", {
        name: path.basename(filePath),
        content,
      });
    } catch {
      mainWindow.webContents.send("open-json-error", {
        name: path.basename(filePath),
      });
    }
  }
}

function createWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    return;
  }

  rendererReady = false;
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 760,
    minHeight: 640,
    backgroundColor: "#0b0d12",
    title: "JSON Explorer",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("did-finish-load", () => {
    rendererReady = true;
    void flushPendingFiles();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
    rendererReady = false;
  });

  void mainWindow.loadFile(path.join(__dirname, "..", "index.html"));
}

const hasSingleInstance = app.requestSingleInstanceLock();
if (!hasSingleInstance) {
  app.quit();
} else {
  app.on("second-instance", (_event, commandLine) => {
    const filePath = findJsonFile(commandLine.slice(app.isPackaged ? 1 : 2));
    if (filePath) queueFile(filePath);
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.on("open-file", (event, filePath) => {
    event.preventDefault();
    queueFile(filePath);
  });

  app.whenReady().then(() => {
    createWindow();
    const startupFile = findJsonFile(process.argv.slice(app.isPackaged ? 1 : 2));
    if (startupFile) queueFile(startupFile);

    app.on("activate", createWindow);
  });
}
