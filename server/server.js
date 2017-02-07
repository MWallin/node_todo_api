"use strict"

// *****************************************************************************
// *****************************************************************************
// Requires

// Externals

const bodyParser = require( "body-parser" )
const express    = require( "express" )


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

  const {iText} = req.body


  const newTodo = new Todo({
    text: iText
  })

  newTodo.save()
    .then( ( doc ) => {

      res.send( doc )

    })
    .catch( ( error ) => {

      console.log( "Oh shit", error )

      res.status( 400 ).send( error )

    })

})





// *****************************************************************************
// *****************************************************************************
// Start server

const port = 3000

app.listen( port, () => {

  console.log( `Server is listening on port ${port}` )

})

