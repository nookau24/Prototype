const DEBUG = true;

//set up the server
const express = require( "express" );
const logger = require("morgan");

const path = require("path");
const fs = require("fs");

const {auth} = require('express-openid-connect');
//console.log(auth); // undefined

const {requiresAuth } = require('express-openid-connect');
const dotenv = require('dotenv');
dotenv.config();

const helmet = require("helmet"); 
const db = require('./db/db_pool');
// const db = require('./db/db_connection'); just assuming this is an older version of the above line
const app = express();
const port = process.env.PORT || 80;
// ta port is 3000

// Configure Express to use EJS - not placed here in example code!
app.set( "views",  path.join(__dirname + "/views"));
app.set( "view engine", "ejs" );

//Configure Express to use certain HTTP headers for security
//Explicitly set the CSP to allow certain sources
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'cdnjs.cloudflare.com']
      }
    }
  })); 

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
  };

// auth router attaches /login, /logout, and /callback routes to the baseURL
// middleware - function that runs for every request that comes in
app.use(auth(config));

// Configure Express to parse incoming JSON data
// app.use( express.json() );
// Configure Express to parse URL-encoded POST request bodies (traditional forms)
app.use( express.urlencoded({ extended: false }) );

// define middleware that logs all incoming requests
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(path.join(__dirname + '/public')));

// define middleware that appends useful auth-related information to the res object
// so EJS can easily access it
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.oidc.isAuthenticated();
    res.locals.user = req.oidc.user;
    next();
})

// req.isAuthenticated is provided from the auth router
app.get('/authtest', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });

 app.get('/profile', requiresAuth(), (req, res) => {
     res.send(JSON.stringify(req.oidc.user));
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

    JOIN details
            ON inventory.category_id = details.category_id
    WHERE
        userid = ?
`
app.get( "/inventory", requiresAuth(), ( req, res ) => {
    db.execute(read_stuff_all_sql, [req.oidc.user.email], (error, results) => {
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
    AND
        userid = ?
`
app.get( "/inventory/todos/:id", requiresAuth(), ( req, res ) => {
    db.execute(read_stuff_item_sql, [req.params.id, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No item found with id = "${req.params.id}"` ); // NOT FOUND
        else {
            let data = results[0]; // results is still an array
            // data's object structure: 
            console.log(data);
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
    AND
        userid = ?
`
app.get("/inventory/todos/:id/delete", requiresAuth(), ( req, res ) => {
    db.execute(delete_item_sql, [req.params.id, req.oidc.user.email], (error, results) => {
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
    AND
        userid = ?
`
app.post("/inventory/todos/:id", ( req, res ) => {
    db.execute(update_item_sql, [req.body.name, req.body.time, req.body.difficulty, req.body.instructions, req.body.keyfocusarea, req.body.description, req.params.id, req.oidc.user.email], (error, results) => {
        // console.log(error ? error : results)
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/inventory/todos/${req.params.id}`);
        }
    });
})

// define a route for item Create
const create_item_sql = `
    INSERT INTO inventory
        (item, time, difficulty, instructions, userid)
    VALUES
        (?, ?, ?, ?, ?)
`
app.post("/inventory", ( req, res ) => {
    console.log(req.body);
    //res.send("hi");
    db.execute(create_item_sql, [req.body.name, req.body.time, req.body.difficulty, req.body.instructions, req.oidc.user.email], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/inventory/todos/${results.insertId}`);
        }
    });
})

// let assignmentsRouter = require("./views/assignments.ejs");
// app.use("/assignments", requiresAuth(), assignmentsRouter);

// let categoriesRouter = require("./views/categories.ejs");
// app.use("/categories", requiresAuth(), categoriesRouter);

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );






