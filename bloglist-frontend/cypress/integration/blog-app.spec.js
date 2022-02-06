describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Anurag Gupta',
      username: 'pragsmatic',
      password: 'master'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('pragsmatic')
      cy.get('#password').type('master')
      cy.get('#login-button').click()

      cy.contains('Anurag Gupta logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('pragsmatic')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.notification')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Anurag Gupta logged-in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'pragsmatic', password: 'master' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()

      cy.get('#title').type('Cypress Tester')
      cy.get('#author').type('Cypress')
      cy.get('#url').type('www.cypress.io')

      cy.get('#save').click()
      cy.contains('blog successfully created with')
      cy.contains('Cypress Tester')
    })

    it('users can like a blog', () => {
      const body = { author:'Strange Author',
        title: 'Strange Title',
        url: 'Strange URL' }
      cy.createBlog(body)
      cy.contains('Strange Author').contains('view').click()
      cy.contains('Strange Author').parent().contains('likes').click()
      cy.contains('Strange Author').parent().contains('likes').parent().contains('1')

    })

    it('users who created can delete only', () => {
      //cy.pause()
      const body = { author:'Strange Author',
        title: 'Strange Title',
        url: 'Strange URL' }

      cy.createBlog(body)
      cy.contains('Strange Author')

      cy.contains('logout').click()

      const user = {
        name: 'Some Stranger',
        username: 'stranger',
        password: 'master'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)

      cy.login({ username: 'stranger', password: 'master' })
      cy.contains('Some Stranger logged-in')

      cy.contains('Strange Author').contains('view').click()
      cy.contains('Strange Author').parent().get('#removeButton').should('not.be.visible')

      cy.contains('logout').click()
      cy.login({ username: 'pragsmatic', password: 'master' })
      cy.contains('Anurag Gupta logged-in')
      cy.contains('Strange Author').contains('view').click()
      cy.contains('Strange Author').parent().get('#removeButton').should('be.visible')
    })

    it('Blog is sorted by likes',function() {

      let body = { author:'Strange Author1',
        title: 'Strange Title1',
        url: 'Strange URL1' }
      cy.createBlog(body)

      body = { author:'Strange Author2',
        title: 'Strange Title2',
        url: 'Strange URL2' }
      cy.createBlog(body)

      body = { author:'Strange Author3',
        title: 'Strange Title3',
        url: 'Strange URL3' }
      cy.createBlog(body)
      cy.get('.blogs').should('have.length',3)

      var likes = new Array()
      let like = 0
      cy.get('.blogs').each( function($el, index) {
        const bcy = cy.wrap($el)
        bcy.get('#viewBlog').click()
        like =  Math.floor(Math.random() * 10)
        likes[index] = like
        likes.sort(function(a, b) { return b - a })
        for(let i=like;i--; )
          bcy.get('.blogsDetail').eq(index).contains('likes').click()
      })


      cy.get('#sortButton').click()

      cy.get('.blogs').each( function($el,index) {
        const bcy = cy.wrap($el)
        return bcy.find('#likes').should('have.text', likes[index])
      })

    })
  })


})