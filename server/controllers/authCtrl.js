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

    const [newUser] = await db.register_user([username, hash, user_img]);

    req.session.user = newUser;

    res.status(200).send(req.session.user);
  },
  login: async (req, res) => {
    const db = req.app.get("db");

    const { username, password } = req.body;

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
    const { user_id } = req.session;
    const { username, user_img, user_score } = req.session;
    const user = await db.me(user_id, username, user_img, user_score);
    res.status(200).send(req.session.user);
  },
};
