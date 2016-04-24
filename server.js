const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const generateId = require('./lib/generate-id');
const port = process.env.PORT || 3000;
const server = http.createServer(app)
                 .listen(port, function () {
                    console.log('Listening on port ' + port + '.');
                  });
const socketIo = require('socket.io');
const io = socketIo(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.locals.polls = {};
app.locals.title = "Crowdsource";

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/polls', (request, response) => {
  if (!request.body.poll) { return response.sendStatus(400); }
  var id = generateId();
  var admin = generateId();
  app.locals.polls[id] = request.body.poll;
  app.locals.polls[id].adminID = admin;
  app.locals.polls[id].url = "http://localhost:3000/polls/" + id;
  app.locals.polls[id].votes = {};
  app.locals.polls[id].closed = false;
  response.redirect('/polls/' + id + '/admin/' + admin );
});

app.get('/polls/:pollID', function (req, res){
  var pollID = req.params.pollID;
  var poll = app.locals.polls[pollID];
  res.render('poll', {pollID: pollID,
                      question: poll.question,
                      options: poll.options});
});

app.get('/polls/:pollID/admin/:adminID', function (req, res){
  var pollID = req.params.pollID;
  var poll = app.locals.polls[pollID];
  res.render('admin', {pollID: pollID,
                            url: poll.url});
});

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      app.locals.polls[message.id].votes[socket.id] = message.vote;
    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });

});

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

module.exports = server;
