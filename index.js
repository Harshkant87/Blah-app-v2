// node server to handle socket.io connections

var express = require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8000;



app.use(express.static(__dirname + '/stat'));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/stat/index.html');
  // res.send('hey')
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
const users={};

io.on('connection',socket =>{

  // when new user joins
    socket.on('new-user-joined', name=>{
      // console.log("New user",name);
      users[socket.id]=name;
      socket.broadcast.emit('user-joined',name)
    });

   //when send msg
    socket.on('send', message=>{
      socket.broadcast.emit('receive',{message: message,name: users[socket.id]})
    });
  // when someone left
    socket.on('disconnect', message=>{
      socket.broadcast.emit('left',users[socket.id]);
      delete users[socket.id];
    });


})
