$(document).ready(function() {
    var namespace = '';
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

    socket.on('connect', function() {
        socket.emit('connect', {data: 'I\'m connected!'});
    });

    socket.on('my_logging', function(msg) {
        $('#log').append('<br>' + $('<div/>').text('Received #' + msg.data).html());
    });

    socket.on('my_response', function(msg) {
        $('#log').append('<br>' + $('<div/>').text('Received #' + msg.data).html());
    });
});