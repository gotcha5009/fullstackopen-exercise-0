describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    //create user for login
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen',
    };
    const myUser = {
      name: 'Test Boii',
      username: 'testboii',
      password: 'test1234',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user);
    cy.request('POST', 'http://localhost:3003/api/users/', myUser);

    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('Log in');
    cy.contains('username');
    cy.contains('password');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('salainen');
      cy.get('#login-button').click();

      cy.contains('Matti Luukkainen logged in');
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('wrong');
      cy.get('#login-button').click();

      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'testboii', password: 'test1234' });
      cy.createBlog({
        title: 'My test',
        author: 'Redboii',
        url: 'playpark.net',
        likes: 1,
      });

      cy.login({ username: 'mluukkai', password: 'salainen' });
      cy.createBlog({
        title: 'Really test',
        author: 'Boonyeet',
        url: 'google.net',
      });
    });

    it('A blog can be created', function () {
      cy.contains('new blog').click();
      const inputValue = {
        title: 'Mighty test',
        author: 'Boony',
        url: 'facebook.com',
      };
      for (let key in inputValue) {
        cy.get(`#${key}`).type(inputValue[key]);
      }

      cy.get('form').submit();

      cy.contains(inputValue.title);
      cy.contains(inputValue.author);
    });

    it('the user can like a blog', function () {
      cy.contains('Really test').parent().contains('view').click();

      cy.contains('Really test').parent().contains('like').click();
      cy.contains('likes 1');
    });

    it('the user can delete his own block, but not others', function () {
      cy.contains('Really test').parent().contains('view').click();
      cy.contains('Really test').parent().contains('remove').click();

      cy.on('window:confirm', () => true);

      cy.contains('Really test').should('not.exist');
      cy.contains('My test').parent().contains('view').click();
      cy.contains('My test')
        .parent()
        .contains('.removeButton')
        .should('not.exist');
    });

    it('the blog should be listed in order of likes', () => {
      const order = ['likes 1', 'likes 0'];
      cy.get('.blogs>.blog').each((ele, index) => {
        cy.wrap(ele)
          .contains('view')
          .click()
          .parents('.blog')
          .contains(order[index]);
      });
    });
  });
});
