// Use `cy.dataCy` custom command for more robust tests
// See https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements

// ** This file is an example of how to write Cypress tests, you can safely delete it **

// This test will pass when run against a clean Quasar project
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('.should() - assert that <title> is correct', () => {
    cy.title().should('include', 'OTCStores CRM')
  })
  it('should not login with wrong password', () => {
    cy.get('[data-cy="login-button"]').click()
    cy.contains('E-mail is required').should('exist')
    cy.get('[data-cy="username"]').type('testoperator@otcstores.com')
    cy.get('[data-cy="password"]').type('12345678')
    cy.get('[data-cy="login-button"]').click()
    cy.contains('Invalid credentials').should('exist')
  })
  it('should login with correct creds', () => {
    cy.get('[data-cy="username"]').type(Cypress.env('csr_username'))
    cy.get('[data-cy="password"]').clear()
    cy.get('[data-cy="password"]').type(Cypress.env('csr_password'), { log: false })
    cy.get('[data-cy="login-button"]').click()
    cy.contains('Dashboard').should('exist')
  })
})

// ** The following code is an example to show you how to write some tests for your home page **
//
// describe('Home page tests', () => {
//   beforeEach(() => {
//     cy.visit('/');
//   });
//   it('has pretty background', () => {
//     cy.dataCy('landing-wrapper')
//       .should('have.css', 'background')
//       .and('match', /(".+(\/img\/background).+\.png)/);
//   });
//   it('has pretty logo', () => {
//     cy.dataCy('landing-wrapper img')
//       .should('have.class', 'logo-main')
//       .and('have.attr', 'src')
//       .and('match', /^(data:image\/svg\+xml).+/);
//   });
//   it('has very important information', () => {
//     cy.dataCy('instruction-wrapper')
//       .should('contain', 'SETUP INSTRUCTIONS')
//       .and('contain', 'Configure Authentication')
//       .and('contain', 'Database Configuration and CRUD operations')
//       .and('contain', 'Continuous Integration & Continuous Deployment CI/CD');
//   });
// });

// Workaround for Cypress AE + TS + Vite
// See: https://github.com/quasarframework/quasar-testing/issues/262#issuecomment-1154127497
export {}
