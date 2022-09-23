const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

loginRouter.post("/", async (req, res) => {
  const { body } = req;
  const { username, password } = body;
  const user = await User.findOne({ username });
  const passwordCorrect =
    user == null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    res.status(401).json({ error: "invalid user or password" });
  }

  //   informacion que se firmara para crear el token
  const userForToken = {
    id: user._id,
    username: user.username,
  };

  //   creando el token
  const token = jwt.sign(userForToken, process.env.SECRET_KEY);

  res.send({
    name: user.name,
    username: user.username,
    token,
  });
});

module.exports = loginRouter;
