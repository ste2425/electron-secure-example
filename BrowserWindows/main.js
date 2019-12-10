// handlers received from preload
const messageHandlers = {
    data: (data) => {
        document.querySelector('.data').textContent = JSON.stringify(data, null, 2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    emitToPreload('loaded');

    // be aware of when the message handler is registered.
    // its possible messages could be missed before the DOMContentLoaded event fires
    window.addEventListener('message', (e) => {
        const {
            channel,
            payload
        } = e.data;

        if (channel in messageHandlers)
            messageHandlers[channel](payload);
    });
});

function emitToPreload(channel, payload) {
    window.postMessage({
        channel,
        payload
    });
}