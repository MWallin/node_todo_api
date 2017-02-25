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
const {authenticate} = require( "./middleware/authenticate" )


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

// Todo - Move routes to a router file
// Todo - Move logic to controller file

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

  // Todo - Move to a function on the model #https://goo.gl/L3Oqan
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




app.post( "/users", ( req, res ) => {

  const body = _.pick( req.body, ["email", "password"] )

  const newUser = new User( body )


  newUser.save()
    .then( () => {

      return newUser.generateAuthToken()

    })
    .then( ( token ) => {

      res.status( 201 ).header( "x-auth", token ).send( newUser )

    })
    .catch( ( error ) => {

      res.status( 400 ).send( error )

    })

})




app.get( "/users/me", authenticate, ( req, res ) => {

  res.send( req.user )


})



app.post( "/users/login", ( req, res ) => {

  const body = _.pick( req.body, ["email", "password"] )

  User.findByCredentials( body.email, body.password )
    .then( ( user ) => {

      return user.generateAuthToken()
        .then( ( token ) => {

          res.header( "x-auth", token ).send( user )

        })

    })
    .catch( ( error ) =>{

      res.status( 400 ).send()


    })


})



app.delete( "/users/me/token", authenticate, ( req, res ) => {

  req.user.removeToken( req.token )
    .then( () => {

      res.status( 200 ).send()

    })
    .catch( () => {

      res.status( 400 ).send()

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
