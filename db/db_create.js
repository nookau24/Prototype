const db = require("./db_connection");

/**** Drop existing tables, if any ****/

const drop_assignments_table_sql = "DROP TABLE IF EXISTS assignments;"

db.execute(drop_assignments_table_sql);

const drop_subjects_table_sql = "DROP TABLE IF EXISTS subjects;"

db.execute(drop_subjects_table_sql);

/**** Create tables ****/

const create_categories_table_sql = `
    CREATE TABLE categories (
        categoryId INT NOT NULL AUTO_INCREMENT,
        categoryName VARCHAR(45) NOT NULL,
        userId VARCHAR(255) NULL,
        PRIMARY KEY (categoryId));

       
`
db.execute(create_categories_table_sql);

const create_assignments_table_sql = `
    CREATE TABLE assignments (
        id INT NOT NULL AUTO_INCREMENT,
        item VARCHAR(45) NOT NULL,
        time DATE NULL,
        difficulty INT NOT NULL,
        instructions VARCHAR(45),
        keyfocusarea VARCHAR(150),
        description VARCHAR(45),
        userId VARCHAR(255) NULL,
        PRIMARY KEY (id),
        INDEX assignmentCategory_idx (categoryId ASC),
        CONSTRAINT assignmentCategory
            FOREIGN KEY (categoryId)
            REFERENCES subjects (categoryId)
            ON DELETE RESTRICT
            ON UPDATE CASCADE);
`

db.execute(create_assignments_table_sql);

db.end();