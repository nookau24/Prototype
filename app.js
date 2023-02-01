// define a route for the default home page
app.get( "/", ( req, res ) => {
    console.log(`${req.method} ${req.url}`);
    next();
    res.sendFile( __dirname + "/views/index.html" );
    const logger = require("morgan")
    app.use(logger("dev"));
    // define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));
} );

// define a route for the stuff inventory page
app.get( "/page3/item", ( req, res ) => {
    res.sendFile( __dirname + "/views/page3.html" );
} );

// define a route for the item detail page
app.get( "/page2", ( req, res ) => {
    res.sendFile( __dirname + "/views/item.html" );
} );