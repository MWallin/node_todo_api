"use strict"

// *****************************************************************************
// Requires
// *****************************************************************************

// Externals

const {ObjectID} = require( "mongodb" )
const jwt = require( "jsonwebtoken" )

// Internals

const {Todo} = require( "./../../server/models/todo" )
const {User} = require( "./../../server/models/user" )



// *****************************************************************************
// *****************************************************************************
// Seed data

const todos = [
  {
    _id : new ObjectID(),
    text: "First test todo"
  },
  {
    _id        : new ObjectID(),
    text       : "Second test todo",
    completed  : true,
    completedAt: 333
  }
]



const userOneID = new ObjectID()
const userTwoID = new ObjectID()

const users = [
  {
    _id     : userOneID,
    email   : "kajsa@mail.com",
    password: "userOnePass",
    tokens  : [{
      access: "auth",
      token : jwt.sign(
        {
          _id   : userOneID,
          access: "auth"
        }, "abc123" ).toString()
    }]
  },
  {
    _id     : userTwoID,
    email   : "linda@mail.com",
    password: "userTwoPass"
  }
]


// *****************************************************************************
// *****************************************************************************
// Seed function

function populateTodos ( done ) {

  Todo.remove({})
    .then( () => {

      return Todo.insertMany( todos )

    }).then( () => done() )


}


function populateUsers ( done ) {

  User.remove({})
    .then( () => {

      const userOne = new User( users[0] ).save()
      const userTwo = new User( users[1] ).save()

      return Promise.all( [userOne, userTwo] )

    })
    .then( () => done() )

}


// *****************************************************************************
// *****************************************************************************
// Exports

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}

