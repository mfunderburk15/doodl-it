SELECT user_id, username, user_img, is_admin, is_creator, lobby_id
FROM users
WHERE user_id = $1