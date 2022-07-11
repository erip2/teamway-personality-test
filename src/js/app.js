import '../css/main.css';
import { showElement, hideElement } from './toggleElementVisibility';

/* Your JS Code goes here */

// Global variables
const CURRENT_QUESTION = 0;
let TOTAL_QUESTIONS;

// Elements
const questionField = document.querySelector('.js-question-field');
const answersField = document.querySelector('.js-answer-list');
const prevQuestionButton = document.querySelector('.js-prev-question');
const nextQuestionButton = document.querySelector('.js-next-question');
const startTestSubmit = document.querySelector('.js-start-questions');
const loadingIcon = document.querySelector('.js-loading');

// Event Listeners
nextQuestionButton.addEventListener('click', (e) => {
  const nextQuestionId = e.target.dataset.nextQuestion;
  e.target.dataset.nextQuestion = Number(nextQuestionId) + 1;
  goToQuestion(nextQuestionId);
});

prevQuestionButton.addEventListener('click', (e) => {
  const prevQuestionId = e.target.dataset.prevQuestion;
  e.target.dataset.prevQuestion = Number(prevQuestionId) - 1;
  goToQuestion(prevQuestionId);
});

startTestSubmit.addEventListener('click', function() {
  hideNameInput();
  showQuestion(0);
});

// Init App
document.addEventListener('DOMContentLoaded', function() {
  startQuestions();
});

// Functions
function startQuestions() {
  const nameInput = document.querySelector('.js-name-input');

  nameInput.addEventListener('keyup', function() {
    if (this.value !== '') {
      startTestSubmit.disabled = false;
    } else {
      startTestSubmit.disabled = true;
    }
  });

  getQuestionsLength();
}

function hideNameInput() {
  document.querySelector('.js-start-test').style.display = 'none';
  showElement(document.querySelector('.js-questions-wrapper'));
}

function getQuestionsLength() {
  fetch('https://62c842678c90491c2cb27bdd.mockapi.io/personality-test/questions')
    .then((response) => response.json())
    .then((data) => {
      TOTAL_QUESTIONS = data.count;
    });
}

async function getQuestion(id) {
  const response = await fetch(`https://62c842678c90491c2cb27bdd.mockapi.io/personality-test/questions/${id}`);
  const data = await response.json();
  return data;
}

function showQuestion(id) {
  const question = getQuestion(id);

  question.then((data) => {
    questionField.innerHTML = data.question;

    data.answers.forEach((answer, i) => {
      answersField.innerHTML
      += `<li>
            <input class="absolute top-0 left-0 invisible peer" name="eri" type="radio" value="answer-${i}" id="answer-${i}">
            <label class="flex border border-gray-300 rounded-md py-3 px-3.5 cursor-pointer hover:shadow-md transition duration-200 peer-checked:border-blue-600 peer-checked:font-medium" for="answer-${i}">${answer}</label>
          </li>`;
    });

    hideElement(loadingIcon);
    showElement(document.querySelector('.js-questions'));
  });
}

function goToQuestion(id) {
  // Show Loading Icon
  loadingIcon.classList.remove('hidden');

  // Hide and remove current question
  showElement(document.querySelector('.js-questions'));
  questionField.innerHTML = '';
  answersField.innerHTML = '';

  // Show Next Question
  enableDisableButtons();
  showQuestion(id);
}

function enableDisableButtons() {
  if (CURRENT_QUESTION === TOTAL_QUESTIONS) {
    nextQuestionButton.disabled = true;
    return;
  }

  if (CURRENT_QUESTION === 0) {
    prevQuestionButton.disabled = true;
    return;
  }

  nextQuestionButton.disabled = false;
  prevQuestionButton.disabled = false;
}
