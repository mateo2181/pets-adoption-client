/// <reference types="cypress" />

describe('Navigation', () => {
    it('Should navigate from Home to Pet Detail Page', () => {
      // Start from the index page
      cy.visit('/');
  
      // Find a link with an href attribute containing "about" and click it
      cy.get('#highlightPetList').children().first().click();
  
      cy.url().should('include', '/pets/');
      cy.get('h2').contains('About');
    });
  });