const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose'); // fix mongoose@4.10.8
const flash = require('connect-flash');
const winston = require('winston');
const jwt = require('jsonwebtoken');
const MongoStore = require('connect-mongo')(session);
const mosca = require('mosca');
const brokerMosca = require('./brokerMosca');
const mqttClient = require('./mqttClient');
const nodeAppServer = require('./node-app-server');
const User = require("./app/models/user");  
var cfg = require("./config/config.js");
const app = express();
const server = require('http').Server(app);
const socket = require('socket.io')(server);

app.use(passport.initialize());
var configDB = require('./config/database');
mongoose.connect(configDB.url);
app.use(session({secret: 'hello',
				store: new MongoStore({ mongooseConnection: mongoose.connection,
					ttl: 7*24*60*60}),
				saveUninitialized: true,
				resave: true}));
require('./config/auth-passport')(passport); 
app.use(morgan('dev'));
app.use(cookieParser());
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

nodeAppServer(app);

const auth = express.Router();
require('./app/routers/auth')(auth, passport);
app.use('/api/v1', auth);

// data esp
const dataset = express.Router();
require('./app/routers/datasetEsp')(dataset, passport, socket);
app.use('/api/v1/data', dataset);

// data client angular
const ngData = express.Router();
require('./app/routers/dataClient')(ngData, passport);
app.use('/api/v1/ngData', ngData);

server.listen( process.env.PORT||8000, (err)=>{
  if (err) {
    winston.error(err);
    return;
  }
  winston.info(`Listening on port ${process.env.PORT||8000}`);
});

socket.on('connection', socket =>{
  winston.info(`new connection ${socket.id}`);
});
// config database for mqtt 
const ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: configDB.urlMqtt,
  pubsubCollection: configDB.Collection,
  mongo: {}
};
const settings = {
  port: configDB.portMqtt,
  backend: ascoltatore,
  persistence: {
    factory: mosca.persistence.Mongo,
    url: configDB.urlMqtt
  }  
};
const serverMosca = new mosca.Server(settings,()=>{
  serverMosca.attachHttpServer(app);
});
brokerMosca.run(serverMosca);
mqttClient.run(socket);