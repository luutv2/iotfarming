'use strict';
const Dataset = require('./app/models/dataset');

var message = {
  topic: '/hello/world',
  payload: 'abcde', // or a Buffer
  qos: 0, // 0, 1, or 2
  retain: false // or true
};


const authenticate = (client, username, password, callback)=> {
    if (username == "luuvt" && password.toString() == "luuvt")
        callback(null, true);
    else
        callback(null, false);
}

const authorizePublish = (client, topic, payload, callback)=> {
    var auth = true;
    // set auth to :
    //  true to allow 
    //  false to deny and disconnect
    //  'ignore' to puback but not publish msg.
    callback(null, auth);
}

const authorizeSubscribe =  (client, topic, callback)=> {
    var auth = true;
    // set auth to :
    //  true to allow
    //  false to deny 
    callback(null, auth);
}

const run = server =>{
    server.on('ready', ()=>{
        server.authenticate = authenticate;
        server.authorizePublish = authorizePublish;
        server.authorizeSubscribe = authorizeSubscribe;
        console.log('Mosca server is up and running.');
    });

    server.on('clientConnected', (client)=> {
        console.log('client connected', client.id);
    });

    // fired when a message is received
    server.on('published', (packet, client)=> {
        console.log(packet);
       // console.log('Published', packet.payload.toString('utf8'));
        var updateQuery = {};
        var updateOnof = {};

        // TODO check path api/v1/data/update 
        if(packet.topic === "api/v1/data/update"){
            if(packet.payload !=null && packet.payload !== undefined){
                try{
                    var _object = packet.payload.toString('utf8');
                    var obj = JSON.parse(_object);
                    console.log(obj);
                    const {
                        _id,
                        versionApi,
                        key,
                        data_onof,
                        data_exchange,
                        data_alarm
                    } = obj;       
                    for(let value of  Object.keys(data_onof)){
                        if ( data_onof.hasOwnProperty(value) ) {
                            updateOnof["data_onof." + value+ ".values"] = data_onof[value];
                        }  
                    }        
                    Dataset.findByIdAndUpdate(_id, updateOnof)
                            .then( dataset =>{
                                    for (const key of Object.keys(data_exchange)) {
                                        console.log(key, data_exchange[key]);
                                        if (data_exchange.hasOwnProperty(key)&dataset.data_exchange.hasOwnProperty(key)) {
                                            updateQuery["data_exchange." + key+ ".values"] = {value:parseFloat(data_exchange[key]), date:Date.now()};
                                        }                        
                                    }
                                    console.log(updateQuery);                        
                                    dataset.update({$push: updateQuery,
                                                    $inc: {entries_number: 1, numData: 1},
                                                    last_entry_at: Date.now()},{strict: false})
                                                    .then(()=>{ console.log("save data successful")})
                                                    .catch(()=>{console.log("error")});
                                    //socket.emit('new-message', { data_onof: data_onof, data_exchange: data_exchange });                                           
                                }
                            )
                            .catch(
                                ()=>{console.log("error")}
                            );                    
                }catch(err){
                    console.log(err);
                }
            }
            //server.publish(message, client);  
        }
    });
    server.on('subscribed', (topic, client)=> {
        console.log('subscribed : ', topic);
        //server.publish(message, client);        
    });

    server.on('unsubscribed', (topic, client)=> {
        console.log('unsubscribed : ', topic);
    });

    server.on('clientDisconnecting', (client)=> {
        console.log('clientDisconnecting : ', client.id);
    });

    server.on('clientDisconnected', (client)=> {
        console.log('clientDisconnected : ', client.id);
    });  
}

module.exports.run = run;