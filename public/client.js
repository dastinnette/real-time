var socket = io();
var connectionCount = document.getElementById('connection-count');
var buttons = document.querySelectorAll('#poll button');
var pollID = document.location.href.split('/')[4];
var pollThings = document.getElementById('#poll-things');

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    socket.send('voteCast', {vote: this.innerText, id: pollID});
  });
}

socket.on('voteCount', function (votes) {
  console.log(votes);
  $results = $('#results');
  if ($results !== null && votes.pollID === pollID) {
    $('#results').empty();
    for (var option in votes.votes){
      $('#results').append('<p>' + option + ': ' + votes.votes[option] + '<p>');
    }
  }
});

socket.on('voteRecorded', function (message) {
  $selection = $('#selection');
  if ($selection !== null) {
    $('#selection').empty().append('<p>' + message + '<p>');
  }
});

if ($('#close-poll')[0]) {
  $('#close-poll')[0].addEventListener('click', function () {
    console.log("close this poll!");
    socket.send('closePoll', {id: pollID});
  });
}

socket.on('pollClosed', function (message) {
  $pollThings = $('#poll-things');
  if ($pollThings !== null && message.pollID === pollID) {
    $pollThings.empty().append('<h3>This poll is closed</h3>');
  }
  $pollStatus = $('#poll-status');
  if ($pollStatus !== null && message.pollID === pollID) {
    $pollStatus.empty().append('<h3>Closed</h3>');
  }
});
