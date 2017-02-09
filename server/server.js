"use strict"

// *****************************************************************************
// *****************************************************************************
// Requires

// Externals

const bodyParser = require( "body-parser" )
const express    = require( "express" )
const {ObjectID} = require( "mongodb" )


// Internals

const {mongoose} = require( "./db/mongoose" )
const {Todo}     = require( "./models/todo" )
const {User}     = require( "./models/user" )




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

      res.send( doc )

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
    return res.status( 404 ).send()

  }


  Todo.findById( todoID )
    .then( ( todo ) => {

      if ( !todo ) {
        return res.status( 404 ).send()
      }

      res.status( 200 ).send({todo})

    })
    .catch( ( error ) => {

      res.status( 400 ).send()

    })


})




// *****************************************************************************
// *****************************************************************************
// Start server

const port = 3000

app.listen( port, () => {

  console.log( `Server is listening on port ${port}` )

})



// *****************************************************************************
// *****************************************************************************
// Exports for testing

module.exports = {
  app
}
