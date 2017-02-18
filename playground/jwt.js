"use strict"

// *****************************************************************************
// Requires

const jwt = require( "jsonwebtoken" )


const data = {
  id: 10
}

const token = jwt.sign( data, "abc123" )

console.log( "token", token )


const decoded = jwt.verify( token, "abc123" )

console.log( "decoded", decoded )
