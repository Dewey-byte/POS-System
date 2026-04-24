console.log("✅ PRELOAD IS RUNNING");

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  printReceipt: (sale) => ipcRenderer.send("print-receipt", sale),
});