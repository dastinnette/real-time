const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app)
                   .listen(port, function () {
                     console.log('Listening on port ' + port + '.');
                   });
const socketIo = require('socket.io');
const io = socketIo(server);
const bodyParser = require('body-parser');
const generateId = require('./lib/generate-id');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.locals.poll = {};

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/polls', (request, response) => {
  if (!request.body.poll) { return response.sendStatus(400); }
  var id = generateId();
  var admin = generateId();
  app.locals.polls[id] = {};
  app.locals.polls[id].question = request.body.poll.question;
  app.locals.polls[id].options = getOptions(request.body.poll.options);
  app.locals.polls[id].adminID = admin;
  console.log(app.locals.polls[id]);
});

function getOptions(options) {
  return Object.keys(options).map(function (key) {
      return options[key];
  });
}

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    io.sockets.emit('userConnection', io.engine.clientsCount);
  });
});

function countVotes(votes) {
var voteCount = {
    "This is old hat to me": 0,
    "I have an okay understanding of this": 0,
    "I have no idea what you're babbling about": 0
};
  for (var vote in votes) {
    voteCount[votes[vote]]++
  }
  return voteCount;
}

module.exports = server;
