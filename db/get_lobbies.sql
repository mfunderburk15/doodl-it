SELECT l.lobby_id, l.lobby_name, l.lobby_img, u.username
FROM lobbies l
Join users u ON l.lobby_id = u.lobby_id;