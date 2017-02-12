"use strict"

// *****************************************************************************
// *****************************************************************************
// Requires


const {ObjectID} = require( "mongodb" )

const {mongoose} = require( "./../server/db/mongoose" )
const {Todo} = require( "./../server/models/todo" )
const {User} = require( "./../server/models/user" )


// *****************************************************************************
// *****************************************************************************
// Queries

Todo.findByIdAndRemove( "dfdf" )
  .then( ( doc ) => {

    console.log( doc )

  })

