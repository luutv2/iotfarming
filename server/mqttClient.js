'use strict';

const mqtt = require('mqtt');
const Dataset = require('./app/models/dataset');

const local = "localhost:1883";

const options = {
  port: 1883,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: 'luuvt',
  password: 'luuvt',
};

const client  = mqtt.connect('mqtt://' + local, options);

const run = (io)=>{
    io.sockets.on('connection', (socket)=>{
        socket.on('subscribe', (data)=>{
            console.log('Subscribing to  '+ data.topic);
            client.subscribe(data.topic);
        });
        socket.on('publish', (data)=>{
            console.log('publish' + data.topic);
            let buf = new Buffer.from(JSON.stringify(data.payload));
            client.publish(data.topic, buf);
        })
    });

    client.on('message', (topic, message)=> {
        // message is Buffer
        console.log("mqtt client", message.toString())
        let data = message.toString();
        const {
            _id,
            versionApi,
            key,
            data_onof,
            data_exchange,
            data_alarm
        } = JSON.parse(data);        
        io.sockets.emit('rest-api-message', { data_onof: data_onof, data_exchange: data_exchange });
        //io.sockets.emit('mqtt',{'topic':String(topic),'payload':String(payload)});
        //client.end()
    })
}

module.exports.run = run;