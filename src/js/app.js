import '../css/main.css';
import { showElement, hideElement } from './toggleElementVisibility';

/* Your JS Code goes here */

// Global and state variables
let CURRENT_QUESTION = 0;
let TOTAL_QUESTIONS;
const FETCH_URL = 'https://62c842678c90491c2cb27bdd.mockapi.io/personality-test/';

// Elements
const questionField = document.querySelector('.js-question-field');
const answersField = document.querySelector('.js-answers-field');

const loadingIcon = document.querySelector('.js-loading');

const resultWrapper = document.querySelector('.js-result-wrapper');
const resultText = document.querySelector('.js-result-text');

const questionsWrapper = document.querySelector('.js-questions-wrapper');
const testWrapper = document.querySelector('.js-test-wrapper');
const preTestWrapper = document.querySelector('.js-start-test');

// Buttons
const startTestSubmit = document.querySelector('.js-start-questions');
const prevQuestionButton = document.querySelector('.js-prev-question');
const nextQuestionButton = document.querySelector('.js-next-question');
const finishTestButton = document.querySelector('.js-finish-test');

// Event Listeners
function initEventListeners() {
  nextQuestionButton.addEventListener('click', () => {
    CURRENT_QUESTION += 1;
    disableNextButton();
    goToQuestion(CURRENT_QUESTION);
  });

  prevQuestionButton.addEventListener('click', () => {
    CURRENT_QUESTION -= 1;
    goToQuestion(CURRENT_QUESTION);
  });

  startTestSubmit.addEventListener('click', () => {
    hideElement(preTestWrapper);
    showElement(testWrapper);

    goToQuestion(0);
  });

  finishTestButton.addEventListener('click', () => {
    hideElement(questionField);
    hideElement(questionsWrapper);

    getResult();
  });
}

/**
 * When the radio is selected, we enable the nextQuestionButton
 */
function initAnswerChangeEventListener() {
  answersField.addEventListener('change', function(e) {
    const { target } = e;
    if (target.type === 'radio') {
      enableNextButton();

      if (CURRENT_QUESTION === TOTAL_QUESTIONS - 1) {
        finishTestButton.disabled = false;
      }
    }
  });
}

// Init App
document.addEventListener('DOMContentLoaded', function() {
  initApp();
});

// Functions
function initApp() {
  const nameInput = document.querySelector('.js-name-input');

  nameInput.addEventListener('keyup', function() {
    if (this.value !== '') {
      startTestSubmit.disabled = false;
    } else {
      startTestSubmit.disabled = true;
    }
  });

  initEventListeners();
  getQuestionsLength();
}

/**
 * Get the questions length and save it on the state
 */
function getQuestionsLength() {
  fetch(`${FETCH_URL}/questions`)
    .then((response) => response.json())
    .then((data) => {
      TOTAL_QUESTIONS = data.count;
    });
}

/**
 * Returns the question data for specific id
 * @param {int} id
 * @returns object
 */
async function getQuestion(id) {
  const response = await fetch(`${FETCH_URL}/questions/${id}`);
  const data = await response.json();
  return data;
}

/**
 * Gets the questions and shows it in the view
 * @param {int} id
 */
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

    initAnswerChangeEventListener();
    hideElement(loadingIcon);
    showElement(questionsWrapper);
  });
}

function goToQuestion(id) {
  // Show Loading Icon
  showElement(loadingIcon);

  // Hide and remove current question
  hideElement(questionsWrapper);
  questionField.innerHTML = '';
  answersField.innerHTML = '';

  // Show Next Question
  showQuestion(id);
  toggleButtonsDisableProperty();
}

/**
 * Toggle prev/next buttons depending on which question we are currently
 * @returns void
 */
function toggleButtonsDisableProperty() {
  if (CURRENT_QUESTION === TOTAL_QUESTIONS - 1) {
    hideElement(nextQuestionButton);
    showElement(finishTestButton);
    return;
  }
  hideElement(finishTestButton);
  showElement(nextQuestionButton);

  if (CURRENT_QUESTION === 0) {
    prevQuestionButton.disabled = true;
    return;
  }

  prevQuestionButton.disabled = false;
}

function enableNextButton() {
  nextQuestionButton.disabled = false;
}

function disableNextButton() {
  nextQuestionButton.disabled = true;
}

// Result functions
function getResult() {
  fetch(`${FETCH_URL}/results`)
    .then((response) => response.json())
    .then((data) => {
      showResult(data[0].results.introvert);
    });
}

function showResult(data) {
  resultText.innerHTML = data;
  showElement(resultWrapper);
}
