const { contextBridge, ipcRenderer } = require("electron");
const { cpus, totalmem } = require("os");

const API = {
    cpus: cpus(),
    getMemory: () => totalmem(),

    //render to main
    debugmsg: (msg) => ipcRenderer.send("debug_msg", msg),
    openfiledialog: (msg) => ipcRenderer.send("opendialog", msg),
    refresh: (msg) => ipcRenderer.send("refresh", msg),
    savecolor: (msg) => ipcRenderer.send("savecolor", msg),

    //main to render
    filecheck: (callback) => ipcRenderer.on("newfilecheck", (event, args) => {
        callback(args);
    }),

    update: (callback) => ipcRenderer.on("update", (event, args) => {
        callback(args);
    }),

    loadprefs: (callback) => ipcRenderer.on("loadprefs", (event, args) => {
        callback(args);
    }),

    status: (callback) => ipcRenderer.on("status", (event, args) => {
        callback(args);
    }),
}

contextBridge.exposeInMainWorld("api", API);