INSERT INTO users (username, hash, user_img, is_admin, is_creator, lobby_id)
VALUES($1, $2, $3, $4, $5, $6)
returning user_id, username;