const bcrypt = require("bcryptjs");
module.exports = {
  register: async (req, res) => {
    const db = req.app.get("db");

    const { username, password } = req.body;

    const [user] = await db.check_user([username]);

    if (user) {
      return res.status(409).send("Username Taken");
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user_img = `https://api.adorable.io/avatars/285/${username}.png`;

    const is_admin = false;

    const is_creator = false;

    const lobby_id = null;

    const [newUser] = await db.register_user([
      username,
      hash,
      user_img,
      is_admin,
      is_creator,
      lobby_id,
    ]);

    req.session.user = newUser;

    res.status(200).send(req.session.user);
  },
  login: async (req, res) => {
    const db = req.app.get("db");

    const { username, password } = req.body;

    console.log(username, password);

    const [existingUser] = await db.check_user([username]);

    if (!existingUser) {
      return res.status(404).send("User does not exist");
    }

    const isAuthenticated = bcrypt.compareSync(password, existingUser.hash);

    if (!isAuthenticated) {
      return res.status(403).send("Incorrect username or password");
    }

    delete existingUser.hash;

    req.session.user = existingUser;

    res.status(200).send(req.session.user);
  },
  logout: async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  },
  me: async (req, res) => {
    const db = req.app.get("db");
    const { user_id, is_admin, username, user_img, is_creator, lobby_id } = req.session;
    const user = await db.me(user_id, username, user_img, is_admin, is_creator, lobby_id);
    res.status(200).send(req.session.user);
  },
};
