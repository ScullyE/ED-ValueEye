const fs = require("fs");
const { app, dialog } = require("electron");
const { join } = require("path");
const readline = require('node:readline');
const adfolder = app.getPath("appData");
const savefolderpath = join(adfolder, "edvalueeye/");
const savefilepath = join(savefolderpath, "save.txt");
const defaultpath = app.getPath("documents");

function attempt_load(currentprefs){
    console.log("Trying to load at: " + savefilepath);
    let result;
    try{
        result = fs.readFileSync(savefilepath, {encoding:'utf8'})
    } catch(e){
        console.log("   Load failed, creating file");
        fs.writeFile(savefilepath, JSON.stringify(currentprefs), function(err) {
            if (err) {
                return console.error(err);
            }
                console.log("       File created successfully!");
        });
        return currentprefs;
    }
    console.log("       Preferences loaded!");
    console.log("       "+result);
    return JSON.parse(result);
}

/*
async function attempt_load(){
    return new Promise(resolve => {
        console.log("Trying to load at: " + savefilepath);
        //try to load file if folder and file exists
        try {
            var outdata = [];
    
            const fileStream = fs.createReadStream(savefilepath);
    
            const file = readline.createInterface({
                input: fileStream,
                output: process.stdout,
                terminal: false,
            });
            
            file.on('line', (line) => {
                if (line == "undefined"){
                    outdata.push("");
                } else {
                    outdata.push(line);
                }
            });
            
            file.on('close', () => {
                if(outdata.length < 1){
                    outdata.push("", "");
                }
                console.log("   Log folder: "+outdata[0]);
                console.log("   bg file: "+outdata[1]);
                resolve(outdata);
            });
    
        } catch (err) {
            console.error(err);
    
            if (fs.existsSync(savefilepath)){
                console.log("Error reading, file exists at path " + savefilepath);
                resolve(["",""]);
            }
            
            console.log("   No file found, creating file at");
            console.log("   "+savefilepath);
            fs.writeFile(savefilepath, '', function(err) {
                if (err) {
                    return console.error(err);
                }
                    console.log("       File created successfully!");
                });
            resolve(["",""]);
        }
    });
}
*/
function save(prefs){
    console.log("Saving prefs at " + savefilepath);
    fs.writeFile(savefilepath, JSON.stringify(prefs), function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("    Data saved successfully!");
    });
}
/*
async function save(folderpath, bgpath){
    console.log("Saving paths at " + savefilepath);
    let savedata = folderpath + '\n' + bgpath;
    fs.writeFile(savefilepath, savedata, function(err) {
        if (err) {
            return console.error(err);
        }

    console.log("    Data saved successfully!");
    });
}
*/
async function openfolder(prefs){
    return new Promise(resolve => {
        console.log("File dialog");
        console.log("   for folder");
        dialog.showOpenDialog({properties: ['openDirectory'], defaultPath: defaultpath, }).then(function (response) {
            if (!response.canceled) {
                prefs.folder = response.filePaths[0]
                console.log("       Selected: "+prefs.folder);
                save(prefs);
                resolve(prefs);
            } else {
                console.log("       no folder selected");
                resolve(prefs);
            }
        });
    });
}

async function openbg(prefs){
    return new Promise(resolve => {
        console.log("File dialog");
        console.log("   for bg");
        dialog.showOpenDialog({filters: [
            { name: 'Images', extensions: ['jpg', 'png'] },
            ],
            properties: ['openFile'],
            defaultPath: defaultpath,
        }).then(function (response) {
            if (!response.canceled) {
                prefs.bg = response.filePaths[0]
                console.log("       Selected: "+prefs.folder);
                save(prefs);
                resolve(prefs);
            } else {
                console.log("       no file selected");
                resolve(prefs);
            }
        });
    })
}

module.exports = {
    attempt_load: attempt_load,
    save:save,
    openfolder:openfolder,
    openbg:openbg,
}