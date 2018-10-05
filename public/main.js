      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyCB-tFj_DHxhX9gucePhsohLNeOvyC6hW8",
        authDomain: "quiz-4dfc7.firebaseapp.com",
        databaseURL: "https://quiz-4dfc7.firebaseio.com",
        projectId: "quiz-4dfc7",
        storageBucket: "quiz-4dfc7.appspot.com",
        messagingSenderId: "241405736059"
      };
      firebase.initializeApp(config);

      // Get a reference to the database service
      var database = firebase.database();

      var game, player, player_sex, question, answer;
      var square = [];
      for (var i = 0; i < 25; i++) {
        square[i] = document.getElementById("square"+i);
       }
      var q_player = document.getElementById("q_player");
      var q_quiz = document.getElementById("q_quiz");
      var countdownEl = document.getElementById("countdown");
      var countdownTimer;
      var p_suggest = false;
      var p_answer = -1;
      var p_options = [];
      p_options.push(document.getElementById("p_opt0"));
      p_options.push(document.getElementById("p_opt1"));
      p_options.push(document.getElementById("p_opt2"));
      p_options.push(document.getElementById("p_opt3"));

      firebase.database().ref('game').on('value', function(snapshot) {
        game = snapshot.val();
        //console.log('game='+game);
        for (var i = 0; i < 25; i++) {
          var q = game.bingo[i];
          square[i].innerHTML = q[0];
          var color = '#FFFFFF';
          if (q[3]==1) {
            color = '#6495ED';
            square[i].innerHTML = '乾';
          } else if (q[3]==2) {
            color = '#FF69B4';
            square[i].innerHTML = '坤';
           }
          square[i].style.backgroundColor = color;
         }
        if (game.question >= 0) {
          var q = game.bingo[game.question];
          //console.log('q='+q);
          square[game.question].style.backgroundColor = '#FFFF00';

          firebase.database().ref('questions_'+q[1]+'/'+q[2]).once('value', function(snapshot) {
            question = snapshot.val();
            //console.log('question='+question);
            if (typeof question != "undefined") {
              q_quiz.innerHTML = question.quiz;
              for (var i = 0; i < question.options.length; i++) {
                p_options[i].innerHTML = '('+(i+1)+') '+question.options[i];
                }

              firebase.database().ref().child('question');
              var updates = {}, ans = {};
              updates['/question/quiz'] = question;
              updates['/question/ans'] = ans;
              firebase.database().ref().update(updates);
              }
           });
         }
       });

      firebase.database().ref('question/ans').on('value', function(snapshot) {
         answer = snapshot.val();
         //console.log('player='+player+' answer='+answer);
         showOptions();
       });


function resetGame() {
  firebase.database().ref('category').on('value', function(snapshot) {
    console.log('category='+snapshot.val());
    var cat = snapshot.val();
    var catList = [];
    var total = 0;
    for (var i = 0; i < cat.length; i++) {
      var c = cat[i];
      total += c.size;
      for (var j = 0; j < c.size; j++) {
        var item = [c.cat, 'c'+(i+1), j, 0];
        catList.push(item);
      }
    }
    bingo = [];
    i = 25;
    j = 0;
    while (i--) {
      j = Math.floor(Math.random() * (i+1));
      bingo.push(catList[j]);
      catList.splice(j,1);
    }
    firebase.database().ref().child('game');
    var updates = {};
    updates['/game/bingo'] = bingo;
    updates['/game/question'] = -1;
    firebase.database().ref().update(updates);
    //console.log('bingo='+bingo);
    location.reload();
  });
}

function pickPlayer() {
  firebase.database().ref('players').on('value', function(snapshot) {
    var players = snapshot.val();
    var keys = Object.keys(players);
    //console.log('players='+keys);
    var man = [];
    var woman = [];
    for (var i = 0; i < keys.length; i++) {
      var p = players[keys[i]];
      if (p.sex == "man") {
        man.push(p);
      } else {
        woman.push(p);
       }
    }
    player_sex = game.turn % 2 + 1;
    i = Math.floor(game.turn / 2);
    //console.log('man='+man.length+' woman='+woman.length+' turn='+game.turn+' sex='+player_sex+' i='+i);
    if (player_sex > 1) {
      i = i % woman.length;
      if (i >= 0 && i < woman.length) {
        player = woman[i];
       }
    } else {
      i = i % man.length;
      if (i >= 0 && i < man.length) {
        player = man[i];
       }
    }
    if (typeof player != "undefined") {
      game.turn ++;
      firebase.database().ref('game/turn').set(game.turn);
      q_player.innerHTML = "參賽者 : "+(player_sex > 1 ?"坤道":"乾道")+"－"+player.name;
    }
  });
}

function pickQuestion(idx) {
  firebase.database().ref('game/question').set(idx);
  pickAnswer(-1);
  p_suggest = false;
  for (var i = 0; i < question.options.length; i++) {
    p_options[i].style.visibility = 'visible';
  }
}

function pickAnswer(idx) {
  p_answer = idx;
  refreshOptions();
}

function refreshOptions() {
  for (var i = 0; i < p_options.length; i++) {
    p_options[i].style.border = (p_answer == i) ? "8px #FFD382 groove" : '';
  }
}

function showAnswer() {
  var rightAns = question.ans-1;
  for (var i = 0; i < p_options.length; i++) {
    if (rightAns == i) {
      p_options[i].style.border = "8px #6495ED groove";
    } else if (p_answer == i) {
      p_options[i].style.border = "8px #FFD382 groove";
    }
  }
  var winner;
  if (rightAns == p_answer) {
    winner = (player_sex > 1) ? 2 : 1;
  } else {
    winner = (player_sex > 1) ? 1 : 2;
  }
  firebase.database().ref('game/bingo/'+game.question+'/3').set(winner);
}

function helpEraseAnswer() {
  var rightAns = question.ans-1;
  var j = 0;
  for (var i = 0; i < question.options.length && j < 2; i++) {
    if (i != rightAns) {
       p_options[i].style.visibility = 'hidden';
       j++;
     }
  }
}

function helpCallOut() {
}

function helpPeopleAnswer() {
  p_suggest = true;
  showOptions();
}

function showOptions() {
  if (typeof player != "undefined" && typeof answer != "undefined") {
    var keys = Object.keys(answer);
    var ans = [0, 0, 0, 0];
    for (var i = 0; i < keys.length; i++) {
      var a = answer[keys[i]];
      var a2 = ans[a] + 1;
      ans[a] = a2;
      if (player.name == keys[i]) {
        pickAnswer(answer[keys[i]]);
       }
    }
    for (var i = 0; i < question.options.length; i++) {
      p_options[i].innerHTML = '('+(i+1)+') '+question.options[i];
      if (p_suggest == true) {
        p_options[i].innerHTML += '<br>'+ans[i];
       }
    }
  }
}
/*
function pleaseAnswer() {
  var countdownNumberEl = document.getElementById('countdown-number');
  var countdown = 10;
  countdownNumberEl.textContent = countdown;
  countdownEl.style.display = "block";
  countdownTimer = setInterval(function() {
    countdown = countdown-1;
    if (countdown <= 0) {
      clearInterval(countdownTimer);
      countdownEl.style.display = "none";
      p_answer.style.display = "block";
    } else {
      countdownNumberEl.textContent = countdown;
    }
  }, 1000);
}
*/
