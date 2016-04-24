var socket = io();

var connectionCount = document.getElementById('connection-count');
var buttons = document.querySelectorAll('#choices button');

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    socket.send('voteCast', this.innerText);
  });
}

socket.on('voteCount', function (votes) {
  console.log(votes);
});
