/// <reference types="cypress" />

describe('web socket event handler', () => {

  beforeEach(() => {
        cy.visit('http://localhost:8000')
  });

  it('testChat', () => {
    cy.get(`input`).type('asdf').type('{enter}')
    cy.get('.my-message').should('contain.text', "asdf")
    
  })

  it('testAfterLoad', () => {
    cy.get('.game-info-message:first').should('contain.text', 'black')
    cy.get('.game-info-message:nth-child(2)').should('contain.text', 'chess1')
    
  })

  it('testResignButton', () => {
    cy.on('uncaught:exception', (err, runnable) => {
      // return false to prevent the error from
      // failing this test
      return false
    })

    cy.get('#btn-resign').click()
    cy.get('.game-info-message:first').should('contain.text', 'RESIGNED')
    
  })

  it('testTimerVisible', () => {

    cy.get('.timer-container').should('be.visible')
    cy.get('.timer-container').should('contain.text', '00:02:00')
    
  })



})