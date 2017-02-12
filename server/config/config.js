"use strict"

// *****************************************************************************
// *****************************************************************************
// Require

require( "dotenv-safe" ).load()



// *****************************************************************************
// *****************************************************************************
// Manage environments

const env = process.env.NODE_ENV || "development"


console.log( "*** Environment ***", env )


if ( env === "production" ) {

  process.env.DB_URI = process.env.PROD_DB_URI



} else if ( env === "development" ) {

  process.env.DB_URI = process.env.DEV_DB_URI



} else if ( env === "test" ) {

  process.env.DB_URI = process.env.TEST_DB_URI


}






