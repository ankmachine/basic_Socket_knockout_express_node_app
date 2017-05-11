module.exports = initSockets;

function initSockets(server){

var io = require('socket.io')(server);
var noOfUsers = 0;
io.on('connection', function (client) {
  console.log('Client connected...');
  noOfUsers++;
  console.log(client.id);

//   client.on('join', function (data) {
//     console.log(data);
//     // client.broadcast.emit('broad', "user is connected");
//   });
client.on('subscribe', function(room){
    console.log("user joined "+room);
    client.join(room);
})

  client.on('disconnect', function(){
    noOfUsers--;
    console.log(client.id)
    console.log("A user has disconnected");

  });

  client.on('messages', function (data) {
    // client.emit('broad', data);
    
    client.broadcast.to(data.roomId).emit('broad', data);
    console.log(data);
  });

});
}