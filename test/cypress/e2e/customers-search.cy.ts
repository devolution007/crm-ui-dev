/// <reference types="cypress" />

describe('Customers search', () => {
  const timeout = 2000

  beforeEach(() => {
    cy.login(Cypress.env('csr_username'), Cypress.env('csr_password'))
    cy.visit('/customers')

    cy.contains('Results', { timeout }).should('exist')
    cy.get('[data-cy="customers-search-submit"].q-focusable', { timeout }).should('exist')
  })

  it('entered to the customers page', () => {
    cy.contains('Customers').should('exist')
    cy.title().should('include', 'Customers')
  })

  it('passes search by member ID', () => {
    cy.get('[data-cy="customers-search-input"]').type('A017')
    cy.get('[data-cy="customers-search-submit"]').click()

    cy.get('[data-cy="customer-view-profile-btn"]')
      .should('have.length', 1)
  })

  it('passes search by last 5 digits insurance card', () => {
    cy.get('[data-cy="customers-search-input"]').type('00202')
    cy.get('[data-cy="customers-search-submit"]').click()

    cy.get('[data-cy="customer-view-profile-btn"]', { timeout })
      .should('exist')

    cy.contains('1234567890aa', { timeout }).should('exist')
  })

  it('passes search by first and last name', () => {
    cy.get('[data-cy="customers-search-input"]').type('Nancy Keiff')
    cy.get('[data-cy="customers-search-submit"]').click()

    cy.get('[data-cy="customer-view-profile-btn"]', { timeout })
      .should('have.length.at.least', 1)
      .should('have.length.lessThan', 5)

    cy.contains('310491', { timeout }).should('exist')
  })
})
export {}
