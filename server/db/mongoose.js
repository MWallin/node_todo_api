"use strict"

// *****************************************************************************
// Requires
// *****************************************************************************

const mongoose = require( "mongoose" )



// *****************************************************************************
// *****************************************************************************
// Configuration

mongoose.Promise = global.Promise
mongoose.connect( process.env.DB_URI )




// *****************************************************************************
// *****************************************************************************
// Exports

module.exports = {
  mongoose
}
