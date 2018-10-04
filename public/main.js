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

      var game, player;
      var square = [];
      var i, j;
      for (i = 0; i < 5; i++) {
        var s = [];
        for (j = 0; j < 5; j++) {
          s[j] = document.getElementById("square"+(i*5+j));
         }
        square[i] = s;
       }
      var q_player = document.getElementById("q_player");

      firebase.database().ref('game').once('value', function(snapshot) {
        game = snapshot.val();
        console.log('game='+game);
        for (i = 0; i < 5; i++) {
          for (j = 0; j < 5; j++) {
            square[i][j].innerHTML = game.bingo[i*5+j][0];
           }
         }
       });

function resetGame() {
  firebase.database().ref('category').on('value', function(snapshot) {
    console.log('category='+snapshot.val());
    var cat = snapshot.val();
    var catList = [];
    var total = 0;
    for (i = 0; i < cat.length; i++) {
      var c = cat[i];
      total += c.size;
      for (j = 0; j < c.size; j++) {
        var item = [c.cat, i, j, 0];
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
    /*for (i = 0; i < 5; i++) {
      for (j = 0; j < 5; j++) {
        square[i][j].innerHTML = squareQuiz[i*5+j][0];
      }
    }*/
    firebase.database().ref('game/bingo').set(bingo);
    //console.log('bingo='+bingo);
  });
}

function pickPlayer() {
  firebase.database().ref('players').on('value', function(snapshot) {
    var players = snapshot.val();
    var keys = Object.keys(players);
    console.log('players='+keys);
    var len = keys.length;
    var man = [];
    var woman = [];
    for (i = 0; i < len; i++) {
      var p = players[keys[i]];
      if (p.sex == "man") {
        man.push(p);
      } else {
        woman.push(p);
       }
    }
    var sex = game.turn % 2;
    i = Math.floor(game.turn / 2);
    //console.log('man='+man.length+' woman='+woman.length+' turn='+game.turn+' sex='+sex+' i='+i);
    if (sex > 0) {
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
      q_player.innerHTML = "參賽者 : "+(sex > 0 ?"坤道":"乾道")+"－"+player.name;
    }
  });
}
/*
      var q_no = document.getElementById("q_no");
      var q_quiz = document.getElementById("q_quiz");
      var q_ans = document.getElementById("q_ans");
      var q_desc = document.getElementById("q_desc");
      var questionIdx = -1;
      var question;
      var countdownEl = document.getElementById("countdown");
      var countdownTimer;
      var p_answer = document.getElementById("p_answer");
      firebase.database().ref('game/question').on('value', function(snapshot) {
        questionIdx = snapshot.val();
        console.log('questionIdx='+questionIdx);
        q_no.innerHTML = '第'+(questionIdx+1)+'題';

        firebase.database().ref('questions/'+questionIdx).on('value', function(snapshot) {
          question = snapshot.val();
          console.log(question);
          q_quiz.innerHTML = question.quiz;
          });
       });
      var p_ans1 = document.getElementById("p_ans1");
      firebase.database().ref('game/answer1').on('value', function(snapshot) {
        console.log('p_ans1='+snapshot.val());
        p_ans1.innerHTML = snapshot.val();
       });
      firebase.database().ref('game/answer2').on('value', function(snapshot) {
        console.log('p_ans2='+snapshot.val());
        p_ans2.innerHTML = snapshot.val();
       });
      firebase.database().ref('game/answer3').on('value', function(snapshot) {
        console.log('p_ans3='+snapshot.val());
        p_ans3.innerHTML = snapshot.val();
       });
      firebase.database().ref('game/answer4').on('value', function(snapshot) {
        console.log('p_ans4='+snapshot.val());
        p_ans4.innerHTML = snapshot.val();
       });

function gotoQuestion(diff) {
  var q = questionIdx + diff;
  console.log('gotoQuestion='+q);
  if (q >= 0) {
    p_answer.style.display = "none";
    q_ans.style.display = "none";
    q_ans.innerHTML = '';
    q_desc.style.display = "none";
    q_desc.innerHTML = '';
    firebase.database().ref('game/question').set(q);
    firebase.database().ref('game/answer1').set('');
    firebase.database().ref('game/answer2').set('');
    firebase.database().ref('game/answer3').set('');
    firebase.database().ref('game/answer4').set('');
  }
}

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

function showAnswer() {
  q_ans.style.display = "block";
  q_ans.innerHTML = '答案: '+question.ans;
  if (question.desc != '') {
    q_desc.style.display = "block";
   q_desc.innerHTML = '說明: <br>'+question.desc;
  }
}
*/
