const { app, BrowserWindow } = require("electron");
const path = require("path");
const os = require("os");
console.log("OS: " + os.platform());

let win;
function createWindow() {
    win = new BrowserWindow({
        show: false,               // wait to show until we size it
        useContentSize: true,      // width/height refer to the page, not the frame
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadFile(path.join(__dirname, 'index.html'));

    win.webContents.once('did-finish-load', async () => {
        // get the content’s dimensions
        const { width, height } = await win.webContents.executeJavaScript(`
      new Promise(resolve => {
        const rect = document.documentElement.getBoundingClientRect();
        resolve({ width: Math.ceil(rect.width), height: Math.ceil(rect.height) });
      });
    `);
        // resize and then show
        win.setContentSize(width-110, height+60);
        win.center();
        win.show();
    });
}

app.whenReady().then(createWindow);