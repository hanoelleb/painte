require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');

const app = express();
var server  = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/index.html');
  });

app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});


var players = [];
var turn = 0;

function nextTurn() {
    turn = turn++ % players.Length;
}

io.on('connection', (socket) => {
  console.log('a user is connected');
  players.push(socket);

  if (players[turn] === socket) {
    io.emit('turn');

    socket.on('finished', () => {
        nextTurn();
    });
  }

  socket.on('message', (msg) => {
    io.emit('message', msg);
  });

  socket.on('draw', (data) => {
    io.emit('draw', data);
  });

  socket.on('player', (nickname) => {
    io.emit('player', nickname);
  });

  socket.on('disconnect', () => {
    console.log('a user has disconnected');
    players.splice(players.indexOf(socket),1);
    turn--;
  });

  socket.on('word', (word) => {
      socket.broadcast.emit('word', word);
  });

});

const portNum = process.env.PORT || 3000;

server.listen(portNum);

module.exports = app;
