/// <reference types="cypress" />

describe('login page', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb')
    cy.visit(`http://localhost:3000/login`)
  })

  it('login a user and gets redirected to home', () => {
    // replace with your seeded user account credentials
    const email = 'owo@gmail.com'
    const password = 'qwerqwer'
    cy.get('[data-cy=email]').type(email.toLowerCase())
    cy.get('[data-cy=password]').type(password)
    cy.get('[data-cy=submit]').click()
    cy.location('pathname', {timeout: 10000}).should('eq', '/')
  })
})