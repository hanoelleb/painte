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
var word = '';
var scores = {};

function nextTurn(turn, players) {
    return (turn+1) % players.length;
}

function processGuess(word, guess) {
    var result = '';
    for (var i = 0; i < word.length; i++) {
        if (word[i] === '_' && i < guess.length) 
	    result += guess[i];
	else
	    result += word[i];
    }
    return result;
}

io.on('connection', (socket) => {
  players.push(socket);
  io.to(socket.id).emit('roster', scores);

  if (players[turn] === socket) {
    io.emit('turn');
  }

  socket.on('finish', () => {
        word = '';
        console.log('finished');
        turn = nextTurn(turn, players);
	console.log(players[turn].id);
	io.to(players[turn].id).emit('turn');
  });

  socket.on('message', (msg) => {
    io.emit('message', msg);
  });

  socket.on('draw', (data) => {
    io.emit('draw', data);
  });

  socket.on('player', (nickname) => {
    socket.broadcast.emit('player', nickname);
    scores[nickname] = 0;
  });

  socket.on('disconnect', () => {
    console.log('a user has disconnected');
    players.splice(players.indexOf(socket),1);
    turn--;
  });

  socket.on('word', (word) => {
      socket.broadcast.emit('word', word);
  });

  socket.on('guess', (data) => {
    //emit guess to everyone, pro
    if (word === '')
        word = data[0];
    else 
	word = processGuess(word, data[0]);
    io.emit('update', [word, data[1], data[2]]);
  });

  socket.on('correct', (data) => {
      scores[data.nickname] = data.score;
      io.emit('correct', data);
  });

});

const portNum = process.env.PORT || 3000;

server.listen(portNum);

module.exports = app;
