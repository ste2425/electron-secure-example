/*
    Communication is based through a preload script.
    It is isolated from the renderer thread and main thread but can receive messages from both.
    These messages are via IPC Messages and postMessage:

        Main <- IPC Message -> | Preload | <- message events (postMessage) -> Renderer
*/

const { 
    app,
    ipcMain,
    BrowserWindow
} = require('electron');

const path = require('path');

let window;

// message received from the preload script
const preloadMessageHandlers = {
    loaded () {
            emitMessageToWindow('data', {
            someData: 'Test Data'
        })
    }
}

function onReady() {
    window = new BrowserWindow({
        backgroundColor: 'white', // set colour to enable font anti-aliasing
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            enableRemoteModule: false,
            contextIsolation: true,
            sandbox: true
        }
    });

    window.loadFile('BrowserWindows/main.html');

    window.webContents.toggleDevTools();

    for (let handler in preloadMessageHandlers)
        ipcMain.on(handler, preloadMessageHandlers[handler]);
}

app.on('ready', onReady);

function emitMessageToWindow(channel, data) {
    if (window)
        window.webContents.send(channel, data);
}