'use strict';
const mongoose = require('mongoose'),
      Dataset = require('../models/dataset');
//      hat = require('hat');
const parser = require('body-parser').urlencoded({ extended: false });

module.exports = (router, passport, socket )=>{
    router.use(passport.authenticate('jwt', { session: false }));
    router.get('/create', (req, res)=> {  
        console.log(req.query);
        const {
            key
        } = req.query;            
        const dataset = new Dataset({key: key});
        dataset.save()
                .then(() => res.sendStatus(200))
                .catch(() => res.sendStatus(401));
        
    }); 
    // update value alarm from esp send to server 
    router.post('/update', (req, res)=> {
        console.log(req.body);
        var updateQuery = {};
        var updateOnof = {};
        if(!req.body){
            res.sendStatus(401);
        }
        const {
            _id,
            versionApi,
            key,
            data_onof,
            data_exchange,
            data_alarm
        } = req.body;
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
                                        .then(()=>{ res.sendStatus(200)})
                                        .catch(()=>{res.sendStatus(401)});
                        socket.emit('rest-api-message', { data_onof: data_onof, data_exchange: data_exchange });                                           
                    }
                )
                .catch(
                    ()=>{res.sendStatus(401)}
                );
    });
    // esp request data alarm to server 
    router.post('/req', (req, res)=>{ 
        const { id } = req.body;   
        let data_onof;
        let data_exchange;
        console.log(req.body);
        Dataset.findById(id)
                .then(data =>{
                    data_onof = {
                        fan: data.data_onof.fan.values,
                        motor: data.data_onof.motor.values,
                        curtain: data.data_onof.curtain.values,
                        lamp: data.data_onof.lamp.values,
                        heatingLamp: data.data_onof.heatingLamp.values
                    };
                    data_exchange = {
                        temp: data.data_exchange.temp.valueAl,
                        humi:   data.data_exchange.humi.valueAl,
                        light:  data.data_exchange.light.valueAl,
                        ph: data.data_exchange.ph.valueAl, 
                    }
                    res.json({data_onof: data_onof, data_exchange: data_exchange})})
                .catch(()=>{res.sendStatus(401)});
    });
    // esp request get id 
    router.post('/reqId', (req, res)=> {
        //todo
        const { key } = req.body;
        Dataset.findOne({key: key})
                .then(data =>{
                    res.json({id: data._id});
                })
                .catch(()=>{res.sendStatus(401)});
    });
}      