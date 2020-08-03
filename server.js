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

io.on('connection', () =>{
  console.log('a user is connected')
})

const portNum = process.env.PORT || 3000;

server.listen(portNum);

module.exports = app;
