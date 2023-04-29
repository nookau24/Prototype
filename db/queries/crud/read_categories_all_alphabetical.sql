-- Select all subjects for a user, in alphabetical order
SELECT 
    categoryId, categoryName
FROM
    categories
WHERE
    categoryId = ? 
ORDER BY
    categoryName ASC