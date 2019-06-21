/// <reference types="cypress" />
import faker from 'faker'

describe('sign page', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb')
    cy.visit(`http://localhost:3000/signup`)
  })

  it('signup a new user and gets redirected to home', () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    cy.get('[data-cy=email]').type(email.toLowerCase())
    cy.get('[data-cy=first-name]').type(firstName)
    cy.get('[data-cy=last-name]').type(lastName)
    cy.get('[data-cy=password]').type(password)
    cy.get('[data-cy=password-2]').type(password)
    cy.get('[data-cy=submit]').click()
    cy.location('pathname', {timeout: 10000}).should('eq', '/')
  })

})