-- SELECT 
--     id, item, time, difficulty, instructions, keyfocusarea, description
-- FROM
--     inventory
-- WHERE
--     id = ?

-- Read detailed values of one row from assignments table
SELECT
    aid, item, time, difficulty, instructions, keyfocusarea, description
    assignments.categoryId as categoryId,
    DATE_FORMAT(time, "%W, %M %D %Y") AS timeExtended, 
    DATE_FORMAT(time, "%Y-%m-%d") AS timeYMD, 
    description
FROM assignments
JOIN categories
    ON assignments.categoryId = categories.categoryId
WHERE assignmentId = ?
AND assignments.userId = ?
