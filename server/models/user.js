"use strict"

// *****************************************************************************
// *****************************************************************************
// Requires

const validator = require( "validator" )
const mongoose  = require( "mongoose" )
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
// Function definition

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
// Model definition

const User = mongoose.model( "User", UserSchema )



// *****************************************************************************
// *****************************************************************************
// Requires

module.exports = {
  User
}
