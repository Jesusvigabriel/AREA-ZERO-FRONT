describe('EmailConfig page', () => {
  beforeEach(() => {
    sessionStorage.removeItem('usuarioLoggeado')
    sessionStorage.removeItem('usuarioNombre')
    cy.visit('/')
    cy.TipearLogin('Fer', 'Fer')
  })

  it('should load and display form fields', () => {
    cy.contains('button', 'SEGURIDAD').click()
    cy.contains('div', 'Configurar Correos').click()

    cy.url().should('include', '/Seguridad/EmailConfig')
    cy.contains('label', 'Nombre')
    cy.contains('label', 'Host')
    cy.contains('label', 'Puerto')
    cy.contains('label', 'Usuario')
    cy.contains('label', 'Password')
    cy.contains('label', 'Email Desde')
    cy.contains('label', 'Nombre Desde')
  })
})
