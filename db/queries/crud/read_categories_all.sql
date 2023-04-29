-- Select all subjects for a user
SELECT 
    categoryId, categoryName
FROM
    categories
WHERE
    userId = ?;