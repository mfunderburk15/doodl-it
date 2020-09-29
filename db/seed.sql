DROP TABLE IF EXISTS lobbies;
DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS users;

CREATE TABLE lobbies(
lobby_id SERIAL PRIMARY KEY,
lobby_name VARCHAR(50),
lobby_img TEXT
);

CREATE TABLE words(
word_id SERIAL PRIMARY KEY,
word VARCHAR(50)
);

CREATE TABLE users(
user_id SERIAL PRIMARY KEY,
username VARCHAR(50),
hash TEXT,
user_img TEXT,
is_admin BOOLEAN,
is_creator BOOLEAN,
lobby_id INT REFERENCES lobbies(lobby_id)
);