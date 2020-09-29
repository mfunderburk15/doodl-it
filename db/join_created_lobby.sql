UPDATE users
SET lobby_id = $2, is_creator = true
WHERE user_id = $1
returning user_id, is_creator, lobby_id;