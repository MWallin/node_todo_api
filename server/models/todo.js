"use strict"

// *****************************************************************************
// *****************************************************************************
// Requires

const mongoose = require( "mongoose" )




// *****************************************************************************
// *****************************************************************************
// Model definition

const Todo = mongoose.model( "Todo", {
  text: {
    type     : String,
    required : true,
    minlength: 2,
    trim     : true
  },
  completed: {
    type   : Boolean,
    default: false
  },
  completedAt: {
    type   : Number,
    default: null
  },
  _creator: {
    // Todo add ref to user
    type    : mongoose.Schema.Types.ObjectId,
    required: true
  }
})



// *****************************************************************************
// *****************************************************************************
// Requires

module.exports = {
  Todo
}

