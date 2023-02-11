SELECT 
    id, item, time, difficulty, instructions, keyfocusarea, description
FROM
    inventory
WHERE
    id = ?