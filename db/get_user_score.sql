SELECT u.user_id, u.username, u.user_img, s.games_played
FROM users u
JOIN stats s ON u.user_id = s.user_id
WHERE u.user_id=$1;