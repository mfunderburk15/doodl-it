module.exports = {
  getWords: async (req, res) => {
    const db = req.app.get("db");

    const words = await db.get_words();

    res
      .status(200)
      .send(words);
  },
  createWord: async (req, res) => {
    const db = req.app.get("db");

    const { word } = req.body;

    const [checkWord] = await db.check_word([word]);

    if (checkWord) {
      console.log(word);
      return res.status(409).send("word is already in use");
    }

    await db.create_word([word]);

    const words = await db.get_words();

    res.status(200).send(words);
  },
  deleteWord: async (req, res) => {
    const db = req.app.get("db");

    const { word_id } = req.params;

    await db.delete_word([word_id]);

    const words = await db.get_words();

    res.status(200).send(words);
  },
};
