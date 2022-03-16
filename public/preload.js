const { contextBridge, ipcRenderer } = require('electron')
const os = require('os');

const RBK_API = {

    getOS: () => {
        return os.platform();
    },

    getRunTime: () => {
        return new Date(Math.floor(process.uptime()) * 1000).toISOString().substr(11, 8);
    },

    onDeviceStatusChange: (callback) => {
        ipcRenderer.on('device-status', function (evt, message) {
            callback(message);
        });
    },

    sendCommand: (payload) => ipcRenderer.send('send-command', payload)
};

contextBridge.exposeInMainWorld('rbk', RBK_API);