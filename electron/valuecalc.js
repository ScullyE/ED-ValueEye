
const TERRAFORM_PERCENT = 0.7

function value(entry){
    if(entry.type = "planet"){
        const q = 0.56591828;
        let value = 0;
        let mass = entry.mass;
        let mapmult = 1;
        if(!entry.mapped && !entry.discovered){
            mapmult = 3.699622
        } else if(!entry.mapped) {
            mapmult = 8.0956;
        } else {
            mapmult = 3.333333;
        }

        let k = get_base_k(entry.fullclass);
        let terraform_k = get_terra_k(entry.fullclass);
        if(entry.terraform){
            k = k + (terraform_k*TERRAFORM_PERCENT);
        }

        value = (k + ((k * q) * Math.pow(mass,0.2))) * mapmult;

        //mapping bonus
        if((value * 0.3) > 555){
            value += value * 0.3;
        } else {
            value += 555;
        }

        value = Math.max(500, value);
        if(!entry.discovered){
            value = value * 2.6;
        }
        
        return Math.round(value);
    }
}

function get_base_k(type){
    let types = {
        //typical
        "Icy body":300,
        "Rocky body":300,
        "Rocky ice body":300,

        //fancy
        "Earthlike body":64831,
        "Water world":64831,
        "Ammonia world":96932,
        "High metal content body":9654,
        "Metal rich body":21790,


        //fucking gas giants
        "Sudarsky class V gas giant":300,
        "Sudarsky class IV gas giant":300,
        "Sudarsky class III gas giant":300,
        "Sudarsky class II gas giant":9654,
        "Sudarsky class I gas giant":1656,
        "Gas giant with water based life":300,
        "Gas giant with ammonia based life":300,
        "Helium rich":300,
        "Helium gas giant":300,
        "Water giant":300,

    }
    if(types[type] == undefined){
        return 300;
    }
    return types[type];
}

function get_terra_k(type){

    let types = {
        "Earthlike body":116295,
        "Water world":116295,
        "High metal content body":100677,
    }
    if(types[type] == undefined){
        return 93328;
    }
    return types[type];
}

/*
update_data.system = log?.StarSystem;
update_data.type = "planet";
update_data.name = log?.BodyName.replace(log?.StarSystem,'');
update_data.fullclass = log?.PlanetClass;
update_data.planet_type = get_planet_type(update_data.fullclass);
update_data.parentstar = get_parent_star(log?.Parents);
    update_data.terraform = true;
    update_data.terraform = false;
update_data.mass = log?.MassEM;
update_data.gravity = log?.SurfaceGravity;
update_data.temp = log?.SurfaceTemperature;
update_data.pressure = log?.SurfacePressure;
update_data.canland = log?.Landable;
update_data.mats = log?.Materials;
update_data.discovered = log?.WasDiscovered;
update_data.mapped = log?.WasMapped;
update_data.value = ?????????????????????????????????PROFIT
*/

module.exports = {
    value:value,
}