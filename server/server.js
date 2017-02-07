"use strict"

// *****************************************************************************
// Requires

const mongoose = require( "mongoose" )

mongoose.Promise = global.Promise
mongoose.connect( "mongodb://localhost:27017/TodoApp" )



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
  }
})

const newTodo = new Todo({
  text: "C   ",
})



// newTodo.save()
//   .then( ( doc ) => {

//     console.log( "Saved todo:", doc )

//   })
//   .catch( ( error ) => {

//     console.log( "Unable to save new todo", error )

//   })



const User = mongoose.model( "User", {
  name: {
    type     : String,
    required : true,
    minlength: 1,
    trim     : true
  },
  email: {
    type     : String,
    required : true,
    minlength: 1,
    trim     : true

  }
})


const newUser = new User({
  name : "Mikael Wallin",
  email: "mikael.wallin@gmail.com"
})

newUser.save()
  .then( ( doc ) => {

    console.log( "Saved user:", doc )

  })
  .catch( ( error ) => {

    console.log( "Unable to save new user", error )

  })

