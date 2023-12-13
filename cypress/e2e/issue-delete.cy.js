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
});

    it('Should delete issue successfully', () => {
        
        cy.get(iconTrash).click();
        
        cy.contains('button', 'Delete issue')
                .click()
                .should('not.exist');
        cy.contains(modalConfirm).should('not.exist');
        cy.contains(issueTitle).should('not.exist');
    });
      
});