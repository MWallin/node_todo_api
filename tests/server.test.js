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
            done()

          })
          .catch( ( error ) => done( error ) )

      })
  })


  it( "Should not create a todo with bad data", ( done ) => {

    request( app )
      .post( "/todos" )
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




})




describe( "GET /todos", () =>{

  it( "Should get all todos", ( done ) => {

    request( app )
      .get( "/todos" )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todos.length ).toBe( 2 )

      })
      .end( done )

  })




})


describe( "GET /todos/:id", () => {

  it( "Should return todo doc", ( done ) => {

    const goodID = todos[0]._id.toHexString()

    request( app )
      .get( `/todos/${goodID}` )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todo.text ).toBe( todos[0].text )

      })
      .end( done )


  })



  it( "Should return 404 if todo not found", ( done ) => {

    const badID = new ObjectID().toHexString()

    request( app )
      .get( `/todos/${badID}` )
      .expect( 404 )
      .end( done )


  })



  it( "Should return 400 if ObjectID is invalid", ( done ) => {

    const badID = "123abc"

    request( app )
      .get( `/todos/${badID}` )
      .expect( 400 )
      .end( done )


  })



})



describe( "DELETE /todos/:id", () => {

  it( "Should remove a todo", ( done ) => {

    const goodID = todos[0]._id.toHexString()

    request( app )
      .delete( `/todos/${goodID}` )
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


  it( "Should return 404 if todo not found", ( done ) => {

    const badID = new ObjectID().toHexString()

    request( app )
      .delete( `/todos/${badID}` )
      .expect( 404 )
      .end( done )



  })


  it( "Should return 400 if ObjectID is invalid", ( done ) => {

    const badID = "123abc"

    request( app )
      .delete( `/todos/${badID}` )
      .expect( 400 )
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


  it( "Should clear completedAt when todo is not completed", ( done ) => {

    const goodID = todos[1]._id.toHexString()

    const todoUpdate = {
      text     : "New todo text",
      completed: false
    }

    request( app )
      .patch( `/todos/${goodID}` )
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
      .expect( 404 )
      .end( done )



  })


  it( "Should return 400 if ObjectID is invalid", ( done ) => {

    const badID = "123abc"

    request( app )
      .patch( `/todos/${badID}` )
      .expect( 400 )
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


