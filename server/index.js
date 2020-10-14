require("dotenv").config();
const express = require("express");
const massive = require("massive");
const session = require("express-session");
const socket = require("socket.io");
const authCtrl = require("./controllers/authCtrl");
const lobbyCtrl = require("./controllers/lobbyCtrl");
const wordsCtrl = require("./controllers/wordsCtrl");
const statsCtrl = require("./controllers/statsCtrl");
const path = require("path");

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

let rooms = {}; // Those are the rooms currently used

//rooms[id][players].______

class Room {
  constructor(lobby_id, initialPlayer, words) {
    this.lobby_id = lobby_id;
    this.players = [initialPlayer];
    this.drawHistory = [];
    this.currentRound = 1;
    this.words = words;
    this.currentWord = words[0];
    this.currentPlayer = 0;
  }

  successfulGuess(name) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].username === name) {
        this.currentPlayer = i;
        this.currentRound++;
        this.currentWord = this.words[this.currentRound - 1];
      }
    }
    return this.players;
  }

  removePlayer(name) {
    // console.log('68', this.players)
    // const index = this.players.findIndex((player) => {
    //   console.log(player.username)
    //   console.log(name)
    //   console.log(player)
    //   player.username === name
    // })

    // console.log(index)

    // if(index !== -1){
    //   this.players.splice(index, 1)
    //   console.log(this.players)
    // }
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].username === name) {
        this.players.splice(i, 1);
      }
    }
    return this.players;
  }

  addPlayer(name, socket_id) {
    const player = {
      username: name,
      score: 0,
      is_creator: false,
      socket_id: socket_id,
    };
    this.players.push(player);
    console.log(player);
    console.log(this.players);
  }
}

//successful guess
//game end
//rooms[data.lobby_id] current game state

io.on("connection", (socket) => {
  socket.on("initiate lobby", (data) => {
    const player = {
      username: data.name,
      score: 0,
      is_creator: true,
      socket_id: socket.id,
    };
    const room = new Room(data.lobby_id, player, data.words);
    rooms[data.lobby_id] = room;

    socket.join(data.lobby_id);
    io.in(data.lobby_id).emit("member join", room);
  });

  socket.on("finish drawing", (data) => {
    console.log("finish drawing");
    socket.to(data.lobby).emit("emit draw finish", data);
  });

  socket.on("successful guess", (data) => {
    rooms[data.lobby_id].successfulGuess(data.name);

    io.in(data.lobby_id).emit("next round", rooms[data.lobby_id]);
  });

  //if someone leaves the component
  socket.on("leave", (data) => {
    console.log(data.name);
    rooms[data.lobby_id].removePlayer(data.name);

    io.in(data.lobby_id).emit("member leave", rooms[data.lobby_id]);
  });

  //Setting up join events on the socket, I want the username to be pushed onto the users array of the socket and logging the info
  socket.on("member join", (data) => {
    rooms[data.lobby_id].addPlayer(data.name, socket.id);
    socket.join(data.lobby_id);
    io.in(data.lobby_id).emit("member joined", rooms[data.lobby_id]);
    console.log("emitted joined");
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
app.put("/api/lobby/leavelobby", lobbyCtrl.leaveLobby);
app.delete("/api/lobby/delete/:lobby_id", lobbyCtrl.deleteLobby);

//word endpoints
app.get("/api/words/get", wordsCtrl.getWords);
app.post("/api/words/create", wordsCtrl.createWord);
app.delete("/api/words/delete/:word_id", wordsCtrl.deleteWord);

//stat endpoints
app.get("/api/stats/get", statsCtrl.getStats);

app.use(express.static(__dirname + "/../build"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});
