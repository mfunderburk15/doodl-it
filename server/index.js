require("dotenv").config();
const express = require("express");
const massive = require("massive");
const session = require("express-session");
const socket = require("socket.io");
const authCtrl = require("./controllers/authCtrl");
const lobbyCtrl = require("./controllers/lobbyCtrl");
const wordsCtrl = require("./controllers/wordsCtrl");

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

let rooms = []; //rooms currently used
let emptyRoom = {
  lobby_id: null,
  players: [
    {
      username: "",
      score: 0,
      is_creator: false,
    },
  ],
  drawHistory: [],
  currentHandle: 0,
  words: [],
  currentWord: "",
  points: [],
};

let room = emptyRoom;

io.on("connection", (socket) => {
  console.log("User connected");

  //drawing events
  socket.on("draw", (data) => {
    room.drawHistory.push({
      lines: data.lines,
      width: data.width,
      color: data.color,
    });
    socket.broadcast.emit("drawing", data);
  });

  socket.on("clear", (data) => {
    room.drawHistory = [];
    socket.broadcast.emit("clear");
  });

  socket.on("clear last", (data) => {
    room.drawHistory.splice(-1, 1);
    socket.broadcast.emit("clear");
    for (const drawObject of room.drawHistory) {
      socket.broadcast.emit("draw", drawObject);
    }
  });

  //creating a lobby and with the creator
  socket.on("initiate-lobby", (data) => {
    room = data;
    console.log("initiate");
    console.log(room);
  });

  //user joining a session in progress
  socket.on("join", (data) => {
    room.players.push({
      username: data.username,
      score: 0,
      is_creator: false,
    });
    console.log("emiting joined");
    socket.broadcast.emit("joined", room);
    console.log("emitted joined");
  });

  socket.on("sucessful-guess", (data) => {
    room.points.push(data.user_id);
    socket.broadcast.emit("next-handle");
  });

  socket.on("end-of-game", (data) => {
    //Calculate the score and announce the winner
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
app.put("/api/lobby/joinlobby/:lobby_id", lobbyCtrl.joinLobby);
app.put("/api/lobby/leavelobby/", lobbyCtrl.leaveLobby);
app.delete("/api/lobby/delete/:lobby_id", lobbyCtrl.deleteLobby);

//word endpoints
app.get("/api/words/get", wordsCtrl.getWords);
app.post("/api/words/create", wordsCtrl.createWord);
app.delete("/api/words/delete/:word_id", wordsCtrl.deleteWord);
