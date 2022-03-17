const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

const { getDevicePort } = require('./port-utils.js');
const { startTimer, getTimer, pauseTimer, resumeTimer, resetTimer } = require('./timer.js');
const { loadConfig, saveConfig } = require('./config.js');
const { mqtt_connect, mqtt_publish } = require('./mqttClient.js');
const { get_mac } = require('./platfome-utils.js');
let device_port = null;
var config = {
    temperature: 500,
    countdown: 5.5,
    count: 0
};
let MainWindow;
let mqttCallbacks = [
    {
        topic: "devices/rbk01/rpc",
        handler: (bytes) => {
            const data = bytes.toString();
            const payload = JSON.parse(data);
            console.log("Received : ", payload)
            // {type:"raz-count / raz-uptime",payload:}
            // {type:"config", paylod:{temp:500,countDown:10}}
            if(payload.type === "config") {
                config.countdown = payload.payload.countDown;
                config.temperature = payload.payload.temperature
                var dd = {temperature: payload.payload.temp, countdown: payload.payload.countDown};
                sendDeviceMessage(dd)
                saveConfig(config)
            }else if( payload.type === "raz-count" ) {
                config.count = 0;
                saveConfig(config)
            }else if ( payload.type === "raz-uptime" ) {
                resetTimer();
            }
            
        }
    }
];



app.disableHardwareAcceleration();
app.whenReady().then(async () => {

    const clientID = get_mac()[0];
    console.log("DeviceID: ", clientID)
    //console.log(config)
    config = await loadConfig();
    console.log(config)
    mqtt_connect('mqtt://197.230.172.211:2005', clientID, mqttCallbacks)
    startTimer();
    main();
});



app.on('window-all-closed', () => {
    // if (process.platform !== 'darwin') {
    //     app.quit()
    // }
    main();
})
  
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        main()
    }
})

async function main() {
    device_port = await getDevicePort(process.platform);
    if(device_port) {
        device_port.on('data', handleDeviceMessage);
        console.log(config)
        sendDeviceMessage({temperature:config.temperature, countdown:config.countdown});
        setInterval(()=>{
            mqtt_publish("devices/rbk/events", JSON.stringify({
                type:"CONFIG",
                temp: config.temperature,
                countDown: config.countdown,
                count: config.count,
                upTime: getTimer()
            }))
        }, 5000)
    }
    
    MainWindow = new BrowserWindow({
        show: false,
        autoHideMenuBar: true,
        minimizable: false,
        maximizable: true,
        closable: true,
        kiosk: false,
        width: 1024,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload:path.join(__dirname, "./preload.js")
        }
    });

    MainWindow.loadURL(
        isDev?"http://localhost:3000":`file://${path.join(__dirname, "../build/index.html")}`
    );

    MainWindow.on('ready-to-show', async () => {
        if(device_port){
            MainWindow.show()
            MainWindow.webContents.openDevTools();
        } else {
            const response = await dialog.showMessageBox(MainWindow, {
                title: 'DEVICE NOT FOUND',
                buttons: ['retry'],
                type: 'error',
                message: 'Device was not detected.',
            });
            MainWindow.close();

        }
    })

    //MainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);

    
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
/*
01 3230 2E 30 00 015F 343530 6261 04

01 32 30 2e 30 00 01 5f 34 35 30 62 31 04


01 3235 2e 35 00 025f 343939 6431 04
    01 Start of packet

    32 
    30  time in seconds 20.5
    2E  
    30 

    00  null separator

    01  product size 1 to 3
    5F  product size code _ or A

    34 
    35  temperature
    30 

    62  checksum
    61 

    04
*/

function time_convert(data)
{
    //check digit in number 
    const numberAfterDecimal = parseInt((data % 1).toFixed(2).substring(2)[0]);
    const numberBeforeDecimal = parseInt(data);

    if (numberBeforeDecimal.toString().length === 1)
    {
        return "0" + numberBeforeDecimal + "." + numberAfterDecimal.toString()
    }
    else if (numberBeforeDecimal.toString().length === 2)
    {
        return  numberBeforeDecimal + "." + numberAfterDecimal.toString()
    }

}
//temperature convert
function temperature_convert(data)
{
        //check digit in number 
        const number_of_digit = data.toString().length;
        if (number_of_digit === 1)
        {
            return "00" + data.toString()
        }
        else if (number_of_digit === 2)
        {
            return "0" + data.toString()

        }
        else if (number_of_digit === 3)
        {
            return data.toString()

        }
}
async function handleDeviceMessage(bytes) {
    
    console.log("Rx : ",bytes);

    if(bytes[0] === 0x12) {
        console.log("OP START");
        config.count++;
        config.status = "OP START"
        saveConfig(config);
        MainWindow.webContents.send('device-status', config);
        mqtt_publish("devices/rbk/events", JSON.stringify({
            type: "STATUS",
            msg: "OP START"
        }))
        resumeTimer();
        setTimeout(()=>{
            console.log("OP DONE");
            mqtt_publish("devices/rbk/events", JSON.stringify({
                type: "STATUS",
                msg: "OP DONE"
            }))

            config.status = "OP DONE";
            saveConfig(config);

            setTimeout(()=>{
                config.status = "OP IDLE";
                saveConfig(config);
                MainWindow.webContents.send('device-status', config);
            },1000)

            MainWindow.webContents.send('device-status', config);
        },config.countdown*1000)
    }

    if(bytes[0] === 0x00) {
        console.log("OP SHUTDOWN")
        config.status = "OP SHUTDOWN";
        saveConfig(config);
        MainWindow.webContents.send("device-status", {'status': 'OP SHUTDOWN'});
        mqtt_publish("devices/rbk/events", JSON.stringify({
            type: "STATUS",
            msg: "OP SHUTDOWN"
        }));
        pauseTimer();
    }
}

async function sendDeviceMessage(data) {
    var buff = Buffer.alloc(14);
    buff[0] = 0x01;
    console.log(time_convert(data.countdown))
    buff.write(time_convert(data.countdown),1);
    buff[6] = 0x01;
    buff[7] = 0x5F;
    console.log(temperature_convert(data.temperature))
    buff.write(temperature_convert(data.temperature), 8);

    var checksum = 0;
    for (let index = 0; index < 11; index++) {
        checksum += buff[index];
    }

    var hex = checksum.toString(16);

    buff[11] = hex.charCodeAt(1);
    buff[12] = hex.charCodeAt(2);
    buff[13] = 0x04;

    console.log(buff);
    
    if(device_port) {
        config.temperature = data.temperature;
        config.countdown = data.countdown;
        device_port.write(buff);
    }
}

async function handleDeviceCMD(evt, payload) {
    console.log("Received : ", payload)
    // {type:"raz-count / raz-uptime",payload:}
    // {type:"config", paylod:{temp:500,countDown:10}}
    if(payload.type === "config") {
        config.countdown = payload.payload.countDown;
        config.temperature = payload.payload.temp
        var dd = {temperature: payload.payload.temp, countdown: payload.payload.countDown};
        sendDeviceMessage(dd)
        saveConfig(config)
    }else if( payload.type === "raz-count" ) {
        config.count = 0;
        saveConfig(config)
    }else if ( payload.type === "raz-uptime" ) {
        resetTimer();
    }

}

ipcMain.on("send-command", handleDeviceCMD);

ipcMain.handle('get-time', () => {
    return getTimer();
})

ipcMain.handle('get-state', () => {
    return config;
})