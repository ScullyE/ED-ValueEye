const fs = require("fs");
const fsPromises = fs.promises;
const { app, BrowserWindow } = require("electron");
const { join } = require("path");
const readline = require('node:readline');
const { value } = require("./valuecalc")



watcher = false;
currentfile = false;
sys_data = {};



function get_parent_star(parents){
    for(let i = 0; i < parents.length; i++){
        if(parents[i].hasOwnProperty('Star')){
            return parents[i].Star;
        }
    }
}

function get_planet_type(type){
    let types = {
        //typical
        "Icy body":"rocky",
        "Rocky body":"rocky",
        "Rocky ice body":"rocky",

        //fancy
        "Earthlike body":"earth",
        "Water world":"water",
        "Ammonia world":"ammonia",
        "High metal content body":"metal",
        "Metal rich body":"metal",


        //fucking gas giants
        "Sudarsky class V gas giant":"giant",
        "Sudarsky class IV gas giant":"giant",
        "Sudarsky class III gas giant":"giant",
        "Sudarsky class II gas giant":"giant",
        "Sudarsky class I gas giant":"giant",
        "Gas giant with water based life":"giant",
        "Gas giant with ammonia based life":"giant",
        "Helium rich":"giant",
        "Helium gas giant":"giant",
        "Water giant":"giant",

    }
    if(types[type] == undefined){
        return "unknown";
    }
    return types[type];
}

function eventhandler(log){
    let win = BrowserWindow.getAllWindows()[0];
    let update_data = {};
    let send = true;
    switch(log.event){
        case "Scan":
            if(log.ScanType == "AutoScan"){ //first enter a system, stars and such (SOMETIMES PLANETS TOO, changed ealirier in the flow)
                update_data.system = log?.StarSystem;
                if(log?.StarType != undefined){
                    update_data.type = "star";
                    update_data.name = log?.BodyName;
                    update_data.mass = log?.StellarMass;
                    update_data.id = log?.BodyID; //need this to put planets under stars
                    update_data.startypenum = log?.Subclass;
                    update_data.startype = log?.StarType;
                    if( update_data.startype == 'F' ||
                        update_data.startype == 'O' ||
                        update_data.startype == 'A' ||
                        update_data.startype == 'M' ||
                        update_data.startype == 'K' ||
                        update_data.startype == 'G' ||
                        update_data.startype == 'B' ){
                            update_data.fuel = true;
                        } else {
                            update_data.fuel = false;
                    }
                }
            } else if (log.ScanType == "Detailed"){ //this is the FSS, or scope scan
                update_data.system = log?.StarSystem;
                if(log?.PlanetClass != undefined){
                    update_data.type = "planet";
                    update_data.name = log?.BodyName.replace(log?.StarSystem,'');
                    update_data.fullclass = log?.PlanetClass;
                    update_data.planet_type = get_planet_type(update_data.fullclass);
                    update_data.parentstar = get_parent_star(log?.Parents);
                    if(log?.TerraformState == "Terraformable"){
                        update_data.terraform = true;
                    } else {
                        update_data.terraform = false;
                    }
                    update_data.mass = log?.MassEM;
                    update_data.gravity = log?.SurfaceGravity;
                    update_data.temp = log?.SurfaceTemperature;
                    update_data.pressure = log?.SurfacePressure;
                    update_data.canland = log?.Landable;
                    update_data.mats = log?.Materials;
                    update_data.discovered = log?.WasDiscovered;
                    update_data.mapped = log?.WasMapped;
                    update_data.value = value(update_data);
                }
            }
        break;
        case "FSSDiscoveryScan":
            update_data.type = "honk"
            update_data.systembodies = log?.BodyCount;
            update_data.system = log?.SystemName;
        break;
        case "StartJump":
            sys_data = {hyper:true};
            win.webContents.send("update", sys_data);
            send = false;
        break;
        case "FSDJump":
            sys_data = {};
            win.webContents.send("update", sys_data);
            win.webContents.send("status", "Jumped to: " + log?.StarSystem);
            update_data.type = "exithyper"
            update_data.system = log?.StarSystem;
        break;
        default:
            return 0;
    }
    if(send){
        add_to_data(update_data);
    }
}

function add_to_data(entry){
    let win = BrowserWindow.getAllWindows()[0];
    console.log("////////////////ENTRY")
    console.log(entry);

    //always add name first
    if(!sys_data.hasOwnProperty('name') || sys_data?.name == "undefined" || sys_data?.name == undefined){
        if(entry.hasOwnProperty('system')){
            sys_data.name = entry.system;
        } else {
            sys_data.name = "Unknown";
        }
    }

    if(!sys_data.hasOwnProperty('items')){
        sys_data.items = [];
    }

    switch(entry.type){
        case "honk":
            sys_data.bodies = entry.systembodies;
        break;
        case "star":
            let idx = check_star_existance(sys_data.items, entry.id)
            if(idx == -1){
                sys_data.items.push({
                    type:"star",
                    items:[],
                    name: entry?.name,
                    id: entry?.id,
                    startype: entry?.startype,
                    starsubtype: entry?.startypenum,
                    mass: entry?.mass,
                    fuel: entry?.fuel,
                })
                win.webContents.send("status", "Star found: " + entry.name);
            } else {
                sys_data.items[idx] = Object.assign(sys_data.items[idx],{
                    type:"star",
                    name: entry?.name,
                    id: entry?.id,
                    startype: entry?.startype,
                    starsubtype: entry?.startypenum,
                    mass: entry?.mass,
                    fuel: entry?.fuel,
                })
            }
        break;
        case "planet":
            //check for parent star
            let parentidx = -1;
            let stars = sys_data.items;
            
            if(sys_data.hasOwnProperty('items')){
                for(let i = 0; i < stars.length; i++){
                    if(entry.parentstar == stars[i].id){
                        parentidx = i;
                    }
                }
            } else {
                sys_data.items = [];
            }
            //create a star if none exist
            if(parentidx == -1){
                parentidx = sys_data.items.push({
                    type:"star",
                    items:[],
                    name: "unknown",
                    id: entry.parentstar,
                    startype: "?",
                    mass: 0,
                    fuel: false,
                })
                parentidx -= 1;
            }

            if(!check_existance(sys_data.items[parentidx].items, entry.name)){
                sys_data.items[parentidx].items.push(entry);
            }

            sys_data.items[parentidx].items.sort((a,b) => {return b.value - a.value});

            win.webContents.send("status", "Planet scanned: " + entry.name);

        break;

    }

    win.webContents.send("update", sys_data);
}

function check_existance(list, name){
    for(let i = 0; i < list.length; i++){
        if(list[i]?.name == name){
            return true;
        }
    }
    return false;
}

function check_star_existance(list, id, name){
    for(let i = 0; i < list.length; i++){
        if(list[i]?.id == id || list[i]?.name == name){
            return i;
        }
    }
    return -1;
}

function updatecheck(path){
    let logout = fs.readFileSync(path, "utf8");
    let log = logout.split("\n");
    let mostrecent = JSON.parse(log[log.length-2]);
    let out = []

    //we have the wrong log!
    if(mostrecent.event == "Shutdown"){
        //return 0;
    }

    //collect entries with same timing
    for(let i = log.length-2; i > 0; i--){
        let entry = JSON.parse(log[i]);
        if(mostrecent.timestamp == entry.timestamp){
            out.push(entry);
        } else {
            break;
        }
    }

    let prev_logs = findpreviouslogs(log);
    out = prev_logs.concat(out);
    out = convert_auto_planets(out);

    for(let j = 0; j < out.length; j++){
        setTimeout(() => {eventhandler(out[j])}, j*50);
    }
}

function watchlog(path){
    watcher = fs.watchFile(path, {
        // Passing the options parameter
        bigint: false,
        persistent: true,
        interval: 1000,
      }, (curr, prev) => {
        console.log("\nThe log was updated:", curr.mtime);
        updatecheck(path);
    });
}

function convert_auto_planets(logs){
    let out = logs;
    for(let i = 0; i < logs.length; i++){
        if(logs[i].hasOwnProperty('PlanetClass') && logs[i]?.ScanType == "AutoScan"){
            logs[i].ScanType = "Detailed";
        }
    }
    return out;
}

function findpreviouslogs(logs){
    star_logs = [];
    for(let i = logs.length-2; i > 0; i--){
        let entry = JSON.parse(logs[i]);
        if(entry.hasOwnProperty('StarType') || entry.hasOwnProperty('PlanetClass')){
            star_logs.push(entry);
        } else if (entry.event == "StartJump" || entry.event == "FSDJump"){
            break;
        }
    }

    return star_logs;
}


async function findlog(folderpath){
    return new Promise(async resolve => {
        //read directory
        if(folderpath == "" || folderpath == undefined){
            console.log("folderpath: " + folderpath);
            resolve(false);
        }

        let logfiles = [];
        let files;

        try {
            files = await fsPromises.readdir(folderpath);
        } catch (err) {
            console.log(err);
        }

        files.forEach( function (file) {
            if(file.slice(file.length - 4) == ".log"){
                logfiles.push(file);
            }
        });

        if(logfiles.length < 1){
            resolve(false);
        }

        logfiles.sort();
        logfiles.reverse();

        resolve(logfiles[0]);
    });
}

async function refresh(prefs){
    console.log("\nRefreshing/starting log");
    ///see if we're watching a file
    console.log("   Searching for log files in " + prefs.folder);
    let logfile = await findlog(prefs.folder);
    if(!logfile){
        console.log("       No log files found.");
        return false;
    }

    
    if(currentfile != logfile){
        console.log("       New file found!");
        if(watcher){
            fs.unwatchFile(currentfile);
        }
        currentfile = logfile;
        console.log("           Watching file: "+logfile);
        watchlog(join(prefs.folder, logfile));
        setTimeout(() => {
            console.log("Auto_update")
            updatecheck(join(prefs.folder, logfile))
        }, 2000);
        
    } else {
        console.log("       Log is up to date: "+logfile);
    }
}

module.exports = {
    refresh:refresh,
}