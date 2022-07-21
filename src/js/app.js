import '../css/main.css';
import { showElement, hideElement } from './toggleElementVisibility';

// Elements
const questionField = document.querySelector('.js-question-field');
const answersField = document.querySelector('.js-answers-field');

const loadingIcon = document.querySelector('.js-loading');

const resultWrapper = document.querySelector('.js-result-wrapper');
const resultTitle = document.querySelector('.js-result-title');
const resultText = document.querySelector('.js-result-text');

const questionsWrapper = document.querySelector('.js-questions-wrapper');
const testWrapper = document.querySelector('.js-test-wrapper');
const preTestWrapper = document.querySelector('.js-start-test');

// Buttons
const startTestSubmit = document.querySelector('.js-start-questions');
const prevQuestionButton = document.querySelector('.js-prev-question');
const nextQuestionButton = document.querySelector('.js-next-question');
const finishTestButton = document.querySelector('.js-finish-test');

var quiz = {
  current_question: 0,
  answers: [],
  fetch_url: 'https://62c842678c90491c2cb27bdd.mockapi.io/personality-test/',
  total_questions: 0,
  saveAnswer: (target) => {
    quiz.answers[quiz.current_question] = Number(target.value);
  },
  updateCurrentQuestion: (handler) => {
    if (handler === 'next') {
      quiz.current_question += 1;
    } else if (handler === 'prev') {
      quiz.current_question -= 1;
    }

    quiz.updateQuestionOnLocalStorage();
  },
  initVariables: () => {
    const localStorageData = window.localStorage.getItem('test_data');
    const localStorageDataObject = JSON.parse(localStorageData);
    quiz.current_question = localStorageDataObject.current_question;
    quiz.answers = localStorageDataObject.answers;
  },
  saveOnLocalStorage: () => {
    const localStorageData = {
      current_question: quiz.current_question,
      answers: quiz.answers,
    };

    window.localStorage.setItem('test_data', JSON.stringify(localStorageData));
  },
  updateQuestionOnLocalStorage: () => {
    const testData = window.localStorage.getItem('test_data');
    const testDataObject = JSON.parse(testData);
    testDataObject.current_question = quiz.current_question;
    testDataObject.answers = quiz.answers;
    window.localStorage.setItem('test_data', JSON.stringify(testDataObject));
  },
  getQuestion: async (id) => {
    const response = await fetch(`${quiz.fetch_url}/questions/${id}`);
    const data = await response.json();
    return data;
  },
  getQuestionsLength: () => {
    fetch(`${quiz.fetch_url}/questions`)
      .then((response) => response.json())
      .then((data) => {
        quiz.total_questions = data.count;
      });
  },
  areVariablesInLocalStorage: () => {
    if (window.localStorage.getItem('test_data') != null) {
      return true;
    } return false;
  },
  getResult: async (personality) => {
    const response = await fetch(`${quiz.fetch_url}/results`);
    const data = await response.json();
    return data[0].results[personality];
  },
};

var handlers = {
  startQuiz: () => {
    if (quiz.areVariablesInLocalStorage()) {
      quiz.initVariables();
      hideElement(preTestWrapper);
      showElement(testWrapper);
      view.goToQuestion(quiz.current_question);
    } else {
      quiz.saveOnLocalStorage();
      view.initNameView();
    }
    quiz.getQuestionsLength();
    handlers.initEventListeners();
  },
  initEventListeners: () => {
    nextQuestionButton.addEventListener('click', () => {
      quiz.updateCurrentQuestion('next');
      view.disableNextButton();
      view.goToQuestion(quiz.current_question);
    });

    prevQuestionButton.addEventListener('click', () => {
      quiz.updateCurrentQuestion('prev');
      view.disableNextButton();
      view.goToQuestion(quiz.current_question);
    });

    startTestSubmit.addEventListener('click', () => {
      hideElement(preTestWrapper);
      showElement(testWrapper);

      view.goToQuestion(0);
    });

    finishTestButton.addEventListener('click', () => {
      hideElement(questionField);
      hideElement(questionsWrapper);

      handlers.getResult();
    });
  },
  initAnswerChangeEventListener: () => {
    answersField.addEventListener('change', function (e) {
      const { target } = e;
      if (target.type === 'radio') {
        view.enableNextButton();
        quiz.saveAnswer(target);
        quiz.updateCurrentQuestion();

        if (quiz.current_question === quiz.total_questions - 1) {
          finishTestButton.disabled = false;
        }
      }
    });
  },
  getResult: () => {
    let answersResult = 0;
    let personality;

    quiz.answers.forEach((answer) => {
      answersResult = answer + answersResult;
    });

    if (answersResult < (quiz.total_questions * 4) / 2) {
      personality = 'introvert';
    } else {
      personality = 'extrovert';
    }

    const result = quiz.getResult(personality);
    result.then((data) => {
      view.showResult(personality, data);
    });
  },
};

var view = {
  initNameView: () => {
    const nameInput = document.querySelector('.js-name-input');

    nameInput.addEventListener('keyup', function () {
      if (this.value !== '') {
        startTestSubmit.disabled = false;
      } else {
        startTestSubmit.disabled = true;
      }
    });
  },
  goToQuestion: (id) => {
    // Show Loading Icon
    showElement(loadingIcon);

    // Hide and remove current question
    hideElement(questionsWrapper);
    questionField.innerHTML = '';
    answersField.innerHTML = '';

    // Show Next Question
    view.showQuestion(id);
    view.toggleButtonsDisableProperty();
  },
  showQuestion: (id) => {
    const question = quiz.getQuestion(id);

    question.then((data) => {
      questionField.innerHTML = data.question;
      let isChecked;
      let checkAnswer;

      data.answers.forEach((answer, i) => {
        if (quiz.answers[quiz.current_question] === i + 1) {
          checkAnswer = true;
          isChecked = true;
        }

        answersField.innerHTML += `<li>
              <input ${
  checkAnswer === true ? 'checked' : ''
} class="absolute top-0 left-0 invisible peer" name="eri" type="radio" value="${
  i + 1
}" id="answer-${i + 1}">
              <label class="flex border border-gray-300 rounded-md py-3 px-3.5 cursor-pointer hover:shadow-md transition duration-200 peer-checked:border-blue-600 peer-checked:font-medium" for="answer-${
  i + 1
}">${answer}</label>
            </li>`;

        checkAnswer = false;
      });

      if (isChecked) {
        view.enableNextButton();
      }

      handlers.initAnswerChangeEventListener();
      hideElement(loadingIcon);
      showElement(questionsWrapper);
    });
  },
  enableNextButton: () => {
    nextQuestionButton.disabled = false;
  },
  disableNextButton: () => {
    nextQuestionButton.disabled = true;
  },
  toggleButtonsDisableProperty: () => {
    if (quiz.current_question === quiz.total_questions - 1) {
      hideElement(nextQuestionButton);
      showElement(finishTestButton);
      return;
    }
    hideElement(finishTestButton);
    showElement(nextQuestionButton);

    if (quiz.current_question === 0) {
      prevQuestionButton.disabled = true;
      return;
    }

    prevQuestionButton.disabled = false;
  },
  showResult: (title, data) => {
    resultTitle.innerHTML = title;
    resultText.innerHTML = data;
    showElement(resultWrapper);
  },
};

// Init App
document.addEventListener('DOMContentLoaded', () => {
  handlers.startQuiz();
});
