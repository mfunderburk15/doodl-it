UPDATE users
SET lobby_id = null, is_creator = false
WHERE user_id = $1
returning user_id, is_creator, lobby_id;