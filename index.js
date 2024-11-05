$(document).ready(function () {
  var question;
  var interval;
  var timeLeft = 10;
  var score = 0;
  
  // the number limit slider
  $(document).on('input', '#numberSlider', function() {
    $('#sliderValue').html( $(this).val() );
  });
  // update the time Left
  var updateTimeLeft = function (number) {
    timeLeft += number;
    $("#timeLeft").text(timeLeft);
  };
  
  // update the score
  var updateScore = function (number) {
    score += number;
    var highScore = $("#highScore").text();
    if (Number(highScore) < score) {
      highScore = score;
      $("#highScore").text(score);
    }
    $("#score").text(score);
  };
  
  // start the game
  var startGame = function () {
    // setting the interval and tracking time
    if (!interval) {
      if (timeLeft === 0) {
        updateTimeLeft(10);
        updateScore(-score);
      }
      interval = setInterval(function () {
        updateTimeLeft(-1);
        if (timeLeft === 0) {
          clearInterval(interval);
          interval = undefined;
        }
      }, 1000);
    }
  };
  
  // get a random number
  var getNumber = function (max) {
    return Math.ceil(Math.random() * max);
  };
  
  // get a question and result
  var getQuestion = function () {
    var question = {};
    var operators = $("input[type='checkbox']:checked").map(function () {
      return $(this).val();
    }).get();
    console.log(operators);
    //var operators = ["+", "-", "*", "/"];
    var operator = operators[Math.floor(Math.random() * operators.length)];
    
    var max = Number($("#sliderValue").html());
    var number1 = getNumber(max);
    var number2 = getNumber(max);
    question.qString = String(number1) + " " + operator + " " + String(number2);
    
    switch (operator) {
      case '+':
        question.result = number1 + number2;
        break;
      case '-':
        if (number2 > number1) {
          question.result = number2 - number1;
        } else {
          question.result = number1 - number2;
        }
        break;
      case '*':
        question.result = number1 * number2;
        break;
      case '/':
        var dividend = number1 * number2;
        question.result = dividend / number1;
        question.qString = String(dividend) + " " + operator + " " + String(number1);
        break;
    }
    
    return question;
  };
  
  // show a question
  var updateQuestion = function () {
    question = getQuestion();
    $("#question").text(question.qString);
  };
  
  // check the player's answer
  var checkAnswer = function (answer, result) {
    if (answer === result) {
      updateQuestion();
      $('#answer').val('');
      updateTimeLeft(+1);
      updateScore(+1);
    }
  };
  
  // when player enters an answer
  $('#answer').on('keyup', function () {
    startGame();
    checkAnswer(Number($(this).val()), question.result);
  });
  
  // show a new question
  updateQuestion();
  
});