INSERT INTO users (username, hash, user_img)
VALUES($1,$2, $3)
returning user_id, username;