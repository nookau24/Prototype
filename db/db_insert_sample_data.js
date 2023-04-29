const db = require("./db_connection");

/**** Delete *CONTENTS OF* existing tables (but not dropping tables themselves) ****/

const delete_assignments_table_sql = "DELETE FROM assignments;"

db.execute(delete_assignments_table_sql);

const delete_categories_table_sql = "DELETE FROM categories;"

db.execute(delete_categories_table_sql);

/**** Create some sample subjects and assignments ****/

const insert_subject_sql = `
    INSERT INTO subjects 
        (categoryId, categoryName) 
    VALUES 
        (?, ?);
`


db.execute(insert_subject_sql, [1, 'Cooking']);

db.execute(insert_subject_sql, [2, 'Cleaning']);

db.execute(insert_subject_sql, [3, 'Homework']);

db.execute(insert_subject_sql, [4, 'Self Care']);


const insert_assignment_sql = `
    INSERT INTO assignments 
        (categoryId, item, time, difficulty, instructions, keyfocusarea, description) 
    VALUES 
        (?, ?, ?, ?, ?, ?);
`

//categoryId: 4 => 'Self Care'
db.execute(insert_assignment_sql, [4, 'Exercises', '2023-05-26', 'Hard', null, 'Growth and Strength', 'Will help you become muscular!']);

//categoryId: 2 => 'Cleaning'
db.execute(insert_assignment_sql, [2, 'Fold laundry', '2023-04-28', 'Easy', null, 'Habits', 'Will be satisfying at the end!']);

//categoryId: 3 => 'Homework'
db.execute(insert_assignment_sql, [4, 'Web App Project', '2023-04-20', 'Very hard', "https://bca.schoology.com/assignment/6655247187/info", 'Coding', 'Design your own web app using your app idea and VS code.']);

/**** Create some additional subjects and assignments that aren't in the prototypes ****/

db.execute(insert_subject_sql, [5, 'Hobbies']);

db.execute(insert_subject_sql, [6, 'Family & Friends']);

//categoryId: 2 => 'Cleaning'
db.execute(insert_assignment_sql, [2, 'Make bed', '2023-04-28', 'Easy', null, 'Habits', 'Come home to a clean bed :)']);

//categoryId: 3 => 'Homework'
db.execute(insert_assignment_sql, [3, 'Study for AP Calc Exam!', '2023-05-08', 'Very hard', null, 'Growth and Strength', 'Will improve your knowledge!']);

//categoryId: 1 => 'Cooking'
db.execute(insert_assignment_sql, [1, 'Make a cake for Dad\'s bday!', '2023-04-28', 'Hard', null, 'Empathy', 'Bday surprise!']);

//categoryId: 3 => 'Cleaning'
db.execute(insert_assignment_sql, [3, 'Do the dishes', '2023-04-29', 'Easy', null, 'Habits', 'Its only fair to rotate this responsibility :/']);

db.end();