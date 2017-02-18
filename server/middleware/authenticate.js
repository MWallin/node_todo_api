"use strict"

// *****************************************************************************
// *****************************************************************************
// Requires

const {User} = require( "./../models/user" )


// *****************************************************************************
// *****************************************************************************
// Middleware definition

function authenticate ( req, res, next ) {

  const token = req.header( "x-auth" )


  User.findByToken( token )
    .then( ( user ) => {

      if ( !user ) {

        return Promise.reject()

      }

      req.user = user
      req.token = token

      next()


    }).catch( ( error ) => {

      res.status( 401 ).send()

    })


}

// *****************************************************************************
// *****************************************************************************
// Exports

module.exports = {
  authenticate
}
