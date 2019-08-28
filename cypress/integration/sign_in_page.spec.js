/// <reference types="cypress" />
import faker from 'faker'

describe('login page', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb')
    cy.visit(`http://localhost:3000/sign-in`)
  })

  // it('login a user with unknown email password combo', () => {
  //   // replace with your seeded user account credentials
  //   const email = faker.internet.email()
  //   const password = faker.internet.password()
  //   cy.get('[data-cy=email]').type(email.toLowerCase())
  //   cy.get('[data-cy=password]').type(password)
  //   cy.get('[data-cy=submit]').click()
  //   cy.get('[data-cy=alert]').should('be.visible')
  // })

  it('login a user with no email and password', () => {
    // replace with your seeded user account credentials
    cy.get('[data-cy=submit]').click()
    cy.get('[data-cy=sign-in-email-error]').should('be.visible')
    cy.get('[data-cy=sign-in-password-error]').should('be.visible')
  })
})
