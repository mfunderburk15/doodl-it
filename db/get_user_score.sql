SELECT u.user_id, u.username, u.user_img, u.is_creator, u.lobby_id, s.played
FROM users u
JOIN stats s ON u.user_id = s.user_id;