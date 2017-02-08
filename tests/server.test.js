"use strict"

// *****************************************************************************
// Requires
// *****************************************************************************

const expect = require( "expect" )
const request = require( "supertest" )

const {app} = require( "./../server/server" )
const {Todo} = require( "./../server/models/todo" )




// *****************************************************************************
// *****************************************************************************
// Prepares

beforeEach( ( done ) => {

  Todo.remove({})
    .then( () => done())

})




// *****************************************************************************
// *****************************************************************************
// Tests

describe( "POST Todos", () =>{

  it( "Should create a new todo", ( done ) => {

    const text = "Dummy todo"

    request( app )
      .post( "/todos" )
      .send({text: text})
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.text ).toBe( text )

      })
      .end( ( error, res ) => {

        if ( error ) {
          return done( error )
        }

        Todo.find()
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
            expect( todos.length ).toBe( 0 )
            done()

          })
          .catch( ( error ) => done( error ) )

      })
  })


})
