const CONFIG_KEY = "cfg";

const default_cfg = {
    temperature: 500,
    countdown: 5.5
}

async function loadConfig() {
    if(localStorage.getItem(CONFIG_KEY)) {
        return localStorage.getItem(CONFIG_KEY);
    } else {
        console.log("Using default configuration");
        localStorage.setItem(default_cfg, JSON.stringify(default_cfg));
        return localStorage.getItem(CONFIG_KEY);
    }
}

function saveConfig(config) {
    localStorage.setItem(default_cfg, JSON.stringify(config));
    return true;
}


/*
* {type:"STATUS"

    payload: }
* 
{type:"PARAMS"

    payload: {
        t:500,
        ct:9.2
    }}

    type: STATE
    payload:
        count: 10,
        uptime: seconds
*/


module.exports = {
    loadConfig,
    saveConfig
};