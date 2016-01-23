var socket = io();

socket.on('connect', function (){
    console.log('Connected to Socket.io server!');
});

socket.on('message', function (message){
    console.log('New message: ' + message.text);
});