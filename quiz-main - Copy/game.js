// Declare variables for questions, answer choices, and start button
let question = document.getElementById("question");
let choices = document.getElementById("choices");
let start = document.getElementById("start");
// Declare variables for the word "Score" (score_prefix) and the numeric quiz score itself (scoreText)
let scoreText = document.getElementById("score");
let score_prefix = document.getElementById("score-prefix");
// Declare variable for input area for the player's initials
var initialsContainer = document.getElementById("initials");
// Declare variables for leaderboard and other elements
let leaderBoard = document.querySelector("#leaderBoard");
var currentQuestion = {};
var score = 0;
var questionCounter = 0;
// Declare variable to hold array of quiz questions
var availableQuestions = [];
// Declare variables for points, number of quiz questions, and number of minutes on timer
var SCORE_POINTS = 0;
var MAX_QUESTIONS = 10;
var minForQuiz = 10;

// Declare variable to hold array of questions, answer choices, and correct answers
var questions = [
  {
    question: "What is 5 + 7?",
    choices: ["10", "12", "11", "13"],
    correctanswer: "12",
  },
  {
    question: "What is 9 - 3?",
    choices: ["5", "6", "4", "7"],
    correctanswer: "6",
  },
  {
    question: "What is 8 × 2?",
    choices: ["14", "16", "18", "20"],
    correctanswer: "16",
  },
  {
    question: "What is 36 ÷ 6?",
    choices: ["5", "6", "7", "8"],
    correctanswer: "6",
  },
  {
    question: "What is the square of 4?",
    choices: ["8", "12", "16", "20"],
    correctanswer: "16",
  },
  {
    question: "What is 15% of 200?",
    choices: ["25", "30", "35", "40"],
    correctanswer: "30",
  },
  {
    question: "What is the value of π (Pi) approximately?",
    choices: ["2.14", "3.14", "4.14", "5.14"],
    correctanswer: "3.14",
  },
  {
    question: "What is the next prime number after 7?",
    choices: ["9", "10", "11", "12"],
    correctanswer: "11",
  },
  {
    question: "What is 3 squared?",
    choices: ["6", "9", "12", "15"],
    correctanswer: "9",
  },
  {
    question: "What is the result of 25 - 9?",
    choices: ["14", "15", "16", "17"],
    correctanswer: "16",
  },
];

// Set up timer
let timer = "";
let time = "";
let quizTimer = document.getElementById("timer");
// Start quiz (reset score, start timer, display first question, begin keeping score, etc.)
let startQuiz = function () {
  questionCounter = 0;
  SCORE_POINTS = 0;
  scoreText.innerText = "";
  availableQuestions = [...questions.slice(0, MAX_QUESTIONS)];
  startTimer();
  score_prefix.style.display = "none";
  start.classList.add("d-none");
  leaderBoard.innerHTML = "";
};
// Add input handler to let user enter and save his/her/their initials at end of game
function addInput() {
  let input = document.createElement("input");
  input.oninput = function (e) {
    name = e.target.value;
  };
  let btn = document.createElement("button");
  btn.innerText = "Save";
  let header = document.createElement("h1");
  header.innerText = "Please enter your initials";
  return [input, btn, header];
}
// Start or restart timer with each new game; clear previous time remaining
function startTimer() {
  clearInterval(timer);
  time = new Date();
  time.setMinutes(minForQuiz);
  time.setSeconds(0);
  quizTimer.innerHTML = `${time.getMinutes()}:${time
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
  // Display running timer (min:sec), subtracting seconds as game progresses and stopping quiz when timer reaches zero
  timer = setInterval(() => {
    if (time.getMinutes() === 0 && time.getSeconds() === 0) {
      stopQuiz();
    } else {
      time.setSeconds(time.getSeconds() - 1);
      quizTimer.innerHTML = `${time.getMinutes()}:${time
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;
    }
  }, 1000);
}
// When quiz ends, total the user's score and display it, show input area for user's initials, save entered initials to leaderboard, display leaderboard
let stopQuiz = function () {
  choices.innerHTML = "";
  scoreText.innerHTML = SCORE_POINTS;
  question.innerHTML = "";
  clearInterval(timer);
  let [input, btn, header] = addInput();
  let initials = "";
  input.oninput = function (e) {
    initials = e.target.value;
  };
  btn.onclick = function () {
    saveToLeaderBoard(initials);
    initialsContainer.innerHTML = "";
  };
  initialsContainer.append(header, input, btn);
  score_prefix.style.display = "block";
};

// Parse string to save initials in local storage
let saveToLeaderBoard = function (initials = "AB") {
  let leaderBoard = localStorage.getItem("leaderBoard");
  if (leaderBoard) {
    leaderBoard = JSON.parse(leaderBoard);
  }
  // Show nothing if no scores/initials are available in local storage
  else {
    leaderBoard = [];
  }
  // Push saved initials and score to leaderboard
  leaderBoard.push({
    initials: initials,
    score: SCORE_POINTS,
  });
  // If score and initials are saved in local storage, stringify to display on leaderboard
  localStorage.setItem("leaderBoard", JSON.stringify(leaderBoard));
  showLeaderBoard(leaderBoard);
  start.classList.remove("d-none"); //Add play button that opens quiz from landing page.
  start.innerText = "Play again";
};

// Get new question each time one is answered
let getNewQuestion = function () {
  // Set up array to structure list of answer choices
  let prefixes = ["A", "B", "C", "D"];
  // Cut last question from array and store in variable
  let current = availableQuestions.pop();
  if (current) {
    // Use forEach method to call choice prefix [A, B, C, and D] and choice text for each question in the array
    question.innerHTML = current.question;
    choices.innerHTML = "";
    current.choices.forEach((choice, index) => {
      // Display alpha prefixes and answer choices on buttons
      choices.innerHTML += `
          <button type="button" class="btn btn-outline-info d-grid gap-2 col-6 mx-auto" data-bs-toggle="button">
          <p class="choice-prefix">${prefixes[index]}</p>
          <p class="choice-text" data-number="${index}">${choice}</p>
          </button><br/><br/>
          `;
    });
    // Use HTML data-number property to track the user's answer choices
    choices.querySelectorAll("button").forEach(function (choice) {
      choice.onclick = function () {
        // The dataset is data-number, so we know which choice is selected
        let number = choice.querySelector("p.choice-text").dataset["number"];
        // Set up scoring so that a point is added for each correct response and time is deducted for each incorrect response
        if (current.choices[number] == current.correctanswer) {
          SCORE_POINTS += 1;
        } else {
          // Set up timer so that it subtracts time in proportion to the number of quiz questions
          let howManySecToReduce = (minForQuiz * 60) / MAX_QUESTIONS;
          time.setSeconds(time.getSeconds() - howManySecToReduce);
        }
        getNewQuestion();
      };
    });
  } else {
    stopQuiz();
  }
};
// Begin quiz when user clicks the start button
start.onclick = function () {
  startQuiz();
  getNewQuestion();
};
