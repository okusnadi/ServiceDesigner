describe('Elements', function() {
    beforeEach(function(){
        cy.visit('/')
        cy.get('button[name="dev"]').click()
    })

    function createComponent(name) {
        cy.get('div[id="components"]').trigger('mouseover')
        cy.get('span[id="icon-create-file"]>svg').click()
        cy.get('input[id="file-create-input"]').type(name+'{enter}')
        cy.get('.scrollarea-content').eq(0).click()
    }

    function createElement(name) {
        cy.get('#element-wrap').trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('input[id="element-input"]').type(name+'{enter}')
    }

    it('Choice Component', function(){
        createComponent('new')
        cy.get('div[id="element-title"]').should('have.text', 'new')
    })

    it('Add Element', function() {
        createComponent('new')
        createElement('div')
        cy.get('.scrollarea-content').eq(1).should('have.text', 'div')
        createElement('span')
    })

    it('Add Nest Element',function() {
        createComponent('new')
        createElement('div')
        cy.get('.scrollarea-content').eq(1).find('div').eq(0).trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('input[id="element-input"]').type('span{enter}')
        cy.get('.scrollarea-content').eq(1).find('div').eq(4).should('have.css', 'padding-left', '15px')
    })

    it('Delete Element',function() {
        createComponent('new')
        createElement('div')
        cy.get('.scrollarea-content').eq(1).find('div').eq(0).trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(3).click()
        cy.get('.scrollarea-content').eq(1).should('have.not.text', 'div')
    })

    it('Negative Create Element', function() {
        cy.get('#element-wrap').trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('.scrollarea-content').eq(1).should('have.text', '')
    })

    it('Collapse element', function() {
        createComponent('new')
        createElement('div')
        cy.get('.element-item').last().trigger('contextmenu')
        cy.get('div[id="contextMenu"]>div').eq(0).click()
        cy.get('input[id="element-input"]').type('span{enter}')
        cy.get('.element-item').last().should('have.text', 'span')
        cy.get('.element-item').first().find('svg').click()
        cy.get('.element-item').last().should('have.text', 'div')
        cy.get('.element-item').first().find('svg').click()
        cy.get('.element-item').last().should('have.text', 'span')
    })
})