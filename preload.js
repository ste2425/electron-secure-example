/*
    The preload script becomes your bridge between the main process and renderer process

    It can communicate with the main process through IPC messages,
    it can communicate with the renderer process through postMessage

    It cannot access global variables,
    It cannot access the same window object,
    it cannot access the same session storage, indexDB etc
*/

const {
    ipcRenderer
} = require('electron');

// Handlers received from renderer thread
const messageHandlers = {
    loaded: () => ipcRenderer.send('loaded')
}

// Handlers received from main thread
const ipcHandlers = {
    data: (e, data) => emitToRenderer('data', data)
}

function onLoaded() {
    // Listen to messages coming from renderer thread
    window.addEventListener('message', (e) => {
        const {
            channel,
            payload
        } = e.data;

        if (channel in messageHandlers)
            messageHandlers[channel](payload);
    });

    // Listen to message from main thread
    for (let handler in ipcHandlers)
        ipcRenderer.on(handler, ipcHandlers[handler]);
}

process.once('loaded', onLoaded);

function emitToRenderer(channel, payload) {
    window.postMessage({
        channel,
        payload
    });
}