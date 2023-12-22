describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
        });
    });

    const issueTitle = 'Double trouble issue';
    const issueDescription = 'Random description of an issue';

    function createIssue(){
        cy.get('[data-testid="icon:plus"]').click();
            // Type value to description input field
            cy.get('.ql-editor').type(issueDescription);
            cy.get('.ql-editor').should('have.text', issueDescription);
            // Type value to title input field
            cy.get('input[name="title"]').type(issueTitle);
            cy.get('input[name="title"]').should('have.value', issueTitle);
            // Open issue type dropdown and choose Bug
            cy.get('[data-testid="select:type"]').click();
            cy.get('[data-testid="select-option:Bug"]')
              .wait(1000)
              .trigger('mouseover')
              .trigger('click');
            cy.get('[data-testid="icon:bug"]').should('be.visible');
            // Select "Highest" priority
            cy.get('[data-testid="select:priority"]').click();
            cy.get('[data-testid="select-option:Highest"]').click();
            // Select Lord Gaben from assignee dropdown
            cy.get('[data-testid="select:userIds"]').click();
            cy.get('[data-testid="select-option:Lord Gaben"]').click();
            // Click on button "Create issue"
            cy.get('button[type="submit"]').click();
            // Assert that created issue is visible in the list of issues
            cy.contains(issueTitle).should('be.visible');                   
    };

    function buttonsVisibilityAssertion() {
        cy.contains('button', 'Cancel').should('be.visible');
           cy.contains('button', 'Save').should('be.visible')
                .click()
                .should('not.exist');
    };

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
    const issueCommentSection = ('[data-testid="issue-comment"]');
    const comment = 'This is a random sentence to test comments adding functionality';
    const updComment = 'A new better random comment';

    it('Should create an issue, add a comment there, edit and delete it successfully', () =>{
        createIssue();
        cy.contains(issueTitle).click();
        getIssueDetailsModal().within(() => {
           // Comments ADDING
           // Assert that there is no comments else
           cy.get(issueCommentSection).should('not.exist');        
           // Assert that there is a field for leaving a comment, click it and type a comment
           cy.contains('Add a comment...').should('be.visible')
                .click();
           cy.get('textarea[placeholder="Add a comment..."]').type(comment);
           // Assert that "Save" and "Cancel" buttons are visible (after clicking "Save" this button is not visible anymore)
           buttonsVisibilityAssertion();
           // Assert that there is new comment now     
           cy.contains('Add a comment...').should('exist');
           cy.get(issueCommentSection).should('contain', comment);
           
           // Comments EDITING
           // Click on "Edit" button and assert that it is not visible after clicking
           cy.get(issueCommentSection)
                .first()
                .contains('Edit')
                .click()
                .should('not.exist');
           // Clear the previous comment and add a new one instead
           cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', comment)
                .clear()
                .type(updComment);
           // Assert that "Save" and "Cancel" buttons are visible (after clicking "Save" this button is not visible anymore)
           buttonsVisibilityAssertion();
           // Assert that the comment is now updated
           cy.get(issueCommentSection)
                .should('contain', 'Edit')
                .and('contain', updComment);

           // Comments DELETING
           // Assert that there is "Delete" button is visible below the comment and click on it
           cy.get(issueCommentSection)
            .contains('Delete').should('be.visible')
            .click()   
        });
        // At the confirmation modal click "Delete comment" and assert that it is not visible anymore
        cy.get('[data-testid="modal:confirm"]')
        .contains('button', 'Delete comment')
        .click()
        .should('not.exist');
       // Assert that the comment is deleted (doesn't exist anymore)
       cy.get(getIssueDetailsModal).find(updComment).should('not.exist');


    })    
});
