import { faker } from '@faker-js/faker';
describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      //System will already open issue creating modal in beforeEach block  
      cy.visit(url + '/board?modal-issue-create=true')
    });
  });
  const IssueTitle = faker.lorem.word()
  const IssueDescription = faker.lorem.words(10)

  it('Issue creation with story and Lord Gaben + validation', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {

      //open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .trigger('click');

      //Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');

      //Type value to title input field
      //Order of filling in the fields is first description, then title on purpose
      //Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');

      //Select Lord Gaben from assignee dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains('TEST_TITLE');
      //Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
      cy.get('[data-testid="icon:story"]').should('be.visible');
    });
  });

  it('Issue creation with bug and Pickle Rick + validation', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //open issue type dropdown and choose Bug
      cy.get('[data-testid="select:type"]').click()
      cy.get('[data-testid="select-option:Bug"]').trigger('click')
      //Type value to description input field
      cy.get('.ql-editor').type('AMT test description')
      //Type value to title input field
      cy.get('input[name="title"]').type('AMT test short summary')
      //Select Pickle Rick from assignee dropdown
      cy.get('[data-testid="select:reporterId"]').click()
      cy.get('[data-testid="select-option:Pickle Rick"]').trigger('click')
      //Click on button "Create issue"
      cy.get('button[type="submit"]').click()
    });
    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist')
    cy.contains('Issue has been successfully created.').should('be.visible')

    cy.log('Will check that changes are saved and correct')
    //Reload the page to be able to see recently created issue
    cy.reload()
    //Assert that successful message has dissappeared after the reload
    cy.contains('Issue has been successfully created.').should('not.exist')
    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]').should('have.length', '5')
        .first().find('p')
        .contains('AMT test short summary')
      //Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible')
      cy.get('[data-testid="icon:bug"]').should('be.visible')
    })
  });

  it('Issue creation using faker for title and description', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Open issue type dropdown and choose Task
      cy.get('[data-testid="select:type"]').click()
      cy.get('[data-testid="icon:task"]').trigger('click')
      //Use the random data plugin for several words to type into description input field
      cy.get('.ql-editor').click().type(IssueDescription)
      //Use the random data plugin for a single word to type into title input field
      cy.get('[name="title"]').click().type(IssueTitle)
      //Select Baby Yoda from assignee dropdown
      cy.get('[data-testid="select:userIds"]').click()
      cy.get('[data-testid="select-option:Baby Yoda"]').trigger('click')
      //Select Low from priority dropdown
      cy.get('[data-testid="select:priority"]').click()
      cy.get('[data-testid="select-option:Low"]').trigger('click')
      //Click on button "Create issue"
      cy.get('button[type="submit"]').click()
    })
    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist')
    cy.contains('Issue has been successfully created.').should('be.visible')

    cy.log('Will check that changes are saved and correct')

    //Assert that successful message has dissappeared after the reload
    cy.reload()
    cy.contains('Issue has been successfully created.').should('not.exist');

  //Assert that correct avatar and type icon, priority are visible
    cy.get('[data-testid="board-list:backlog"]').contains(IssueTitle).parent().within(() => {
      cy.get('[data-testid="icon:task"]').should('be.visible');
      cy.get('[data-testid="icon:arrow-down"]').should('be.visible')
      cy.get('[data-testid="avatar:Baby Yoda"]').should('be.visible')
       })
});
it('Should validate title is required field if missing', () => {
  //System finds modal for creating issue and does next steps inside of it
  cy.get('[data-testid="modal:issue-create"]').within(() => {

    //Click create issue button without filling any data
    cy.get('button[type="submit"]').click()

    //Assert that correct error message is visible
    cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required')
  })
})
  })



