"use strict"

// *****************************************************************************
// *****************************************************************************
// Load environment variables

require( "dotenv-safe" ).load()





// *****************************************************************************
// *****************************************************************************
// Requires and constants

// Externals

const bodyParser = require( "body-parser" )
const express    = require( "express" )
const {ObjectID} = require( "mongodb" )


// Internals

const {mongoose} = require( "./db/mongoose" )
const {Todo}     = require( "./models/todo" )
const {User}     = require( "./models/user" )


// Constants

const PORT = process.env.PORT





// *****************************************************************************
// *****************************************************************************
// App setup

const app = express()

app.use( bodyParser.json() )


// *****************************************************************************
// *****************************************************************************
// Routing

app.post( "/todos", ( req, res ) => {

  const {text} = req.body

  const newTodo = new Todo({
    text: text
  })

  newTodo.save()
    .then( ( doc ) => {

      res.status( 201 ).send( doc )

    })
    .catch( ( error ) => {

      res.status( 400 ).send( error )

    })

})


app.get( "/todos", ( req, res ) => {

  Todo.find()
    .then( ( todos ) => {

      res.send({todos})

    })
    .catch( ( error ) => {

      res.status( 400 ).send( error )

    })


})


app.get( "/todos/:id", ( req, res ) => {

  const todoID = req.params.id


  if ( !ObjectID.isValid( todoID ) ) {
    return res.status( 400 ).send()

  }


  Todo.findById( todoID )
    .then( ( todo ) => {

      if ( !todo ) {
        return res.status( 404 ).send()
      }

      res.status( 200 ).send({todo})

    })
    .catch( ( error ) => {

      res.status( 500 ).send()

      console.log( error )

    })


})


app.delete( "/todos/:id", ( req, res ) => {

  const todoID = req.params.id


  if ( !ObjectID.isValid( todoID ) ) {
    return res.status( 400 ).send()

  }


  Todo.findByIdAndRemove( todoID )
    .then( ( todo ) => {

      if ( !todo ) {
        return res.status( 404 ).send()
      }

      res.status( 200 ).send({todo})

    })
    .catch( ( error ) => {

      res.status( 500 ).send()

      console.log( error )

    })


})



// *****************************************************************************
// *****************************************************************************
// Start server

app.listen( PORT, () => {

  console.log( `Server is listening on port ${PORT}` )

})



// *****************************************************************************
// *****************************************************************************
// Exports for testing

module.exports = {
  app
}
