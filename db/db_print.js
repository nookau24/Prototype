const db = require("./db_connection");

/**** Read and print the subjects table ****/

const select_categories_sql = "SELECT * FROM categories";

db.execute(select_categories_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'categories' contents:")
        console.log(results);
    }
);

/**** Read the assignments table, joined with categories table ****/

const select_assignments_sql = `
SELECT *
FROM assignments
JOIN categories
    ON assignments.categoryId = categories.categoryId;
ORDER BY
    assignments.assignmentId;
`;

db.execute(select_assignments_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'assignments' contents:")
        console.log(results);
    }
);

db.end();