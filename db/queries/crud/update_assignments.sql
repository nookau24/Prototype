UPDATE
    assignemnts
SET
    item = ?,
    time = ?,
    difficulty = ?,
    instructions = ?,
    keyfocusarea = ?,
    description = ?

WHERE
    assignmentId = ?
AND
    userId = ?