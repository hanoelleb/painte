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
var names = {};

//if everyone guesses it, end the turn early
var finished = 0;

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
  else if (players.length === 1) {
    turn = 0;
    io.to(players[0].id).emit('turn');
  }

  socket.on('finish', () => {
        word = '';
        turn = nextTurn(turn, players);
	console.log(players[turn].id);
	io.to(players[turn].id).emit('turn');
  });

  socket.on('message', (msg) => {
    io.emit('message', msg);
  });

  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data);
  });

  socket.on('clear', () => {
    socket.broadcast.emit('clear');
  });

  socket.on('player', (nickname) => {
    socket.broadcast.emit('player', nickname);
    scores[nickname] = 0;
    names[socket.id] = nickname;
  });

  socket.on('disconnect', () => {
    players.splice(players.indexOf(socket),1);
    
    var nickname = names[socket.id];
    delete scores[nickname];
    delete names[socket.id];

    turn--;
    turn = nextTurn(turn, players);
    io.emit('left', nickname);
    if (players.length != 0)
        io.to(players[turn].id).emit('turn');
  });

  socket.on('nickname', (nickname) => {
    console.log(nickname);
    delete scores[nickname];
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
      finished++;
      scores[data.nickname] = data.score;

      if (finished === players.length - 1 && players.length != 1) { 
          finished = 0;
          word = '';
          console.log('all finished');
          turn = nextTurn(turn, players);
          console.log(players[turn].id);
          io.to(players[turn].id).emit('turn');
      } 
      io.emit('correct', data);
  });

});

const portNum = process.env.PORT || 3000;

server.listen(portNum);

module.exports = app;
