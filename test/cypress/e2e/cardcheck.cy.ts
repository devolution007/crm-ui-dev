describe('Check Card', () => {
  it('passes test card PHC check', () => {
    cy.login(Cypress.env('csr_username'), Cypress.env('csr_password'))

    cy.visit('/card-check')
    cy.contains('Check Insurance Card').should('exist')
    cy.title().should('include', 'Card')
    cy.get('[data-cy="card-number-input"]').type('63681102000000180')
    cy.get('[data-cy="card-cvv-input"]').type('1234')
    cy.get('[data-cy="card-check-button"]').click()
    cy.contains('balance', {
      timeout: 10000
    }).should('exist')
  })
})
export {}
