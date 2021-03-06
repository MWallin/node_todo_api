"use strict"

// Todo - Move tests to separate files for readability

// *****************************************************************************
// Requires
// *****************************************************************************

// Externals

const expect     = require( "expect" )
const request    = require( "supertest" )
const {ObjectID} = require( "mongodb" )

// Internals

const {app}  = require( "./../server/server" )
const {Todo} = require( "./../server/models/todo" )
const {User} = require( "./../server/models/user" )

const {todos, populateTodos, users, populateUsers} = require( "./seed/seed" )



// *****************************************************************************
// *****************************************************************************
// Setting up

beforeEach( populateUsers )

beforeEach( populateTodos )




// *****************************************************************************
// *****************************************************************************
// Tests

describe( "POST /todos", () =>{

  it( "Should create a new todo", ( done ) => {

    const text = "Dummy todo"

    request( app )
      .post( "/todos" )
      .set( "x-auth", users[0].tokens[0].token )
      .send({text: text})
      .expect( 201 )
      .expect( ( res ) => {
        expect( res.body.text ).toBe( text )

      })
      .end( ( error, res ) => {

        if ( error ) {
          return done( error )
        }

        Todo.find({text})
          .then( ( todos ) => {
            expect( todos.length ).toBe( 1 )
            expect( todos[0].text ).toBe( text )
            expect( todos[0]._creator.toHexString() ).toBe( users[0]._id.toHexString() )
            done()

          })
          .catch( ( error ) => done( error ) )

      })
  })


  it( "Should not create a todo with bad data", ( done ) => {

    request( app )
      .post( "/todos" )
      .set( "x-auth", users[0].tokens[0].token )
      .send({})
      .expect( 400 )
      .end( ( error, res ) => {
        if ( error ) {
          return done( error )
        }

        Todo.find()
          .then( ( todos ) => {
            expect( todos.length ).toBe( 2 )
            done()

          })
          .catch( ( error ) => done( error ) )

      })
  })


  it( "Should not create a todo if not authenticated", ( done ) => {

    request( app )
      .post( "/todos" )
      .send({})
      .expect( 401 )
      .end( done )


  })


})




describe( "GET /todos", () =>{

  it( "Should get all todos", ( done ) => {

    request( app )
      .get( "/todos" )
      .set( "x-auth", users[0].tokens[0].token )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todos.length ).toBe( 1 )

      })
      .end( done )

  })


  it( "Should not return todos if not authenticated", ( done ) => {

    request( app )
      .get( "/todos" )
      .send({})
      .expect( 401 )
      .end( done )


  })



})


describe( "GET /todos/:id", () => {

  it( "Should return todo doc", ( done ) => {

    const goodID = todos[0]._id.toHexString()

    request( app )
      .get( `/todos/${goodID}` )
      .set( "x-auth", users[0].tokens[0].token )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todo.text ).toBe( todos[0].text )

      })
      .end( done )


  })


  it( "Should not return todo doc for other user", ( done ) => {

    const goodID = todos[1]._id.toHexString()

    request( app )
      .get( `/todos/${goodID}` )
      .set( "x-auth", users[0].tokens[0].token )
      .expect( 404 )
      .expect( ( res ) => {
        expect( res.body ).toEqual({})

      })
      .end( done )


  })



  it( "Should return 404 if todo not found", ( done ) => {

    const badID = new ObjectID().toHexString()

    request( app )
      .get( `/todos/${badID}` )
      .set( "x-auth", users[0].tokens[0].token )
      .expect( 404 )
      .end( done )


  })



  it( "Should return 400 if ObjectID is invalid", ( done ) => {

    const badID = "123abc"

    request( app )
      .get( `/todos/${badID}` )
      .set( "x-auth", users[0].tokens[0].token )
      .expect( 400 )
      .end( done )


  })


  it( "Should not return todo if not authenticated", ( done ) => {

    const badID = "123abc"

    request( app )
      .get( `/todos/${badID}` )
      .send({})
      .expect( 401 )
      .end( done )

  })


})





describe( "DELETE /todos/:id", () => {

  it( "Should remove a todo", ( done ) => {

    const goodID = todos[1]._id.toHexString()

    request( app )
      .delete( `/todos/${goodID}` )
      .set( "x-auth", users[1].tokens[0].token )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todo._id ).toBe( goodID )

      })
      .end( ( err, res ) => {
        if ( err ) {
          return done( err )
        }

        Todo.findById( goodID )
          .then( ( todo ) => {
            expect( todo ).toNotExist()
            done()

          })
          .catch( ( error ) => done( error ) )


      })


  })


  it( "Should not remove another users todo", ( done ) => {

    const goodID = todos[0]._id.toHexString()

    request( app )
      .delete( `/todos/${goodID}` )
      .set( "x-auth", users[1].tokens[0].token )
      .expect( 404 )
      .expect( ( res ) => {
        expect( res.body ).toEqual({})

      })
      .end( ( err, res ) => {
        if ( err ) {
          return done( err )
        }

        Todo.findById( goodID )
          .then( ( todo ) => {
            expect( todo ).toExist()
            done()

          })
          .catch( ( error ) => done( error ) )


      })

  })


  it( "Should return 404 if todo not found", ( done ) => {

    const badID = new ObjectID().toHexString()

    request( app )
      .delete( `/todos/${badID}` )
      .set( "x-auth", users[1].tokens[0].token )
      .expect( 404 )
      .end( done )



  })


  it( "Should return 400 if ObjectID is invalid", ( done ) => {

    const badID = "123abc"

    request( app )
      .delete( `/todos/${badID}` )
      .set( "x-auth", users[1].tokens[0].token )
      .expect( 400 )
      .end( done )


  })


  it( "Should not delete todo if not authenticated", ( done ) => {

    const badID = "123abc"

    request( app )
      .delete( `/todos/${badID}` )
      .send({})
      .expect( 401 )
      .end( done )

  })

})


describe( "PATCH /todos/:id", () => {

  it( "Should update the todo", ( done ) => {

    const goodID = todos[0]._id.toHexString()

    const todoUpdate = {
      text     : "New todo text",
      completed: true,
      priority : "High"
    }

    request( app )
      .patch( `/todos/${goodID}` )
      .set( "x-auth", users[0].tokens[0].token )
      .send( todoUpdate )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todo.text ).toBe( todoUpdate.text )
        expect( res.body.todo.completed ).toBe( todoUpdate.completed )
        expect( res.body.todo.completedAt ).toBeA( "number" )
        expect( res.body.priority ).toNotExist()

      })
      .end( done )


  })

  it( "Should not update the todo for another user", ( done ) => {

    const goodID = todos[0]._id.toHexString()

    const todoUpdate = {
      text     : "New todo text",
      completed: true,
      priority : "High"
    }

    request( app )
      .patch( `/todos/${goodID}` )
      .set( "x-auth", users[1].tokens[0].token )
      .send( todoUpdate )
      .expect( 404 )
      .expect( ( res ) => {
        expect( res.body ).toEqual({})

      })
      .end( ( err, res ) => {

        Todo.findById( goodID )
          .then( ( todo ) => {
            expect( todo.text ).toNotBe( todoUpdate.text )
            done()

          })
          .catch( ( error ) => done( error ) )


      })


  })


  it( "Should clear completedAt when todo is not completed", ( done ) => {

    const goodID = todos[1]._id.toHexString()

    const todoUpdate = {
      text     : "New todo text",
      completed: false
    }

    request( app )
      .patch( `/todos/${goodID}` )
      .set( "x-auth", users[1 ].tokens[0].token )
      .send( todoUpdate )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todo.text ).toBe( todoUpdate.text )
        expect( res.body.todo.completed ).toBe( todoUpdate.completed )
        expect( res.body.todo.completedAt ).toNotExist()

      })
      .end( done )


  })


  it( "Should return 404 if todo not found", ( done ) => {

    const badID = new ObjectID().toHexString()

    request( app )
      .patch( `/todos/${badID}` )
      .set( "x-auth", users[1 ].tokens[0].token )
      .expect( 404 )
      .end( done )



  })


  it( "Should return 400 if ObjectID is invalid", ( done ) => {

    const badID = "123abc"

    request( app )
      .patch( `/todos/${badID}` )
      .set( "x-auth", users[1 ].tokens[0].token )
      .expect( 400 )
      .end( done )


  })

  it( "Should not update todo if not authenticated", ( done ) => {

    const badID = "123abc"

    request( app )
      .patch( `/todos/${badID}` )
      .expect( 401 )
      .end( done )

  })

})


describe( "GET /users/me", () => {

  it( "Should return user if authenticated", ( done ) => {

    request( app )
      .get( "/users/me" )
      .set( "x-auth", users[0].tokens[0].token )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body._id ).toBe( users[0]._id.toHexString() )
        expect( res.body.email ).toBe( users[0].email )

      })
      .end( done )


  })


  it( "Should return 401 if not authenticated", ( done ) => {

    request( app )
      .get( "/users/me" )
      .expect( 401 )
      .expect( ( res ) => {
        expect( res.body ).toEqual({})

      })
      .end( done )


  })


})



describe( "POST /users", () => {

  it( "Should return 201 with new user with x-auth header", ( done ) => {

    const user = {
      email   : "email@example.com",
      password: "abc123"
    }

    request( app )
      .post( "/users" )
      .send( user )
      .expect( 201 )
      .expect( ( res ) => {
        expect( res.headers["x-auth"] ).toExist()
        expect( res.body._id ).toExist()
        expect( res.body.email ).toBe( user.email )

      })
      .end( ( error ) => {

        if ( error ) {
          return done( error )
        }

        User.findOne({email: user.email})
          .then( ( returnedUser ) => {
            expect( returnedUser ).toExist()
            expect( returnedUser.password ).toNotBe( user.password )
            done()

          })
          .catch( ( error ) => done( error ) )

      })


  })


  it( "Should return validation error if no email or password", ( done ) => {

    const user = {
      email   : "e",
      password: "1"
    }

    request( app )
      .post( "/users" )
      .send( user )
      .expect( 400 )
      .end( done )


  })


  it( "Should return error if email in use", ( done ) => {

    const user = {
      email   : users[1].email,
      password: users[1].password
    }

    request( app )
      .post( "/users" )
      .send( user )
      .expect( 400 )
      .end( done )


  })


})




describe( "POST /users/login", () => {

  it( "Should login user and return auth-token", ( done ) => {

    const user = {
      _id     : users[1]._id,
      email   : users[1].email,
      password: users[1].password
    }

    request( app )
      .post( "/users/login" )
      .send( user )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.headers["x-auth"] ).toExist()
        expect( res.body._id ).toBe( user._id.toHexString() )
        expect( res.body.email ).toBe( user.email )
      })
      .end( ( error, res ) => {

        if ( error ) {
          return done( error )
        }

        User.findById( user._id )
          .then( ( returnedUser ) => {
            expect( returnedUser.tokens[1] ).toInclude(
              {
                access: "auth",
                token : res.headers["x-auth"]
              }
            )

            done()

          })
          .catch( ( error ) => done( error ) )

      })

  })


  it( "Should reject invalid login", ( done ) => {

    const user = {
      _id     : users[1]._id,
      email   : users[1].email,
      password: "users[1].password"
    }

    request( app )
      .post( "/users/login" )
      .send( user )
      .expect( 400 )
      .expect( ( res ) => {
        expect( res.headers["x-auth"] ).toNotExist()
        expect( res.body._id ).toNotExist()

      })
      .end( ( error, res ) => {

        if ( error ) {
          return done( error )
        }

        User.findById( user._id )
          .then( ( returnedUser ) => {
            expect( returnedUser.tokens.length ).toBe( 1 )

            done()

          })
          .catch( ( error ) => done( error ) )

      })


  })


})



describe( "DELETE /users/me/token", () => {

  it( "Should remove auth token on logout", ( done ) => {

    const user = {
      _id  : users[0]._id,
      token: users[0].tokens[0].token
    }

    request( app )
      .delete( "/users/me/token" )
      .set( "x-auth", user.token )
      .expect( 200 )
      .end( ( error, res ) => {

        if ( error ) {
          return done( error )
        }

        User.findById( user._id )
          .then( ( returnedUser ) => {
            expect( returnedUser.tokens.length ).toBe( 0 )

            done()

          })
          .catch( ( error ) => done( error ) )

      })



  })



  it( "Should return 401 if not authenticated", ( done ) => {

    request( app )
      .delete( "/users/me/token" )
      .expect( 401 )
      .end( done )


  })



})

