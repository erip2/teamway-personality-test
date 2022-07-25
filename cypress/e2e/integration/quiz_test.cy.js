/// <reference types="cypress" />
import 'cypress-localstorage-commands';

describe('example quiz test take', () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('opens the homepage', () => {
    cy.visit('index.html');
  });

  it('opens the test page', () => {
    cy.get('a[href="the-test.html"]').click();

    cy.url()
      .should('include', '/the-test.html');
  });

  it('should check the start quiz button to be disabled', () => {
    cy.get('.js-start-test > button').should('be.disabled');
  });

  it('fills the name input and stars the quiz', () => {
    cy.get('input[type="name"]')
      .type('My Name');

    cy.get('.js-start-test > button')
      .click();
  });

  it('should show the first question and answers', () => {
    // cy.intercept('https://62c842678c90491c2cb27bdd.mockapi.io/personality-test/questions/0').as('getFirstQuesion');

    // cy.wait('@getFirstQuesion').its('response.statusCode').should('eq', 200);

    // Let this because of this issue:
  });

  it('selects a random answer and goes to the next question', () => {
    for (let i = 0; i < 8; i++) {
      const randomAnswer = Math.floor(Math.random() * 4) + 1;
      cy.get(`label[for="answer-${randomAnswer}"]`).click();
      cy.get('.js-next-question').click();
    }

    const randomAnswer = Math.floor(Math.random() * 4) + 1;
    cy.get(`label[for="answer-${randomAnswer}"]`).click();
  });

  it('should the reload the page', () => {
    cy.reload();
  });

  it('should continue where it left of and selects a random answer and goes to the next question', () => {
    for (let i = 0; i < 5; i++) {
      const randomAnswer = Math.floor(Math.random() * 4) + 1;
      cy.get(`label[for="answer-${randomAnswer}"]`).click();
      cy.get('.js-next-question').click();
    }

    const randomAnswer = Math.floor(Math.random() * 4) + 1;
    cy.get(`label[for="answer-${randomAnswer}"]`).click();
  });

  it('should show the quiz answer', () => {
    cy.get('.js-finish-test').click();
  });
});
