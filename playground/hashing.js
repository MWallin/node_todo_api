"use strict"

// *****************************************************************************
// Requires

const {SHA256} = require( "crypto-js" )

const message = "I am user number 3"

const hash = SHA256( message ).toString()

console.log( `Message: ${message}` )
console.log( `Message: ${hash}` )


const data = {
  id: 4
}

const token = {
  data,
  hash: SHA256( JSON.stringify( data ) + "somesecret" ).toString()
}


token.data.id = 5
token.hash = SHA256( JSON.stringify( token.data ).toString() )


const resultHash = SHA256( JSON.stringify( token.data ) + "somesecret" ).toString()


if ( resultHash === token.hash ) {
  console.log( "Data was not changed" )
} else {
  console.log( "Data has changed, DO NOT TRUST!" )
}
