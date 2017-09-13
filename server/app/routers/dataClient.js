'use strict';
const mongoose = require('mongoose'),
      Dataset = require('../models/dataset');

module.exports = (router, passport )=>{
    router.use(  passport.authenticate('jwt', { session: false }));

    router.get('/', (req, res)=>{
        console.log("get id");
        Dataset.findOne()
                .then(data => {
                    res.json({id: data._id, entries_number: data.numData}) })
                .catch(()=>{ res.sendStatus(401)});
    });
    router.post('/AllData', (req, res)=>{
        const { id, limit } = req.body;
        const flag = limit <= 10? 0: (limit - 10);   
        console.log(`id: ${id} flag: ${flag} limit: ${limit}`);
        Dataset.find(id, {  'data_exchange.temp.values':{$slice:[flag, limit]},
                            'data_exchange.ph.values':{$slice:[flag, limit]},
                            'data_exchange.humi.values':{$slice:[flag, limit]},
                            'data_exchange.light.values':{$slice:[flag, limit]}})
        .then(data => res.json({data}))
        .catch( ()=>{ res.sendStatus(401)});              
    });
    router.post('/Update', (req, res)=>{
        const {_id, data_onof, data_exchange} = req.body;
        Dataset.findByIdAndUpdate(_id, {data_onof: data_onof, data_exchange: data_exchange})
                        .then(data =>{
                            res.sendStatus(200);
                        })
                        .catch(()=>{res.sendStatus(401)});
    });
    router.post('/ElementData', (req, res)=>{
        const { id, limit } = req.body;
        const flag = limit? (limit - 1):0;  
        if(!limit){
            res.sendStatus(401);
        } 
        console.log(`id: ${id} flag: ${flag} limit: ${limit}`);
        Dataset.find(id, {  'data_exchange.temp':{$slice:[limit, limit]},
                            'data_exchange.ph':{$slice:[limit, limit]},
                            'data_exchange.humi':{$slice:[limit, limit]},
                            'data_exchange.light':{$slice:[flag, limit]}})
        .then(data => res.json({data}))
        .catch( ()=>{ res.sendStatus(401)});
    });
}      