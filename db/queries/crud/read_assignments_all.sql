-- SELECT 
--     id, item, time, difficulty, instructions
-- FROM
--     inventory

-- Read readable summary of rows of assignments table
-- in order of most recently created first
SELECT 
    id, item, time, difficulty, instructions
    assignments.categoryId as categoryId,
    DATE_FORMAT(time, "%m/%d/%Y (%W)") AS timeFormatted
FROM assignments
JOIN categories
    ON assignments.categoryId = categories.categoryId
WHERE assignments.userId = ?
ORDER BY assignments.assignmentId DESC
