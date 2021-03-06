"use strict"

// *****************************************************************************
// Requires

const {MongoClient, ObjectID} = require( "mongodb" )


MongoClient.connect( "mongodb://localhost:27017/TodoApp", ( error, db ) => {

  if ( error ) {
    return console.log( "Unable to connect to MongoDB server" )
  }

  console.log( "Connected to MongoDB server" )


  db.collection( "Users" ).findOneAndUpdate(
    { _id: new ObjectID( "58910e7f1f69e5389c70ad64" )},
    {
      $set: {name: "Elin Hultin"},
      $inc: {age: -6}
    },
    { returnOriginal: false }
  )
  .then( ( uUser ) => {
    console.log( "Updated user", uUser )
  })

  // db.collection( "Todos" ).findOneAndUpdate({ _id: new ObjectID( "5898a0980392b2b9c8e9530b" )}, { $set: {completed: true}}, {returnOriginal: false})
  //   .then( ( uTodo ) => {
  //     console.log( JSON.stringify( uTodo, undefined, 2 ) )
  //   })



  // db.collection( "Todos" ).find({completed: false}).count()
  //   .then( ( count ) => {

  //     console.log( `There are ${count} todos left today!` )

  //   })


  // db.collection( "Todos" ).find({ completed: false }).toArray()
  //   .then( ( docs ) => {

  //     console.log( "Todos" )
  //     console.log( "^^^^^" )
  //     console.log( JSON.stringify( docs, undefined, 2 ) )

  //   })
  //   .catch( ( error ) => {

  //     console.log( "Error", error )

  //   })



  // db.collection( "Todos" ).insertOne({
  //   text     : "something more for me to do",
  //   completed: false
  // }, ( error, result ) => {

  //   if ( error ) {
  //     return console.log( "Unable to insert todo", error )
  //   }

  //   console.log( JSON.stringify( result.ops, undefined, 2 ) )

  // })

  // db.collection( "Users" ).insertOne({
  //   name    : "Mikael Wallin",
  //   age     : 29,
  //   location: "Sverige"
  // }, ( error, result ) => {

  //   if ( error ) {
  //     return console.log( "Unable to insert user" )
  //   }

  //   console.log( JSON.stringify( result.ops, undefined, 2 ) )

  // })



  db.close()


})
