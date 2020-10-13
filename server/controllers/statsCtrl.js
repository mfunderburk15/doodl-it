module.exports = {
  getStats: async (req, res) => {
    const db = req.app.get("db");
    const {
      user_id,
      username,
      user_img,
      is_admin,
      is_creator,
      lobby_id,
    } = req.session.user;

    await db.me(user_id, username, user_img, is_admin, is_creator, lobby_id);

    const [user] = await db.get_user_score([user_id]);

    res.status(200).send(user);
  },
};
