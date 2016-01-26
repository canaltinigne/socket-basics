var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room') || 'Anonymous Room';

var socket = io();

console.log(name + ' wants to join ' + room);

socket.on('connect', function () {
    
    console.log('Connected to Socket.io server!');
    
    $('.room-title').html(room);
   
    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});

socket.on('message', function (message) {

    var momentTimestamp = moment.utc(message.timeStamp);
    var timeStr = momentTimestamp.local().format('h:mm a');
    console.log('New message: ' + message.text);
    $(".messages").append('<li class="list-group-item"><p><strong>' + message.name + '</strong> said</p><p>' + timeStr + ' --- ' + message.text + '</p></li>');
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