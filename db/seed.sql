CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(20),
    user_img TEXT,
    hash TEXT,
    user_score INT 
)

CREATE TABLE words(
    word_id SERIAL PRIMARY KEY,
    word VARCHAR(50)
)

CREATE TABLE lobbies(
    lobby_id SERIAL PRIMARY KEY,
    lobby_name VARCHAR(20),
    lobby_img TEXT
)