const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jsonExplorer", {
  onFileOpen(callback) {
    const listener = (_event, file) => callback(file);
    ipcRenderer.on("open-json-file", listener);
    return () => ipcRenderer.removeListener("open-json-file", listener);
  },
  onFileError(callback) {
    const listener = (_event, file) => callback(file);
    ipcRenderer.on("open-json-error", listener);
    return () => ipcRenderer.removeListener("open-json-error", listener);
  },
});
