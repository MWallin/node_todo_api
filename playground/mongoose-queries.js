"use strict"

// *****************************************************************************
// *****************************************************************************
// Requires


const {ObjectID} = require( "mongodb" )

const {mongoose} = require( "./../server/db/mongoose" )
const {Todo} = require( "./../server/models/todo" )
const {User} = require( "./../server/models/user" )


// *****************************************************************************
// *****************************************************************************
// Queries


const userID = "99a823c159f05450c74e2b"

getUser( userID )


function getUser ( id ) {

  if ( ObjectID.isValid( id ) ) {

    User.findById( id )
      .then( ( user ) => {

        if ( !user ) {

          return console.log( "User not found" )

        }

        console.log( "User", user )

      })
      .catch( ( error ) => {

        console.log( "Unable to find user", error )

      })

  } else {

    console.log( "Invalid ID" )

  }

}







// const id = "62569e06b6c5260c10aeb"

// if ( !ObjectID.isValid( id ) ) {

//   console.log( "ObjectID not valid" )

// }

// Todo.find({ _id: id })
//   .then( ( todos ) => {

//     console.log( "Todos", todos )

//   })

// Todo.findOne({ _id: id })
//   .then( ( todo ) => {

//     console.log( "Todo", todo )

//   })


// Todo.findById( id )
//   .then( ( todo ) => {

//     if ( !todo ) {

//       return console.log( "Todo ID not found." )

//     }

//     console.log( "Todo by _id", todo )

//   })
//   .catch( ( error ) => console.log( error ))
