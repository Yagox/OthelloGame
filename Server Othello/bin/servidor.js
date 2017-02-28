/*
Socket.IO
	1)Eventos connection y disconnect
	2)Puedes crear tus propios eventos
	3)emit(): cuando se comunica un mensaje a todos los clientes conectados
	4)broadcast.emit(): cuando se comunica un mensaje a todos los clientes, excepto al que lo origina
	5)Los 4 puntos anteriores funcionan en el servidor y en el cliente
*/

'use strict';
/*const Game = require('./Game'),
    GameInicial = new Game();
*/	
const http = require('http').createServer(server),
	fs = require('fs'),
	io = require('socket.io')(http);

const Game = require('./Game'),
    GameInicial = new Game();
let conexions = 0;
GameInicial.nuevoGame(1);
GameInicial.nuevoGame(2);
GameInicial.nuevoGame(3);
function server(req, res) {
  /*Leer un archivo, en este caso html*/
	fs.readFile('index.html', (err, data) => {
		if (err) {
      /*Error interno del servidor*/
			res.writeHead(500,{'Content-Type' : 'text/html'});
			return res.end('<h1>Error Interno del Servidor</h1>');
		} else {
			res.writeHead(200,{'Content-Type' : 'text/html'});
			return res.end(data, 'utf-8');
		}
	});
}
/*Levanta el servidor*/
http.listen( 3001, () => console.log('Servidor corriendo desde localhost:3001') );

io.on('connection', (socket) => {
	socket.on( 'login', () => {
		console.log("login hecho")
		  	      console.log("Toca login':" + socket.client.id);
		socket.emit('list rooms', GameInicial.listRooms());
        socket.join('waitRooms');
	});
  	socket.on( 'create board' , data =>{
  	      console.log("Toca Put create board':" + socket.client.id);

  	    let tablero = GameInicial.nuevoGame(socket.client.id);
  	    let room_name = tablero['room'];
		socket.emit("board inicial", tablero);
		socket.join(room_name);
		socket.in('waitRooms').emit('list rooms', GameInicial.listRooms());
        console.log(tablero);
	});
	socket.on( 'join board', data => {
      console.log("Toca Put join board':" + socket.client.id);
        let tablero =  GameInicial.joinGame(data['room'], socket.client.id);
        let room_name = tablero['room'];
		socket.emit("board inicial",  tablero);
		socket.join(room_name);
		socket.in(room_name).emit(tablero);
		console.log(tablero);
	});
  	socket.on( 'put disk' , data => {
  	      console.log("Toca Put disk:" + socket.client.id);
		  let room_name = data['room'];
		  let tablero = GameInicial.putDisk(room_name, socket.client.id, data['row'], data['column']);
		  if(tablero != null){
              console.log("ESte es el neuvo tablero");
              console.log(tablero);
              socket.in(room_name).emit("board", tablero);
              socket.emit("board", tablero);
		  }
	  } );

	conexions++;

	console.log(`Conexiones activas: ${conexions}`);

	socket.emit('nuevo usuario', { numbers : conexions });
	socket.broadcast.emit('nuevo usuario', { numbers : conexions });

	socket.on('disconnect', () => {
		conexions--;
		console.log(`Conexiones activas: ${conexions}`);
		socket.broadcast.emit('connect users', { numbers : conexions });
	});
});

