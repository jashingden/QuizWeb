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

      var p_form = document.getElementById("p_form");
      var p_question = document.getElementById("p_question");
      var p_id = document.getElementById("p_id");
      var p_name = document.getElementById("p_name");
      var p_sex = document.getElementsByName("p_sex");
      var p_age = document.getElementsByName("p_age");
      var p_mobile = document.getElementById("p_mobile");
      var p_email = document.getElementById("p_email");

      console.log('cookie: '+document.cookie)
      if (-1 != document.cookie.indexOf("player=")) {
        p_form.style.display = "none";
        p_question.style.display = "block";
        p_id.innerHTML = (cookie('sex')=="man"?"乾道":"坤道")+"－"+cookie('player');
       }

function getSelected(radio) {
  var i, r;
  for (i = 0; i < radio.length; i++) {
    if (radio[i].checked) {
      return radio[i].value;
     }
  }
  return '';
}

function sendPlayer() {
  var strName = p_name.value;
  var strSex = getSelected(p_sex);
  var p_info = {
    name: strName,
    sex: strSex,
    age: Number(getSelected(p_age)),
    mobile: p_mobile.value,
    email: p_email.value
  };
  console.log('sendPlayer='+strName);
  if (strName.length > 0) {
    firebase.database().ref().child('players');
    var updates = {};
    updates['/players/'+strName] = p_info;
    firebase.database().ref().update(updates);
    setCookie('player', strName);
    setCookie('sex', strSex);
    location.reload();
  }
}

function changePlayer() {
  delCookie('player');
  p_form.style.display = "block";
  p_question.style.display = "none";
}

function setCookie(name, value) {
  var date = new Date();
  date.setTime(date.getTime() + 60 * 60 * 1000); //60min
  var str = name + "=" + escape(value) + ";expires=" + date.toGMTString();
  document.cookie = str;
  console.log('cookie: '+document.cookie)
}

function delCookie(name)
{
  document.cookie = name+"=;expires="+(new Date(0)).toGMTString();
}

function cookie(name){    
  var cookieArray=document.cookie.split("; ");
  var cookie=new Object();
  for (var i=0;i<cookieArray.length;i++){
     var arr=cookieArray[i].split("=");
     if(arr[0]==name)return unescape(arr[1]);
  } 
  return ""; 
}
/*
      var p_no = document.getElementById("p_no");
      var p_quiz = document.getElementById("p_quiz");
      var p_ans = document.getElementById("p_ans");
      var p_ans_ok = document.getElementById("p_ans_ok");
      var questionIdx = -1;
      var question;
      firebase.database().ref('game/question').on('value', function(snapshot) {
        questionIdx = snapshot.val();
        console.log('questionIdx='+questionIdx);
        p_no.innerHTML = '第'+(questionIdx+1)+'題';
        p_ans.value = '';
        p_ans_ok.innerHTML = '';

        firebase.database().ref('questions/'+questionIdx).on('value', function(snapshot) {
          question = snapshot.val();
          console.log(question);
          p_quiz.innerHTML = question.quiz;
          });
       });

function sendAnswer(player) {
  console.log('sendAnswer='+p_ans.value);
  firebase.database().ref('game/answer'+player).set(p_ans.value);
  p_ans_ok.innerHTML = '已送出！';
}
*/
