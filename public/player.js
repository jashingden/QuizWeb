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
      var p_quiz = document.getElementById("p_quiz");
      var p_ans_ok = document.getElementById("p_ans_ok");
      var player, question;
      var p_answer = -1;
      var p_options = [];
      p_options.push(document.getElementById("p_opt0"));
      p_options.push(document.getElementById("p_opt1"));
      p_options.push(document.getElementById("p_opt2"));
      p_options.push(document.getElementById("p_opt3"));

      console.log('cookie: '+document.cookie)
      if (-1 != document.cookie.indexOf("player=")) {
        player = cookie('player');
        p_form.style.display = "none";
        p_question.style.display = "block";
        p_id.innerHTML = (cookie('sex')=="man"?"乾道":"坤道")+"－"+player;

        firebase.database().ref('question/quiz').on('value', function(snapshot) {
           question = snapshot.val();
           console.log('question='+question);
           pickAnswer(-1);
           p_ans_ok.innerHTML = '';
           if (typeof question != "undefined") {
             p_quiz.innerHTML = question.quiz;
             for (var i = 0; i < question.options.length; i++) {
               p_options[i].innerHTML = '('+(i+1)+') '+question.options[i];
               }
             }
         });
       }

function getSelected(radio) {
  for (var i = 0; i < radio.length; i++) {
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
  location.reload();
}

function setCookie(name, value) {
  var date = new Date();
  date.setTime(date.getTime() + 12 * 60 * 60 * 1000); //12 hours
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

function pickAnswer(idx) {
  p_answer = idx;
  refreshOptions();
}

function refreshOptions() {
  for (var i = 0; i < p_options.length; i++) {
    p_options[i].style.border = (p_answer == i) ? "8px #FFD382 groove" : '';
  }
}

function sendAnswer() {
  //console.log('sendAnswer='+p_answer+' player='+player);
  if (typeof player != "undefined") {
    firebase.database().ref('question/ans/'+player).set(p_answer);
    p_ans_ok.innerHTML = '已送出！';
  }
}

