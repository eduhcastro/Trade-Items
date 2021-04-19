const LowDB = require('./Server/Modules/LowDB');
const FunctionsPB = require('./Server/Class/FunctionsPB');
const ClassPB = new FunctionsPB();
const chalk = require('chalk');


var express = require('express');
var app = express()
var http = require('http').Server(app);
const io = require('socket.io')(http);
var path = require('path');

const Getting = {
    Session: LowDB('Session-PB').get('Sessions'),
    Users: LowDB('Users-PB').get('Users'),
    Trade: LowDB('Trade-PB').get('TradeCourrent'),
    Items: LowDB('Items-PB').get('Items')
}

app.use(express.static('Client/Static'));
require('./Server/Routes/Login')(app, path);
require('./Server/Routes/Erros')(app, path);
require('./Server/Routes/Trade')(app, path, io, chalk, Getting, ClassPB)
require('./Server/Socket')(io, chalk, Getting, ClassPB);


http.listen(Number(process.env.PORT || 80), function() {
    console.log(`PORT: ${Number(process.env.PORT || 80)}`);
});
