describe("Time tracking functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        createIssue();
      });
  });

  const issueTitle = "Double trouble issue";
  const issueDescription = "Random description of an issue";
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const timeInsertingField = '[placeholder="Number"]';
  const stopWatch = '[data-testid="icon:stopwatch"]';

  function openTimeLoggingModal() {
    cy.get(stopWatch).should("be.visible").click();
  }
  function doneButtonVisibilityandClick() {
    cy.contains("button", "Done")
      .should("be.visible")
      .click()
      .should("not.exist");
  }

  function createIssue() {
    cy.get('[data-testid="icon:plus"]').click();
    // Open issue type dropdown and choose Bug
    cy.get('[data-testid="select:type"]').click();
    cy.get('[data-testid="select-option:Bug"]')
      .wait(1000)
      .trigger("mouseover")
      .trigger("click");
    cy.get('[data-testid="icon:bug"]').should("be.visible");
    // Type value to description input field
    cy.get(".ql-editor").type(issueDescription);
    cy.get(".ql-editor").should("have.text", issueDescription);
    // Type value to title input field
    cy.get('input[name="title"]').type(issueTitle);
    cy.get('input[name="title"]').should("have.value", issueTitle);

    // Select "Highest" priority
    cy.get('[data-testid="select:priority"]').click();
    cy.get('[data-testid="select-option:Highest"]').click();
    // Select Lord Gaben from assignee dropdown
    cy.get('[data-testid="select:userIds"]').click();
    cy.get('[data-testid="select-option:Lord Gaben"]').click();
    // Click on button "Create issue"
    cy.get('button[type="submit"]').click();
    // Assert that created issue is visible in the list of issues
    cy.contains(issueTitle).should("be.visible");
  }

  it("Should add/edit/delete the time estimation in the created issue", () => {
    cy.contains(issueTitle).click();
    getIssueDetailsModal().within(() => {
      // Estimated time ADDING
      // Assert that there is field for inserting the estimated time visible, clear it and type 10
      cy.get(timeInsertingField)
        .should("be.visible")
        .click()
        .clear()
        .type("15");
      // Click somewhere else and check that estimated time is visible now
      cy.contains("Created at").click();
      cy.contains("15h estimated").should("be.visible");

      // Estimated time UPDATING
      // Click on time-adding field and update an estimated time (type 20)
      cy.get(timeInsertingField).click().clear().type("20");
      // Click somewhere else and check that updated estimated time is visible now
      cy.contains("Created at").click();
      cy.contains("20h estimated").should("be.visible");

      // Estimated time DELETING
      // // Click on time-adding field and delete an estimated time
      cy.get(timeInsertingField).click().clear();
      // Click somewhere else and check that estimated time is not visible anymore
      cy.contains("Created at").click();
      cy.contains("20h estimated").should("not.exist");
    });
  });

  it("Should add/edit/delete logged time in the created issue", () => {
    cy.contains(issueTitle).click();
    getIssueDetailsModal().within(() => {
      // Logged and remaining hours ADDING
      // Assert that there is a place where user can log time and click on it
      openTimeLoggingModal();
    });
    // Type 10 to the first field and 20 to the second
    cy.get('[data-testid="modal:tracking"]').within(() => {
      cy.get('[placeholder="Number"]').first().type("10");
      cy.get('[placeholder="Number"]').last().type("20");
      doneButtonVisibilityandClick();
    });
    // Assert that logged and remaining hours are visible
    cy.contains("10h logged").should("be.visible");
    cy.contains("20h remaining").should("be.visible");

    // Logged and remaining hours EDITING
    openTimeLoggingModal();
    cy.get('[data-testid="modal:tracking"]').within(() => {
      // Clear all fields and type 20 to the first field and 10 to the second
      cy.get('[placeholder="Number"][value="10"]').first().clear().type("20");
      cy.get('[placeholder="Number"][value="20"]').last().clear().type("10");
      doneButtonVisibilityandClick();
    });
    // Assert that updated logged and remaining hours are visible
    cy.contains("20h logged").should("be.visible");
    cy.contains("10h remaining").should("be.visible");

    // Logged and remaining hours DELETING
    openTimeLoggingModal();
    cy.get('[data-testid="modal:tracking"]').within(() => {
      // Clear all the fields and click done button
      cy.get('[placeholder="Number"][value="20"]').first().click().clear();
      cy.get('[placeholder="Number"][value="10"]').last().click().clear();
      doneButtonVisibilityandClick();
    });
    // Assert that there is no hours logged and remaining
    cy.contains("No time logged").should("be.visible");
    cy.contains("10h remaining").should("not.exist");
  });
});
