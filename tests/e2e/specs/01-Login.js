
describe('Test iniciar sesión', () => {
    beforeEach(() => {
        sessionStorage.removeItem("usuarioLoggeado")
        sessionStorage.removeItem("usuarioNombre")
        cy.visit('/')
    })

    it('Iniciar sesión sin completar los datos', () => {
        cy.contains('Inicio de sesión')
        cy.TipearLogin('', '')
        cy.contains("Datos incompletos")
    })

    it('Iniciar sesión con datos incorrectos', () => {
        cy.contains('Inicio de sesión')
        cy.TipearLogin('Fer', 'blablabla')
        cy.contains('Usuario inexistente o contraseña incorrecta')
    })

    it('Iniciar sesión con datos correctos', () => {
        cy.contains('Inicio de sesión')
        cy.TipearLogin('Fer', 'Fer')
        cy.get('[data-cy=IconoSesionIniciada]')
        cy.get('[data-cy=IconoSesionIniciada]').should('exist')
    })

    it('Cerrar sesión', () => {
        cy.contains('Inicio de sesión')
        cy.TipearLogin('Fer', 'Fer')
        cy.get('[data-cy=IconoSesionIniciada]')
        cy.get('#BotonAbrirMenu').click()
        cy.get('#BotonCerrarSesion').click()
        cy.get('[data-cy=IconoSesionIniciada]').should('not.exist')
    })
})