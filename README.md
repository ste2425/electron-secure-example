# electron-secure-example

Demo of disabling the node API's within the renderer thread.

Demo's how communication between the main and renderer thread is facilitated by a preload script.

The preload script is isolated from the render but can communicate through message events.

## Renderer -> Main
* Render emits message event to preload
* Preload emits IPCMessage to main.

## Main -> Renderer
* Main emits IPC message to preload.
* Preload emits message event to renderer.