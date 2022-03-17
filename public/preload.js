const { contextBridge, ipcRenderer } = require('electron')
const os = require('os');
const { getTimer } = require('./timer');

const RBK_API = {

    getOS: () => {
        return os.platform();
    },

    getStatus: async () => {
        const state = await ipcRenderer.invoke('get-state');
        return state;
        //return new Date(Math.floor(process.uptime()) * 1000).toISOString().substr(11, 8);
    },

    getRunTime: async () => {
        const time = await ipcRenderer.invoke('get-time');
        return new Date(Math.floor(time) * 1000).toISOString().substr(11, 8);
        //return new Date(Math.floor(process.uptime()) * 1000).toISOString().substr(11, 8);
    },

    onDeviceStatusChange: (callback) => {
        ipcRenderer.on('device-status', function (evt, message) {
            callback(message);
        });
    },

    sendCommand: (payload) => ipcRenderer.send('send-command', payload)
};

contextBridge.exposeInMainWorld('rbk', RBK_API);