
const bcrypt = require( "bcryptjs" )

const password = "123abc!"



bcrypt.genSalt( 11 )
  .then( ( salt ) => {

    return bcrypt.hash( password, salt )

  })
  .then( ( hash ) => {

    console.log( "hash", hash )

  })
  .catch( ( error ) => {

    console.log( "Oh snap", error )

  })


const passHash = "$2a$11$r/1GRpH2aRS5B5SoZW9RP.cOWucQ0tZphCMOJd/M5fIBkHzhe213y"


bcrypt.compare( password, passHash )
  .then( ( res ) => {

    if ( res ) {

      console.log( "Its a match!" )

    } else {

      console.log( "No match, sad face =(" )

    }


  })

// // As of bcryptjs 2.4.0, compare returns a promise if callback is omitted:
// bcrypt.compare("B4c0/\/", hash).then((res) => {
//     // res === true
// });


// var bcrypt = require('bcryptjs');
// bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash("B4c0/\/", salt, function(err, hash) {
//         // Store hash in your password DB.
//     });
// });



