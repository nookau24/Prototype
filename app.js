//set up the server
const express = require( "express" );
const app = express();
const logger = require("morgan");
const port = 80;

// define middleware that logs all incoming requests
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

// define a route for the default home page
app.get( "/", ( req, res ) => {
    console.log(`${req.method} ${req.url}`);
    res.sendFile( __dirname + "/views/index.html" );
} );

// define a route for the stuff inventory page
app.get( "/inventory", ( req, res ) => {
    console.log(`${req.method} ${req.url}`);
    res.sendFile( __dirname + "/views/inventory.html" );
} );

// define a route for the item detail page
app.get( "/inventory/todos", ( req, res ) => {
    console.log(`${req.method} ${req.url}`);
    res.sendFile( __dirname + "/views/todos.html" );
} );

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );
