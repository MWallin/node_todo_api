"use strict"

// *****************************************************************************
// Requires
// *****************************************************************************

// Externals

const expect = require( "expect" )
const request = require( "supertest" )
const {ObjectID} = require( "mongodb" )

// Internals

const {app} = require( "./../server/server" )
const {Todo} = require( "./../server/models/todo" )




// *****************************************************************************
// *****************************************************************************
// Setting up

const todos = [
  {
    _id : new ObjectID(),
    text: "First test todo"
  },
  {
    _id : new ObjectID(),
    text: "Second test todo"
  }
]



beforeEach( ( done ) => {

  Todo.remove({})
    .then( () => {

      return Todo.insertMany( todos )

    }).then( () => done() )


})




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



  it( "Should return 404 for non valid IDs", ( done ) => {

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
