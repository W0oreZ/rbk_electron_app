const { SerialPort } = require('serialport');


const getDevicePort = async (platform) => {
    try {
        var result = false;
        const ports = await SerialPort.list();

        if(platform === "linux") {
            for (let index = 0; index < ports.length; index++) 
            {
                const port = ports[index];
                if( port.path === "/dev/ttyS1" )
                {
                    result = new SerialPort({ path: port.path, baudRate: 9600 }, function (err) {
                        if (err) {
                            console.log('Error: ', err.message)
                            return false;
                        }
                    })
                }
            }
        } else {
            for (let index = 0; index < ports.length; index++) {
                const port = ports[index];
                if( port.manufacturer === "wch.cn" )
                {
                    result = new SerialPort({ path: port.path, baudRate: 9600 }, function (err) {
                        if (err) {
                            console.log('Error: ', err.message)
                            return false;
                        }
                    })
                }
            }
        }

        return result;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

module.exports = { getDevicePort };