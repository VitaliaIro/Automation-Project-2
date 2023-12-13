

describe('Issue details deleting', () => {

    const issueTitle = 'This is an issue of type: Task.';
    const issueDetailViewModal = '[data-testid="modal:issue-details"]';
    const modalConfirm = '[data-testid="modal:confirm"]';
    const iconTrash = '[data-testid="icon:trash"]';

    beforeEach(() => {
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
      }); 
      // Assert the visibility of the issue detail view modal  
      cy.get(issueDetailViewModal).should('exist')
});

    it('Issue Deletion', () => {
        // Delete the issue by clicking the delete button and confirming the deletion
        cy.get(iconTrash).click();      
        cy.contains('button', 'Delete issue')
                .click()
                .should('not.exist');

        // Assert that the deletion confirmation dialogue is not visible
        cy.contains(modalConfirm).should('not.exist');
        // Assert that the issue is deleted and no longer displayed on the Jira board.
        cy.contains(issueTitle).should('not.exist');
    });

    it('Issue Deletion Cancellation', () => {
      // Click the Delete Issue button
      cy.get(iconTrash).click(); 
      // Cancel the deletion in the confirmation pop-up
      cy.contains('button', 'Cancel').click()

      // Assert that the deletion confirmation dialogue is not visible
      cy.contains(modalConfirm).should('not.exist');

      // Assert that the issue is not deleted and is still displayed on the Jira board
      cy.get('[data-testid="icon:close"]').eq(0).click();
      cy.reload();
      cy.contains(issueTitle).should('exist');
    });
      
});