const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

//http server
const server = app.listen(PORT,()=>{
    console.log(`😊 server is running on ${PORT}`);
    
})

//initialize server using socket.io server
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname,'public')))

//variable to disconnect user
let socketConnected = new Set()

//listen for event 
io.on('connection',onConnected)

//function to count connected user
function onConnected(socket){
    socketConnected.add(socket.id);
    console.log(socket.id);

    //to count connected user count
    io.emit('client-total',socketConnected.size);

    //after disconnect the user update in server that user is disconnected
    socket.on('disconnect',()=>{
        console.log("Socket disconnected",socket.id);
        socketConnected.delete(socket.id)  ;
        io.emit('client-total',socketConnected.size);  
    })

    //created the event 
    socket.on('message',(data)=>{
        console.log(data);
        socket.broadcast.emit('chat-message',data)
    })

    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feed-back',data)
    })
}
