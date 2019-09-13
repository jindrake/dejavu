/// <reference types="cypress" />
import faker from 'faker'

describe('sign-up page', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb')
    cy.visit(`http://localhost:3000/sign-up`)
  })

  it.only('signup a new user and gets redirected to home', () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const email = faker.internet.email()
    // const password = faker.internet.password()
    const password = 'qwerqwer'

    cy.get('[data-cy=first-name]').type(firstName)
    cy.get('[data-cy=last-name]').type(lastName)
    cy.get('[data-cy=email]').type(email.toLowerCase())
    cy.get('[data-cy=field-of-study]').select('Other')
    cy.get('[data-cy=is-student]').click({ force: true })
    cy.get('[data-cy=password]').type(password)
    cy.get('[data-cy=password-confirmation]').type(password)
    cy.get('[data-cy=submit-button]').click()
    cy.location('pathname', { timeout: 50000 }).should('eq', '/')
  })

  it('fail on confirm password validation', () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const email = faker.internet.email()
    // const password = faker.internet.password()
    const password = 'qwerqwer'

    cy.get('[data-cy=email]').type(email.toLowerCase())
    cy.get('[data-cy=first-name]').type(firstName)
    cy.get('[data-cy=last-name]').type(lastName)
    cy.get('[data-cy=password]').type(password)
    cy.get('[data-cy=field-of-study]').select('Information Technology')
    cy.get('[data-cy=submit-button]').click()
    cy.get('[data-cy=confirm-password-error]').should('be.visible')
  })

  it('signup a user, then log user out, then logs in again', () => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    cy.get('[data-cy=email]').type(email.toLowerCase())
    cy.get('[data-cy=first-name]').type(firstName)
    cy.get('[data-cy=last-name]').type(lastName)
    cy.get('[data-cy=field-of-study]').select('Other')
    cy.get('[data-cy=password]').type(password)
    cy.get('[data-cy=password-confirmation]').type(password)
    cy.get('[data-cy=submit-button]').click()
    cy.location('pathname', { timeout: 50000 }).should('eq', '/')
    indexedDB.deleteDatabase('firebaseLocalStorageDb')
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('http://localhost:3000/sign-in')
    cy.get('[data-cy=email]').type(email.toLowerCase())
    cy.get('[data-cy=password]').type(password)
    cy.get('[data-cy=submit]').click()
    cy.location('pathname', { timeout: 50000 }).should('eq', '/')
  })
})
