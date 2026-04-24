const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { printReceipt } = require("./printer");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false, // 🔥 IMPORTANT (safer)
    },
  });

  mainWindow.loadURL("http://localhost:5173");

  mainWindow.webContents.openDevTools(); // 🔥 TEMP: debugging only
}

app.whenReady().then(createWindow);

// IPC PRINT HANDLER
ipcMain.on("print-receipt", async (event, sale) => {
  console.log("🖨️ PRINT REQUEST RECEIVED:", sale);

  try {
    await printReceipt(sale);
    console.log("✅ PRINT SUCCESS");
  } catch (err) {
    console.error("❌ PRINT ERROR:", err);
  }
});

// macOS support
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Windows/Linux close behavior
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});