const os = require('os');

function get_mac()
{
    try {
        if(process.platform === "linux") {
            return  [os.networkInterfaces()['wlan0'][0]['mac'] , os.networkInterfaces()['wlan0'][0]['address']]
        } else {
            return [os.networkInterfaces()['WiFi'][1]['mac'] , os.networkInterfaces()['WiFi'][1]['address']]
        }
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

module.exports = {
    get_mac,
};