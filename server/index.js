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

let words = [
  "word",
  "letter",
  "number",
  "person",
  "man",
  "people",
  "sound",
  "apple",
  "men",
  "woman",
  "women",
  "boy",
  "seagull",
  "hotdog",
  "hamburger",
  "Earth",
  "girl",
  "week",
  "month",
  "name",
  "elephant",
  "feather",
  "sled",
  "keyboard",
  "land",
  "home",
  "hand",
  "house",
  "picture",
  "animal",
  "mother",
  "father",
  "air",
  "sandwich",
  "moon",
  "world",
  "head",
  "page",
  "country",
  "question",
  "pigeon",
  "school",
  "plant",
  "food",
  "sun",
  "state",
  "eye",
  "city",
  "tree",
  "Trump",
  "puppy",
  "farm",
  "story",
  "egg",
  "night",
  "day",
  "life",
  "north",
  "south",
  "east",
  "man",
  "west",
  "child",
  "children",
  "paper",
  "music",
  "river",
  "car",
  "Superman",
  "beetle",
  "feet",
  "book",
  "duck",
  "friend",
  "fish",
  "mouse",
  "owl",
  "soda",
  "mountain",
  "horse",
  "watch",
  "color",
  "face",
  "wood",
  "Mars",
  "bird",
  "water",
  "body",
  "family",
  "song",
  "door",
  "forest",
  "wind",
  "ship",
  "area",
  "hat",
  "rock",
  "fire",
  "problem",
  "airplane",
  "top",
  "bottom",
  "king",
  "breakfast",
  "space",
  "whale",
  "unicorn",
  "sunset",
  "sunburn",
  "whale",
  "coffee",
  "butterfly",
];
let wordcount;

const newWord = () => {
  wordcount = Math.floor(Math.random() * words.length);
  return words[wordcount];
};

let users = {}

io.on('connection', (socket) => {
  io.emit('userlist', users)

 
  
  socket.on('leave', (data) => {
    for(let i=0; i < users[data.lobby].length; i++){
      console.log(users[data.lobby][i])
      if(users[data.lobby][i] === `${data.name}`){
        users[data.lobby].splice(i,1)
      }
      console.log(users[data.lobby])
    }
    console.log(`${data.name} has disconnected`)
    io.in(data.lobby).emit('member leave', users[data.users])
  })
  //Setting up join events on the socket, I want the username to be pushed onto the users array of the socket and logging the info
  socket.on('join', (data) => {
    socket.username = data.name;
    socket.join(data.lobby);
    if(users[data.lobby]){
      users[data.lobby].push(socket.username)
    }else{
      users[data.lobby] = [socket.username]
    }
    console.log(`${socket.username} has joined. ID: ${data.lobby}`);
    io.in(data.lobby).emit('member join', users[data.lobby])
  });

  // console.log("hit socket", socket)
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
