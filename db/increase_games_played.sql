UPDATE stats
SET games_played = games_played + 1
WHERE user_id = $1;