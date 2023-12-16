import { faker } from '@faker-js/faker';

describe('Issue deletion', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
            cy.visit(url + '/board');
            //Create to issue for deletion
            cy.visit(url + '/board?modal-issue-create=true')
            createNewIssue()
             //Open just created issue
            cy.contains(IssueTitle).click()
        })

    })

    it('Delete Issue', () => {
    
        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="icon:trash"]').click()
        })
        cy.contains(deleteConfirm).should('exist')
        cy.contains(deleteTitle).click()
        cy.contains(deleteConfirm).should('not.exist')
        cy.reload()
        cy.contains(IssueTitle).should('not.exist')

    });

    it('Cancel deleting Issue', () => {
        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="icon:trash"]').click()
        })
        cy.contains(deleteConfirm).should('exist')
        cy.contains(cancelTitle).click()
        cy.contains(deleteConfirm).should('not.exist')
        cy.get('[data-testid="icon:close"]').first().click()
        getIssueDetailsModal().should('not.exist')
        cy.contains(IssueTitle).should('exist')

    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]')
    const deleteConfirm = ('Are you sure you want to delete this issue?')
    const deleteTitle = ('Delete issue')
    const cancelTitle = ('Cancel')
    const IssueTitle = faker.lorem.word()
    const IssueDescription = faker.lorem.words(10)
    function createNewIssue() {
        cy.get('[data-testid="modal:issue-create"]').within(() => {
            cy.get('[data-testid="select:type"]').click()
            cy.get('[data-testid="icon:task"]').trigger('click')
            cy.get('.ql-editor').click().type(IssueDescription)
            cy.get('[name="title"]').click().type(IssueTitle)
            cy.get('[data-testid="select:userIds"]').click()
            cy.get('[data-testid="select-option:Baby Yoda"]').trigger('click')
            cy.get('[data-testid="select:priority"]').click()
            cy.get('[data-testid="select-option:Low"]').trigger('click')
            cy.get('button[type="submit"]').click()

        })
    }
})

