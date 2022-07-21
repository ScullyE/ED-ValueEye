const { app, BrowserWindow, ipcMain } = require("electron");
const { join } = require("path");
const { attempt_load, openfolder, openbg, save } = require("./savingloading");
const { refresh } = require("./logfiles");

const NEWFILE_CHECK_INTERVAL = 10000
const AUTOCHECK = true

app.disableHardwareAcceleration();

let preferences = {
    folder:"",
    bg: "images/default3.jpg",
    color:"#d9d9d9",
}

app.whenReady().then(main);

async function main(){
    //create window
    const win = new BrowserWindow({
        //width: 1000, height: 800,
        width: 800, height: 680,
        show: false,
        autoHideMenuBar: true,
        //resizable: false,
        webPreferences: {
            preload: join(__dirname, "./preload.js")
        },
        icon: __dirname + "./icons/icon.png",
        backgroundColor: '#fff'
    });

    //load svelte app
    win.loadFile(join(__dirname, "../public/index.html"));
    win.on("ready-to-show", win.show);

    //load saved data and get current log if exists
    preferences = await attempt_load(preferences);

    win.webContents.send("loadprefs", preferences);
    
    //refresh log reader
    refresh(preferences);

    ipcMain.on("debug_msg", (event, args) => {
        console.log(args);
    });
    
    ipcMain.on("refresh", (event, args) => {
        refresh(preferences);
    });

    ipcMain.on("opendialog", async function (event, args) {
        if(args == "file"){
            preferences = await openfolder(preferences);
            //refresh log watcher
        } else if (args == "bg") {
            preferences = await openbg(preferences);
            win.webContents.send("loadprefs", preferences);
        }
    });

    ipcMain.on("savecolor", (event, args) => {
        preferences.color = args;
        save(preferences);
    });
    
    //regularly check if a new log file has been made
    let count = 0;
    if(AUTOCHECK){
        setInterval(() => {
            win.webContents.send("newfilecheck", count++);
            refresh(preferences)
        }, NEWFILE_CHECK_INTERVAL);
    }
    //sometimes it just doesn't work.
    setTimeout(() => {  win.webContents.send("loadprefs", preferences);}, 200);
    setTimeout(() => {  win.webContents.send("loadprefs", preferences);}, 500);
    setTimeout(() => {  win.webContents.send("loadprefs", preferences);}, 1000);
}



