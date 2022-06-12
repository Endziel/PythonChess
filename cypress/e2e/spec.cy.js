/// <reference types="cypress" />

describe('web socket event handler', () => {

  beforeEach(() => {
        cy.visit('http://localhost:8000')
  });

  it('testChat', () => {
    cy.get(`input`).type('asdf').type('{enter}')
    cy.get('.my-message').should('contain.text', "asdf")
    
  })
})