const notesRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Note = require("../models/Note");
const User = require("../models/User");

notesRouter.get("/", (req, res) => {
  // const notes = await Note.find({}).populate("user");
  // res.json(notes);
  // se pone el nombre de la propiedad
  Note.find({})
    .populate("user", {
      notes: 0,
    })
    .then((note) => res.json(note));
});

notesRouter.post("/", async (req, res) => {
  const { content, important, userId } = req.body;
  const authorization = req.headers.authorization;
  console.log(authorization);
  let token = "";
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }
  let decodeToken = {};
  decodeToken = jwt.verify(token, process.env.SECRET_KEY);
  if (!token || !decodeToken.id) {
    return res.status(401).json({ error: "invalid" });
  }
  const user = await User.findById(userId);

  if (content === undefined) return res.status(400).json({ error: "error" });
  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id,
  });
  try {
    const savedNote = await newNote.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();
    res.json(savedNote);
  } catch (error) {
    next(error);
  }
});

notesRouter.get("/:id", (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      if (note) {
        res.send(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

notesRouter.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const body = req.body;
  Note.findByIdAndUpdate(id, body, { new: true })
    .then((note) => res.send(note))
    .catch((error) => next(error));
});

notesRouter.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  Note.findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

module.exports = notesRouter;
