var $messages = document.querySelector('.messages-content'),
    d, h, m,
    i = 0;

document.querySelector(window).load(function() {
  $messages.mCustomScrollbar();
  setTimeout(function() {
    fakeMessage();
  }, 100);
});

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function setDate(){
  d = new Date()
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    document.querySelector('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo(document.querySelector('.message:last'));
  }
}

function insertMessage() {
  msg = document.querySelector('.message-input').value;
  if ($.trim(msg) == '') {
    return false;
  }
  document.querySelector('<div class="message message-personal">' + msg + '</div>').appendTo(document.querySelector('.mCSB_container')).classList.add('new');
  setDate();
  document.querySelector('.message-input').val(null);
  updateScrollbar();
  setTimeout(function() {
    fakeMessage();
  }, 1000 + (Math.random() * 20) * 100);
}

document.querySelector('.message-submit').click(function() {
  insertMessage();
});

document.querySelector(window).addEventListener('keydown', function(e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
})

var Fake = [
  'Hi there, I\'m Fabio and you?',
  'Nice to meet you',
  'How are you?',
  'Not too bad, thanks',
  'What do you do?',
  'That\'s awesome',
  'Codepen is a nice place to stay',
  'I think you\'re a nice person',
  'Why do you think that?',
  'Can you explain?',
  'Anyway I\'ve gotta go now',
  'It was a pleasure chat with you',
  'Time to make a new codepen',
  'Bye',
  ':)'
]

function fakeMessage() {
  if (document.querySelector('.message-input').value != '') {
    return false;
  }
  document.querySelector('<div class="message loading new"><figure class="avatar"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" /></figure><span></span></div>').appendTo(document.querySelector('.mCSB_container'));
  updateScrollbar();

  setTimeout(function() {
    document.querySelector('.message.loading').remove();
    document.querySelector('<div class="message new"><figure class="avatar"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" /></figure>' + Fake[i] + '</div>').appendTo(document.querySelector('.mCSB_container')).classList.add('new');
    setDate();
    updateScrollbar();
    i++;
  }, 1000 + (Math.random() * 20) * 100);

}