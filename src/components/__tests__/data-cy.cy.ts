import DataCyComponent from '../test-demo/data-cy.vue'

describe('dataCy command', () => {
  it('works as a parent command', () => {
    cy.mount(DataCyComponent)

    cy.dataCy('wrapper').should('exist')
    cy.dataCy('paragraph').should('exist').and('contain', 'Test')
  })

  it('works as a child command', () => {
    cy.mount(DataCyComponent)

    cy.dataCy('wrapper').dataCy('paragraph').should('exist')
  })
})
