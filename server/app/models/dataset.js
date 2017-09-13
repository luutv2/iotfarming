const mongoose = require('mongoose');
// đối với điều khiển on off thì không có valueAl 
// checkKey using detect on off with temp,humi...
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const datasetSchema = new Schema({
    versionApi: {type: String, default: "0.0.1"},
    key: {type: String},
    numData:{type: Number, default: 0},
    data_onof:{
        fan: {  icon: {type: String, default: "fa-power-off"},
                unit: {type: String, default: ""},
                label: {type: String, default: "QUẠT"},
                values: {type: Boolean, default: false},
                checkKey: {type: Boolean, default: false},
                avatar: {
                        urlOn: {type: String, default: "fa-power-off"},
                        urlOf: {type: String, default: "fa-sliders"},
                }
        },
        motor: {  icon: {type: String, default: "fa-sliders"},
                unit: {type: String, default: ""},
                label: {type: String, default: "MÔ TƠ"},
                values: {type: Boolean, default: false},
                checkKey: {type: Boolean, default: false},
                avatar: {
                        urlOn: {type: String, default: "fa-power-off"},
                        urlOf: {type: String, default: "fa-sliders"},
                }
        },
        curtain: {  icon: {type: String, default: "fa-sliders"},
                unit: {type: String, default: ""},
                label: {type: String, default: "MÀN"},
                values: {type: Boolean, default: false},
                checkKey: {type: Boolean, default: false},
                avatar: {
                        urlOn: {type: String, default: "fa-power-off"},
                        urlOf: {type: String, default: "fa-sliders"},
                }
        },
        lamp: {  icon: {type: String, default: "fa-lightbulb-o"},
                unit: {type: String, default: ""},
                label: {type: String, default: "ĐÈN CHIẾU SÁNG"},
                values: {type: Boolean, default: false},
                checkKey: {type: Boolean, default: false},
                avatar: {
                        urlOn: {type: String, default: "fa-power-off"},
                        urlOf: {type: String, default: "fa-sliders"},
                }
        },
        heatingLamp: {  icon: {type: String, default: "fa-lightbulb-o"},
                unit: {type: String, default: ""},
                label: {type: String, default: "ĐÈN SƯỞI"},
                values: {type: Boolean, default: false},
                checkKey: {type: Boolean, default: false},
                avatar: {
                        urlOn: {type: String, default: "fa-power-off"},
                        urlOf: {type: String, default: "fa-sliders"},
                }
        }        
    },
    data_exchange:{
        temp: { icon: {type: String, default: "fa fa-thermometer-half"},
                unit: {type: String, default: "°C"},
                label: {type: String, default: "NHIỆT ĐỘ"},
                values: {type: Object},
                checkKey: {type: Boolean, default: true},
                valueAl: {type: Number, default: 0},
                setMaxAl: {type: Number, default: 100},
                setMinAl: {type: Number, default: 1},
                avatar: {
                        urlOn: {type: String, default: "fa fa-thermometer-half"},
                        urlOf: {type: String, default: "fa-sliders"},
                }},        
        humi: {  icon: {type: String, default: "fa-tint"},
                unit: {type: String, default: "%"},
                label: {type: String, default: "ĐỘ ẨM"},
                values: {type: Object},
                checkKey: {type: Boolean, default: true},
                valueAl: {type: Number, default: 0},
                setMaxAl: {type: Number, default: 100},
                setMinAl: {type: Number, default: 1},
                avatar: {
                        urlOn: {type: String, default: "fa-tint"},
                        urlOf: {type: String, default: "fa-sliders"},
                }},        
        light: {  icon: {type: String, default: "fa-sun-o"},
                unit: {type: String, default: "%"},
                label: {type: String, default: "ÁNH SÁNG"},
                values: {type: Object},
                checkKey: {type: Boolean, default: true},
                valueAl: {type: Number, default: 0},
                setMaxAl: {type: Number, default: 100},
                setMinAl: {type: Number, default: 1},
                avatar: {
                        urlOn: {type: String, default: "fa-sun-o"},
                        urlOf: {type: String, default: "fa-sliders"},
                }},        
        ph: {  icon: {type: String, default: "fa-flask"},
                unit: {type: String, default: ""},
                label: {type: String, default: "PH"},
                values: {type: Object},
                checkKey: {type: Boolean, default: true},
                valueAl: {type: Number, default: 0},
                setMaxAl: {type: Number, default: 14},
                setMinAl: {type: Number, default: 1},
                avatar: {
                        urlOn: {type: String, default: "fa-flask"},
                        urlOf: {type: String, default: "fa-sliders"},
                }}
    },
//     data_alarm:{
//         tempAlarm:{type: Number, default: 0},
//         humiAlarm:{type: Number, default: 0},
//         lightAlarm:{type: Number, default: 0},
//         phAlarm:{type: Number, default: 0},
//     },
    created_at: {type: Date, default: Date.now},
    last_entry_at: {type: Date}	
});

module.exports = mongoose.model("Dataset", datasetSchema);