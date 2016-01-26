var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers(socket){
    var info = clientInfo[socket.id];
    var users = [];
    
    if (typeof info == 'undefined') {
        return;
    }
    
    Object.keys(clientInfo).forEach(function (socketId){
        var userInfo = clientInfo[socketId];
        
        if (info.room == userInfo.room) {
            users.push(userInfo.name);
        }
    });
    
    socket.emit('message', {
        name: 'System',
        text: 'Current Users: ' + users.join(', '),
        timestamp: moment.valueOf()
    })
}

io.on('connection', function (socket) {
    console.log('User connected via socket.io!');

    socket.on('disconnect', function () {
        if (typeof clientInfo[socket.id] != 'undefined') {
            socket.leave(clientInfo[socket.id].room);
            io.to(clientInfo[socket.id].room).emit('message', {
                name: 'System',
                text: clientInfo[socket.id].name + ' has left',
                timestamp: moment.valueOf()
            });

            delete clientInfo[socket.id];
        }
    });

    socket.on('joinRoom', function (req) {
        clientInfo[socket.id] = req;
        socket.join(req.room);

        socket.broadcast.to(req.room).emit('message', {
            name: 'System',
            text: req.name + ' has joined !',
            timeStamp: moment.valueOf()
        });
    });

    socket.on('message', function (message) {
        console.log('Message received: ' + message.text);

        if (message.text == '@currentUsers') {
            sendCurrentUsers(socket);
        } else {
            message.timestamp = moment().valueOf();
            io.to(clientInfo[socket.id].room).emit('message', message); //io.emit send everybody but yourself
        }


    });

    socket.emit('message', {
        name: 'System',
        text: 'Welcome to ChatApp ! ',
        timestamp: moment().valueOf()
    });
});


http.listen(PORT, function () {
    console.log('Server started');
});