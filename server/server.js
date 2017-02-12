"use strict"

// *****************************************************************************
// *****************************************************************************
// Configure environment

require( "./config/config.js" )





// *****************************************************************************
// *****************************************************************************
// Requires and constants

// Externals

const bodyParser = require( "body-parser" )
const express    = require( "express" )
const {ObjectID} = require( "mongodb" )
const _          = require( "lodash" )

// const format     = require( "date-fns/format" )
// const svLocale   = require( "date-fns/locale/sv" )

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


app.patch( "/todos/:id", ( req, res ) => {

  const todoID = req.params.id
  const body = _.pick( req.body, ["text", "completed"] )


  if ( !ObjectID.isValid( todoID ) ) {
    return res.status( 400 ).send()

  }


  if ( _.isBoolean( body.completed ) && body.completed ) {
    body.completedAt = new Date().getTime()

    // Formatting should be handled on the client
    // body.completedAt = format(
    //   new Date(),
    //   "YYYY-MM-DD HH:mm:ss",
    //   {locale: svLocale}
    // )


  } else {
    body.completed = false
    body.completedAt = null

  }


  Todo.findByIdAndUpdate(
    todoID,
    { $set: body },
    {new: true }
  )
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
