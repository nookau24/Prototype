-- Select all rows of assignments table, along with related info from
SELECT *
FROM assignments
JOIN categories
    ON assignments.categoryId = categories.categoryId
ORDER BY
    assignments.assignmentId;