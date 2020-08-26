const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const sockjs = require('sockjs');
const wsServer = sockjs.createServer();

app.use(express.json({extended:false}));
app.use(express.static('public',{}));

app.get('/', function(request, response){
    response.sendFile(__dirname+'/public/index.html')
});
const sockets = [];

wsServer.on('connection', function (socket) {
    console.log("Novo cliente conectado!");
    sockets.push(socket);

    socket.on('data', function(mensagem){
        console.log("Enviando para todos: ");
        for (let i in sockets){
            sockets[i].write(mensagem);
        }
    });
});

wsServer.installHandlers(httpServer, {prefix:'/exemplo'});

httpServer.listen(3000, function(){
    console.log("Servidor HTTP no ar");
    console.log("Servidor WS no ar");
});