const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

const { getDevicePort } = require('./port-utils.js');
const { startTimer, getTimer } = require('./timer.js');
const { loadConfig } = require('./config.js');
let device_port = null;
let MainWindow;

app.disableHardwareAcceleration();
app.whenReady().then(() => {
    loadConfig();
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
    }
    
    MainWindow = new BrowserWindow({
        show: false,
        autoHideMenuBar: true,
        minimizable: false,
        maximizable: true,
        closable: true,
        kiosk: true,
        width: 1024,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload:path.join(__dirname, "./preload.js")
        }
    });

    // MainWindow.loadURL(
    //     isDev?"http://localhost:3000":`file://${path.join(__dirname, "../build/index.html")}`
    // );

    MainWindow.on('ready-to-show', async () => {
        if(device_port){
            MainWindow.show()
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

    MainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
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

//timer convert

function time_convert(data)
{
    //check digit in number 
    const numberAfterDecimal = parseInt((data % 1).toFixed(2).substring(2));
    console.log(numberAfterDecimal)
    const numberBeforeDecimal = parseInt(data);
    console.log(numberBeforeDecimal)

    if (numberBeforeDecimal.toString().length == 1)
    {   new_data = "0" + data + "." + numberAfterDecimal.toString()
        return new_data
    }
    else if (numberBeforeDecimal.toString().length == 2)
    {
        new_data = data + "." + numberAfterDecimal.toString()
        return  new_data
    }

}
//temperature convert
function temperature_convert(data)
{
        //check digit in number 
        const number_of_digit = data.toString().length;
        if (number_of_digit == 1)
        {
            return "00" + data.toString()
        }
        else if (number_of_digit == 2)
        {
            return "0" + data.toString()

        }
        else if (number_of_digit == 3)
        {
            return data.toString()

        }
}
async function handleDeviceMessage(bytes) {
    
    console.log("Rx : ",bytes);

    if(bytes[0] === 0x12) {
        console.log("OP START");
        MainWindow.webContents.send('device-status', {'status': 'OP START'});
        setTimeout(()=>{
            console.log("OP DONE");
            MainWindow.webContents.send('device-status', {'status': 'OP DONE'});
        },9500)
    }

    if(bytes[0] === 0x00) {
        console.log("OP SHUTDOWN")
        MainWindow.webContents.send('device-status', {'status': 'OP SHUTDOWN'});
    }
}

async function sendDeviceMessage(data) {
    var buff = Buffer.alloc(14);
    buff[0] = 0x01;
    buff.write(time_convert(data),1);
    buff[6] = 0x01;
    buff[7] = 0x5F;
    buff.write(temperature_convert(data), 8);

    var checksum = 0;
    for (let index = 0; index < 11; index++) {
        checksum += buff[index];
    }
    //checksum -= 2;

    //buff.writeUint16BE(checksum, 11);
    // buff.write(checksum.toString(16).charAt[1], 11);
    // buff.write(checksum.toString(16).charAt[0], 12);
    var hex = checksum.toString(16);
    console.log(hex)
    buff[11] = hex.charCodeAt(1);
    buff[12] = hex.charCodeAt(2);
    buff[13] = 0x04;

    console.log(buff);
    
    if(device_port) {
        device_port.write(buff);
    }
}

function timer_convert(data)
{
    //check digit in number 
    const numberAfterDecimal = parseInt((data % 1).toFixed(2).substring(2));
    console.log(numberAfterDecimal)
    const numberBeforeDecimal = parseInt(data);
    console.log(numberBeforeDecimal)

    if (numberBeforeDecimal.toString().length == 1)
    {   new_data = "0" + data + "." + numberAfterDecimal.toString()
        return new_data
    }
    else if (numberBeforeDecimal.toString().length == 2)
    {
        new_data = data + "." + numberAfterDecimal.toString()
        return  new_data
    }

}

function temperature_convert(data)
{
        //check digit in number 
        const number_of_digit = data.toString().length;
        if (number_of_digit == 1)
        {
            return "00" + data.toString()
        }
        else if (number_of_digit == 2)
        {
            return "0" + data.toString()

        }
        else if (number_of_digit == 3)
        {
            return data.toString()

        }
}
ipcMain.on("send-command", sendDeviceMessage);

ipcMain.handle('get-time', () => {
    return getTimer();
})