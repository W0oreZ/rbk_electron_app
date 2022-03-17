function get_mac()
{
    try {
        if(process.platform === "linux") {
            return  [require('os').networkInterfaces()['wlan0'][0]['mac'] , require('os').networkInterfaces()['wlan0'][0]['address']]
        } else {
            return [require('os').networkInterfaces()['Wi-Fi'][0]['mac'] , require('os').networkInterfaces()['Wi-Fi'][0]['address']]
        }
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

console.log(get_mac())