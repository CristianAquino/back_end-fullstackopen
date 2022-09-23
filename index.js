require("dotenv").config();
require("./mongo");
const express = require("express");
const morgan = require("morgan");
const app = express();
const handleErrors = require("./middleware/handleErrors");
const usersRouter = require("./controllers/users");
const notesRouter = require("./controllers/notes");
const loginRouter = require("./controllers/login");

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/notes", notesRouter);
app.use("/api/login", loginRouter);
// middleware
app.use(handleErrors);

const server = app.listen(process.env.PORT, () => {
  console.log("http://localhost:3000/");
});

module.exports = { app, server };
