const { BrowserWindow } = require("electron");
const path = require("path");

function printReceipt(sale) {
  return new Promise((resolve, reject) => {
    const printWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    printWindow.loadFile(path.join(__dirname, "receipt.html"));

    // ❗ FAIL SAFE: if page doesn't load
    printWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
      console.error("❌ Failed to load receipt.html:", errorDescription);
      reject(errorDescription);
    });

    printWindow.webContents.on("did-finish-load", () => {
      console.log("📄 Receipt HTML loaded");

      // Send data
      printWindow.webContents.send("load-receipt", sale);

      // 🔥 Wait for render + IPC update
      setTimeout(() => {
        printWindow.webContents.print(
          {
            silent: true, // ⚠️ CHANGE TO FALSE FOR TESTING FIRST
            printBackground: true,
            deviceName: "POS",
          },
          (success, errorType) => {
            if (!success) {
              console.log("❌ Print failed:", errorType);
              reject(errorType);
            } else {
              console.log("✅ Print success");
              resolve(true);
            }

            printWindow.close();
          }
        );
      }, 2000); // increased delay for reliability
    });
  });
}

module.exports = {
  printReceipt,
};