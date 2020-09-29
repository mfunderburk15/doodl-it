require("dotenv").config();
const express = require("express");
const massive = require("massive");
const session = require("express-session");
const socket = require("socket.io");
const authCtrl = require("./controllers/authCtrl");
const lobbyCtrl = require("./controllers/lobbyCtrl");

const app = express();
const { CONNECTION_STRING, SERVER_PORT, SESSION_SECRET } = process.env;

app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 },
  })
);

//was running into an error where my massive and sockets were looking at the same server port.  I had to move app.listen outside of massive and declare it to server
const server = app.listen(SERVER_PORT, () =>
  console.log(`This server is looking at port: ${SERVER_PORT}`)
);

// declared io from the sockets.io library and set it equal to socket that takes in my server declared earlier, this way socket.io looks at my server along with app.listen, instead of looking at the same port seprately.
const io = socket(server);

massive({
  connectionString: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
}).then((dbInstance) => {
  app.set("db", dbInstance);
  console.log("DB Works!");
});

//socket connection event in the io object and sending the userlist
io.on("connection", (socket) => {
  console.log(`Socket connected`);

  socket.on(`disconnect`, () => {
    console.log(`Socket disconnected`);
  });

  //lobby socket
  socket.on("join lobby", (data) => {
    console.log(`join lobby ${data.lobby_id}`);
    socket.join(data.lobby_id);
  });

  //emits whats being drawn to all clients
  socket.on("draw", (obj) => {
    socket.broadcast.emit("draw", obj);
  });

  //emits guesses to all clients
  socket.on("guess", (data) => {
    io.emit("guess", { username: data.username, guess: data.guess });
    console.log(
      `guess event triggered from: ${data.username} with word: ${data.guess} `
    );
  });
});

//Auth endpoints
app.post("/api/auth/register", authCtrl.register);
app.post("/api/auth/login", authCtrl.login);
app.post("/api/auth/logout", authCtrl.logout);
app.get("/api/auth/me", authCtrl.me);

//lobby endpoints
app.post("/api/lobby/create", lobbyCtrl.createLobby);
app.get("/api/lobby/getlobbies", lobbyCtrl.getLobbies);
app.get("/api/lobby/getLobbyById/:lobby_id", lobbyCtrl.getLobbyById);
app.delete("/api/lobby/delete/:lobby_id", lobbyCtrl.deleteLobby);
