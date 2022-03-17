const Store = require('electron-store');
const store = new Store();

const CONFIG_KEY = "rbk-config";

const default_cfg = {
    temperature: 500,
    countdown: 5.5,
    count: 0
}

async function loadConfig() {
    if(await store.get(CONFIG_KEY)) {
        return JSON.parse(await store.get(CONFIG_KEY));
    } else {
        console.log("Using default configuration");
        await store.set(CONFIG_KEY, JSON.stringify(default_cfg));
        return JSON.parse( await store.get(CONFIG_KEY));
    }
}

function saveConfig(config) {
    store.set(CONFIG_KEY, JSON.stringify(config));
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