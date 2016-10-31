var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

mongoose.connect("mongodb://localhost:27017/volcraft");
var db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// use sessions for tracking logins
app.use(session({
    secret: 'volcraft', //todo : Change the secret on production
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
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
    function login(pseudo) {
        users.push({
            soketId: socket.id,
            pseudo: pseudo
        });
        socket.emit('succes', {
            msg: "Login succesful",
            type: "login"
        })
    }
    socket.on('login', function(data) {

    });
    socket.on('register', function(data) {
        if (data.password) {
            User.register(data).then(function(doc) {
                login(doc.pseudo);
                socket.emit('succes', {
                    msg: "register succesful",
                    type: "register"
                })
            }, function(err) {
                socket.emit('err', err);
                User.login(data).then(function(doc) {
                    login(doc.pseudo);

                }, function(err) {
                    socket.emit('err', err);
                })
            });
        } else {
            login('* ' + data.pseudo);
        }
    });
    socket.on('logout', function(data) {

    })
    socket.on('message', function(data) {
        console.log(data);
        io.emit('globalMessage', data);
    });
});