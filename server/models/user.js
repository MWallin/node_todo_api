"use strict"

// *****************************************************************************
// *****************************************************************************
// Requires

const validator = require( "validator" )
const mongoose  = require( "mongoose" )
const bcrypt    = require( "bcryptjs" )
const jwt       = require( "jsonwebtoken" )
const _         = require( "lodash" )



// *****************************************************************************
// *****************************************************************************
// Schema definition

const UserSchema = new mongoose.Schema({
  email: {
    type     : String,
    required : true,
    trim     : true,
    minlength: 1,
    unique   : true,
    validate : {
      validator: validator.isEmail,
      message  : "{VALUE} is not a valid email"
    }
  },

  password: {
    type     : String,
    require  : true,
    minlength: 6
  },

  tokens: [
    {
      access: {
        type    : String,
        required: true
      },
      token: {
        type    : String,
        required: true
      }
    }
  ]

})



// *****************************************************************************
// *****************************************************************************
// Documents functions definition

UserSchema.methods.generateAuthToken = function () {

  const user = this
  const access = "auth"
  const token = jwt.sign(
    {
      _id: user._id.toHexString(),
      access
    }, "abc123" ).toString()

  user.tokens.push(
    {
      access,
      token
    })

  return user.save()
    .then( () => {
      return token
    })


}


UserSchema.methods.toJSON = function () {

  const user = this
  const userObject = user.toObject()


  return _.pick( userObject, ["_id", "email"] )


}



// *****************************************************************************
// *****************************************************************************
// Model functions definition

UserSchema.statics.findByToken = function ( token ) {

  const User = this
  let decoded = undefined


  try {

    decoded = jwt.verify( token, "abc123" )

  } catch ( error ) {

    return Promise.reject()

  }


  return User.findOne({
    "_id"          : decoded._id,
    "tokens.access": "auth",
    "tokens.token" : token
  })


}



UserSchema.statics.findByCredentials = function ( email, password ) {

  const User = this

  return User.findOne({ email })
    .then( ( user ) => {

      if ( !user ) {
        return Promise.reject()
      }

      return bcrypt.compare( password, user.password )
        .then( ( match ) => {

          if ( !match ) {

            console.log( "password is no match" )

            return Promise.reject()

          }

          console.log( "password is a match" )

          return Promise.resolve( user )


        })

    })

}



// *****************************************************************************
// *****************************************************************************
// Middleware definition

UserSchema.pre( "save", function ( next ) {

  const user = this

  if ( user.isModified( "password" ) ) {

    bcrypt.genSalt( 8 )
      .then( ( salt ) => {

        return bcrypt.hash( user.password, salt )

      })
      .then( ( hash ) => {

        user.password = hash

        next()

      })
      .catch( ( error ) => {

        console.log( "Oh snap", error )

      })


  } else {

    next()

  }


})



// *****************************************************************************
// *****************************************************************************
// Model definition

const User = mongoose.model( "User", UserSchema )



// *****************************************************************************
// *****************************************************************************
// Exports

module.exports = {
  User
}
