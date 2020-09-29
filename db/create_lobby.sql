INSERT INTO lobbies(lobby_name, lobby_img)
VALUES ($1,$2)
returning *;