/// <reference types="cypress" />

describe('example quiz test take', () => {
  it('opens the homepage', () => {
    cy.visit('http://localhost:8000/');
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

    // Lets this because of this issue: https://62c842678c90491c2cb27bdd.mockapi.io/personality-test//questions/0
  });

  it('selects the second answers and goes to the next question', () => {
    cy.get('label[for="answer-2"]').click();
  });
});
