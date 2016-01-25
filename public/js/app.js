var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room') || 'Anonymous Room';

var socket = io();

console.log(name + ' wants to join ' + room);

socket.on('connect', function () {
    console.log('Connected to Socket.io server!');
});

socket.on('message', function (message) {
    
    var momentTimestamp = moment.utc(message.timeStamp);
    var timeStr = momentTimestamp.local().format('h:mm a');
    console.log('New message: ' + message.text);
    $(".messages").append('<p><strong>' + message.name + '</strong> said</p>');
    $(".messages").append('<p>' + timeStr + ' --- ' + message.text + '</p>');
});

var $form = jQuery('#message-form');

$form.on('submit', function (Event) {
    
    Event.preventDefault();

    socket.emit('message', {
        name: name,
        text: $form.find('input[name=message]').val()
    });
    
    $form.find('input[name=message]').val('');
});