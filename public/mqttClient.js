const mqtt = require('mqtt');
let client = null;

async function mqtt_connect(server, clientID, callbacks) {
    client  = mqtt.connect(server,{clientId:clientID})

    client.on('connect', () => {
        callbacks.forEach(cb => {
            client.subscribe(cb.topic, (err)=>{
                if(!err) {
                    console.log("Subscribed to "+ cb.topic);
                }else {
                    console.log("ERROR : "+ err.message);
                }
            })
        });
    });

    client.on('message', (topic, payload) => {
        callbacks.forEach(cb => {
            if(cb.topic === topic) {
                cb.handler(payload)
            }
        });
    });
}

function mqtt_publish(topic, message) {
    try {
        if(client) {
            client.publish(topic, message, {}, (err) => {
                if(!err) {
                    return true;
                }else {
                    console.log("ERROR : "+ err.message);
                    return false;
                }
            })
        }
        else {
            return false;
        }
    } catch (error) {
        console.log("PUB ERROR : ", error.message)
    }
}

module.exports = {
    mqtt_connect,
    mqtt_publish
}