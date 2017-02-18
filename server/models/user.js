"use strict"

// *****************************************************************************
// *****************************************************************************
// Requires

const validator = require( "validator" )
const mongoose  = require( "mongoose" )



// *****************************************************************************
// *****************************************************************************
// Model definition

const User = mongoose.model( "User", {

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
// Requires

module.exports = {
  User
}
