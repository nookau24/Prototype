// (Re)Sets up the database, including a little bit of sample data
const db = require("./db_connection");

/**** Delete existing table, if any ****/

const drop_stuff_table_sql = "DROP TABLE IF EXISTS `inventory`;"

db.execute(drop_stuff_table_sql);

/**** Create "stuff" table (again)  ****/

const create_stuff_table_sql = `
    CREATE TABLE inventory (
        id INT NOT NULL AUTO_INCREMENT,
        item VARCHAR(45) NOT NULL,
        time VARCHAR(45) NOT NULL,
        difficulty VARCHAR(45) NOT NULL,
        instructions VARCHAR(45) NOT NULL,
        keyfocusarea VARCHAR(45) NOT NULL,
        description VARCHAR(150) NULL,
        userid VARCHAR(50) NULL,
        PRIMARY KEY (id)
    );
`
db.execute(create_stuff_table_sql);

/**** Create some sample items ****/

const insert_stuff_table_sql = `
    INSERT INTO inventory 
        (id, item, time, difficulty, instructions, keyfocusarea, description) 
    VALUES 
        (?, ?, ?, ?, ?, ?, ?);
`
db.execute(insert_stuff_table_sql, [1, 'Make your bed', '5:00AM', 'Easy', 'N/A', 'Habit building/responsibility', 'Making your bed is statistically proven to make your room appear 80% cleaner.']);

db.execute(insert_stuff_table_sql, [2, 'Take out the trash', '9:00PM', 'Easy', 'N/A', 'Responsibility', 'Its annoying but I should do it']);

db.execute(insert_stuff_table_sql, [3, 'Cook spaghetti dinner', '6:30PM', 'Hard', 'N/A', 'Learning new skills', 'I love making spaghetti and Im excited to learn how to make it!']);

/**** Read the sample items inserted ****/

const read_stuff_table_sql = "SELECT * FROM inventory";

db.execute(read_stuff_table_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'inventory' initialized with:")
        console.log(results);
    }
);

db.end();