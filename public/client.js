var socket = io();

var connectionCount = document.getElementById('connection-count');

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

var buttons = document.querySelectorAll('#poll button');
var pollID = document.location.href.split('/')[4];

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
