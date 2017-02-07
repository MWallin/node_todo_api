"use strict"

// *****************************************************************************
// Requires

const mongoose = require( "mongoose" )

mongoose.Promise = global.Promise
mongoose.connect( "mongodb://localhost:27017/TodoApp" )



const Todo = mongoose.model( "Todo", {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
})

const newTodo = new Todo({
  text       : "Call mom",
  completed  : true,
  completedAt: 3456789
})



newTodo.save()
  .then( ( doc ) => {

    console.log( "Saved todo:", doc )

  })
  .catch( ( error ) => {

    console.log( "Unable to save new todo", error )

  })


