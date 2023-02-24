//set up the server

const db = require('./db/db_connection');
const express = require( "express" );
const app = express();
const logger = require("morgan");
const { auth } = require('express-openid-connect');
const port = 80;

// Configure Express to use EJS
app.set( "views",  __dirname + "/views");
app.set( "view engine", "ejs" );

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:80',
    clientID: 'OQgmId5jWL3aiuKaYUVt8tVkE95w1XZF',
    issuerBaseURL: 'https://dev-fzmq06eihcdot3e8.us.auth0.com'
  };

// auth router attaches /login, /logout, and /callback routes to the baseURL
// middleware - function that runs for every request that comes in
app.use(auth(config));

// define middleware that logs all incoming requests
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

// Configure Express to parse URL-encoded POST request bodies (traditional forms)
app.use( express.urlencoded({ extended: false }) );

// req.isAuthenticated is provided from the auth router
app.get('/authtest', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });

// define a route for the default home page
app.get( "/", ( req, res ) => {
    //console.log(`${req.method} ${req.url}`);
    //res.sendFile( __dirname + "/views/index.html" );
    //res.render("/views/index.html", data);
    res.render("index");
} );

// define a route for the stuff inventory page
const read_stuff_all_sql = `
    SELECT 
        id, item, time, difficulty, instructions
    FROM
        inventory
`
app.get( "/inventory", ( req, res ) => {
    db.execute(read_stuff_all_sql, (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else
            res.render('inventory', { inventory : results });
    });
});

// define a route for the item detail page
const read_stuff_item_sql = `
    SELECT 
        id, item, time, difficulty, instructions, keyfocusarea, description
    FROM
        inventory
    WHERE
        id = ?
`
app.get( "/inventory/todos/:id", ( req, res ) => {
    db.execute(read_stuff_item_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No item found with id = "${req.params.id}"` ); // NOT FOUND
        else {
            let data = results[0]; // results is still an array
            // data's object structure: 
            //  { item: ___ , quantity:___ , description: ____ }
            res.render('todos', data);
        }
    });
});

// define a route for item DELETE
const delete_item_sql = `
    DELETE 
    FROM
        inventory
    WHERE
        id = ?
`
app.get("/inventory/todos/:id/delete", ( req, res ) => {
    db.execute(delete_item_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/inventory");
        }
    });
})



  



// // define a route for the stuff inventory page
// app.get( "/inventory", ( req, res ) => {
//     console.log(`${req.method} ${req.url}`);
//     res.sendFile( __dirname + "/views/inventory.html" );
// } );



// // define a route for the item detail page
// app.get( "/inventory/todos", ( req, res ) => {
//     console.log(`${req.method} ${req.url}`);
//     res.sendFile( __dirname + "/views/todos.html" );
// } );

// define a route for item Create
const create_item_sql = `
    INSERT INTO inventory
        (item, time, difficulty, instructions)
    VALUES
        (?, ?, ?, ?)
`
app.post("/inventory", ( req, res ) => {
    db.execute(create_item_sql, [req.body.item, req.body.time, req.body.difficulty, req.body.instructions], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/inventory/todos/${results.insertId}`);
        }
    });
})

// define a route for item UPDATE
const update_item_sql = `
    UPDATE
        inventory
    SET
        item = ?,
        time = ?,
        difficulty = ?,
        instructions = ?,
        keyfocusarea = ?,
        description = ?
    WHERE
        id = ?
`
app.post("/inventory/todos/:id", ( req, res ) => {
    db.execute(update_item_sql, [req.body.item, req.body.time, req.body.difficulty, req.body.instructions, req.body.keyfocusarea, req.body.description, req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/inventory/todos/${req.params.id}`);
        }
    });
})


// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );






