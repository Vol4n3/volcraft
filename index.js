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
// make user ID available in templates
app.use(function(req, res, next) {
    res.locals.currentUser = req.session.userId;
    next();
});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
// include routes
var routes = require('./routes.js');
app.use('/', routes);

// listen on port 8081
server.listen(8081, function() {
    console.log('Api volcraft is launched on port 8081');
});


var User = require('./models/user.js');
var Message = require('./models/message.js');
var users = {};


io.on('connection', function(socket) {

    //test ip
    var clientIp = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
    console.log(clientIp);
    Message.getLastest().then(function(log) {
        log.reverse();
        for (var item of log) {
            socket.emit('globalMessage', item)
        }
    });

    //===================Login function =============
    function login(pseudo) {
        socket.handshake.session.user = {
            pseudo: pseudo,
            socketId: socket.id,
            loginAt: Date.now()
        }
        users[pseudo] = {
            pseudo: pseudo,
            socketId: socket.id
        };
        socket.emit('succes', {
            msg: "Login succesful",
            type: "login"
        });
        var loginMessage = {
            pseudo: pseudo,
            message: "à rejoint le salon",
            msgClass: "chat_notification",
            date: Date.now()
        };
        io.emit('globalMessage', loginMessage);
        io.emit('update_online', users)
            //Message.add(loginMessage)
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
            login('*' + data.pseudo);
        }
    });
    socket.on('logout', function(data) {
        if (socket.handshake.session.user) {
            var logoutMessage = {
                pseudo: socket.handshake.session.user.pseudo,
                message: "est parti(e)",
                msgClass: "chat_notification",
                date: Date.now()
            };
            delete users[socket.handshake.session.user.pseudo];
            io.emit('globalMessage', logoutMessage);
            io.emit('update_online', users)
                //Message.add(logoutMessage)
            delete socket.handshake.session.user;
            socket.emit('logout');
        }
    })
    socket.on('message', function(data) {
        if (data) {
            if (socket.handshake.session.user) {
                //Send a whisp
                const whispRegex = /^@(\S*)/g;
                let whispMatch;
                let whisp = whispRegex.exec(data);
                if (whisp) { //if @.. exist send a whisp

                    if (users[whisp[1]]) {
                        //to replace @truc message
                        var whispText = data.replace(whispRegex, '');
                        io.to(users[whisp[1]].socketId).emit('globalMessage', {
                            message: whispText,
                            pseudo: socket.handshake.session.user.pseudo,
                            msgClass: "chat_whisper",
                            date: Date.now()
                        });
                        socket.emit('globalMessage', {
                            message: whispText,
                            pseudo: "à " + whisp[1] + ":",
                            msgClass: "chat_notification",
                            date: Date.now()
                        })
                    } else { //say whisper isn't online
                        socket.emit('globalMessage', {
                            message: "n'est pas en ligne",
                            pseudo: whisp[1],
                            msgClass: "chat_notification",
                            date: Date.now()
                        })
                    }
                } else { //send a normal message

                    var glob_mess = {
                        message: data,
                        pseudo: socket.handshake.session.user.pseudo,
                        date: Date.now()
                    }
                    Message.add(glob_mess);
                    io.emit('globalMessage', glob_mess);
                }
            }
        }
    });
    // on disconnect
    socket.on('disconnect', function() {
        if (socket.handshake.session.user) {
            var logoutMessage = {
                pseudo: socket.handshake.session.user.pseudo,
                message: "est parti(e)",
                msgClass: "chat_notification",
                date: Date.now()
            };

            io.emit('globalMessage', logoutMessage);
            io.emit('update_online', users)
                //Message.add(logoutMessage)
        }
    })
});