"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require("express-session")
mongoose.Promise = require('bluebird');
var MongoStore = require('connect-mongo')(session);
mongoose.connect("mongodb://localhost:27017/volcraft");
var db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var cookieParser = require("cookie-parser");
var sessionConfig = session({
    secret: "changethisindev",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: db
    })
});
var sharedsession = require("express-socket.io-session");

// Use express-session middleware for express
app.use(sessionConfig);

// Use shared session middleware for socket.io
// setting autoSave:true
io.use(sharedsession(sessionConfig, {
    autoSave: true
}));


// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

// listen on port 8081
server.listen(8081, function() {
    console.log('Api volcraft is launched on port 8081');
});


var User = require('./models/user.js');
var users = [];
var logs = [];

io.on('connection', function(socket) {
    //test ip
    console.log(socket.handshake.address);
    //===================Login function =============
    function login(pseudo) {
        socket.handshake.session.user = {
            pseudo: pseudo,
            socketId: socket.id,
            loginAt: Date.now()
        }
        socket.emit('succes', {
            msg: "Login succesful",
            type: "login"
        });

        io.emit('globalMessage', {
            pseudo: pseudo,
            message: "à rejoind le salon",
            msgClass: "chat_notification",
            date: date.now()
        });
    }
    if (socket.handshake.session.user) {
        login(socket.handshake.session.user.pseudo);
    }
    //==================Socket receive login ==============
    socket.on('login', function(data) {

        //todo: filtre pseudo data
        if (data.password) {
            //===========Send to model User for register if password ========
            User.register(data).then(function(doc) {
                login(doc.pseudo);
                socket.emit('succes', {
                    msg: "register succesful",
                    type: "register"
                });
            }, function(err) {
                //=========== If user exist Send model User for login ======
                socket.emit('err', err);
                User.login(data).then(function(doc) {
                    if (doc) {
                        login(doc.pseudo);

                    } else {
                        socket.emit('err', "User not found !")
                    }

                }, function(err) {
                    //========= If error
                    socket.emit('err', err);
                })
            });
        } else {
            //If just give pseudo , login as anonym
            login('* ' + data.pseudo);
        }
    });
    socket.on('logout', function(data) {
        delete socket.handshake.session.user;
        socket.emit('logout');
    })
    socket.on('message', function(data) {
        if (data) {
            if (socket.handshake.session.user) {
                var glob_mess = {
                    message: data,
                    pseudo: socket.handshake.session.user.pseudo,
                    date: Date.now()
                }
                logs.push(glob_mess);
                io.emit('globalMessage', glob_mess);
            }

        }
    });
});