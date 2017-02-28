var y

io.on('connection', function(socket){

    socket.on('join:room', function(data){
        var room_name = data.room_name;
        socket.join(room_name);
        console.log('someone joined room ' + room_name + ' ' + socket.id);
    });
    socket.on('leave:room', function(msg){
        msg.text = msg.user + " has left the room";
        socket.in(msg.room).emit('exit', msg);
        socket.leave(msg.room);
    });


    socket.on('send:message', function(msg){
        socket.in(msg.room).emit('message', msg);
        console.log(msg)
    });

});