const { app, BrowserWindow, ipcMain, dialog } = require("electron");

let window = null;

ipcMain.on("exit", app.quit);

ipcMain.on("alert", (event, args) => {
  dialog.showMessageBox(window, {
    title: args.error ? "오류" : "알림",
    message: args.message,
    type: args.error ? "error" : "none",
  });
});

function createWindow() {
  window = new BrowserWindow({
    width: 340,
    height: 200,
    resizable: false,
    frame: false,
    fullscreenable: false,
    maximizable: false,
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false,
  });

  window.webContents.on("did-finish-load", function () {
    window.show();
  });

  window.loadFile("./public/index.html", { hash: app.getAppPath() });
}

app.whenReady().then(createWindow);
app.on("window-all-closed", app.quit);
