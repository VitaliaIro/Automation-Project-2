import IssueModal from "../../pages/IssueModal";

describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    //open issue detail modal 
    cy.contains(issueTitle).click();
    });
  });

  //issue title, that we are testing with, saved into variable
  const issueTitle = 'This is an issue of type: Task.';

  it('Should delete issue successfully', () => {
    // Delete the issue by clicking the delete button and confirming the deletion
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    // Assert that issue is not visible anymore
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
  });

  it('Should cancel deletion process successfully', () => {
    // Click the Delete Issue button
    IssueModal.clickDeleteButton();
    // Cancel the deletion in the confirmation pop-up
    IssueModal.cancelDeletion();
    // Close the detail modal 
    IssueModal.closeDetailModal();
    // Assert that the issue is not deleted and is still displayed on the Jira board
    IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
  });
});