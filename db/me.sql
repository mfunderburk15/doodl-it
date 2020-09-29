SELECT user_id, username, user_img, is_admin
FROM users
WHERE user_id = $1