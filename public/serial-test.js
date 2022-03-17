const { SerialPort } = require('serialport');


const getDevicePort = async () => {
    try {
        var result = false;
        const ports = await SerialPort.list();
        
        console.log(ports);
    } catch (error) {
        console.log(error.message);
    }
}

getDevicePort();