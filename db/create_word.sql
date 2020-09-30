INSERT INTO words(word)
VALUES ($1)
returning *;