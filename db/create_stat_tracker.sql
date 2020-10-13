INSERT INTO stats(user_id, games_played)
VALUES ($1, 0)
returning*;